import mongoose, { Schema, Document } from 'mongoose';

export interface ISocial extends Document {
  name: string;
  href: string;
  icon: string;
  order: number;
}

const SocialSchema: Schema = new Schema({
  name: { type: String, required: true },
  href: { type: String, required: true },
  icon: { type: String },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Social || mongoose.model<ISocial>('Social', SocialSchema);
