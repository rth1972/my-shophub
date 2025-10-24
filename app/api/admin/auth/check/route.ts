// ============================================
// FILE: app/api/admin/auth/check/route.js
// Check if admin is authenticated
// ============================================
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request:NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (token === 'authenticated') {
      return NextResponse.json({ authenticated: true });
    } else {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication check failed' },
      { status: 401 }
    );
  }
}