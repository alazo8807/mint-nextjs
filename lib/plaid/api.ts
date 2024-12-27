const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"; // Use absolute URL on the server

// syncTransactions calls transactions-sync api.
export const syncTransactions = async () => {
  // get itemId for user
  const response = await fetch(`${baseUrl}/api/plaid/transactions-sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
    })
  });

  const data = await response.json();
  console.log('Sync Transactions:', data);
  return data;
};

// DEPRECATED: Should use sync endpoint instead. Use for debugging or testing only.
// fetchTransactions calls get-transactions api using the accessToken for plaid
export const fetchTransactions = async (accessToken: string | null) => {
  if (!accessToken) {
    return;
  }

  const response = await fetch(`${baseUrl}/api/plaid/get-transactions`, {
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

