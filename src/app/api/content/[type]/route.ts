import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';
import Experience from '@/models/Experience';
import Social from '@/models/Social';
import Review from '@/models/Review';

function getModel(type: string) {
  switch (type) {
    case 'projects': return Project;
    case 'experiences': return Experience;
    case 'socials': return Social;
    case 'reviews': return Review;
    default: return null;
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  try {
    await connectToDatabase();
    const { type } = await params;
    const model = getModel(type);
    if (!model) return NextResponse.json({ error: 'Invalid type' }, { status: 400 });

    const body = await req.json();
    const newItem = await (model as any).create(body);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}
