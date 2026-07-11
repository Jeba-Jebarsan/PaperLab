"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

/**
 * VisualStory — a picture-book walkthrough of a paper.
 *
 * Design borrowed from the best visual explainers (3Blue1Brown, The
 * Illustrated Transformer): one idea per scene, one friendly sentence per
 * idea, a concrete example carried through, and motion doing the teaching.
 * Every paper gets bespoke scene art — no shared template feel.
 */

export interface StoryScene {
  id: string;
  /** One sentence a 10-year-old understands. */
  caption: string;
  /** Optional smaller follow-up line. */
  sub?: string;
  /** The animated artwork. Receives `active` so loops can restart on entry. */
  Art: React.FC<{ active: boolean }>;
}

const SCENE_MS = 6500;

export function VisualStory({ scenes, title }: { scenes: StoryScene[]; title: string }) {
  const [index, setIndex] = React.useState(0);
  const [playing, setPlaying] = React.useState(true);
  const [direction, setDirection] = React.useState(1);
  const done = index === scenes.length - 1;

  const go = React.useCallback(
    (next: number, dir: number) => {
      setDirection(dir);
      setIndex(Math.max(0, Math.min(scenes.length - 1, next)));
    },
    [scenes.length]
  );

  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setIndex((i) => {
        if (i >= scenes.length - 1) {
          setPlaying(false);
          return i;
        }
        setDirection(1);
        return i + 1;
      });
    }, SCENE_MS);
    return () => clearInterval(id);
  }, [playing, scenes.length]);

  const scene = scenes[index];

  return (
    <GlassCard className="overflow-hidden">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3.5">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="size-4 text-amber" />
          {title}
        </p>
        <p className="text-[11px] text-ink-faint">
          No paper-reading needed — the pictures tell the whole story
        </p>
      </div>

      {/* artwork */}
      <div className="relative bg-void/60">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={scene.id}
            custom={direction}
            initial={{ opacity: 0, x: 40 * direction }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 * direction }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <scene.Art active />
          </motion.div>
        </AnimatePresence>

        {/* edge tap zones */}
        <button
          aria-label="Previous scene"
          onClick={() => {
            setPlaying(false);
            go(index - 1, -1);
          }}
          disabled={index === 0}
          className="absolute left-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-line bg-void/70 text-ink-dim backdrop-blur transition-all hover:text-ink hover:border-line-strong disabled:opacity-0 cursor-pointer"
        >
          <ChevronLeft className="size-4.5" />
        </button>
        <button
          aria-label="Next scene"
          onClick={() => {
            setPlaying(false);
            go(index + 1, 1);
          }}
          disabled={done}
          className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-line bg-void/70 text-ink-dim backdrop-blur transition-all hover:text-ink hover:border-line-strong disabled:opacity-0 cursor-pointer"
        >
          <ChevronRight className="size-4.5" />
        </button>
      </div>

      {/* caption */}
      <div className="border-t border-line px-6 py-4 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={scene.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            <p className="text-[15px] font-semibold leading-snug md:text-lg">
              {scene.caption}
            </p>
            {scene.sub && (
              <p className="mx-auto mt-1 max-w-xl text-[12.5px] leading-relaxed text-ink-dim">
                {scene.sub}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* transport */}
      <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-3">
        <button
          onClick={() => {
            if (done) {
              go(0, -1);
              setPlaying(true);
            } else {
              setPlaying((p) => !p);
            }
          }}
          className="grid size-8 place-items-center rounded-lg bg-primary text-void transition-colors hover:bg-primary-bright cursor-pointer"
          aria-label={done ? "Replay" : playing ? "Pause" : "Play"}
        >
          {done ? (
            <RotateCcw className="size-3.5" />
          ) : playing ? (
            <Pause className="size-3.5" />
          ) : (
            <Play className="size-3.5 translate-x-px" />
          )}
        </button>

        {/* progress dots + bar */}
        <div className="flex flex-1 items-center gap-1.5">
          {scenes.map((s, i) => (
            <button
              key={s.id}
              onClick={() => {
                setPlaying(false);
                go(i, i > index ? 1 : -1);
              }}
              className="group relative h-4 flex-1 cursor-pointer"
              aria-label={`Scene ${i + 1}`}
            >
              <span
                className={cn(
                  "absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full transition-colors",
                  i < index ? "bg-primary/70" : "bg-white/10 group-hover:bg-white/20"
                )}
              >
                {i === index && (
                  <motion.span
                    key={`${scene.id}-${playing}`}
                    initial={{ width: playing ? "0%" : "100%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: playing ? SCENE_MS / 1000 : 0, ease: "linear" }}
                    className="absolute inset-y-0 left-0 bg-primary"
                  />
                )}
              </span>
            </button>
          ))}
        </div>

        <span className="font-mono text-[11px] text-ink-faint">
          {index + 1}/{scenes.length}
        </span>
      </div>
    </GlassCard>
  );
}

/* ---------- shared drawing helpers for story scenes ---------- */

export const STORY_W = 480;
export const STORY_H = 250;

export function SceneFrame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox={`0 0 ${STORY_W} ${STORY_H}`}
      className="mx-auto block w-full max-w-2xl"
      style={{ maxHeight: 320 }}
    >
      {children}
    </svg>
  );
}

export const INK = "#ecedf2";
export const DIM = "rgba(236,237,242,0.45)";
export const FAINT = "rgba(236,237,242,0.22)";
export const TEAL = "#4fd1c5";
export const AMBER = "#f0b866";
export const BLUE = "#60a5fa";
export const ROSE = "#f27d98";
