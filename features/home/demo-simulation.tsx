"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { GradientDescentSimulator } from "@/features/simulators/gradient-descent/gradient-descent-simulator";

export function DemoSimulation() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
      <SectionHeading
        eyebrow="Try it right now"
        title="This is what learning feels like here"
        description="A live gradient descent lab — crank the learning rate past 0.9 and watch training explode. That intuition is worth ten textbook pages."
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mt-10"
      >
        <GradientDescentSimulator compact />
      </motion.div>
    </section>
  );
}
