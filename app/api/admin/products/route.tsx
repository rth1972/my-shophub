// ============================================
// UPDATED: app/api/admin/products/route.js
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
    const [products] = await pool.query(`
      SELECT p.*, c.category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.category_id 
      ORDER BY p.created_at DESC
    `);
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { product_name, description, category_id, price, cost_price, stock_quantity, sku, image_url } = data;

    const [result] = await pool.query(
      `INSERT INTO products (product_name, description, category_id, price, cost_price, stock_quantity, sku, image_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [product_name, description, category_id, price, cost_price || null, stock_quantity, sku, image_url]
    );

    return NextResponse.json({ message: 'Product created', product_id: result.insertId }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
