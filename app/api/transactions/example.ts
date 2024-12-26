import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: Request,
  res: Response
) {
    const transactions = [
        {
          id: 1,
          date: "2024-01-26",
          description: "Whole Foods Market",
          category: "Groceries",
          amount: -128.45,
        },
        {
          id: 2,
          date: "2024-01-25",
          description: "Monthly Salary",
          category: "Income",
          amount: 5000.0,
        },
        {
          id: 3,
          date: "2024-01-25",
          description: "Netflix Subscription",
          category: "Entertainment",
          amount: -15.99,
        },
        {
          id: 4,
          date: "2024-01-24",
          description: "Shell Gas Station",
          category: "Auto & Transport",
          amount: -45.23,
        },
        {
          id: 5,
          date: "2024-01-24",
          description: "Amazon.com",
          category: "Shopping",
          amount: -67.89,
        },
      ];
  
      return NextResponse.json(transactions);
}
