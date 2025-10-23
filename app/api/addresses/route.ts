// ============================================
// FILE: app/api/addresses/route.js
// Create address
// ============================================
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
  try {
    const { 
      customer_id, 
      address_type, 
      streetAddress, 
      city, 
      state, 
      zipCode, 
      country 
    } = await request.json();

    const [result] = await pool.query(
      `INSERT INTO addresses (customer_id, address_type, street_address, city, state, zip_code, country) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [customer_id, address_type, streetAddress, city, state, zipCode, country || 'USA']
    );

    return NextResponse.json({ 
      message: 'Address created',
      address_id: result.insertId
    });
  } catch (error) {
    console.error('Error creating address:', error);
    return NextResponse.json(
      { error: 'Failed to create address' },
      { status: 500 }
    );
  }
}
