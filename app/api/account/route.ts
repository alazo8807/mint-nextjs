import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/client';
import { Account } from '@prisma/client';

// POST: Create a new account
export async function POST(req: Request) {
  try {
    const { accountId, institutionId, name, subtype, currentBalance }: Account = await req.json();
    
    const newAccount = await prisma.account.create({
      data: {
        accountId,
        institutionId,
        name,
        subtype,
        currentBalance
      }
    });

    return NextResponse.json(newAccount, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}

// GET: Retrieve all accounts for a specific institution
export async function GET(req: Request) {
  try {
    const body = await req.json(); // Parse JSON body
    const { institutionId } = body;
    
    if (!institutionId) {
      return NextResponse.json({ error: 'Institution ID is required' }, { status: 400 });
    }

    const accounts = await prisma.account.findMany({
      where: {
        institutionId: String(institutionId)
      }
    });

    return NextResponse.json(accounts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  }
}

// PUT: Update account details
export async function PUT(req: Request) {
  try {
    const { accountId, name, subtype, currentBalance }: Account = await req.json();
    
    const updatedAccount = await prisma.account.update({
      where: { accountId },
      data: { name, subtype, currentBalance }
    });

    return NextResponse.json(updatedAccount);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update account' }, { status: 500 });
  }
}

// DELETE: Delete an account
export async function DELETE(req: Request) {
  try {
    const { accountId }: { accountId: string } = await req.json();
    
    await prisma.account.delete({
      where: { accountId }
    });

    return NextResponse.json({ message: 'Account deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}
