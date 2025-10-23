// ============================================
// FILE: app/api/admin/auth/logout/route.js
// Admin logout API
// ============================================
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out successfully' });
  
  // Delete admin cookie
  response.cookies.delete('admin_token');
  
  return response;
}