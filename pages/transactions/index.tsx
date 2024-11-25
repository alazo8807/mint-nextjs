import { useEffect, useState } from "react";
import PlaidLinkComponent from "@/components/PlaidLinkComponent";
import TransactionList from "@/components/TransactionTable";
import '@/app/globals.css';
import Link from "next/link";
import { saveAccessToken, syncTransactions, checkAccessToken } from "./helpers";
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Check if the 'access_token' cookie is set
  useEffect(() => {
    const checkIsAuthenticated = async () => {
      const ok = await checkAccessToken();
      setIsAuthenticated(ok);  // The cookie is set
    }
    checkIsAuthenticated();
  }, []);

  // // Load list of transactions when accessToken is available
  // useEffect(() => {
  //   const getTransactions = async () => {
  //     if (isAuthenticated) {
  //       const data = await syncTransactions();
  //       setTransactions((prev) => [
  //         ...data.added,
  //         ...prev.map((t) =>
  //           data.modified.find((m: { transaction_id: string; }) => m.transaction_id === t.transaction_id) || t
  //         ),
  //       ]);
  //     }
  //   }
  //   getTransactions();
  // }, [isAuthenticated])

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch('/api/transactions');
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
        const data = await response.json();
        setTransactions(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error(error);
        setError(error.message);
      }
    }

    fetchTransactions();
  }, []);

  // handleAccessToken persists the accessToken received
  const handleAccessToken = async (accessToken: string) => {
    const { error } = await saveAccessToken(accessToken)
    if (error && error.message) {
      console.log("Error saving access_token", error.message, error.code)
      setError(error.message)
      return;
    }

    setIsAuthenticated(true);
  }

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
        {error && <p>Error: {error}</p>}
        {/* Connect to plaid if no accessToken available*/}
        {!isAuthenticated && <section className="text-center">
          <h2 className="text-4xl font-extrabold mb-4">Connect to plaid first</h2>
          <p className="text-lg mb-6">
            In order to fetch your transactions you need to connect with plaid servers first.
          </p>
          <PlaidLinkComponent onAccessToken={handleAccessToken}></PlaidLinkComponent>
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