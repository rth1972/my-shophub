// ============================================
// UPDATED: app/api/admin/orders/[id]/route.js
// Add authentication check
// ============================================
import { NextResponse,NextRequest } from 'next/server';
import pool from '@/lib/db';
import { checkAdminAuth } from '@/lib/adminAuth';

export async function PUT(request: NextRequest,
  { params }: { params: Promise<{ id: string }> }) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { status } = await request.json();

    await pool.query('UPDATE orders SET status = ? WHERE order_id = ?', [status, id]);

    return NextResponse.json({ message: 'Order status updated' });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}