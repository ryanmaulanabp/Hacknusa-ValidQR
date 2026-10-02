import { NextRequest, NextResponse } from 'next/server';
import { sendFraudAlert, sendTestAlert, checkWhatsAppStatus } from '@/lib/whatsapp';

export async function GET() {
  try {
    const status = await checkWhatsAppStatus();
    return NextResponse.json({ success: true, ...status });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { action, nmid, suspectedMerchantName, buyerLocation, distanceMeters, reason, targetPhone } = body;

    // Handle test alert trigger
    if (action === 'test' || (!nmid && targetPhone)) {
      const result = await sendTestAlert(targetPhone);
      return NextResponse.json(result);
    }

    if (!nmid) {
      return NextResponse.json({ success: false, error: 'Field nmid is required for fraud alerts' }, { status: 400 });
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

