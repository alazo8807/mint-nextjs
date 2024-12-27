import { ArrowUpDown } from "lucide-react";

type TableHeaderProps = {
  sortKey: string;
  sortOrder: string;
  onSort: (key: string) => void;
};

export default function TableHeader({
  sortKey,
  sortOrder,
  onSort,
}: TableHeaderProps) {
  const headers = [
    { label: "Date", key: "date" },
    { label: "Description", key: "description" },
    { label: "Category", key: "category" },
    { label: "Amount", key: "amount" },
  ];

  return (
    <tr>
      {headers.map((header) => (
        <th
          key={header.key}
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
          onClick={() => onSort(header.key)}
        >
          <div className="flex items-center">
            {header.label}
            {sortKey === header.key && (
              <ArrowUpDown className="ml-1 h-4 w-4" />
            )}
          </div>
        </th>
      ))}
    </tr>
  );
}
