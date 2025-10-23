// ============================================
// FILE: app/api/orders/create/route.js
// Create order from cart
// ============================================
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { 
      customer_id, 
      shipping_address_id, 
      billing_address_id, 
      payment_method 
    } = await request.json();

    // Use stored procedure to create order
    const [result] = await connection.query(
      'CALL sp_create_order_from_cart(?, ?, ?, ?, @order_id)',
      [customer_id, shipping_address_id, billing_address_id, payment_method]
    );

    // Get the order_id from the OUT parameter
    const [orderIdResult] = await connection.query('SELECT @order_id as order_id');
    const orderId = orderIdResult[0].order_id;

    await connection.commit();

    return NextResponse.json({ 
      message: 'Order created successfully',
      order_id: orderId
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}