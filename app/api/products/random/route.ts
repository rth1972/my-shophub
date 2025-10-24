// ============================================
// FILE: app/api/products/random/route.js
// Get random products with optional limit
// ============================================
import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

export async function GET(req:NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get('limit');
const limit = Math.max(1, Math.min(parseInt(limitParam || '1', 10), 50));

    const [products] = await pool.query<RowDataPacket[]>(
      `
      SELECT p.*, c.category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.category_id 
      WHERE p.is_active = TRUE
      ORDER BY RAND()
      LIMIT ?
      `,
      [limit]
    );

    if (products.length === 0) {
      return NextResponse.json({ error: 'No products found' }, { status: 404 });
    }

    return NextResponse.json({ products }); // Return array of products
  } catch (error) {
    console.error('Error fetching random products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch random products' },
      { status: 500 }
    );
  }
}
