import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

/**
 * API route to fetch all products associated with a specific category ID.
 * Route path: /api/categories/[id]/products
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Await the params in Next.js 15
  const { id } = await context.params;
  
  try {
    const [products]: any = await pool.query(
      'SELECT * FROM products WHERE category_id = ?',
      [id]
    );
    return NextResponse.json({ products: products || [] });
  } catch (error) {
    console.error(`Error fetching products for category ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}