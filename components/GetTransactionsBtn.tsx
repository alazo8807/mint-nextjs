import { Transaction} from 'plaid';

const GetTransactionsButton: React.FC<{ accessToken: string | null, onTransactions: (transactions: Transaction[]) => void }> = ({ accessToken, onTransactions }) => {
  const fetchTransactions = async () => {
    if (!accessToken) {
      console.error('No access token available');
      return;
    }

    if (!onTransactions) {
      console.error('No onTransactions specified');
      return
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
    onTransactions(data.transactions);
  };

  return <button className="btn btn-primary" onClick={fetchTransactions}>Get Transactions</button>;
};

export default GetTransactionsButton;
