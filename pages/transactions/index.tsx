import GetTransactionsButton from "@/app/components/GetTransactionsBtn";
import PlaidLinkComponent from "@/app/components/PlaidLinkComponent";
import { useState } from "react";
import { Transaction } from "plaid";

export default function Transactions() {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const handleTransactions = (transactions: Transaction[]) => {
    console.log({ transactions })
  }

  return (
    <div>
      <div>Transactions</div>
      <PlaidLinkComponent onAccessToken={setAccessToken}></PlaidLinkComponent>
      <GetTransactionsButton accessToken={accessToken} onTransactions={handleTransactions}></GetTransactionsButton>
    </div>
    
  )
}