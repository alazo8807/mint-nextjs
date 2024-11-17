// pages/api/transactions-sync.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox, // Replace with 'development' or 'production' as needed
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID!,
      'PLAID-SECRET': process.env.PLAID_SECRET!,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

const db = new Map<string, string | null>(); // TODO: Save in db

function saveCursor(cursor: string, accessToken: string) {
  db.set(accessToken, cursor)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { access_token } = req.body;

      if (!access_token) {
        res.status(400).json({ error: 'Missing token' });
        return;
      }

      const nextCursor = db.get(access_token) || null

      // Call the transactions.sync endpoint
      const response = await plaidClient.transactionsSync({
        access_token,
        cursor: nextCursor || "",
        options: {
          include_original_description: true
        }
      });

      // Update the next cursor for future syncs
      db.set(access_token, response.data.next_cursor);

      // Return the fetched transactions
      res.status(200).json({
        added: response.data.added,
        modified: response.data.modified,
        removed: response.data.removed,
        hasMore: response.data.has_more,
      });
    } catch (error: any) {
      console.error('Error with transactions.sync:', error.response?.data || error.message);
      res.status(500).json({ error: 'Error fetching transactions' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
