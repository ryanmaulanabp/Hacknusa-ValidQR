import { NextResponse } from 'next/server';
import { initDatabase } from '@/lib/db';

export async function GET() {
  try {
    const result = await initDatabase();
    return NextResponse.json({
      success: true,
      result,
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
