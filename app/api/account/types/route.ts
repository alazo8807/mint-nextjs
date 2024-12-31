import { NextResponse } from 'next/server';
import { NextApiRequest} from 'next';
import prisma from '@/lib/prisma/client';

// GET: Retrieve all types from view
export async function GET(req: NextApiRequest) {
    try {
    //   // Parse the URL using the URL API
    //   const url = new URL(req.url || '');
      
    //   // Extract query parameters. TODO: Extract by userId
    //   const institutionId = url.searchParams.get('institutionId');
    //   if (!institutionId) {
    //     return NextResponse.json({ error: 'Institution ID is required' }, { status: 400 });
    //   }
  
      const accountTypes = await prisma.uniqueAccountTypes.findMany();
  
      return NextResponse.json(accountTypes);
    } catch (error) {
      console.log("Failed to fetch account types", error);
      return NextResponse.json({ error: 'Failed to fetch account types' }, { status: 500 });
    }
  }