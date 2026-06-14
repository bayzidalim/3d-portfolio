import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';
import Experience from '@/models/Experience';
import Social from '@/models/Social';
import Review from '@/models/Review';

export async function GET() {
  try {
    await connectToDatabase();

    const [projects, experiences, socials, reviews] = await Promise.all([
      (Project as any).find({}).sort({ order: 1 }).lean(),
      (Experience as any).find({}).sort({ order: 1 }).lean(),
      (Social as any).find({}).sort({ order: 1 }).lean(),
      (Review as any).find({}).sort({ order: 1 }).lean(),
    ]);

    return NextResponse.json({
      projects,
      experiences,
      socials,
      reviews,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}
