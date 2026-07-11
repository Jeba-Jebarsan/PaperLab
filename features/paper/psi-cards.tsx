"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Lightbulb, Rocket } from "lucide-react";
import type { PsiCard } from "@/lib/data/types";
import { GlassCard } from "@/components/ui/glass-card";

const META = [
  { key: "problem" as const, label: "Problem", icon: AlertTriangle, color: "text-rose", ring: "border-rose/25" },
  { key: "solution" as const, label: "Solution", icon: Lightbulb, color: "text-amber", ring: "border-amber/25" },
  { key: "impact" as const, label: "Impact", icon: Rocket, color: "text-accent", ring: "border-accent/25" },
];

export function PsiCards({
  psi,
}: {
  psi: { problem: PsiCard; solution: PsiCard; impact: PsiCard };
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {META.map((m, i) => {
        const card = psi[m.key];
        return (
          <motion.div
            key={m.key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="relative"
          >
            {/* connector arrow on desktop */}
            {i < 2 && (
              <span className="absolute -right-3.5 top-1/2 z-10 hidden -translate-y-1/2 text-ink-faint md:block">
                →
              </span>
            )}
            <GlassCard hover className={`h-full border ${m.ring} p-6`}>
              <div className="flex items-center gap-2">
                <m.icon className={`size-4.5 ${m.color}`} />
                <span className={`text-xs font-bold uppercase tracking-[0.18em] ${m.color}`}>
                  {m.label}
                </span>
              </div>
              <h4 className="mt-3 text-[15px] font-semibold leading-snug">{card.title}</h4>
              <ul className="mt-3 space-y-2">
                {card.points.map((p) => (
                  <li key={p} className="flex gap-2 text-sm leading-relaxed text-ink-dim">
                    <span className={`mt-2 size-1 shrink-0 rounded-full bg-current ${m.color}`} />
                    {p}
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-line pt-3 text-xs italic leading-relaxed text-ink-faint">
                {card.analogy}
              </p>
            </GlassCard>
          </motion.div>
        );
      })}
    </div>
  );
}
