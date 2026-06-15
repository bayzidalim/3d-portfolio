import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import PMTask from '@/models/PMTask';
import mongoose from 'mongoose';

export async function PATCH(req: NextRequest) {
  try {
    await connectToDatabase();

    const { tasks } = await req.json();
    const operations = tasks.map((task: { _id: string; status: string; order: number }) => ({
      updateOne: {
        filter: { _id: new mongoose.Types.ObjectId(task._id) },
        update: { $set: { status: task.status, order: task.order } },
      },
    }));

    await (PMTask as any).bulkWrite(operations);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to reorder tasks' }, { status: 500 });
  }
}
