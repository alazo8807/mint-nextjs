import TransactionsContainer from "./TransactionsContainer";

export default async function Transactions({searchParams}: {searchParams: { [key: string]: string }}) {
  return <TransactionsContainer searchParams={searchParams}/>;
}
