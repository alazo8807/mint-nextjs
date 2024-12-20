import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();
const ITEMS_PER_PAGE = 10;  // Set the number of items per page

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { page = 1 } = req.query; // Default to page 1 if no page is specified
    const pageNumber = parseInt(page as string, 10);
    const skip = (pageNumber - 1) * ITEMS_PER_PAGE;

    try {
      const transactions = await prisma.transaction.findMany({
        skip,
        take: ITEMS_PER_PAGE,
      });

      // Get the total count of transactions to calculate total pages
      const totalTransactions = await prisma.transaction.count();
      const totalPages = Math.ceil(totalTransactions / ITEMS_PER_PAGE);

      res.status(200).json({ transactions, totalPages, currentPage: pageNumber });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ error: 'Error fetching transactions' });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === 'POST') {
    const { transactions } = req.body;

    // deduplicate any possible existing transaction
    const existingTransactions = await prisma.transaction.findMany();
    const newTransactions = transactions.filter(
      (t) => !existingTransactions.some((m: { id: string }) => m.id === t.transaction_id)
    );

    // No new transactions received. Don't send unnecessary request to db
    if (newTransactions.length !== transactions.length) {
      console.warn("Some or all transactions received already existed.");
    }

    try {
      await prisma.transaction.createMany({
        data: newTransactions.map(txn => ({
          id: txn.transaction_id,
          transactionId: txn.transaction_id,
          accountId: txn.account_id,
          amount: txn.amount,
          currency: txn.iso_currency_code,
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

      res.status(200).json("success");
    } catch (error) {
      console.log(`Error saving transactions: ${error}`);
      res.status(500).json({ error: `Error saving transactions: ${error}` });
    }
  } else if (req.method === 'PUT') {
    const { transactions } = req.body;
    try {
      // deduplicate 
      const existingTransactions = await prisma.transaction.findMany();
      const updatedTransactions = [...existingTransactions.map((t) => transactions.find((m: { transaction_id: string; }) => m.transaction_id === t.id) || t)]
      
      await prisma.transaction.updateMany({
        data: updatedTransactions as Prisma.TransactionCreateManyInput[],
      });

      res.status(200).json("success");
    } catch (error) {
      // console.log('Error saving transactions:', error);
      res.status(500).json({ error: `Error saving transactions: ${error}` });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  };
}
