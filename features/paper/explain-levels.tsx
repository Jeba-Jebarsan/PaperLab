"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Baby, Code2, FlaskConical } from "lucide-react";
import type { ExplainLevel, ExplainSection } from "@/lib/data/types";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

const LEVELS: { id: ExplainLevel; label: string; hint: string; icon: typeof Baby }[] = [
  { id: "beginner", label: "Beginner", hint: "Explain like I'm 15", icon: Baby },
  { id: "developer", label: "Developer", hint: "Technical, practical", icon: Code2 },
  { id: "researcher", label: "Researcher", hint: "Precise and deep", icon: FlaskConical },
];

export function ExplainLevels({
  levels,
}: {
  levels: Record<ExplainLevel, ExplainSection[]>;
}) {
  const [level, setLevel] = React.useState<ExplainLevel>("beginner");
  const sections = levels[level];

  return (
    <GlassCard className="overflow-hidden">
      <div className="flex border-b border-line">
        {LEVELS.map((l) => (
          <button
            key={l.id}
            onClick={() => setLevel(l.id)}
            className={cn(
              "relative flex flex-1 flex-col items-center gap-0.5 px-3 py-4 transition-colors cursor-pointer",
              level === l.id ? "text-ink" : "text-ink-faint hover:text-ink-dim"
            )}
          >
            <span className="flex items-center gap-2 text-sm font-medium">
              <l.icon className="size-4" />
              {l.label}
            </span>
            <span className="hidden text-[11px] text-ink-faint sm:block">{l.hint}</span>
            {level === l.id && (
              <motion.span
                layoutId="level-indicator"
                className="absolute inset-x-6 bottom-0 h-0.5 rounded-full bg-primary"
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={level}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="space-y-6 p-6 md:p-8"
        >
          {sections.map((s) => (
            <div key={s.heading}>
              <h4 className="text-sm font-semibold text-primary-bright">{s.heading}</h4>
              <p className="mt-1.5 text-[15px] leading-relaxed text-ink-dim">{s.body}</p>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </GlassCard>
  );
}
