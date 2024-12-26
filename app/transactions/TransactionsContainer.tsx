import TransactionsPage from "./TransactionsPage";

// async function fetchTransactions() {
//   // Simulate fetching data from an API or database
//   return [
//     { id: 1, date: "2024-01-26", description: "Whole Foods Market", category: "Groceries", amount: -128.45 },
//     { id: 2, date: "2024-01-25", description: "Monthly Salary", category: "Income", amount: 5000.0 },
//     { id: 3, date: "2024-01-25", description: "Netflix Subscription", category: "Entertainment", amount: -15.99 },
//     { id: 4, date: "2024-01-24", description: "Shell Gas Station", category: "Auto & Transport", amount: -45.23 },
//     { id: 5, date: "2024-01-24", description: "Amazon.com", category: "Shopping", amount: -67.89 },
//   ];
// }

async function fetchTransactions(page: number) {
  try {
    const baseUrl =
      typeof window !== "undefined"
        ? "" // Use relative URL in the browser
        : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"; // Use absolute URL on the server

    const response = await fetch(`${baseUrl}/api/transactions?page=${page}`);
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
    
    return await response.json();
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
  }
}

export default async function TransactionsContainer() {
  let response;

  try {
    response = await fetchTransactions(1);
  } catch (error) {
    console.error(`Failed to fetch transactions: ${error}`);
    return <div>Error fetching transactions</div>;
  }

  if (!response) {
    return <div>No transactions found</div>;
  }

  const { transactions, currentPage: currentPageResponse, totalPages: totalPagesResponse } = response;
  return <TransactionsPage initialTransactions={transactions} />;
}
