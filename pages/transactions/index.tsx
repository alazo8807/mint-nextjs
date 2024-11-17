import { useEffect, useState } from "react";
import { Transaction } from "plaid";
import PlaidLinkComponent from "@/components/PlaidLinkComponent";
import TransactionList from "@/components/TransactionList";
import '@/app/globals.css';
import Link from "next/link";
// import GetTransactionsButton from "@/components/GetTransactionsBtn";

const fetchTransactions = async (accessToken: string | null) => {
  if (!accessToken) {
    return;
  }

  const response = await fetch('/api/plaid/get-transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_token: accessToken,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    }),
  });

  const data = await response.json();
  console.log('Transactions:', data.transactions);
  return data.transactions;
};

export default function Transactions() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const getTransactions = async () => {
      const transactions = await fetchTransactions(accessToken)
      setTransactions(transactions);
    }
    getTransactions()
  }, [accessToken])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">My Mint</h1>
          <nav>
            <Link className="mx-2 hover:underline" href="/">Home</Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-16">
        {!accessToken && <section className="text-center">
          <h2 className="text-4xl font-extrabold mb-4">Connect to plaid first</h2>
          <p className="text-lg mb-6">
            In order to fetch your transactions you need to connect with plaid servers first.
          </p>
          <PlaidLinkComponent onAccessToken={setAccessToken}></PlaidLinkComponent>
        </section>}
        {transactions && transactions.length > 0 && <section>
          {/* <GetTransactionsButton accessToken={accessToken} onTransactions={handleTransactions}></GetTransactionsButton> */}
          <TransactionList transactions={transactions}></TransactionList>
        </section>}
      </main>
    </div>
  )
}