export type Transaction = {
    id: number;
    date: string;
    name: string;
    category: string;
    amount: number;
  };

export type Account = {
    id: string
    name: string
    type: string
    bank: string
  }