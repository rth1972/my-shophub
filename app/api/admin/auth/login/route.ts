// ============================================
// FILE: app/api/admin/auth/login/route.js
// Admin login API
// ============================================
import { NextResponse } from 'next/server';

const ADMIN_EMAIL = 'robintehofstee@gmail.com';
const ADMIN_PASSWORD = 'welkom';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Check credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const response = NextResponse.json({ 
        message: 'Login successful',
        admin: { email: ADMIN_EMAIL }
      });

      // Set HTTP-only cookie for admin session
      response.cookies.set('admin_token', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 8 * 60 * 60 // 8 hours
      });

      return response;
    } else {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}