"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Play,
  Pause,
  StepForward,
  RotateCcw,
  Sparkles,
  FlaskConical,
  type LucideIcon,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Segmented } from "@/components/ui/segmented";
import { cn } from "@/lib/utils";

export type SimMode = "beginner" | "advanced";

export interface TransportProps {
  playing: boolean;
  onPlayPause: () => void;
  onStep?: () => void;
  onReset: () => void;
}

/**
 * SimulatorShell — the reusable frame every PaperLab simulator plugs into.
 *
 * Provides the shared laboratory chrome: title bar, beginner/advanced mode,
 * a controls rail, play/pause/step/reset transport, and the live
 * "lab notes" strip where the simulator narrates what is happening.
 * Simulators own their state; the shell owns the look and interaction grammar.
 */
export function SimulatorShell({
  icon: Icon = FlaskConical,
  title,
  subtitle,
  analogy,
  explanation,
  transport,
  controls,
  mode,
  onModeChange,
  children,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  /** Real-world analogy, always visible in beginner mode. */
  analogy?: string;
  /** Live narration — updates as the user experiments. */
  explanation?: string;
  transport?: TransportProps;
  controls: React.ReactNode;
  mode: SimMode;
  onModeChange: (m: SimMode) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <GlassCard className={cn("overflow-hidden", className)}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-primary/15 text-primary-bright">
            <Icon className="size-4.5" strokeWidth={1.75} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] font-semibold">{title}</h3>
              <Badge tone="accent" className="hidden sm:inline-flex">
                <span className="size-1.5 rounded-full bg-accent animate-pulse-soft" />
                Live
              </Badge>
            </div>
            {subtitle && <p className="text-xs text-ink-faint">{subtitle}</p>}
          </div>
        </div>
        <Segmented
          size="sm"
          options={[
            { label: "Beginner", value: "beginner" },
            { label: "Advanced", value: "advanced" },
          ]}
          value={mode}
          onChange={(v) => onModeChange(v as SimMode)}
        />
      </div>

      {/* Body: canvas + controls rail */}
      <div className="grid gap-0 lg:grid-cols-[1fr_260px]">
        <div className="min-w-0 p-5">{children}</div>
        <aside className="space-y-4 border-t border-line bg-white/[0.02] p-5 lg:border-l lg:border-t-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
            Experiment
          </p>
          {controls}
          {transport && (
            <div className="flex items-center gap-2 border-t border-line pt-4">
              <button
                onClick={transport.onPlayPause}
                className="grid size-9 place-items-center rounded-lg bg-primary text-void transition-colors hover:bg-primary-bright cursor-pointer"
                aria-label={transport.playing ? "Pause" : "Play"}
              >
                {transport.playing ? (
                  <Pause className="size-4" />
                ) : (
                  <Play className="size-4 translate-x-px" />
                )}
              </button>
              {transport.onStep && (
                <button
                  onClick={transport.onStep}
                  className="grid size-9 place-items-center rounded-lg border border-line text-ink-dim transition-colors hover:text-ink hover:border-line-strong cursor-pointer"
                  aria-label="Step"
                >
                  <StepForward className="size-4" />
                </button>
              )}
              <button
                onClick={transport.onReset}
                className="grid size-9 place-items-center rounded-lg border border-line text-ink-dim transition-colors hover:text-ink hover:border-line-strong cursor-pointer"
                aria-label="Reset"
              >
                <RotateCcw className="size-4" />
              </button>
            </div>
          )}
        </aside>
      </div>

      {/* Lab notes: live narration + analogy */}
      {(explanation || analogy) && (
        <div className="border-t border-line bg-primary/[0.04] px-5 py-4">
          {explanation && (
            <div className="flex items-start gap-2.5">
              <Sparkles className="mt-0.5 size-4 shrink-0 text-primary-bright" />
              <AnimatePresence mode="wait">
                <motion.p
                  key={explanation}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="text-sm leading-relaxed text-ink-dim"
                >
                  {explanation}
                </motion.p>
              </AnimatePresence>
            </div>
          )}
          {analogy && mode === "beginner" && (
            <p className="mt-2 pl-6.5 text-xs italic leading-relaxed text-ink-faint">
              Analogy: {analogy}
            </p>
          )}
        </div>
      )}
    </GlassCard>
  );
}
