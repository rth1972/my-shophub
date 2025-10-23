// ============================================
// FILE: app/api/categories/route.js
// Get all categories
// ============================================
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [categories] = await pool.query(
      'SELECT * FROM categories ORDER BY category_name'
    );
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}