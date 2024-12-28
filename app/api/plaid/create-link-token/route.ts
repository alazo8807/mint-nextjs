import { NextRequest, NextResponse } from 'next/server';
import {Products, CountryCode } from 'plaid';
import { createPlaidApiClient } from '@/lib/plaid/api';

const client = createPlaidApiClient();

export async function GET() {
  try {
    console.log({secret: process.env.PLAID_SECRET})
    const response = await client.linkTokenCreate({
      user: { client_user_id: 'user-id' }, // Replace with your unique user ID
      client_name: 'my-mint',
      products: ['transactions'] as Products[],
      country_codes: ['CA'] as CountryCode[],
      language: 'en',
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error creating Plaid link token:', error);
    return NextResponse.json({ error: 'Unable to create link token' }, { status: 500 });
  }
}

export function POST() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
