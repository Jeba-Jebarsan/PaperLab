import { Hero } from "@/features/home/hero";
import { FeaturesGrid } from "@/features/home/features-grid";
import { ExamplePapers } from "@/features/home/example-papers";
import { DemoSimulation } from "@/features/home/demo-simulation";
import { LearningPath } from "@/features/home/learning-path";
import { getFeaturedPapers } from "@/lib/data/papers";

export default function HomePage() {
  return (
    <>
      <Hero />
      <LearningPath />
      <DemoSimulation />
      <ExamplePapers papers={getFeaturedPapers()} />
      <FeaturesGrid />
    </>
  );
}
