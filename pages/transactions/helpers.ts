import { plaidSyncCursorRepository } from "@/lib/repositories/plaidSyncCursorRepository";

// fetchTransactions calls get-transactions api using the accessToken for plaid
export const fetchTransactions = async (accessToken: string | null) => {
  if (!accessToken) {
    return;
  }

  const response = await fetch('/api/plaid/get-transactions', {
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

// syncTransactions calls transactions-sync api.
export const syncTransactions = async () => {
  // get itemId for user
  const userId = 'alazotest'; // TODO: get current user once implemented.
  const itemIds = await plaidSyncCursorRepository.getItemIdsForUser(userId);
  const response = await fetch('/api/plaid/transactions-sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      // For now there is only 1 itemId. If multiple accounts associated with the user,
      // then we need to get the right itemId.
      itemId: itemIds[0], 
    })
  });

  const data = await response.json();
  console.log('Sync Transactions:', data);
  return data;
};

// syncTransactions calls the set-access-token api to save the token server-side using cookies
export const saveAccessToken = async (accessToken: string | null) => {
  if (!accessToken) {
    return {
      data: null,
      error: { message: "Missing accessToken parameter!", code: 400 },
    };
  }

  const response = await fetch('/api/plaid/set-access-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_token: accessToken }),
  });

  const data = await response.json();
  return { data, error: null };
};

// checkAccessToken calls the check-access-token api to validate the access-token is saved as a cookie
export const checkAccessToken = async () => {
  const response = await fetch('/api/plaid/check-access-token', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  await response.json();
  return response.ok;
};