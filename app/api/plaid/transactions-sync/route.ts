import { NextRequest, NextResponse } from 'next/server';
import { createPlaidApiClient } from '@/lib/plaid/api';
import { RemovedTransaction, Transaction } from 'plaid';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const client = createPlaidApiClient();

interface TransactionSyncResponse {
  added: Transaction[];
  modified: Transaction[];
  removed: RemovedTransaction[];
}

export async function POST(req: NextRequest) {
  try {
    // For now, using a hardcoded userId (to be replaced with JWT logic later)
    const userId = "test_user_id";

    // Fetch all item_ids and access_tokens for user
    const plaidTokens = await prisma?.plaidAccessToken.findMany({
      where: { userId },
      select: { itemId: true, accessToken: true, cursor: true }
    }) || [];

    if (plaidTokens?.length <= 0) {
      console.error(`No plaid tokens found for userId: ${userId}`);
      return NextResponse.json({ error: 'No token found for user' }, { status: 404 });
    }

    const syncResult: TransactionSyncResponse = {
      added: [],
      modified: [],
      removed: []
    }

    for (const item of plaidTokens) {
      let hasMore = true;
      let nextCursor = item.cursor ?? "";

      const { itemId, accessToken } = item;
      if (!itemId) return NextResponse.json({ error: 'Invalid item_id or user_id' }, { status: 404 });
      if (!accessToken) return NextResponse.json({ error: 'Invalid accessToken or user_id' }, { status: 404 });

      while (hasMore) {
        const response = await client.transactionsSync({
          access_token: accessToken,
          cursor: nextCursor,
          options: {
            include_original_description: true, // Needed to include the proper transaction description
          },
          count: 500, // Max allowed transactions per request
        });

        // Update the nextCursor with the value received from the response
        nextCursor = response.data.next_cursor || "";
        await prisma?.plaidAccessToken.update({
          where: {
            userId_itemId: { userId, itemId },
          },
          data: {
            cursor: nextCursor, // Store the new cursor in the database
          },
        });

        // Update the syncResult with the fetched transactions
        syncResult.added = [...syncResult.added, ...response.data.added];
        syncResult.modified = [...syncResult.modified, ...response.data.modified];
        syncResult.removed = [...syncResult.removed, ...response.data.removed];

        // Check if there are more transactions to fetch
        hasMore = response.data.has_more;
      }
    }

    // Return the aggregated transactions after all loops
    return NextResponse.json({
      added: syncResult.added,
      modified: syncResult.modified,
      removed: syncResult.removed,
    });

  } catch (error: any) {
    console.error('Error with transactions.sync:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Error fetching transactions' }, { status: 500 });
  }
}



export function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
