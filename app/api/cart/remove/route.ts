// ============================================
// FILE: app/api/cart/remove/route.ts
// Remove item from cart
// ============================================
import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';

export async function DELETE(request: NextRequest) {
  try {
    const { customer_id, product_id } = await request.json();

    if (!customer_id || !product_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await pool.query(
      'DELETE FROM cart WHERE customer_id = ? AND product_id = ?',
      [customer_id, product_id]
    );

    return NextResponse.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { error: 'Failed to remove from cart' },
      { status: 500 }
    );
  }
}
