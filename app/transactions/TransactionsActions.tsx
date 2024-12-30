"use client";

import { CalendarIcon, ChevronDownIcon, Menu, PlusCircle, RefreshCw } from 'lucide-react'
import SyncButton from "./SyncButton";

interface TransactionsActionsProps {
    onSyncComplete: () => void
    onToggleSidebar: () => void
  }

export default function TransactionsActions({
  onSyncComplete, onToggleSidebar
}: TransactionsActionsProps) {

return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
      <div className="flex items-center">
        <button
          className="sm:hidden mr-4 p-2 text-gray-500 hover:text-gray-700"
          onClick={onToggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
      </div>
      <SyncButton onSynced={onSyncComplete}></SyncButton>
    </div>
  )

}
