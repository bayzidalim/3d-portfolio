import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';
import Project from '../models/Project';
import Experience from '../models/Experience';
import Social from '../models/Social';
import Review from '../models/Review';

import { myProjects, mySocials, experiences, reviews } from '../constants';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB Atlas');

  // Clear existing data
  await User.deleteMany({});
  await Project.deleteMany({});
  await Experience.deleteMany({});
  await Social.deleteMany({});
  await Review.deleteMany({});

  // 1. Create Admin User
  const email = 'admin@bayzidalim.com';
  const password = 'Bayzidalim420.';
  const passwordHash = await bcrypt.hash(password, 10);
  
  await User.create({ email, passwordHash });
  console.log('Admin user created');

  // 2. Seed Projects
  const projectsData = myProjects.map((p, index) => ({
    title: p.title,
    description: p.description,
    subDescription: p.subDescription,
    href: p.href,
    logo: p.logo,
    image: p.image,
    tags: p.tags,
    order: index,
  }));
  await Project.insertMany(projectsData);
  console.log('Projects seeded');

  // 3. Seed Experiences
  const experiencesData = experiences.map((e, index) => ({
    title: e.title,
    job: e.job,
    date: e.date,
    contents: e.contents,
    order: index,
  }));
  await Experience.insertMany(experiencesData);
  console.log('Experiences seeded');

  // 4. Seed Socials
  const socialsData = mySocials.map((s, index) => ({
    name: s.name,
    href: s.href,
    icon: s.icon,
    order: index,
  }));
  await Social.insertMany(socialsData);
  console.log('Socials seeded');

  // 5. Seed Reviews
  const reviewsData = reviews.map((r, index) => ({
    name: r.name,
    username: r.username,
    body: r.body,
    img: r.img,
    order: index,
  }));
  await Review.insertMany(reviewsData);
  console.log('Reviews seeded');

  console.log('Database seeding complete');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
