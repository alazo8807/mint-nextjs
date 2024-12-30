"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TransactionsTable from "./TransactionsTable";
import TransactionsActions from "./TransactionsActions";
import { TransactionSidebar } from "@/components/transactions/TransactionsSidebar";
import { fetchTransactions } from "@/lib/transactions/api";

export default function TransactionsContainer() {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
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

  const handleAccountChange = (accountId: string) => {
    setSelectedAccounts(prev => {
      if (prev.includes(accountId)) {
        return prev.filter(id => id !== accountId)
      } else {
        return [accountId]
      }
    })
  }

  const handleTypeChange = (typeId: string) => {
    setSelectedTypes(prev => {
      if (prev.includes(typeId)) {
        return prev.filter(id => id !== typeId)
      } else {
        return [typeId]
      }
    })
  }


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
      <div className="flex flex-col space-y-8 mt-6">
          <TransactionsActions
            onSyncComplete={() => fetchAndSetTransactions(1)}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        <div className="flex flex-col sm:flex-row">
          <div className={`${isSidebarOpen ? 'block' : 'hidden'} sm:block sm:w-64 mb-4 sm:mb-0`}>
            <TransactionSidebar
              selectedAccounts={selectedAccounts}
              selectedTypes={selectedTypes}
              onAccountChange={handleAccountChange}
              onTypeChange={handleTypeChange}
            />
          </div>
          <div className="flex-1 sm:ml-4">
            <TransactionsTable
              initialTransactions={transactions}
              currentPage={currentPage}
              totalPages={totalPages}
              totalTransactions={totalTransactions}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}
