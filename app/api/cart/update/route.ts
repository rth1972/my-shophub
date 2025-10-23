// ============================================
// FILE: app/api/cart/update/route.js
// Update cart item quantity
// ============================================
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(request) {
  try {
    const { customer_id, product_id, quantity } = await request.json();

    if (!customer_id || !product_id || quantity === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await pool.query(
      'UPDATE cart SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE customer_id = ? AND product_id = ?',
      [quantity, customer_id, product_id]
    );

    return NextResponse.json({ message: 'Cart updated successfully' });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}