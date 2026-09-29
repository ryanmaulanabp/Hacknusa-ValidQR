import { NextRequest, NextResponse } from 'next/server';
import { getAllMerchants, createMerchant } from '@/lib/db';

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

    const merchant = await createMerchant({
      nmid,
      name,
      city,
      latitude,
      longitude,
      wa_number: body.wa_number || null,
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
