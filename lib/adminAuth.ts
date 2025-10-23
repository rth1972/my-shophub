// ============================================
// FILE: lib/adminAuth.js
// Middleware helper for admin routes
// ============================================
export function checkAdminAuth(request) {
  const token = request.cookies.get('admin_token')?.value;
  return token === 'authenticated';
}