import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Experience from '../models/Experience';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

async function addExperience() {
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB Atlas');

  // Add the new experience at the top (order: -1 so it comes first)
  await Experience.create({
    title: "Software Project Manager",
    job: "Bright Future Soft",
    date: "2024 - Present",
    contents: [
      "Bridging engineering and product strategy for software projects.",
      "Managing end-to-end project delivery and cross-functional team coordination.",
      "Overseeing technical planning, architecture decisions, and sprint execution.",
      "Ensuring quality standards and timely delivery of software products.",
    ],
    order: -1, // puts it at the top
  });
  console.log('New experience added: Software Project Manager @ Bright Future Soft');

  await mongoose.disconnect();
}

addExperience().catch((err) => {
  console.error(err);
  process.exit(1);
});
