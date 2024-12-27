import { NextRequest, NextResponse } from 'next/server';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { plaidSyncCursorRepository } from '@/lib/repositories/plaidSyncCursorRepository';

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Parse JSON body
    const { public_token } = body;

    if (!public_token) {
      return NextResponse.json({ error: 'Missing public token' }, { status: 400 });
    }

    // Exchange the public token for an access token and item ID
    const response = await client.itemPublicTokenExchange({ public_token });

    // // Save accessToken associated to item_id in SyncCursor table to be used as cursor's key
    // await plaidSyncCursorRepository.create(userId, item_id, access_token);

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error exchanging public token:', error);
    return NextResponse.json({ error: 'Unable to exchange token' }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
