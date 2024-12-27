"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { syncTransactions } from "@/lib/plaid/api";
import { saveTransactions } from "@/lib/transactions/api";

type SyncProps = {
    onSynced: () => void;
}

export default function SyncButton({ onSynced }: SyncProps) {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    if (isSyncing) return; // Prevent duplicate sync calls
    setIsSyncing(true);

    try {
      const data = await syncTransactions();
      if (!data) throw new Error("No data returned from syncTransactions");

      // Handle updated and new transactions 
      const tasks: Promise<any>[] = [];
  
      // Save new transactions
      if (Array.isArray(data.added) && data.added.length > 0) {
        tasks.push(
          saveTransactions(data.added, 'POST')
            .then((response) =>
              console.log(`New transactions response: ${JSON.stringify(response)}`)
            )
            .catch((error) => {
              console.error('Failed to save new transactions:', error);
              alert('Failed to save new transactions.');
            })
        );
      }
  
      // Update modified transactions
      if (Array.isArray(data.modified) && data.modified.length > 0) {
        tasks.push(
          saveTransactions(data.modified, 'PUT')
            .then((response) =>
              console.log(`Modified transactions response: ${JSON.stringify(response)}`)
            )
            .catch((error) => {
              console.error('Failed to update modified transactions:', error);
              alert('Failed to update modified transactions.');
            })
        );
      }
  
      // Wait for all tasks to complete
      await Promise.all(tasks);

      onSynced();
    } catch (error) {
      console.error("Synchronization failed:", error);
      alert("Failed to synchronize. Please try again.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <button
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-w-[172px]"
      onClick={handleSync}
      disabled={isSyncing}
    >
      <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
      {isSyncing ? "Syncing" : "Sync Transactions"}
    </button>
  );
}
