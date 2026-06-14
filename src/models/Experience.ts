import mongoose, { Schema, Document } from 'mongoose';

export interface IExperience extends Document {
  title: string;
  job: string;
  date: string;
  contents: string[];
  order: number;
}

const ExperienceSchema: Schema = new Schema({
  title: { type: String, required: true },
  job: { type: String, required: true },
  date: { type: String, required: true },
  contents: [{ type: String }],
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Experience || mongoose.model<IExperience>('Experience', ExperienceSchema);
