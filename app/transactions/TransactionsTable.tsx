"use client";

import { useState } from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import Pagination from "./Pagination";
import EmptyState from "./EmptyState";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { PlaidConnectionBanner } from "@/components/banners/PlaidConnectionBanner";
import { Transaction } from "@/lib/types";

// type SortKey = "date" | "description" | "category" | "amount";
// type SortOrder = "asc" | "desc";
type TransactionsTableProps = {
  initialTransactions: Transaction[];
  currentPage: number;
  totalPages: number;
  totalTransactions: number;
  sortColumn: string;
  sortDirection: string;
  onSortChange: (column: string) => void;
  onPageChange: (page: number) => void;
};

export default function TransactionsTable({
  initialTransactions,
  currentPage,
  totalPages,
  totalTransactions,
  sortColumn,
  sortDirection,
  onSortChange,
  onPageChange,
}: TransactionsTableProps) {
  const [transactions] = useState(initialTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  // const [sortKey, setSortKey] = useState<SortKey>("date");
  // const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [isPlaidConnected, setIsPlaidConnected] = useState(true);

  // Filter and sort transactions
  const filteredTransactions = transactions
  .filter((txn) =>
    (txn.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto">
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
            {filteredTransactions.length > 0 ? (
              <>
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <TableHeader
                      sortKey={sortColumn}
                      sortOrder={sortDirection}
                      onSort={onSortChange}
                    />
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTransactions.map((txn) => (
                      <TableRow key={txn.id} transaction={txn} />
                    ))}
                  </tbody>
                </table>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalRows={totalTransactions}
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
