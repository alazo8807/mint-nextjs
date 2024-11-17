import React from 'react';
import { Transaction } from 'plaid';

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {transactions.map((transaction) => (
        <div key={transaction.transaction_id} className="card w-full bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">{transaction.merchant_name}</h2>
            <p className="text-sm text-gray-500">{transaction.date}</p>
            <div className="card-actions justify-end">
              <span className="text-xl font-bold text-green-500">
                ${transaction.amount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
