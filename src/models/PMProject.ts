import mongoose, { Schema, Document } from 'mongoose';

export interface IPMProject extends Document {
  title: string;
  description: string;
  color: string;
  status: string;
  order: number;
}

const PMProjectSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  color: { type: String, default: '#6366f1' },
  status: { type: String, enum: ['active', 'archived'], default: 'active' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.PMProject || mongoose.model<IPMProject>('PMProject', PMProjectSchema);
