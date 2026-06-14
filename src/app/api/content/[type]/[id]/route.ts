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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ type: string, id: string }> }) {
  try {
    await connectToDatabase();
    const { type, id } = await params;
    const model = getModel(type);
    if (!model) return NextResponse.json({ error: 'Invalid type' }, { status: 400 });

    const body = await req.json();
    const updatedItem = await (model as any).findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updatedItem);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ type: string, id: string }> }) {
  try {
    await connectToDatabase();
    const { type, id } = await params;
    const model = getModel(type);
    if (!model) return NextResponse.json({ error: 'Invalid type' }, { status: 400 });

    await (model as any).findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
