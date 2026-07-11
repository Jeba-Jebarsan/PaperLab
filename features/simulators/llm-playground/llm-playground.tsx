"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Braces, Dices } from "lucide-react";
import {
  PROMPT_CASES,
  computeDistribution,
  sampleToken,
  explainSampling,
  type SamplingParams,
} from "@/lib/sim/next-token";
import { SimulatorShell, type SimMode } from "../engine/simulator-shell";
import { Slider } from "@/components/ui/slider";
import { Segmented } from "@/components/ui/segmented";
import { cn } from "@/lib/utils";

export function LlmPlayground() {
  const [mode, setMode] = React.useState<SimMode>("beginner");
  const [caseId, setCaseId] = React.useState(PROMPT_CASES[0].id);
  const [params, setParams] = React.useState<SamplingParams>({
    temperature: 0.8,
    topK: 10,
    topP: 1,
  });
  const [sampled, setSampled] = React.useState<string | null>(null);
  const [flash, setFlash] = React.useState<string | null>(null);

  const promptCase = PROMPT_CASES.find((c) => c.id === caseId)!;
  const dist = React.useMemo(
    () => computeDistribution(promptCase.candidates, params),
    [promptCase, params]
  );
  const maxProb = Math.max(...dist.map((d) => d.prob), 0.0001);

  function roll() {
    const token = sampleToken(dist);
    setSampled(token);
    setFlash(token);
    setTimeout(() => setFlash(null), 900);
  }

  const set = (patch: Partial<SamplingParams>) => {
    setParams((p) => ({ ...p, ...patch }));
    setSampled(null);
  };

  const explanation = sampled
    ? `The model rolled the weighted dice and picked “${sampled.trim()}”. Roll again — with temperature ${params.temperature.toFixed(
        2
      )}, you ${params.temperature < 0.4 ? "will almost always get the same token" : "may get a different token each time"}.`
    : explainSampling(params);

  const controls = (
    <div className="space-y-5">
      <Slider
        label="Temperature"
        value={params.temperature}
        min={0.1}
        max={2}
        step={0.05}
        onChange={(v) => set({ temperature: v })}
        format={(v) => v.toFixed(2)}
        hint="Low = focused and repetitive. High = creative and risky."
      />
      <Slider
        label="Top-K"
        value={params.topK}
        min={1}
        max={10}
        step={1}
        onChange={(v) => set({ topK: v })}
        hint="Only the K most likely tokens stay in the running."
      />
      <Slider
        label="Top-P (nucleus)"
        value={params.topP}
        min={0.1}
        max={1}
        step={0.05}
        onChange={(v) => set({ topP: v })}
        format={(v) => v.toFixed(2)}
        hint="Keep the smallest set of tokens covering P of the probability."
      />
      <button
        onClick={roll}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-void transition-colors hover:bg-primary-bright cursor-pointer"
      >
        <motion.span
          key={flash ?? "idle"}
          animate={flash ? { rotate: [0, 360], scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.5 }}
          className="grid place-items-center"
        >
          <Dices className="size-4" />
        </motion.span>
        Sample a token
      </button>
    </div>
  );

  return (
    <SimulatorShell
      icon={Braces}
      title="Next-Token Playground"
      subtitle="How GPT-style models choose every single word"
      mode={mode}
      onModeChange={setMode}
      analogy="The model builds a weighted raffle for the next word — temperature decides how fair the raffle is, Top-K and Top-P decide who's even allowed to enter."
      explanation={explanation}
      controls={controls}
    >
      {/* Prompt + tokenization */}
      <div className="mb-4">
        <Segmented
          size="sm"
          options={PROMPT_CASES.map((c) => ({
            label: `“${c.prompt.length > 22 ? c.prompt.slice(0, 22) + "…" : c.prompt}”`,
            value: c.id,
          }))}
          value={caseId}
          onChange={(v) => {
            setCaseId(v as string);
            setSampled(null);
          }}
          className="flex-wrap"
        />
        <div className="mt-3 flex flex-wrap items-center gap-1.5 rounded-xl border border-line bg-void/60 p-3">
          {promptCase.prompt.split(" ").map((word, i) => (
            <span
              key={i}
              className="rounded-md border border-line bg-white/[0.04] px-2 py-1 font-mono text-xs text-ink-dim"
            >
              {word}
            </span>
          ))}
          <span className="font-mono text-lg leading-none text-primary-bright animate-pulse-soft">
            ▊
          </span>
          <AnimatePresence>
            {sampled && (
              <motion.span
                key={sampled + String(flash)}
                initial={{ opacity: 0, scale: 0.7, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="rounded-md border border-accent/50 bg-accent/15 px-2 py-1 font-mono text-xs font-semibold text-accent"
              >
                {sampled.trim()}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Probability bars */}
      <div className="space-y-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
          Next-token probabilities
        </p>
        {dist.map((d) => (
          <div key={d.token} className="flex items-center gap-2">
            <span
              className={cn(
                "w-24 shrink-0 truncate text-right font-mono text-xs",
                d.filtered ? "text-ink-faint line-through opacity-50" : "text-ink-dim",
                flash === d.token && "text-accent font-semibold"
              )}
            >
              {d.token.trim() || "␣"}
            </span>
            <div className="h-5 flex-1 overflow-hidden rounded-md bg-white/[0.04]">
              <motion.div
                animate={{ width: `${(d.prob / maxProb) * 100}%` }}
                transition={{ type: "spring", stiffness: 160, damping: 24 }}
                className={cn(
                  "h-full rounded-md",
                  d.filtered
                    ? "bg-white/10"
                    : flash === d.token
                      ? "bg-accent"
                      : "bg-gradient-to-r from-primary/80 to-accent/70"
                )}
              />
            </div>
            <span className="w-14 shrink-0 font-mono text-[11px] text-ink-faint">
              {d.filtered ? "cut" : `${(d.prob * 100).toFixed(1)}%`}
            </span>
            {mode === "advanced" && (
              <span className="hidden w-20 shrink-0 font-mono text-[10px] text-ink-faint sm:block">
                logit {d.logit.toFixed(1)}
              </span>
            )}
          </div>
        ))}
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">
        Note: the candidate tokens and their starting scores are curated
        examples, but the temperature, top-k, top-p, softmax, and sampling math
        applied to them is exactly the algorithm production LLMs use to pick
        every word.
      </p>
    </SimulatorShell>
  );
}
