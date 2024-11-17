import { useEffect, useState } from "react";
import PlaidLinkComponent from "@/components/PlaidLinkComponent";
import TransactionList from "@/components/TransactionTable";
import '@/app/globals.css';
import Link from "next/link";
import { syncTransactions } from "./helpers";
// import GetTransactionsButton from "@/components/GetTransactionsBtn";
import { Transaction } from 'plaid';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface SyncTransactionsData {
  added: Transaction[];
  hasMore: boolean;
  modified: Transaction[];
  removed: Transaction[];
}

export default function Transactions() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load list of transactions when accessToken is available
  useEffect(() => {
    const getTransactions = async () => {
      if (accessToken) {
        const { data, error } = await syncTransactions(accessToken);
        if (error && error.message) {
          console.log("Error with sync transactions", error.message, error.code)
          return;
        }
        setTransactions((prev) => [
          ...data.added,
          ...prev.map((t) =>
            data.modified.find((m: { transaction_id: string; }) => m.transaction_id === t.transaction_id) || t
          ),
        ]);
      }
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
        {/* Connect to plaid if no accessToken available*/}
        {!accessToken && <section className="text-center">
          <h2 className="text-4xl font-extrabold mb-4">Connect to plaid first</h2>
          <p className="text-lg mb-6">
            In order to fetch your transactions you need to connect with plaid servers first.
          </p>
          <PlaidLinkComponent onAccessToken={setAccessToken}></PlaidLinkComponent>
        </section>}
        {/* Display transactions table once data is ready */}
        {transactions && transactions.length > 0 && <section>
          <TransactionList transactions={transactions}></TransactionList>
          {/* <GetTransactionsButton accessToken={accessToken} onTransactions={handleTransactions}></GetTransactionsButton> */}
        </section>}
      </main>
    </div>
  )
}