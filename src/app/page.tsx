import Navbar from "../sections/Navbar";
import Hero from "../sections/Hero";
import About from "../sections/About";
import Projects from "../sections/Projects";
import Experiences from "../sections/Experiences";
import Testimonial from "../sections/Testimonial";
import Contact from "../sections/Contact";
import Footer from "../sections/Footer";

import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import Experience from "@/models/Experience";
import Social from "@/models/Social";
import Review from "@/models/Review";

export const revalidate = 60; // revalidate every 60 seconds

export default async function Home() {
  await connectToDatabase();
  const [projects, experiences, socials, reviews] = await Promise.all([
    (Project as any).find({}).sort({ order: 1 }).lean(),
    (Experience as any).find({}).sort({ order: 1 }).lean(),
    (Social as any).find({}).sort({ order: 1 }).lean(),
    (Review as any).find({}).sort({ order: 1 }).lean(),
  ]);

  // Convert to plain objects to pass from Server to Client component
  const safeProjects = JSON.parse(JSON.stringify(projects));
  const safeExperiences = JSON.parse(JSON.stringify(experiences));
  const safeSocials = JSON.parse(JSON.stringify(socials));
  const safeReviews = JSON.parse(JSON.stringify(reviews));

  return (
    <div className="container mx-auto max-w-7xl">
      <Navbar />
      <Hero />
      <About />
      <Projects projects={safeProjects} />
      <Experiences experiences={safeExperiences} />
      <Testimonial reviews={safeReviews} />
      <Contact />
      <Footer socials={safeSocials} />
    </div>
  );
}
