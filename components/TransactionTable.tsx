'use client'

import React from 'react';

interface TransactionListProps {
  transactions: Array<any>;
  currentPage: number;
  totalPages: number;
  onPrev: (page: number) => void;
  onNext: (page: number) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, currentPage, totalPages, onPrev, onNext }) => {
  return (
      <div className="overflow-x-auto">
      <table className="table w-full border-collapse border border-gray-200">
        <thead>
        <tr className="bg-gray-100 text-gray-600">
          <th className="border border-gray-200 px-4 py-2">Date</th>
          <th className="border border-gray-200 px-4 py-2">Description</th>
          <th className="border border-gray-200 px-4 py-2">Category</th>
          <th className="border border-gray-200 px-4 py-2 text-right">Amount</th>
        </tr>
        </thead>
        <tbody>
        {transactions.map((transaction) => (
          <tr key={transaction.id}>
          <td className="border border-gray-200 px-4 py-2">{transaction.date}</td>
          <td className="border border-gray-200 px-4 py-2">{transaction.name}</td>
          <td className="border border-gray-200 px-4 py-2">{transaction.category}</td>
          <td className="border border-gray-200 px-4 py-2">{transaction.amount < 0 ? (
                  <span className="text-red-600">{transaction.amount.toFixed(2)}</span>
                ) : (
                  <span className="text-green-600">{transaction.amount.toFixed(2)}</span>
                )}</td>
        </tr>
        ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          className="btn btn-neutral"
          onClick={() => onPrev(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="flex items-center justify-center">{currentPage} / {totalPages}</span>
        <button
          className="btn btn-neutral"
          onClick={() => onNext(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionList;
