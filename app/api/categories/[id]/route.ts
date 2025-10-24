import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db'; // Ensure this path is correct for your database pool

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Explicitly resolve params in an async context to satisfy the Next.js runtime check
  const resolvedParams = await Promise.resolve(params);

  try {
    // Access the ID from the resolved object
    const id = resolvedParams.id; 

    // Assuming pool.query returns a tuple/array where the first element contains the results
    const [categories]: any = await pool.query( 
      'SELECT * FROM categories WHERE category_id = ?',
      [id]
    );

    if (!categories || categories.length === 0) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ category: categories[0] });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}
