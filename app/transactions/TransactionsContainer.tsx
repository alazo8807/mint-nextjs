"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TransactionsTable from "./TransactionsTable";
import TransactionsActions from "./TransactionsActions";
import { fetchTransactions } from "@/lib/transactions/api";

export default function TransactionsContainer() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAndSetTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchTransactions(1);
      setTransactions(response.transactions);
    } catch (err) {
      setError("Failed to fetch transactions.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetTransactions();
  }, []);

  if (loading) {
    return <div className="font-bold text-gray-900">Loading transactions...</div>;
  }

  if (error) {
    return <div className="font-bold text-gray-900">{error}</div>;
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
        <TransactionsActions onSyncComplete={() => fetchAndSetTransactions()}/>
      </div>
      <TransactionsTable initialTransactions={transactions} />
    </>
  );
}
