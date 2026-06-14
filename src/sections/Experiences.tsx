"use client";
import { Timeline } from "../components/Timeline";
const Experiences = ({ experiences }: { experiences: any[] }) => {
  return (
    <div id="work" className="w-full">
      <Timeline data={experiences} />
    </div>
  );
};

export default Experiences;
