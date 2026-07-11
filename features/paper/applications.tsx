"use client";

import { motion } from "framer-motion";
import {
  MessageSquareText,
  Search,
  Languages,
  Eye,
  Dna,
  Code2,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { Application } from "@/lib/data/types";
import { GlassCard } from "@/components/ui/glass-card";

const ICONS: Record<string, LucideIcon> = {
  "message-square": MessageSquareText,
  search: Search,
  languages: Languages,
  eye: Eye,
  dna: Dna,
  code: Code2,
};

export function Applications({ items }: { items: Application[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((app, i) => {
        const Icon = ICONS[app.icon] ?? Sparkles;
        return (
          <motion.div
            key={app.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.06, duration: 0.45 }}
          >
            <GlassCard hover className="h-full p-5">
              <Icon className="size-5 text-accent" strokeWidth={1.75} />
              <h4 className="mt-3 text-sm font-semibold">{app.title}</h4>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-dim">
                {app.description}
              </p>
            </GlassCard>
          </motion.div>
        );
      })}
    </div>
  );
}
