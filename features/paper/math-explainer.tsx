"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowDown, MessageCircleQuestion, Sigma } from "lucide-react";
import type { MathBlock } from "@/lib/data/types";
import { MathTex } from "@/components/math/katex";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

function EquationCard({ block, index }: { block: MathBlock; index: number }) {
  const [activeSymbol, setActiveSymbol] = React.useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
    >
      <GlassCard className="overflow-hidden">
        <div className="flex items-center gap-2.5 border-b border-line px-6 py-4">
          <Sigma className="size-4 text-amber" />
          <h4 className="text-sm font-semibold">{block.name}</h4>
        </div>

        <div className="p-6">
          {/* The formula */}
          <div className="rounded-xl border border-line bg-void/60 px-4 py-5 text-center">
            <MathTex tex={block.formula} display className="text-lg" />
          </div>

          {/* Symbol chips — hover to decode */}
          <div className="mt-4 flex flex-wrap gap-2">
            {block.breakdown.map((sym, i) => (
              <button
                key={i}
                onMouseEnter={() => setActiveSymbol(i)}
                onClick={() => setActiveSymbol(activeSymbol === i ? null : i)}
                className={cn(
                  "rounded-lg border px-2.5 py-1.5 transition-all cursor-pointer",
                  activeSymbol === i
                    ? "border-amber/50 bg-amber/10"
                    : "border-line bg-white/[0.03] hover:border-line-strong"
                )}
              >
                <MathTex tex={sym.symbol} className="text-sm" />
              </button>
            ))}
          </div>
          <div className="mt-2 min-h-10">
            {activeSymbol !== null ? (
              <motion.p
                key={activeSymbol}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm leading-relaxed text-amber/90"
              >
                <MathTex tex={block.breakdown[activeSymbol].symbol} className="mr-2" />
                {block.breakdown[activeSymbol].meaning}
              </motion.p>
            ) : (
              <p className="text-xs text-ink-faint">
                Hover a symbol to decode it.
              </p>
            )}
          </div>

          {/* Formula → meaning → analogy flow */}
          <div className="mt-4 space-y-3">
            <div className="flex justify-center text-ink-faint">
              <ArrowDown className="size-4" />
            </div>
            <div className="rounded-xl border border-primary/20 bg-primary/[0.06] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary-bright">
                What it means
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-dim">{block.meaning}</p>
            </div>
            <div className="flex justify-center text-ink-faint">
              <ArrowDown className="size-4" />
            </div>
            <div className="rounded-xl border border-accent/20 bg-accent/[0.05] p-4">
              <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                <MessageCircleQuestion className="size-3.5" />
                Real-world analogy
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-dim">{block.analogy}</p>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export function MathExplainer({ blocks }: { blocks: MathBlock[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {blocks.map((block, i) => (
        <EquationCard key={block.id} block={block} index={i} />
      ))}
    </div>
  );
}
