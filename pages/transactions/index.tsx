import { useState } from "react";
import { Transaction } from "plaid";
import GetTransactionsButton from "@/components/GetTransactionsBtn";
import PlaidLinkComponent from "@/components/PlaidLinkComponent";
import TransactionList from "@/components/TransactionList";
import '@/app/globals.css';
import Link from "next/link";

export default function Transactions() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleTransactions = (transactions: Transaction[]) => {
    console.log({ transactions })
    setTransactions(transactions)
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
      <section className="text-center">
          <h2 className="text-4xl font-extrabold mb-4">Connect to plaid first</h2>
          <p className="text-lg mb-6">
            In order to fetch your transactions you need to connect with plaid servers first.
          </p>
          <PlaidLinkComponent onAccessToken={setAccessToken}></PlaidLinkComponent>
        </section>
      </main>
      <h1 className="text-xl font-bold">My Brand</h1>
      
      <GetTransactionsButton accessToken={accessToken} onTransactions={handleTransactions}></GetTransactionsButton>
      <TransactionList transactions={transactions}></TransactionList>
    </div>
  )
}