"use client";

import { useState, useEffect } from "react";
import { checkAccessToken } from "@/lib/auth/api";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import Pagination from "./Pagination";
import EmptyState from "./EmptyState";
import { TransactionFilters } from "@/components/transactions/transaction-filters";
import { PlaidConnectionBanner } from "@/components/banners/plaid-connection-banner";

type Transaction = {
  id: number;
  date: string;
  description: string;
  category: string;
  amount: number;
};

type SortKey = "date" | "description" | "category" | "amount";
type SortOrder = "asc" | "desc";

type TransactionsTableProps = {
  initialTransactions: Transaction[];
  currentPage: number;
  totalPages: number;
  totalTransactions: number;
  onPageChange: (page: number) => void;
};

export default function TransactionsTable({
  initialTransactions,
  currentPage,
  totalPages,
  totalTransactions,
  onPageChange,
}: TransactionsTableProps) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [isPlaidConnected, setIsPlaidConnected] = useState(true);

  // Check if Plaid is connected
  useEffect(() => {
    const checkConnection = async () => {
      const connected = await checkAccessToken();
      setIsPlaidConnected(connected);
    };
    checkConnection();
  }, []);

  // Handle sorting logic
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // Filter and sort transactions
  const filteredAndSortedTransactions = transactions
  .filter((txn) =>
    (txn.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="mx-auto py-6">
      {!isPlaidConnected && (
        <PlaidConnectionBanner onConnected={() => setIsPlaidConnected(true)} />
      )}
      <div className="flex flex-col space-y-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                All Transactions
              </h2>
              <TransactionFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            {filteredAndSortedTransactions.length > 0 ? (
              <>
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <TableHeader
                      sortKey={sortKey}
                      sortOrder={sortOrder}
                      onSort={handleSort}
                    />
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAndSortedTransactions.map((txn) => (
                      <TableRow key={txn.id} transaction={txn} />
                    ))}
                  </tbody>
                </table>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalTransactions={totalTransactions}
                  onPageChange={onPageChange}
                />
              </>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
