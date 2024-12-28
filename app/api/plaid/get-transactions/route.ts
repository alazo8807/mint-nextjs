import { NextRequest, NextResponse } from 'next/server';
import { createPlaidApiClient } from '@/lib/plaid/api';

const client = createPlaidApiClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Parse the JSON body
    const { access_token, startDate, endDate } = body;

    // Validate required parameters
    if (!access_token || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Fetch transactions from Plaid
    const response = await client.transactionsGet({
      access_token,
      start_date: startDate,
      end_date: endDate,
      options: {
        include_original_description: true,
      },
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Unable to fetch transactions' }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
