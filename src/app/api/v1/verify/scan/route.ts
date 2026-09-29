import { NextRequest, NextResponse } from 'next/server';
import { parseQRIS } from '@/lib/emvco';
import { fuzzyMatch } from '@/lib/fuzzy';
import { checkGeofence } from '@/lib/geofence';
import { getMerchantsByNmid, createMerchant, logIncident } from '@/lib/db';
import { sendFraudAlert } from '@/lib/whatsapp';
import { ScanResponse } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    let nmid = body.nmid;
    let scannedName = (body.name || body.merchantName || body.scannedName || '').toString().toUpperCase().trim();
    const userLat = body.latitude ?? body.userLat ?? null;
    const userLon = body.longitude ?? body.userLon ?? null;
    const gpsAvailable = userLat != null && userLon != null && !isNaN(userLat) && !isNaN(userLon);
    const rawPayload = body.rawPayload || body.payload;

    // If raw payload is passed, extract NMID and name using EMVCo parser
    if (rawPayload && (!nmid || !scannedName)) {
      try {
        const parsed = parseQRIS(rawPayload);
        if (!nmid) nmid = parsed.nmid;
        if (!scannedName) scannedName = parsed.merchantName.toUpperCase().trim();
      } catch (err) {
        console.warn('[ScanRoute] Error parsing raw payload:', err);
      }
    }

    if (!nmid) {
      return NextResponse.json(
        { success: false, error: 'Field nmid (or valid raw QRIS payload) is required' },
        { status: 400 }
      );
    }

    const radiusMeters = parseInt(process.env.GEOFENCE_RADIUS_METERS || '15', 10);
    const fuzzyThreshold = parseInt(process.env.FUZZY_WARNING_THRESHOLD || '50', 10);

    // ────────────────────────────────────────────────────────────────────────
    // Step 1: Query Merchants by NMID
    // ────────────────────────────────────────────────────────────────────────
    let merchants = await getMerchantsByNmid(nmid);
    let autoRegistered = false;

    if (merchants.length === 0) {
      // Auto-register merchant if not found
      const regLat = gpsAvailable ? Number(userLat) : -6.974021;
      const regLon = gpsAvailable ? Number(userLon) : 107.630342;
      const newMerchant = await createMerchant({
        nmid,
        name: scannedName || `Merchant ${nmid}`,
        city: 'BANDUNG',
        latitude: regLat,
        longitude: regLon,
        is_auto_registered: true,
      });
      autoRegistered = true;
      merchants = [newMerchant];
    }

    // ────────────────────────────────────────────────────────────────────────
    // Step 2: Layer 2 Fuzzy Matching vs Primary Merchant
    // ────────────────────────────────────────────────────────────────────────
    const primaryMerchant = merchants[0];
    const registeredName = primaryMerchant.name;
    const { score: fuzzyScore, debug: fuzzyDebug } = fuzzyMatch(scannedName, registeredName);

    // ────────────────────────────────────────────────────────────────────────
    // Step 3: Layer 3 Geofence Check
    // ────────────────────────────────────────────────────────────────────────
    const geo = checkGeofence(
      gpsAvailable ? Number(userLat) : null,
      gpsAvailable ? Number(userLon) : null,
      Number(primaryMerchant.latitude),
      Number(primaryMerchant.longitude),
      radiusMeters
    );

    const locationCheck = geo.locationCheck;
    const distanceMeters = gpsAvailable ? geo.distanceMeters : null;

    // ────────────────────────────────────────────────────────────────────────
    // LAYER 1 & GEOFENCE GUARD:
    // If distance exceeds radius -> IMMEDIATE HARD BLOCK (RED)
    // ────────────────────────────────────────────────────────────────────────
    if (gpsAvailable && (locationCheck === 'MISMATCH' || (distanceMeters !== null && distanceMeters > radiusMeters))) {
      console.warn(`[ValidQR] 🚨 GEOFENCE BREACH: Distance ${distanceMeters}m > ${radiusMeters}m -> BLOCKED`);

      // Trigger WhatsApp Alert
      sendFraudAlert({
        nmid,
        suspectedMerchantName: scannedName || registeredName,
        buyerLocation: { latitude: Number(userLat), longitude: Number(userLon) },
        timestamp: new Date().toISOString(),
        distanceMeters: distanceMeters ?? undefined,
        reason: 'GEOFENCE_LOCATION_MISMATCH',
        targetPhone: primaryMerchant.wa_number || undefined,
      }).catch(console.error);

      // Log incident
      const incident = await logIncident({
        nmid_scanned: nmid,
        merchant_name: scannedName || registeredName,
        status: 'BLOCKED',
        color: 'RED',
        reason: 'LOCATION_MISMATCH',
        fuzzy_score: fuzzyScore,
        latitude: Number(userLat),
        longitude: Number(userLon),
        distance_meters: distanceMeters ?? undefined,
        gps_available: true,
        raw_payload: rawPayload || undefined,
      });

      const response: ScanResponse = {
        status: 'BLOCKED',
        color: 'RED',
        message: 'Lokasi Anda tidak sesuai dengan merchant terdaftar. Kemungkinan overlay attack.',
        reason: 'LOCATION_MISMATCH',
        nmid,
        nmid_valid: true,
        matched_name: registeredName,
        merchant_city: primaryMerchant.city,
        location_check: 'MISMATCH',
        distance_meters: distanceMeters,
        duration_seconds: 1,
        calculation_method: 'HAVERSINE',
        geofence_radius: radiusMeters,
        fuzzy_score: fuzzyScore,
        fuzzy_algorithm: 'levenshtein_hybrid',
        scanned_name: scannedName,
        auto_registered: autoRegistered,
        gps_checked: true,
        conflict_count: merchants.length,
        conflict_names: merchants.map(m => ({ id: m.id, name: m.name })),
        incident_id: incident.id,
      };

      return NextResponse.json(response);
    }

    // ────────────────────────────────────────────────────────────────────────
    // Verification: Evaluate Rebrand & Soft Warnings
    // ────────────────────────────────────────────────────────────────────────
    let finalStatus: 'VERIFIED' | 'REBRAND_WARNING' | 'SOFT_WARNING' = 'VERIFIED';
    let finalColor: 'GREEN' | 'YELLOW' = 'GREEN';
    let finalReason = 'ALL_CLEAR';
    let finalMessage = 'Merchant terdaftar resmi dan lokasi sesuai.';

    if (merchants.length > 1) {
      finalStatus = 'REBRAND_WARNING';
      finalColor = 'YELLOW';
      finalReason = 'REBRAND_DETECTED';
      finalMessage = `Terdeteksi Perubahan Nama / NMID Digunakan Oleh ${merchants.length} Merchant`;
    } else if (fuzzyScore < 100) {
      finalStatus = 'REBRAND_WARNING';
      finalColor = 'YELLOW';
      finalReason = 'NAME_MISMATCH';
      finalMessage = 'Nama merchant berbeda dari database. Transaksi tetap dapat dilanjutkan.';
    } else if (!gpsAvailable) {
      finalStatus = 'SOFT_WARNING';
      finalColor = 'YELLOW';
      finalReason = 'GPS_DENIED';
      finalMessage = 'Lokasi tidak dapat diverifikasi karena GPS tidak tersedia.';
    } else {
      finalStatus = 'VERIFIED';
      finalColor = 'GREEN';
      finalReason = 'ALL_CLEAR';
      finalMessage = 'Merchant terdaftar resmi dan lokasi sesuai.';
    }

    // Log incident
    const incident = await logIncident({
      nmid_scanned: nmid,
      merchant_name: scannedName || registeredName,
      status: finalStatus,
      color: finalColor,
      reason: finalReason,
      fuzzy_score: fuzzyScore,
      latitude: gpsAvailable ? Number(userLat) : undefined,
      longitude: gpsAvailable ? Number(userLon) : undefined,
      distance_meters: distanceMeters ?? undefined,
      gps_available: gpsAvailable,
      raw_payload: rawPayload || undefined,
    });

    const response: ScanResponse = {
      status: finalStatus,
      color: finalColor,
      message: finalMessage,
      nmid,
      nmid_valid: true,
      matched_name: registeredName,
      merchant_city: primaryMerchant.city,
      location_check: locationCheck,
      distance_meters: distanceMeters,
      duration_seconds: 1,
      calculation_method: 'HAVERSINE',
      geofence_radius: radiusMeters,
      fuzzy_score: fuzzyScore,
      fuzzy_algorithm: 'levenshtein_hybrid',
      scanned_name: scannedName,
      auto_registered: autoRegistered,
      reason: finalReason,
      gps_checked: gpsAvailable,
      conflict_count: merchants.length,
      conflict_names: merchants.map(m => ({ id: m.id, name: m.name })),
      incident_id: incident.id,
    };

    return NextResponse.json(response);
  } catch (err: any) {
    console.error('[ScanRoute Error]:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
