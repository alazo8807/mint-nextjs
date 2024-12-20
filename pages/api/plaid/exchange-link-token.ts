// /pages/api/exchange-link-token.ts
import { plaidSyncCursorRepository } from '@/lib/repositories/plaidSyncCursorRepository';
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
  const { public_token } = req.body;

  if (!public_token) {
    res.status(400).json({ error: 'Missing public token' });
    return;
  }

  try {
    const response = await client.itemPublicTokenExchange({ public_token });

    // Save the access token and item ID
    const { access_token, item_id } = response.data;
    await plaidSyncCursorRepository.create(req.body.userId, item_id, access_token);

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to exchange token' });
  }
}
