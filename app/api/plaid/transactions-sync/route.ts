import { NextRequest, NextResponse } from 'next/server';
import { createPlaidApiClient } from '@/lib/plaid/api';

const client = createPlaidApiClient();

export async function POST(req: NextRequest) {
  try {
    // Retrieve the item_id from the request body
    const { itemId } = await req.json();
    
    if (!itemId) {
      return NextResponse.json({ error: 'Missing item_id' }, { status: 400 });
    }

    // For now, using a hardcoded userId (to be replaced with JWT logic later)
    const userId = "test_user_id";

    // Fetch the access_token and cursor for the given itemId
    const plaidToken = await prisma?.plaidAccessToken.findUnique({
      where: {
        userId_itemId: { userId, itemId },
      },
    });

    if (!plaidToken) {
      console.error(`No token found for userId: ${userId} and itemId: ${itemId}`);
      return NextResponse.json({ error: 'Invalid item_id or user_id' }, { status: 404 });
    }

    const accessToken = plaidToken.accessToken;
    const cursor = plaidToken.cursor ?? "";  // Default to empty string if no cursor is set

    // Call the transactions.sync endpoint with the access_token and cursor
    const response = await client.transactionsSync({
      access_token: accessToken,
      cursor: cursor, // Empty cursor will fetch all historical transactions
      options: {
        include_original_description: true, // Needed to include the proper transaction description
      },
      count: 500, // This is the max allowed
    });

    // Save the next_cursor received from the Plaid API
    const nextCursor = response.data.next_cursor || "";
    await prisma?.plaidAccessToken.update({
      where: {
        userId_itemId: { userId, itemId },
      },
      data: {
        cursor: nextCursor,
      },
    });

    // Return the fetched transactions
    return NextResponse.json({
      added: response.data.added,
      modified: response.data.modified,
      removed: response.data.removed,
      hasMore: response.data.has_more,
      nextCursor: response.data.next_cursor,
    });
  } catch (error: any) {
    console.error('Error with transactions.sync:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Error fetching transactions' }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
