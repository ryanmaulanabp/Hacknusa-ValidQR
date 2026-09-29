import { NextRequest, NextResponse } from 'next/server';
import { sendFraudAlert } from '@/lib/whatsapp';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nmid, suspectedMerchantName, buyerLocation, distanceMeters, reason, targetPhone } = body;

    if (!nmid) {
      return NextResponse.json({ success: false, error: 'Field nmid is required' }, { status: 400 });
    }

    const result = await sendFraudAlert({
      nmid,
      suspectedMerchantName: suspectedMerchantName || 'Unknown Merchant',
      buyerLocation,
      distanceMeters,
      reason,
      targetPhone,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
