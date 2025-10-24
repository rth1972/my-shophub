// app/api/cart/sync/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db'; // Adjust path to your database connection

export async function POST(request: NextRequest) {
  try {
    const { customer_id, cart } = await request.json();

    if (!customer_id) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Get existing cart from database
    const [existingCart] = await pool.query(
      `SELECT c.*, p.product_name, p.price, p.image_url 
       FROM cart c 
       JOIN products p ON c.product_id = p.product_id 
       WHERE c.customer_id = ?`,
      [customer_id]
    );

    // Create a map of existing items
    const existingMap = new Map();
    (existingCart as any[]).forEach((item: any) => {
      existingMap.set(item.product_id, item.quantity);
    });

    // Merge local cart with database cart
    const mergedItems = new Map();

    // Add database items first
    (existingCart as any[]).forEach((item: any) => {
      mergedItems.set(item.product_id, {
        product_id: item.product_id,
        product_name: item.product_name,
        price: item.price,
        quantity: item.quantity,
        image_url: item.image_url
      });
    });

    // Add or merge local cart items
    cart.forEach((item: any) => {
      const existing = mergedItems.get(item.product_id);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        mergedItems.set(item.product_id, item);
      }
    });

    // Clear existing cart in database
    await pool.query('DELETE FROM cart WHERE customer_id = ?', [customer_id]);

    // Insert merged cart into database
    const mergedCart = Array.from(mergedItems.values());
    
    if (mergedCart.length > 0) {
      const values = mergedCart.map((item: any) => [
        customer_id,
        item.product_id,
        item.quantity
      ]);

      await pool.query(
        'INSERT INTO cart (customer_id, product_id, quantity) VALUES ?',
        [values]
      );
    }

    return NextResponse.json({ 
      success: true, 
      cart: mergedCart 
    });
  } catch (error) {
    console.error('Cart sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync cart' },
      { status: 500 }
    );
  }
}