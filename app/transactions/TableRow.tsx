type Transaction = {
    id: number;
    date: string;
    name: string;
    category: string;
    amount: number;
  };
  
  type TableRowProps = {
    transaction: Transaction;
  };

  // Category is a string that contains an array of categories(e.g ["Travel","Taxi"]).
  // We need to parse it to an array and display only the last category.
  export default function TableRow({ transaction }: TableRowProps) {
    const renderCategory = (category: string): string => {
      const categoriesArr = JSON.parse(category);
      return categoriesArr[categoriesArr.length - 1];
    }

    return (
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {new Date(transaction.date).toLocaleDateString()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {transaction.name}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {renderCategory(transaction.category)}
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
  