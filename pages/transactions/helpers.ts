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

// syncTransactions calls transactions-sync api using the accessToken for plaid
export const syncTransactions = async (accessToken: string | null) => {
  if (!accessToken) {
    return {
      data: null,
      error: { message: "Missing accessToken parameter!", code: 400 },
    };
  }

  const response = await fetch('/api/plaid/transactions-sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_token: accessToken }),
  });

  const data = await response.json();
  console.log('Sync Transactions:', data);
  return { data, error: null };
};