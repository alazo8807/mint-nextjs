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

  return <button onClick={fetchTransactions}>Get Transactions</button>;
};

  // interface Transaction {
  //   transaction_id: string;
  //   name: string;
  //   amount: number;
  // }

//   const fetchTransactions = async (accessToken: string) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch('/api/get-transactions', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           access_token: accessToken, // Replace with your stored access token
//           startDate: '2023-01-01', // Replace with your desired start date
//           endDate: '2023-12-31', // Replace with your desired end date
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`Error: ${response.status}`);
//       }

//       const data = await response.json();
//       setTransactions(data.transactions);
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (err: any) {
//       setError(err.message || 'Failed to fetch transactions.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <button onClick={() => fetchTransactions(accessToken)} disabled={loading}>
//         {loading ? 'Loading...' : 'Get Transactions'}
//       </button>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <ul>
//         {transactions.map((transaction) => (
//           <li key={transaction.transaction_id}>
//             {transaction.name}: ${transaction.amount}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

export default GetTransactionsButton;
