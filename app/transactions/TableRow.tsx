type Transaction = {
    id: number;
    date: string;
    description: string;
    category: string;
    amount: number;
  };
  
  type TableRowProps = {
    transaction: Transaction;
  };
  
  export default function TableRow({ transaction }: TableRowProps) {
    return (
      <tr className="hover:bg-gray-50">
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
            transaction.amount >= 0 ? "text-green-600" : "text-gray-900"
          }`}
        >
          {transaction.amount >= 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
        </td>
      </tr>
    );
  }
  