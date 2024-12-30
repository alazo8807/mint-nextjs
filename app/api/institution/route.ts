import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/client';
import { Institution } from '@prisma/client';


// POST: Create a new institution
export async function POST(req: Request) {
  try {
    const { institutionId, institutionName }: Institution = await req.json();
    
    const newInstitution = await prisma.institution.create({
      data: {
        institutionId,
        institutionName
      }
    });

    return NextResponse.json(newInstitution, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create institution' }, { status: 500 });
  }
}

// GET: Retrieve all institutions
export async function GET() {
  try {
    const institutions = await prisma.institution.findMany();
    return NextResponse.json(institutions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch institutions' }, { status: 500 });
  }
}

// PUT: Update an institution
export async function PUT(req: Request) {
  try {
    const { institutionId, institutionName }: Institution = await req.json();
    
    const updatedInstitution = await prisma.institution.update({
      where: { institutionId },
      data: { institutionName }
    });

    return NextResponse.json(updatedInstitution);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update institution' }, { status: 500 });
  }
}

// DELETE: Delete an institution
export async function DELETE(req: Request) {
  try {
    const { institutionId }: { institutionId: string } = await req.json();
    
    await prisma.institution.delete({
      where: { institutionId }
    });

    return NextResponse.json({ message: 'Institution deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete institution' }, { status: 500 });
  }
}
