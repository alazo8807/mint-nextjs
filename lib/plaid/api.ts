/**
 * Helper functions to interact with /api/plaid endpoints.
 */

import { BASE_URL } from "@/lib/constants";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

export function createPlaidConfiguration(): Configuration {
  if (!process.env.PLAID_ENV || !process.env.PLAID_CLIENT_ID || !process.env.PLAID_SECRET) {
    throw new Error('Missing required environment variables for Plaid configuration.');
  }

  return new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV],
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
        'PLAID-SECRET': process.env.PLAID_SECRET,
      },
    },
  });
}

export function createPlaidApiClient() {
 return new PlaidApi(createPlaidConfiguration());
}

// syncTransactions calls transactions-sync api.
export const syncTransactions = async () => {
  // get itemId for user
  const response = await fetch(`${BASE_URL}/api/plaid/transactions-sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cursor: '',
    })
  });

  const data = await response.json();
  const { error } = data;
  if (error) {
    alert(error);
  }

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


// fetchLinkToken gets a public token to start link connection flow
export const fetchLinkToken = async () => {
  try {
      const response = await fetch("/api/plaid/create-link-token");
      if (!response.ok) {
      throw new Error("Failed to fetch link token");
      }
      const data = await response.json();
      const { link_token } = data;
      if (!link_token) {
      throw new Error("empty or invalid link token received");
      }

      return link_token;
  } catch (error) {
      console.error("Error fetching link token:", error);
  }

  return null;
};


// exchangeLinkToken exchanges the public token for an access_token. 
// The access_token is persisted in the server side and will be used to communicate with plaid.
export const exchangeLinkToken = async (publicToken: string) => {
  try {
    const response = await fetch("/api/plaid/exchange-link-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ public_token: publicToken }),
    });

    if (!response.ok) {
      throw new Error("Failed to exchange link token");
    }

    const respJson = await response.json();
    console.log({respJson})
    return respJson;
  } catch (error) {
    console.error("Error exchanging link token:", error);
  }
}