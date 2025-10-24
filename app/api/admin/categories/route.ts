// FILE: app/api/admin/categories/route.ts
import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';
import type { ResultSetHeader } from 'mysql2';

export async function POST(request: NextRequest) {
  try {
    const { category_name, description } = await request.json();
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO categories (category_name, description) VALUES (?, ?)',
      [category_name, description]
    );
    return NextResponse.json(
      { message: 'Category created', category_id: result.insertId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}