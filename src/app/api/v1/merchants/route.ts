import { NextRequest, NextResponse } from 'next/server';
import { getAllMerchants, createMerchant, checkRegistrationCollision } from '@/lib/db';

export async function GET() {
  try {
    const merchants = await getAllMerchants();
    return NextResponse.json({
      success: true,
      data: merchants,
      count: merchants.length,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = (body.name || body.merchantName || '').toString().toUpperCase().trim();
    const city = (body.city || 'BANDUNG').toString().toUpperCase().trim();
    const latitude = parseFloat(body.latitude);
    const longitude = parseFloat(body.longitude);
    const nmid = body.nmid || `ID${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`;

    if (!name || isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json(
        { success: false, error: 'Name, latitude, and longitude are required' },
        { status: 400 }
      );
    }

    // Zero-Tolerance Registration Guard:
    // Reject registering any merchant inside an existing EXCLUSIVE_STATIC perimeter!
    const collision = await checkRegistrationCollision(latitude, longitude);
    if (collision.hasCollision && collision.exclusiveMerchant) {
      const em = collision.exclusiveMerchant;
      return NextResponse.json(
        {
          success: false,
          error: `Pendaftaran DITOLAK MUTLAK (Zero-Tolerance)! Titik koordinat berjarak ${collision.distanceMeters}m dan berada di dalam radius (${em.radius_meters}m) Zona Statis Eksklusif "${em.name}". Tidak ada merchant lain yang diizinkan beroperasi di zona ini demi pencegahan penipuan QRIS!`,
          code: 'EXCLUSIVE_ZONE_REGISTRATION_FORBIDDEN',
          exclusiveMerchant: {
            id: em.id,
            name: em.name,
            radius_meters: em.radius_meters,
            distance_meters: collision.distanceMeters,
          },
        },
        { status: 409 }
      );
    }

    const merchant = await createMerchant({
      nmid,
      name,
      city,
      latitude,
      longitude,
      wa_number: body.wa_number || null,
      security_mode: body.security_mode || 'DYNAMIC',
      zone_category: body.zone_category || 'UMKM',
      radius_meters: body.radius_meters ? parseInt(body.radius_meters, 10) : undefined,
    });

    return NextResponse.json({
      success: true,
      data: merchant,
      message: 'Merchant successfully created',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
