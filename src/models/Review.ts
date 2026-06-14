import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  name: string;
  username: string;
  body: string;
  img: string;
  order: number;
}

const ReviewSchema: Schema = new Schema({
  name: { type: String, required: true },
  username: { type: String },
  body: { type: String, required: true },
  img: { type: String },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
