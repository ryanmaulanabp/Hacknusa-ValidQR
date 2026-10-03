import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { createMerchant, getMerchantsByNmid, checkRegistrationCollision } from '@/lib/db';
import { buildDemoPayload } from '@/lib/mockData';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = (body.name || body.merchantName || '').toString().toUpperCase().trim();
    const city = (body.city || 'BANDUNG').toString().toUpperCase().trim();
    const latitude = parseFloat(body.latitude);
    const longitude = parseFloat(body.longitude);
    let nmid = (body.nmid || body.overrideNmid || '').toString().trim();

    if (!name || isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json(
        { success: false, error: 'Nama merchant dan koordinat lokasi (latitude, longitude) wajib diisi!' },
        { status: 400 }
      );
    }

    // ── Strict Validation: Bukti Usaha & Identitas Pemilik Wajib ──
    const owner_nik = (body.owner_nik || '').toString().trim();
    const business_description = (body.business_description || '').toString().trim();
    const store_photo_url = (body.store_photo_url || '').toString().trim();
    const product_photo_url = (body.product_photo_url || '').toString().trim();

    if (!owner_nik || !/^\d{16}$/.test(owner_nik)) {
      return NextResponse.json(
        { success: false, error: 'Validasi Gagal: NIK KTP penanggung jawab wajib 16 digit angka untuk verifikasi identitas resmi.' },
        { status: 400 }
      );
    }

    if (!business_description || business_description.length < 5) {
      return NextResponse.json(
        { success: false, error: 'Validasi Gagal: Rincian barang dagangan / hal yang dijual wajib diisi (minimal 5 karakter).' },
        { status: 400 }
      );
    }

    if (!store_photo_url) {
      return NextResponse.json(
        { success: false, error: 'Validasi Gagal: Bukti foto tempat usaha fisik / etalase toko wajib diunggah untuk mencegah pembuatan QR sembarangan.' },
        { status: 400 }
      );
    }

    if (!product_photo_url) {
      return NextResponse.json(
        { success: false, error: 'Validasi Gagal: Bukti foto barang dagangan / produk yang dijual wajib diunggah.' },
        { status: 400 }
      );
    }

    const qr_type: 'STATIS' | 'DINAMIS' = body.qr_type === 'DINAMIS' ? 'DINAMIS' : 'STATIS';
    const dynamic_amount = qr_type === 'DINAMIS' && body.dynamic_amount ? parseFloat(body.dynamic_amount) : null;

    if (qr_type === 'DINAMIS' && (!dynamic_amount || dynamic_amount <= 0)) {
      return NextResponse.json(
        { success: false, error: 'Validasi Gagal: QRIS Dinamis mewajibkan nominal transaksi yang valid (lebih dari Rp 0).' },
        { status: 400 }
      );
    }

    if (!nmid) {
      nmid = `ID${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`;
    }

    // Zero-Tolerance Registration Guard:
    // Reject registering any merchant/sticker inside an existing EXCLUSIVE_STATIC / EXCLUSIVE_ZONE perimeter!
    const collision = await checkRegistrationCollision(latitude, longitude);
    if (collision.hasCollision && collision.exclusiveMerchant) {
      const em = collision.exclusiveMerchant;
      return NextResponse.json(
        {
          success: false,
          error: `Pendaftaran Stiker DITOLAK MUTLAK (Zero-Tolerance)! Koordinat berjarak ${collision.distanceMeters}m, berada di dalam radius (${em.radius_meters}m) Zona Eksklusif "${em.name}". Tidak ada QR lain yang diizinkan beroperasi di zona ini demi pencegahan penipuan QRIS!`,
          code: 'EXCLUSIVE_ZONE_COLLISION',
        },
        { status: 409 }
      );
    }

    const rawMode = body.security_mode || 'OPEN_ZONE';
    const isExclusiveMode = rawMode === 'EXCLUSIVE_STATIC' || rawMode === 'EXCLUSIVE_ZONE';
    const security_mode = isExclusiveMode ? 'EXCLUSIVE_ZONE' : 'OPEN_ZONE';
    const zone_category = body.zone_category || 'UMKM';
    const radius_meters = body.radius_meters ? parseInt(body.radius_meters, 10) : (isExclusiveMode ? 60 : 20);

    const merchant = await createMerchant({
      nmid,
      name,
      city,
      latitude,
      longitude,
      wa_number: body.wa_number || null,
      security_mode,
      zone_category,
      radius_meters,
      qr_type,
      dynamic_amount,
      owner_nik,
      business_description,
      store_photo_url,
      product_photo_url,
    });

    const invoiceNumber = qr_type === 'DINAMIS' ? `INV-${Date.now().toString().slice(-6)}` : undefined;
    const payload = buildDemoPayload(nmid, name, city, {
      qrType: qr_type,
      amount: dynamic_amount,
      invoiceNumber,
    });

    // Generate QR Data URL
    const qrDataUrl = await QRCode.toDataURL(payload, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    const activeMerchants = await getMerchantsByNmid(nmid);
    const hasConflict = activeMerchants.length > 1;

    return NextResponse.json({
      success: true,
      id: merchant.id,
      nmid: merchant.nmid,
      name: merchant.name,
      city: merchant.city,
      qr_type: merchant.qr_type,
      dynamic_amount: merchant.dynamic_amount,
      owner_nik: merchant.owner_nik,
      business_description: merchant.business_description,
      store_photo_url: merchant.store_photo_url,
      product_photo_url: merchant.product_photo_url,
      qrDataUrl,
      rawPayload: payload,
      hasConflict,
      conflictCount: activeMerchants.length,
      message: 'Sticker QR generated successfully',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
