import { NextResponse } from 'next/server';
import { getIncidentLogs } from '@/lib/db';

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
