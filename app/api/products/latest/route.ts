// ============================================
// FILE: app/api/products/latest/route.js
// Get latest products (newest arrivals)
// ============================================
import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

export async function GET(request:NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '8'; // Default to 8 products

    const [products] = await pool.query<RowDataPacket[]>(
      `SELECT p.*, c.category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.category_id 
       WHERE p.is_active = TRUE
       ORDER BY p.created_at DESC
       LIMIT ?`,
      [parseInt(limit)]
    );

    return NextResponse.json({ 
      products,
      count: products.length,
      message: 'Latest products fetched successfully'
    });
    } catch (error) {
    console.error('Error fetching latest products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch latest products' },
      { status: 500 }
    );
  }
}