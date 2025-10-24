// ============================================
// FILE: app/api/cart/add/route.ts
// Add item to cart
// ============================================
import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';

interface ProductRow {
  stock_quantity: number;
}

export async function POST(request: NextRequest) {
  try {
    const { customer_id, product_id, quantity } = await request.json();

    if (!customer_id || !product_id || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if product exists and has stock
    const [rawRows] = await pool.query(
      'SELECT stock_quantity FROM products WHERE product_id = ?',
      [product_id]
    );
    const products = rawRows as ProductRow[];

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
