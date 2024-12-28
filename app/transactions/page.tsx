import { Header } from "@/components/layout/Header";
import TransactionsContainer from "./TransactionsContainer";

export default async function Transactions() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto py-6 px-4">
        <TransactionsContainer />
      </div>
    </main>
  );
}
