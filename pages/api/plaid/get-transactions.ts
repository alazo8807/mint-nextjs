// Always try to favor the use of transactions-sync route.
// This route is not in use at the moment.
// You can use this route if you need to fetch transactions for a date range.
import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { access_token, startDate, endDate } = req.body;

  if (!access_token || !startDate || !endDate) {
    res.status(400).json({ error: 'Missing required parameters' });
    return;
  }

  try {
    const response = await client.transactionsGet({
      access_token,
      start_date: startDate,
      end_date: endDate,
      options: {
        include_original_description: true
      }
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch transactions' });
  }
}
