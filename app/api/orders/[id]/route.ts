// ============================================
// FILE: app/api/orders/[id]/route.ts
// Get single order details
// ============================================
import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';

interface OrderRow {
  order_id: string;
  customer_id: string;
  order_date: string;
  total_amount: number;
  status: string;
  customer_name: string;
  email: string;
  shipping_street: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
}

interface OrderItemRow {
  order_item_id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  product_name: string;
  image_url: string;
}

export async function GET(
  request: NextRequest,
context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const [orderRows] = await pool.query(
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

    const orders = orderRows as OrderRow[];

    if (orders.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const [itemRows] = await pool.query(
      `SELECT oi.*, p.product_name, p.image_url
       FROM order_items oi
       JOIN products p ON oi.product_id = p.product_id
       WHERE oi.order_id = ?`,
      [id]
    );

    const items = itemRows as OrderItemRow[];

    return NextResponse.json({
      order: orders[0],
      items,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
