// ============================================
// FILE: app/api/orders/create/route.ts
// Create a new order
// ============================================
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  const connection = await pool.getConnection();

  try {
    const { customer_id, shipping_address_id, items } = await request.json();

    if (!customer_id || !shipping_address_id || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connection.beginTransaction();

    const [orderResult] = await connection.query(
      `INSERT INTO orders (customer_id, shipping_address_id, order_date, status)
       VALUES (?, ?, NOW(), 'pending')`,
      [customer_id, shipping_address_id]
    );

    const orderId = (orderResult as any).insertId;

    for (const item of items) {
      const { product_id, quantity, unit_price } = item;
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
         VALUES (?, ?, ?, ?)`,
        [orderId, product_id, quantity, unit_price]
      );
    }

    await connection.commit();
    return NextResponse.json({ message: 'Order created successfully', order_id: orderId }, { status: 201 });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  } finally {
    connection.release();
  }
}
