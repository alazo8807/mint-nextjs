import { NextRequest, NextResponse } from 'next/server';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { parse } from 'cookie';
import { plaidSyncCursorRepository } from '@/lib/repositories/plaidSyncCursorRepository';
import { COOKIE_NAME } from '@/lib/constants';

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV!],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID!,
      'PLAID-SECRET': process.env.PLAID_SECRET!,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

export async function POST(req: NextRequest) {
  try {
    // Parse cookies from the request
    const cookieHeader = req.headers.get('cookie') || '';
    const cookies = parse(cookieHeader);
    const accessToken = cookies[COOKIE_NAME];
    if (!accessToken) {
      return NextResponse.json({ error: 'Access token not found' }, { status: 401 });
    }

    // Call the transactions.sync endpoint
    const { cursor = '' } = await req.json(); // Read the cursor from the request body if provided
    const response = await plaidClient.transactionsSync({
      access_token: accessToken,
      cursor, // Empty cursor will fetch all historical transactions
      options: {
        include_original_description: true,
      },
    });

    // Return the fetched transactions
    return NextResponse.json({
      added: response.data.added,
      modified: response.data.modified,
      removed: response.data.removed,
      hasMore: response.data.has_more,
    });
  } catch (error: any) {
    console.error('Error with transactions.sync:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Error fetching transactions' }, { status: 500 });
  }
}