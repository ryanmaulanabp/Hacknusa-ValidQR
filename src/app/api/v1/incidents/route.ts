import { NextRequest, NextResponse } from 'next/server';
import { getIncidentLogs, logIncident } from '@/lib/db';

export async function GET() {
  try {
    const logs = await getIncidentLogs(100);
    return NextResponse.json({
      success: true,
      data: logs,
      count: logs.length,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const incident = await logIncident({
      nmid_scanned: body.nmid || 'UNKNOWN',
      merchant_name: body.merchant_name || 'UNKNOWN',
      status: body.status || 'BLOCKED',
      color: body.color || 'RED',
      reason: body.reason || 'SUSPECTED_FAKE_STORE',
      fuzzy_score: body.fuzzy_score != null ? Number(body.fuzzy_score) : undefined,
      latitude: body.latitude != null ? Number(body.latitude) : undefined,
      longitude: body.longitude != null ? Number(body.longitude) : undefined,
      distance_meters: body.distance_meters != null ? Number(body.distance_meters) : undefined,
      gps_available: body.gps_available ?? true,
      raw_payload: body.raw_payload || undefined,
    });

    return NextResponse.json({
      success: true,
      message: 'Laporan dugaan pemalsuan toko / QR berhasil dicatat dalam audit trail sistem.',
      data: incident,
    });
  } catch (err: any) {
    console.error('[Incidents POST Error]:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

