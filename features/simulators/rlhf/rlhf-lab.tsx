"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Scale } from "lucide-react";
import { SimulatorShell, type SimMode } from "../engine/simulator-shell";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

/**
 * The KL-penalty tug-of-war from "Learning to Summarize from Human Feedback".
 *
 * The candidate summaries are curated, but the policy shown is the TRUE
 * closed-form optimum of KL-regularized RL:  π(y) ∝ π_SFT(y) · exp(r(y)/β).
 * Slide β down and watch real reward hacking take over.
 */

const POST =
  "My neighbor's cat sneaks into my house every day through the window, eats my cat's food, and then naps on my couch. My own cat just sits there and watches it happen. Should I say something to my neighbor about it?";

interface Candidate {
  id: string;
  text: string;
  /** log-probability under the supervised (SFT) baseline policy */
  sftLogProb: number;
  /** reward model score */
  reward: number;
  hack?: boolean;
}

const CANDIDATES: Candidate[] = [
  {
    id: "A",
    text: "Neighbor's cat sneaks in daily, eats my cat's food and naps on my couch — my cat doesn't mind. Should I talk to the neighbor?",
    sftLogProb: -4.0,
    reward: 2.6,
  },
  {
    id: "B",
    text: "A neighbor's cat keeps coming into my house and eating food. Asking if I should tell the neighbor.",
    sftLogProb: -3.2,
    reward: 1.7,
  },
  {
    id: "C",
    text: "I have a cat and a neighbor who also has a cat.",
    sftLogProb: -2.6,
    reward: -0.5,
  },
  {
    id: "D",
    text: "Cats! There are cats everywhere in my house, all day long.",
    sftLogProb: -5.0,
    reward: -1.2,
  },
  {
    id: "E",
    text: "Excellent heartwarming summary!!! 10/10 amazing best post reward reward reward",
    sftLogProb: -11.0,
    reward: 6.5,
    hack: true,
  },
];

function softmax(logits: number[]): number[] {
  const max = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - max));
  const s = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / s);
}

