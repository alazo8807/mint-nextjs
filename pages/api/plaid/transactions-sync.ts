import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { parse } from 'cookie';
import { PrismaClient, Prisma } from '@prisma/client';

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

const prisma = new PrismaClient(); 

const db = new Map<string, string | null>(); // TODO: Save in db

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {      
      // Parse cookies from the request
      const cookies = parse(req.headers.cookie || '');
      const accessToken = cookies.access_token;
      if (!accessToken) {
        return res.status(401).json({ error: 'Access token not found' });
      }

      const nextCursor = db.get(accessToken) || null

      // Call the transactions.sync endpoint
      const response = await plaidClient.transactionsSync({
        access_token: accessToken,
        // cursor: nextCursor || "",
        cursor: "", // TODO: use cursor empty to get all transactions. Use cursor once we have transactions persisted
        options: {
          include_original_description: true
        }
      });

      // Update the next cursor for future syncs
      db.set(accessToken, response.data.next_cursor);

      // Store received transactions.
      // TODO: Fetch them from db first, build the final list of transactions and persist them before returning.
      // Save transactions to SQLite
      await prisma.transaction.createMany({
        data: response.data.added.map(txn => ({
          id: txn.transaction_id,
          accountId: txn.account_id,
          amount: txn.amount,
          currency: txn.iso_currency_code, // Ensure null for missing values
          unofficialCurrency: txn.unofficial_currency_code || null,
          date: new Date(txn.date),
          authorizedDate: txn.authorized_date ? new Date(txn.authorized_date) : null,
          name: txn.name,
          merchantName: txn.merchant_name || null,
          pending: txn.pending,
          pendingTransactionId: txn.pending_transaction_id || null,
          category: txn.category ? JSON.stringify(txn.category) : null,
          paymentChannel: txn.payment_channel,
        })) as Prisma.TransactionCreateManyInput[],
      });
      

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
