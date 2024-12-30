import { NextRequest, NextResponse } from 'next/server';
import { createPlaidApiClient } from '@/lib/plaid/api';
import prisma from '@/lib/prisma/client';
import { fetchInstitutionAndAccountInfo } from './helpers';
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
    const { item_id, access_token } = response.data;

    // For now, using a hardcoded userId (to be replaced with JWT logic later)
    const userId = "test_user_id";

    // Persist the access token in the PlaidToken table
    await prisma.plaidAccessToken.create({
      data: {
        userId,
        itemId: item_id,
        accessToken: access_token,
        refreshToken: null,
        cursor: null,
      },
    });

    // Fetch and persist institution and accounts info associated to this connection token.
    const { institutionId, institutionName, accounts } = await fetchInstitutionAndAccountInfo(access_token, client);

    // Persist the institution data in the database
    const institution = await prisma.institution.upsert({
      where: { institutionId },
      update: { institutionName },
      create: { institutionId, institutionName },
    });

    // Persist the account data in the database
    const accountPromises = accounts.map(async (account) => {
      const accountId = account.account_id || "";
      const name = account.name || "";
      const subtype = account.subtype || "";
      const currentBalance = account.balances.current || 0;
  
      // Save account info, linking it to the correct institution
      await prisma.account.upsert({
        where: { accountId: accountId },
        update: { name, subtype, currentBalance, institutionId: institution.institutionId },
        create: {
        accountId: accountId,
        name,
        subtype,
        currentBalance,
        institutionId: institution.institutionId,
        },
      });
    });

    // Wait for all account inserts/updates to complete
    await Promise.all(accountPromises);

    // Return the response data with the item_id and access_token
    return NextResponse.json({ message: 'Link created sucessfully' }, { status: 200 });
  } catch (error) {
    console.error('Error exchanging public token:', error);
    return NextResponse.json({ error: 'Unable to exchange token' }, { status: 500 });
  }
}



