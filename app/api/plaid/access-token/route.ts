import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/prismaClient';

// Create a new PlaidToken (for user connecting an account)
export async function POST(request: Request) {
  const { userId, itemId, accessToken, refreshToken } = await request.json();

  try {
    const newToken = await prisma.plaidAccessToken.create({
      data: {
        userId,
        itemId,
        accessToken,
        refreshToken,
      },
    });
    return NextResponse.json(newToken, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create token' }, { status: 500 });
  }
}

// Get PlaidToken for a user and item (Fetch by userId and itemId)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const itemId = searchParams.get('itemId');

  if (!userId || !itemId) {
    return NextResponse.json({ error: 'userId and itemId are required' }, { status: 400 });
  }

  try {
    const plaidToken = await prisma.plaidAccessToken.findUnique({
      where: { userId_itemId: { userId, itemId } },
    });
    if (!plaidToken) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 });
    }
    return NextResponse.json(plaidToken);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch token' }, { status: 500 });
  }
}

// Update PlaidToken (update only the fields passed in the body)
export async function PUT(request: Request) {
    const { userId, itemId, accessToken, refreshToken, cursor } = await request.json();
  
    // Prepare the update data based on the fields provided
    const updateData: { accessToken?: string; refreshToken?: string; cursor?: string } = {};
  
    if (accessToken) updateData.accessToken = accessToken;
    if (refreshToken) updateData.refreshToken = refreshToken;
    if (cursor) updateData.cursor = cursor;
  
    // Perform the update
    try {
      const updatedToken = await prisma.plaidAccessToken.update({
        where: { userId_itemId: { userId, itemId } },
        data: updateData,  // Only the fields that are passed in the request body will be updated
      });
      return NextResponse.json(updatedToken);
    } catch (error) {
      return NextResponse.json({ error: 'Failed to update token' }, { status: 500 });
    }
  }

// Delete a PlaidToken (e.g., when user disconnects)
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const itemId = searchParams.get('itemId');

  if (!userId || !itemId) {
    return NextResponse.json({ error: 'userId and itemId are required' }, { status: 400 });
  }

  try {
    await prisma.plaidAccessToken.delete({
      where: { userId_itemId: { userId, itemId } },
    });
    return NextResponse.json({ message: 'Token deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete token' }, { status: 500 });
  }
}
