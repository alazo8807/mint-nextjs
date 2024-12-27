"use client";

import SyncButton from "./SyncButton";
import FilterButton from "./FilterButton";

export default function TransactionsActions({
  onSyncComplete,
}: {
  onSyncComplete: () => void;
}) {
  return (
    <div className="flex items-center space-x-2">
      <SyncButton onSynced={onSyncComplete} />
      <FilterButton />
    </div>
  );
}
