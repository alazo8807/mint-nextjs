import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'cookie';
import { plaidSyncCursorRepository } from '@/lib/repositories/plaidSyncCursorRepository';
import { COOKIE_NAME } from '@/lib/constants';
import { createPlaidApiClient } from '@/lib/plaid/api';

const client = createPlaidApiClient();

export async function POST(req: NextRequest) {
  try {
    // Parse cookies from the request
    const cookieHeader = req.headers.get('cookie') || '';
    const cookies = parse(cookieHeader);
    const accessToken = cookies[COOKIE_NAME];
    if (!accessToken) {
      return NextResponse.json({ error: 'Access token not found' }, { status: 401 });
    }

    // Retrieve the next cursor from the database if there is any.
    // TODO: we should extract this in a separate endpoint for better separation of concerns and 
    // let the caller pass the cursor.
    const userId = 'alazotest'; // TODO: Get from jwt token later
    const itemIds = await plaidSyncCursorRepository.getItemIdsForUser(userId);
    if (!itemIds || itemIds.length <= 0) {
      console.error(`Could not fetch itemIds from PlaidCursorSync table for userId: ${userId}`)
      throw new Error("Invalid PlaidSyncCursor data");
    }
    const itemId = itemIds.length > 0 ? itemIds[0] : ""; // for now there is only 1 itemId per account.
    const syncCursorData = await plaidSyncCursorRepository.getSyncData(itemId);
    if (!syncCursorData) {
      console.error(`Could not fetch syncCursorData for userId: ${userId}`)
      throw new Error("Invalid PlaidSyncCursor data");
    }

    const cursor = syncCursorData ? syncCursorData.cursor : ""; // Use the stored cursor or empty string
   
    // Call the transactions.sync endpoint
    const response = await client.transactionsSync({
      access_token: accessToken,
      cursor: cursor?? "", // Empty cursor will fetch all historical transactions
      options: {
        include_original_description: true,
      },
      count: 500 // This is the max allowed
    });

    // Save next cursor
    const nextCursor = response.data.next_cursor || "";
    await plaidSyncCursorRepository.updateCursor(itemId, nextCursor);
  
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