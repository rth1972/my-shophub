// ============================================
// UPDATED: app/api/admin/products/[id]/route.js
// Add authentication check
// ============================================
import { NextResponse,NextRequest } from 'next/server';
import pool from '@/lib/db';
import { checkAdminAuth } from '@/lib/adminAuth';

export async function PUT(request: NextRequest,
  { params }: { params: Promise<{ id: string }> }) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const data = await request.json();
    const { product_name, description, category_id, price, cost_price, stock_quantity, sku, image_url } = data;

    await pool.query(
      `UPDATE products 
       SET product_name = ?, description = ?, category_id = ?, price = ?, cost_price = ?, 
           stock_quantity = ?, sku = ?, image_url = ?
       WHERE product_id = ?`,
      [product_name, description, category_id, price, cost_price, stock_quantity, sku, image_url, id]
    );

    return NextResponse.json({ message: 'Product updated' });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest,
  { params }: { params: Promise<{ id: string }> }) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await pool.query('DELETE FROM products WHERE product_id = ?', [id]);
    return NextResponse.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}