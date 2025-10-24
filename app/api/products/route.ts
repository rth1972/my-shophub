// ============================================
// FILE: app/api/products/route.js
// Get all products
// ============================================
import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

export async function GET(request:NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let query = `
      SELECT p.*, c.category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.category_id 
      WHERE p.is_active = TRUE
    `;
    const params = [];

    if (category && category !== 'All') {
      query += ' AND c.category_name = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (p.product_name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY p.product_name';

    const [products] = await pool.query<RowDataPacket[]>(query, params);

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
