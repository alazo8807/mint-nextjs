import { NextRequest, NextResponse } from 'next/server';
import { createPlaidApiClient } from '@/lib/plaid/api';
import { prisma } from '@/lib/prisma/prismaClient';

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

    // Return the response data with the item_id and access_token
    return NextResponse.json({ message: 'Link created sucessfully' }, { status: 200 });
  } catch (error) {
    console.error('Error exchanging public token:', error);
    return NextResponse.json({ error: 'Unable to exchange token' }, { status: 500 });
  }
}
