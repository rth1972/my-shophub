// ============================================
// FILE: app/api/cart/add/route.js
// Add item to cart
// ============================================
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
  try {
    const { customer_id, product_id, quantity } = await request.json();

    if (!customer_id || !product_id || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if product exists and has stock
    const [products] = await pool.query(
      'SELECT stock_quantity FROM products WHERE product_id = ?',
      [product_id]
    );

    if (products.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (products[0].stock_quantity < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      );
    }

    // Use stored procedure
    await pool.query(
      'CALL sp_add_to_cart(?, ?, ?)',
      [customer_id, product_id, quantity]
    );

    return NextResponse.json({ message: 'Added to cart successfully' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}
