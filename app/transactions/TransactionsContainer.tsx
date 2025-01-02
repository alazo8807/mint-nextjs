"use client";

import { useState, useEffect } from "react";
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
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<string>('desc');

  useEffect(() => {
    fetchAndSetTransactions(1, sortColumn, sortDirection, selectedAccounts);
  }, []);

  // Handler for updating selected accounts
  const handleAccountSelection = (accountId: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId]
    );
  };

  // Fetch transactions when accounts change
  useEffect(() => {
    fetchAndSetTransactions(1, sortColumn, sortDirection, selectedAccounts);
  }, [sortColumn, sortDirection, selectedAccounts]);

  const fetchAndSetTransactions = async (
    page: number,
    sortColumn: string, 
    sortDirection: string,
    selectedAccounts?: string[]
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchTransactions(page, sortColumn, sortDirection, selectedAccounts);
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

  const handlePageChange = (page: number) => {
    fetchAndSetTransactions(page, sortColumn, sortDirection, selectedAccounts); // Include the filter in the page change
  };

  const handleTypeChange = (typeId: string) => {
    setSelectedTypes((prev) => {
      if (prev.includes(typeId)) {
        return prev.filter((id) => id !== typeId);
      } else {
        return [typeId];
      }
    });
  };

  const handleSortChanged = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
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
      <div className="flex flex-col space-y-8 mt-6">
        <TransactionsActions
          onSyncComplete={() => fetchAndSetTransactions(1, sortColumn, sortDirection, selectedAccounts)}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <div className="flex flex-col sm:flex-row">
          <div
            className={`${
              isSidebarOpen ? "block" : "hidden"
            } sm:block sm:w-64 mb-4 sm:mb-0`}
          >
            <TransactionSidebar
              selectedAccounts={selectedAccounts}
              selectedTypes={selectedTypes}
              onAccountChange={handleAccountSelection}
              onTypeChange={handleTypeChange}
            />
          </div>
          <div className="flex-1 sm:ml-4">
            <TransactionsTable
              initialTransactions={transactions}
              currentPage={currentPage}
              totalPages={totalPages}
              totalTransactions={totalTransactions}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSortChange={handleSortChanged}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}
