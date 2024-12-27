import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function EmptyState() {
  return (
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
          <PlusCircle className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add Transaction
        </Link>
      </div>
    </div>
  );
}
