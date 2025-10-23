import { NextResponse } from 'next/server';
import pool from '@/lib/db'; // Ensure this path is correct for your database pool

/**
 * API route to fetch all products associated with a specific category ID.
 * Route path: /api/categories/[id]/products
 */
export async function GET(
  request: Request, 
  { params }: { params: { id: string } }
) {
  // Use Promise.resolve().then() to wrap the access to params 
  // and resolve the "sync-dynamic-apis" warning in this environment.
  const resolvedParams = await Promise.resolve(params);

  try {
    const categoryId = resolvedParams.id; 

    // Assuming pool.query returns a tuple/array where the first element contains the results
    const [products]: any = await pool.query( 
      'SELECT * FROM products WHERE category_id = ?',
      [categoryId]
    );

    // Always return an array, even if empty, for consistency
    return NextResponse.json({ products: products || [] });
  } catch (error) {
    // Note: Using resolvedParams.id here to avoid the same warning in the console log
    console.error(`Error fetching products for category ${resolvedParams.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
