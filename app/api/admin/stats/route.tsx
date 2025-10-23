// ============================================
// UPDATED: app/api/admin/stats/route.js
// Add authentication check
// ============================================
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { checkAdminAuth } from '@/lib/adminAuth';

export async function GET(request) {
  // Check authentication
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [productCount] = await pool.query('SELECT COUNT(*) as count FROM products');
    const [orderCount] = await pool.query('SELECT COUNT(*) as count FROM orders');
    const [customerCount] = await pool.query('SELECT COUNT(*) as count FROM customers');
    const [revenue] = await pool.query('SELECT SUM(total_amount) as total FROM orders WHERE payment_status = "completed"');

    return NextResponse.json({
      totalProducts: productCount[0].count,
      totalOrders: orderCount[0].count,
      totalCustomers: customerCount[0].count,
      totalRevenue: revenue[0].total || 0
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
