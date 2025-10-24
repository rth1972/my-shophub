import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { checkAdminAuth } from '@/lib/adminAuth';
import type { RowDataPacket } from 'mysql2';

export async function GET(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [productCountRows] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) AS count FROM products'
    );
    const [orderCountRows] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) AS count FROM orders'
    );
    const [customerCountRows] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) AS count FROM customers'
    );
    const [revenueRows] = await pool.query<RowDataPacket[]>(
      'SELECT SUM(total_amount) AS total FROM orders'
    );

    const productCount = (productCountRows[0] as { count: number }).count;
    const orderCount = (orderCountRows[0] as { count: number }).count;
    const customerCount = (customerCountRows[0] as { count: number }).count;
    const revenue = (revenueRows[0] as { total: number | null }).total || 0;

    return NextResponse.json({
      productCount,
      orderCount,
      customerCount,
      revenue,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}