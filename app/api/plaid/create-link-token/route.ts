import { NextRequest, NextResponse } from 'next/server';
import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from 'plaid';

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV!],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID!,
      'PLAID-SECRET': process.env.PLAID_SECRET!,
    },
  },
});
const client = new PlaidApi(configuration);

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
