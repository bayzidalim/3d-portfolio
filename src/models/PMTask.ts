import mongoose, { Schema, Document } from 'mongoose';

export interface IPMTask extends Document {
  projectId: mongoose.Types.ObjectId;
  title: string;
  status: string;
  priority: string;
  dueDate: Date | null;
  order: number;
}

const PMTaskSchema: Schema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'PMProject', required: true },
  title: { type: String, required: true },
  status: { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  dueDate: { type: Date, default: null },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.PMTask || mongoose.model<IPMTask>('PMTask', PMTaskSchema);
