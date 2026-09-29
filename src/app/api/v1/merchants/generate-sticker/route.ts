import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { createMerchant, getMerchantsByNmid } from '@/lib/db';
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
        { success: false, error: 'Name, latitude, and longitude are required' },
        { status: 400 }
      );
    }

    if (!nmid) {
      nmid = `ID${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`;
    }

    const merchant = await createMerchant({
      nmid,
      name,
      city,
      latitude,
      longitude,
      wa_number: body.wa_number || null,
    });

    const payload = buildDemoPayload(nmid, name, city);

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
