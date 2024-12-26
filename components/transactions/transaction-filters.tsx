import { SearchIcon } from 'lucide-react'

interface TransactionFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
}

export function TransactionFilters({ searchTerm, onSearchChange }: TransactionFiltersProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search transactions..."
          className="pl-10 pr-4 py-2 w-64 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <select className="pl-4 pr-8 py-2 text-sm text-gray-700 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
        <option value="all">All Categories</option>
        <option value="income">Income</option>
        <option value="groceries">Groceries</option>
        <option value="entertainment">Entertainment</option>
        <option value="transport">Auto & Transport</option>
        <option value="shopping">Shopping</option>
      </select>
    </div>
  )
}

