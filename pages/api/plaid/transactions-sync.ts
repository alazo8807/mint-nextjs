import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { parse } from 'cookie';
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

const plaidClient = new PlaidApi(configuration);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {      
      // Parse cookies from the request
      const cookies = parse(req.headers.cookie || '');
      const accessToken = cookies.access_token;
      if (!accessToken) {
        return res.status(401).json({ error: 'Access token not found' });
      }

      // get plaidSyncCursor data for itemId received.
      const { itemId } = req.body;
      if (!itemId) {
          return res.status(400).json({ error: 'itemId is required' });
      }
      const syncData = await plaidSyncCursorRepository.getSyncData(itemId);
      if (!syncData) {
          throw new Error("Sync data not found for this item");
      }
      const { cursor: nextCursor } = syncData;

      // Call the transactions.sync endpoint
      const response = await plaidClient.transactionsSync({
        access_token: accessToken,
        cursor: nextCursor || "", // WARN: Empty cursor will retrieve all historical transactions.
        options: {
          include_original_description: true
        }
      });

      // Update the next cursor for future syncs
      const { next_cursor } = response.data;
      await plaidSyncCursorRepository.updateCursor(itemId, next_cursor);

      // Return the fetched transactions
      res.status(200).json({
        added: response.data.added,
        modified: response.data.modified,
        removed: response.data.removed,
        hasMore: response.data.has_more,
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error with transactions.sync:', error.response?.data || error.message);
      res.status(500).json({ error: 'Error fetching transactions' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
