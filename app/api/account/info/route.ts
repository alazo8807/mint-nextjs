import { NextResponse } from 'next/server';
import { NextApiRequest} from 'next';
import prisma from '@/lib/prisma/client';

// GET: Retrieve accountInfo from view
export async function GET(req: NextApiRequest) {
    try {
    //   // Parse the URL using the URL API
    //   const url = new URL(req.url || '');
      
    //   // Extract query parameters
    //   const institutionId = url.searchParams.get('institutionId');
      
    //   if (!institutionId) {
    //     return NextResponse.json({ error: 'Institution ID is required' }, { status: 400 });
    //   }
  
      const accounts = await prisma.accountInformationView.findMany();
  
      return NextResponse.json(accounts);
    } catch (error) {
      console.log("Failed to fetch accounts info", error);
      return NextResponse.json({ error: 'Failed to fetch accounts info' }, { status: 500 });
    }
  }