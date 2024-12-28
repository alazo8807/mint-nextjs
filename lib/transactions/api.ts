/**
 * Helper functions to interact with /api/transactions endpoints.
 */

import { BASE_URL } from "@/lib/constants";

export async function fetchTransactions(page: number) {
  try {
    const response = await fetch(`${BASE_URL}/api/transactions?page=${page}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
    }

    return await response.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
  }
}

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