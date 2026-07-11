"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { AnimatedBackground } from "./animated-background";
import { SearchBar } from "@/features/search/search-bar";
import { Badge } from "@/components/ui/badge";

const EXAMPLE_CHIPS = [
  { label: "Attention Is All You Need", query: "attention is all you need" },
  { label: "YOLO", query: "yolo object detection" },
  { label: "GPT-3", query: "gpt-3 few-shot" },
  { label: "ViT", query: "vision transformer" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.6, ease: [0.21, 0.6, 0.35, 1] as const },
  }),
};

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28">
      <AnimatedBackground />

      <div className="mx-auto max-w-4xl px-5 text-center">
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
          <Badge tone="primary" className="mb-6 px-3 py-1 text-xs">
            <span className="size-1.5 rounded-full bg-accent animate-pulse-soft" />
            Your virtual AI laboratory
          </Badge>
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl"
        >
          Understand AI research papers{" "}
          <span className="text-gradient">by interacting with them</span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-dim md:text-lg"
        >
          Stop reading complex PDFs. PaperLab turns papers into live
          simulations you can experiment with — drag a slider, watch attention
          flow, break gradient descent — and an AI tutor explains what changed.
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mx-auto mt-10 max-w-2xl"
        >
          <SearchBar size="lg" />
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-ink-faint">Try:</span>
            {EXAMPLE_CHIPS.map((chip) => (
              <Link
                key={chip.label}
                href={`/search?q=${encodeURIComponent(chip.query)}`}
                className="rounded-full border border-line bg-white/[0.03] px-3 py-1 text-xs text-ink-dim transition-all hover:border-primary/40 hover:text-ink"
              >
                {chip.label}
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-10 flex items-center justify-center gap-4"
        >
          <Link
            href="/paper/1706.03762"
            className="group inline-flex items-center gap-2 text-sm font-medium text-primary-bright transition-colors hover:text-ink"
          >
            <BookOpen className="size-4" />
            See the Transformer paper explained
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
