// ============================================
// FILE: app/api/auth/me/route.ts
// Get current user
// ============================================
import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import pool from '@/lib/db';

interface UserRow {
  customer_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    if (typeof decoded === 'string' || !('customer_id' in decoded)) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
    }

    const customerId = (decoded as JwtPayload).customer_id;

    const [rawRows] = await pool.query(
  'SELECT customer_id, first_name, last_name, email, phone FROM customers WHERE customer_id = ? AND is_active = TRUE',
  [customerId]
);

const rows = rawRows as UserRow[];

if (rows.length === 0) {
  return NextResponse.json({ error: 'User not found' }, { status: 404 });
}

return NextResponse.json({ user: rows[0] });

  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }
}
