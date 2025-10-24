// ============================================
// FILE: app/api/cart/route.ts
// Get cart items for a customer
// ============================================
import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';

interface CartItem {
  cart_id: number;
  customer_id: string;
  product_id: string;
  quantity: number;
  product_name: string;
  price: number;
  image_url: string;
  stock_quantity: number;
  category_name: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customer_id');

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID required' },
        { status: 400 }
      );
    }

    const [rawRows] = await pool.query(
      `SELECT c.*, p.product_name, p.price, p.image_url, p.stock_quantity, cat.category_name
       FROM cart c
       JOIN products p ON c.product_id = p.product_id
       LEFT JOIN categories cat ON p.category_id = cat.category_id
       WHERE c.customer_id = ?`,
      [customerId]
    );

    const cart = rawRows as CartItem[];

    return NextResponse.json({ cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}
