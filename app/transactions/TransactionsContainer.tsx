import TransactionsPage from "./TransactionsPage";

async function fetchTransactions(page: number) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"; // Use absolute URL on the server
    const response = await fetch(`${baseUrl}/api/transactions?page=${page}`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
    
    return await response.json();
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
  }
}

export default async function TransactionsContainer({ searchParams }: { searchParams: { [key: string]: string } }) {
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

  console.log({response})
  const { transactions, currentPage: currentPageResponse, totalPages: totalPagesResponse } = response;
  return <TransactionsPage initialTransactions={transactions} />;
}
