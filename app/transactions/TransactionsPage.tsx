"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarIcon,
  ChevronDownIcon,
  PlusCircle,
  ArrowUpDown,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { TransactionFilters } from "@/components/transactions/transaction-filters";

type Transaction = {
  id: number;
  date: string;
  description: string;
  category: string;
  amount: number;
};

type SortKey = "date" | "description" | "category" | "amount";
type SortOrder = "asc" | "desc";

export default function TransactionsPage({
  initialTransactions,
}: {
  initialTransactions: Transaction[];
}) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const SortableHeader = ({
    label,
    sortKey: key,
  }: {
    label: string;
    sortKey: SortKey;
  }) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
      onClick={() => handleSort(key)}
    >
      <div className="flex items-center">
        {label}
        <ArrowUpDown className="ml-1 h-4 w-4" />
      </div>
    </th>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <div className="flex flex-col space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
            <div className="flex items-center space-x-2">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <CalendarIcon className="h-4 w-4" />
                Last 30 Days
                <ChevronDownIcon className="h-4 w-4" />
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Add Transaction
              </button>
            </div>
          </div>

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
              {sortedTransactions.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <SortableHeader label="Date" sortKey="date" />
                      <SortableHeader
                        label="Description"
                        sortKey="description"
                      />
                      <SortableHeader label="Category" sortKey="category" />
                      <SortableHeader label="Amount" sortKey="amount" />
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {transaction.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {transaction.category}
                          </span>
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                            transaction.amount >= 0
                              ? "text-green-600"
                              : "text-gray-900"
                          }`}
                        >
                          {transaction.amount >= 0 ? "+" : ""}$
                          {Math.abs(transaction.amount).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-16">
                  <PlusCircle className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No transactions
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by adding your first transaction.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/add-transaction"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <PlusCircle
                        className="-ml-1 mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                      Add Transaction
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
