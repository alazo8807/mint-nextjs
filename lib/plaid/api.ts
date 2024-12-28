/**
 * Helper functions to interact with /api/plaid endpoints.
 */

import { BASE_URL } from "@/lib/constants";

// syncTransactions calls transactions-sync api.
export const syncTransactions = async () => {
  // get itemId for user
  const response = await fetch(`${BASE_URL}/api/plaid/transactions-sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
    })
  });

  const data = await response.json();
  console.log('Sync Transactions:', data);
  return data;
};

// DEPRECATED: Should use syncTransactions endpoint instead. Use for debugging or testing only.
// fetchTransactions calls get-transactions api using the accessToken for plaid
export const fetchTransactions = async (accessToken: string | null) => {
  if (!accessToken) {
    return;
  }

  const response = await fetch(`${BASE_URL}/api/plaid/get-transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_token: accessToken,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    }),
  });

  const data = await response.json();
  console.log('Transactions:', data.transactions);
  return data.transactions;
};
