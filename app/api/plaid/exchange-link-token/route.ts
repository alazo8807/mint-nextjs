import { NextRequest, NextResponse } from 'next/server';
import { plaidSyncCursorRepository } from '@/lib/repositories/plaidSyncCursorRepository';
import { createPlaidApiClient } from '@/lib/plaid/api';

const client = createPlaidApiClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Parse JSON body
    const { public_token } = body;

    if (!public_token) {
      return NextResponse.json({ error: 'Missing public token' }, { status: 400 });
    }

    // Exchange the public token for an access token and item ID
    const response = await client.itemPublicTokenExchange({ public_token });
    
    // Save accessToken associated to item_id in SyncCursor table to be used as cursor's key
    // TODO: we should extract this in a separate endpoint for better separation of concerns and 
    // let the caller update the cursor.
    const {item_id, access_token} = response.data;
    await plaidSyncCursorRepository.create('alazotest', item_id, access_token );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error exchanging public token:', error);
    return NextResponse.json({ error: 'Unable to exchange token' }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
