import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { fakeTransactions } from "@/mock/fakeTransactions";

const prisma = new PrismaClient();
const ITEMS_PER_PAGE = 10; // Set the number of items per page

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const useFakeTransactions = searchParams.get('fake'); // Debug flag to return mock data
  const page = searchParams.get('page') || '1';
  const selectedAccounts = searchParams.get('selectedAccounts'); // Comma-separated account IDs
  const pageNumber = parseInt(page as string, 10);
  const skip = (pageNumber - 1) * ITEMS_PER_PAGE;

  if (useFakeTransactions) {
    return NextResponse.json({ transactions: [...fakeTransactions] }, { status: 200 });
  }

  try {
    // Parse selected accounts if provided
    const accountFilters = selectedAccounts
      ? selectedAccounts.split(',').map((id) => id.trim())
      : null;

    const transactions = await prisma.transaction.findMany({
      skip,
      take: ITEMS_PER_PAGE,
      where: accountFilters
        ? { accountId: { in: accountFilters } } // Filter by selected accounts
        : undefined, // No filtering if no selected accounts
    });

    // Get the total count of filtered transactions
    const totalTransactions = await prisma.transaction.count({
      where: accountFilters
        ? { accountId: { in: accountFilters } }
        : undefined,
    });

    const totalPages = Math.ceil(totalTransactions / ITEMS_PER_PAGE);

    return NextResponse.json(
      {
        transactions,
        totalPages,
        currentPage: pageNumber,
        totalTransactions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error fetching transactions: ${error}`);
    return NextResponse.json(
      { message: 'Error fetching transactions' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}


export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { transactions } = body;

    // Deduplicate transactions
    const existingTransactions = await prisma.transaction.findMany();
    const updatedTransactions = [
      ...existingTransactions.map(
        (t) =>
          transactions.find(
            (m: { transaction_id: string }) => m.transaction_id === t.id
          ) || t
      ),
    ];

    await prisma.transaction.updateMany({
      data: updatedTransactions as Prisma.TransactionCreateManyInput[],
    });

    return NextResponse.json({ message: "success" });
  } catch (error) {
    console.error("Error saving transactions:", error);
    return NextResponse.json(
      { error: `Error saving transactions: ${error}` },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transactions } = body;

    // Deduplicate any possible existing transactions
    const existingTransactions = await prisma.transaction.findMany();
    const newTransactions = transactions.filter(
      (t: { transaction_id: string }) =>
        !existingTransactions.some(
          (m: { id: string }) => m.id === t.transaction_id
        )
    );

    // No new transactions received
    if (newTransactions.length !== transactions.length) {
      console.warn("Some or all transactions received already existed.");
    }

    await prisma.transaction.createMany({
      data: newTransactions.map((txn: any) => ({
        id: txn.transaction_id,
        transactionId: txn.transaction_id,
        accountId: txn.account_id,
        amount: txn.amount,
        currency: txn.iso_currency_code,
        unofficialCurrency: txn.unofficial_currency_code || null,
        date: new Date(txn.date),
        authorizedDate: txn.authorized_date
          ? new Date(txn.authorized_date)
          : null,
        name: txn.name,
        merchantName: txn.merchant_name || null,
        pending: txn.pending,
        pendingTransactionId: txn.pending_transaction_id || null,
        category: txn.category ? JSON.stringify(txn.category) : null,
        paymentChannel: txn.payment_channel,
        personalFinanceCategoryDetail: txn.personal_finance_category.detailed
      })) as Prisma.TransactionCreateManyInput[],
    });

    return NextResponse.json({ message: "success" });
  } catch (error) {
    console.error("Error saving transactions:", error);
    return NextResponse.json(
      { error: `Error saving transactions: ${error}` },
      { status: 500 }
    );
  }
}
