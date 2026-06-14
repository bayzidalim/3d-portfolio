"use client";
import { OrbitingCircles } from "./OrbitingCircles";

export function Frameworks() {
  const skills = [
    { name: "react", path: "assets/logos/react.svg" },
    { name: "nextjs", path: "assets/logos/nextjs.png" },
    { name: "tailwindcss", path: "assets/logos/tailwindcss.svg" },
    { name: "nodejs", path: "assets/logos/nodejs.png" },
    { name: "express", path: "assets/logos/express.png" },
    { name: "javascript", path: "assets/logos/javascript.svg" },
    { name: "git", path: "assets/logos/git.svg" },
    { name: "github", path: "assets/logos/github.svg" },
    { name: "sqlite", path: "assets/logos/sqlite.svg" },
    { name: "html5", path: "assets/logos/html5.svg" },
    { name: "css3", path: "assets/logos/css3.svg" },
    { name: "vite", path: "assets/logos/vitejs.svg" },
  ];
  return (
    <div className="relative flex h-[15rem] w-full flex-col items-center justify-center">
      <OrbitingCircles iconSize={40}>
        {skills.map((skill, index) => (
          <Icon key={index} src={skill.path} />
        ))}
      </OrbitingCircles>
      <OrbitingCircles iconSize={25} radius={100} reverse speed={2}>
        {skills.slice().reverse().map((skill, index) => (
          <Icon key={index} src={skill.path} />
        ))}
      </OrbitingCircles>
    </div>
  );
}

const Icon = ({ src }) => (
  <img src={src} className="duration-200 rounded-sm hover:scale-110" />
);
