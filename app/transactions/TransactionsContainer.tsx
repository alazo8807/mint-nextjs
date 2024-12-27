"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TransactionsTable from "./TransactionsTable";
import TransactionsActions from "./TransactionsActions";
import { fetchTransactions } from "@/lib/transactions/api";

export default function TransactionsContainer() {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 10; // Define items per page

  const fetchAndSetTransactions = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchTransactions(page); // Fetch transactions for the given page
      setTransactions(response.transactions);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
      setTotalTransactions(response.totalTransactions);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setError("Failed to fetch transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetTransactions(1);
  }, []);

  const handlePageChange = (page: number) => {
    fetchAndSetTransactions(page);
  };

  if (loading) {
    return (
      <div className="font-bold text-gray-900">Loading transactions...</div>
    );
  }

  if (error) {
    return <div className="font-bold text-gray-900">{error}</div>;
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
        <TransactionsActions
          onSyncComplete={() => fetchAndSetTransactions(1)}
        />
      </div>
      <TransactionsTable
        initialTransactions={transactions}
        currentPage={currentPage}
        totalPages={totalPages}
        totalTransactions={totalTransactions}
        onPageChange={handlePageChange}
      />
    </>
  );
}
