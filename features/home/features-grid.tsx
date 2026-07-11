"use client";

import { motion } from "framer-motion";
import {
  Layers,
  MessageSquareText,
  Network,
  GraduationCap,
  Sigma,
  Code2,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeading } from "@/components/ui/section-heading";

const FEATURES = [
  {
    icon: Layers,
    title: "Three explanation levels",
    body: "Every paper explained for a 15-year-old, a developer, and a researcher. Switch depth with one tab.",
    color: "text-primary-bright",
  },
  {
    icon: Network,
    title: "Interactive diagrams",
    body: "Architectures you can click. Select any block to see what it does, with concrete examples — not static figures.",
    color: "text-accent",
  },
  {
    icon: Sigma,
    title: "Math that makes sense",
    body: "Every equation comes with its plain meaning and a real-world analogy. Formula → intuition → analogy, always.",
    color: "text-amber",
  },
  {
    icon: MessageSquareText,
    title: "Chat with the paper",
    body: "Ask anything — “what's the main innovation?”, “why √d_k?” — and get answers grounded in the paper itself.",
    color: "text-rose",
  },
  {
    icon: GraduationCap,
    title: "Papers become courses",
    body: "One click turns a paper into a mini course with lessons, visuals, and quizzes that check real understanding.",
    color: "text-primary-bright",
  },
  {
    icon: Code2,
    title: "Runnable code",
    body: "See the core idea as clean, minimal PyTorch you can actually run — the fastest path from theory to intuition.",
    color: "text-accent",
  },
];

export function FeaturesGrid() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
      <SectionHeading
        eyebrow="Why PaperLab"
        title="Built for understanding, not skimming"
        description="A summarizer compresses a paper. PaperLab teaches it — the way a great mentor would sit next to you and walk through it."
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.06 * i, duration: 0.5 }}
          >
            <GlassCard hover className="h-full p-6">
              <f.icon className={`size-6 ${f.color}`} strokeWidth={1.75} />
              <h3 className="mt-4 text-[15px] font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-dim">{f.body}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