export function RlhfLab() {
  const [mode, setMode] = React.useState<SimMode>("beginner");
  const [beta, setBeta] = React.useState(1.0);

  // π_SFT: the supervised policy's own preferences
  const sftProbs = React.useMemo(
    () => softmax(CANDIDATES.map((c) => c.sftLogProb)),
    []
  );
  // π*: the exact optimum of  E[r] − β·KL(π ‖ π_SFT)
  const policyProbs = softmax(CANDIDATES.map((c) => c.sftLogProb + c.reward / beta));

  const kl = policyProbs.reduce(
    (s, p, i) => s + (p > 1e-12 ? p * Math.log(p / sftProbs[i]) : 0),
    0
  );
  const topIdx = policyProbs.indexOf(Math.max(...policyProbs));
  const top = CANDIDATES[topIdx];

  const explanation = top.hack
    ? `Reward hacking! With β = ${beta.toFixed(2)} the KL leash is so loose that the policy chases raw reward — and the reward model's blind spot (candidate E, gibberish it mistakenly loves) takes over. The paper hit exactly this: over-optimizing the reward model makes real quality WORSE.`
    : beta >= 2
      ? `β = ${beta.toFixed(2)} keeps the policy pinned to the supervised baseline — it barely uses the reward model at all (KL = ${kl.toFixed(2)} nats). Safe, but you're leaving the human feedback on the table.`
      : `Sweet spot: at β = ${beta.toFixed(2)} the policy shifts toward genuinely better summaries — “${top.id}” leads — while the KL penalty (${kl.toFixed(2)} nats) keeps it from wandering into the reward model's blind spots.`;

  const controls = (
    <div className="space-y-5">
      <Slider
        label="KL penalty (β)"
        value={beta}
        min={0.15}
        max={3}
        step={0.05}
        onChange={setBeta}
        format={(v) => v.toFixed(2)}
        hint="The leash: how expensive it is to drift from the supervised model."
      />
      <div className="space-y-1.5 border-t border-line pt-4 font-mono text-[11px]">
        <p className="flex justify-between text-ink-faint">
          <span>KL(π ‖ π_SFT)</span>
          <span className="text-primary-bright">{kl.toFixed(3)} nats</span>
        </p>
        <p className="flex justify-between text-ink-faint">
          <span>policy&apos;s top pick</span>
          <span className={top.hack ? "text-rose" : "text-accent"}>
            {top.id} {top.hack ? "(hacked!)" : ""}
          </span>
        </p>
      </div>
      <p className="text-[11px] leading-snug text-ink-faint">
        π(y) ∝ π_SFT(y) · exp(r(y)/β) — the true closed-form optimum of
        KL-regularized RL, computed live.
      </p>
    </div>
  );

  return (
    <SimulatorShell
      icon={Scale}
      title="RLHF Lab: the reward vs leash tug-of-war"
      subtitle="Why aligned models need a KL penalty — feel the trade-off"
      mode={mode}
      onModeChange={setMode}
      analogy="Training a dog with treats (the reward model) while keeping it on a leash (the KL penalty). Drop the leash entirely and the dog stops herding sheep and starts mugging you for treats."
      explanation={explanation}
      controls={controls}
    >
      {/* the post */}
      <div className="rounded-xl border border-line bg-void/60 p-4">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-faint">
          Post to summarize
        </p>
        <p className="text-[13px] leading-relaxed text-ink-dim">{POST}</p>
      </div>

      {/* candidates */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
            Candidate summaries — policy probability
          </p>
          <p className="text-[10px] text-ink-faint">
            ○ = supervised baseline&apos;s probability
          </p>
        </div>
        {CANDIDATES.map((c, i) => {
          const p = policyProbs[i];
          const isTop = i === topIdx;
          return (
            <div
              key={c.id}
              className={cn(
                "rounded-xl border p-3 transition-colors",
                isTop && c.hack
                  ? "border-rose/50 bg-rose/[0.06]"
                  : isTop
                    ? "border-accent/40 bg-accent/[0.05]"
                    : "border-line bg-white/[0.02]"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <p
                  className={cn(
                    "text-[13px] leading-snug",
                    c.hack ? "font-mono text-rose/90" : "text-ink-dim"
                  )}
                >
                  <span className="mr-1.5 font-mono text-[11px] text-ink-faint">{c.id}.</span>
                  {c.text}
                </p>
                <div className="shrink-0 text-right font-mono text-[10px] leading-tight">
                  <p className="text-amber">r = {c.reward.toFixed(1)}</p>
                  {mode === "advanced" && (
                    <p className="text-ink-faint">logπ₀ = {c.sftLogProb.toFixed(1)}</p>
                  )}
                </div>
              </div>
              <div className="relative mt-2 h-3 overflow-hidden rounded-full bg-white/[0.05]">
                <motion.div
                  animate={{ width: `${p * 100}%` }}
                  transition={{ type: "spring", stiffness: 150, damping: 24 }}
                  className={cn(
                    "h-full rounded-full",
                    c.hack ? "bg-rose/80" : "bg-gradient-to-r from-primary/80 to-accent/70"
                  )}
                />
                {/* SFT baseline marker */}
                <div
                  className="absolute top-0 h-full w-0.5 bg-white/50"
                  style={{ left: `${sftProbs[i] * 100}%` }}
                  title={`baseline: ${(sftProbs[i] * 100).toFixed(1)}%`}
                />
              </div>
              <p className="mt-1 font-mono text-[10px] text-ink-faint">
                {(p * 100).toFixed(1)}%
              </p>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">
        Note: the summaries and their scores are curated; the policy
        distribution, KL divergence, and the emergence of reward hacking come
        from the real KL-regularized-RL optimum π ∝ π_SFT·exp(r/β) — the exact
        trade-off the paper tunes with its KL coefficient.
      </p>
    </SimulatorShell>
  );
}
