import { NextRequest, NextResponse } from 'next/server';
import { deleteMerchant } from '@/lib/db';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numId = parseInt(id, 10);
    if (isNaN(numId)) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }

    const deleted = await deleteMerchant(numId);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Merchant not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Merchant with ID ${numId} removed successfully`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
