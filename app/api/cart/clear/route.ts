// app/api/cart/clear/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db'; // Adjust path to your database connection

export async function DELETE(request: NextRequest) {
  try {
    const { customer_id } = await request.json();

    if (!customer_id) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Clear cart from database
    await pool.query('DELETE FROM cart WHERE customer_id = ?', [customer_id]);

    return NextResponse.json({ 
      success: true,
      message: 'Cart cleared successfully' 
    });
  } catch (error) {
    console.error('Cart clear error:', error);
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}