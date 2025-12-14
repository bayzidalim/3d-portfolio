import { Canvas, useFrame } from "@react-three/fiber";
import HeroText from "../components/HeroText";
import ParallaxBackground from "../components/parallaxBackground";
import { Astronaut } from "../components/Astronaut";
import { Float, ContactShadows, Environment } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";
import { easing } from "maath";
import { Suspense } from "react";
import Loader from "../components/Loader";

const Hero = () => {
  // Ensure proper deployment
  const isMobile = useMediaQuery({ maxWidth: 853 });
  return (
    <section id="home" className="flex items-start justify-center min-h-screen overflow-hidden md:items-start md:justify-start c-space">
      <HeroText />
      <ParallaxBackground />
      <figure
        className="absolute inset-0"
        style={{ width: "100vw", height: "100vh" }}
      >
        <Canvas
          camera={{ position: [0, 1, 3] }}
          dpr={[1, 2]}
          gl={{ preserveDrawingBuffer: true }}
          performance={{ min: 0.5 }}
          shadows
        >
          <Suspense fallback={<Loader />}>
            <Environment preset="city" />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
            <Float floatIntensity={2} speed={3}>
              <Astronaut
                scale={isMobile ? 0.23 : 0.3}
                position={isMobile ? [0, -1.5, 0] : [1.3, -1, 0]}
              />
            </Float>
            <ContactShadows opacity={0.5} scale={10} blur={2.5} far={4} color="#000000" />
            <Rig />
          </Suspense>
        </Canvas>
      </figure>
    </section>
  );
};

function Rig() {
  return useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [state.mouse.x / 10, 1 + state.mouse.y / 10, 3],
      0.5,
      delta
    );
  });
}

export default Hero;
