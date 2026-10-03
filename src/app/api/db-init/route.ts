import { NextResponse } from 'next/server';
import { initDatabase, seedOfficialDemoMerchants } from '@/lib/db';

export async function GET() {
  try {
    const result = await initDatabase();
    await seedOfficialDemoMerchants();
    return NextResponse.json({
      success: true,
      result,
      message: 'Database schema and official demo merchants successfully verified & synchronized.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
