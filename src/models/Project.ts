import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  subDescription: string[];
  href: string;
  logo: string;
  image: string;
  tags: { id: number; name: string; path: string }[];
  order: number;
}

const ProjectSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  subDescription: [{ type: String }],
  href: { type: String },
  logo: { type: String },
  image: { type: String },
  tags: [{
    id: { type: Number },
    name: { type: String },
    path: { type: String },
  }],
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
