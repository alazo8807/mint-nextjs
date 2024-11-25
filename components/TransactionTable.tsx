'use client'

import React from 'react';
import { Transaction } from 'plaid';

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
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
          <tr key={transaction.transaction_id}>
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
    </div>
  );
};

export default TransactionList;
