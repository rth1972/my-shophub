// ============================================
// UPDATED: app/api/admin/customers/route.js
// Add authentication check
// ============================================
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { checkAdminAuth } from '@/lib/adminAuth';

export async function GET(request) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [customers] = await pool.query(`
      SELECT customer_id, first_name, last_name, email, phone, created_at, is_active
      FROM customers
      ORDER BY created_at DESC
    `);
    return NextResponse.json({ customers });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}