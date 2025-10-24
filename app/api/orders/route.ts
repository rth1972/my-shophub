// ============================================
// FILE: app/api/orders/route.ts
// Get customer orders
// ============================================
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

interface OrderSummary {
  order_id: string;
  customer_id: string;
  order_date: string;
  status: string;
  total_amount: number;
  items_count: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customer_id');

    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID required' }, { status: 400 });
    }

    const [rawRows] = await pool.query(
      `SELECT o.*, COUNT(oi.order_item_id) as items_count
       FROM orders o
       LEFT JOIN order_items oi ON o.order_id = oi.order_id
       WHERE o.customer_id = ?
       GROUP BY o.order_id
       ORDER BY o.order_date DESC`,
      [customerId]
    );

    const orders = rawRows as OrderSummary[];

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
