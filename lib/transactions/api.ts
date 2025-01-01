/**
 * Helper functions to interact with /api/transactions endpoints.
 */

import { BASE_URL } from "@/lib/constants";

export const fetchTransactions = async (page: number, selectedAccounts?: string[]) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    ...(selectedAccounts && { selectedAccounts: selectedAccounts.join(',') }), // Include selectedAccounts if provided
  });

  const response = await fetch(`/api/transactions?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch transactions');
  }
  return response.json();
};


export async function saveTransactions(transactions: any[], method: 'POST' | 'PUT') {
  try {
    const response = await fetch(`${BASE_URL}/api/transactions`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transactions,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save transactions");
    }

    return await response.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
  }
}