// ============================================
// FILE: app/api/orders/[id]/route.js
// Get single order details
// ============================================
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const [orders] = await pool.query(
      `SELECT o.*, 
              CONCAT(c.first_name, ' ', c.last_name) as customer_name,
              c.email,
              sa.street_address as shipping_street,
              sa.city as shipping_city,
              sa.state as shipping_state,
              sa.zip_code as shipping_zip
       FROM orders o
       JOIN customers c ON o.customer_id = c.customer_id
       LEFT JOIN addresses sa ON o.shipping_address_id = sa.address_id
       WHERE o.order_id = ?`,
      [id]
    );

    if (orders.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const [items] = await pool.query(
      `SELECT oi.*, p.product_name, p.image_url
       FROM order_items oi
       JOIN products p ON oi.product_id = p.product_id
       WHERE oi.order_id = ?`,
      [id]
    );

    return NextResponse.json({ 
      order: orders[0],
      items 
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}