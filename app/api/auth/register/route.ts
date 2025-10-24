// ============================================
// FILE: app/api/auth/register/route.ts
// User registration
// ============================================
import { NextResponse, NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import type { ResultSetHeader } from 'mysql2';

interface CustomerRow {
  customer_id: string;
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password, phone } = await request.json();

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const [rawRows] = await pool.query(
      'SELECT customer_id, email FROM customers WHERE email = ?',
      [email]
    );
    const existingUsers = rawRows as CustomerRow[];

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [insertResult] = await pool.query(
      `INSERT INTO customers (first_name, last_name, email, password_hash, phone) 
       VALUES (?, ?, ?, ?, ?)`,
      [firstName, lastName, email, hashedPassword, phone || null]
    );

    const result = insertResult as ResultSetHeader;

    return NextResponse.json(
      {
        message: 'User registered successfully',
        customer_id: result.insertId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
