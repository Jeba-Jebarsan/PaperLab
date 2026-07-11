"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { VenetianMask } from "lucide-react";
import { SimulatorShell, type SimMode } from "../engine/simulator-shell";
import { Segmented } from "@/components/ui/segmented";
import { cn } from "@/lib/utils";

/**
 * BERT's pre-training game, playable. The candidate lists are curated; the
 * softmax over them is real, and the left-only vs both-sides comparison is
 * the paper's actual argument for bidirectionality.
 */

interface Slot {
  index: number;
  leftOnly: { token: string; logit: number }[];
  bothSides: { token: string; logit: number }[];
}

interface MaskSentence {
  id: string;
  words: string[];
  slots: Slot[];
}

const SENTENCES: MaskSentence[] = [
  {
    id: "chef",
    words: ["The", "chef", "cooked", "a", "delicious", "meal", "in", "the", "kitchen", "."],
    slots: [
      {
        index: 1,
        leftOnly: [
          { token: "man", logit: 2.2 },
          { token: "sun", logit: 1.9 },
          { token: "dog", logit: 1.7 },
          { token: "chef", logit: 1.5 },
          { token: "car", logit: 1.4 },
          { token: "king", logit: 1.2 },
        ],
        bothSides: [
          { token: "chef", logit: 3.6 },
          { token: "cook", logit: 2.6 },
          { token: "woman", logit: 1.3 },
          { token: "man", logit: 1.2 },
          { token: "baker", logit: 1.0 },
          { token: "sun", logit: -1.5 },
        ],
      },
      {
        index: 5,
        leftOnly: [
          { token: "meal", logit: 2.5 },
          { token: "cake", logit: 2.2 },
          { token: "dinner", logit: 2.1 },
          { token: "song", logit: 1.0 },
          { token: "story", logit: 0.8 },
          { token: "plan", logit: 0.6 },
        ],
        bothSides: [
          { token: "meal", logit: 3.2 },
          { token: "dinner", logit: 2.8 },
          { token: "dish", logit: 2.2 },
          { token: "cake", logit: 1.6 },
          { token: "song", logit: -1.0 },
          { token: "plan", logit: -1.2 },
        ],
      },
    ],
  },
  {
    id: "guitar",
    words: ["She", "played", "the", "guitar", "on", "stage", "last", "night", "."],
    slots: [
      {
        index: 3,
        leftOnly: [
          { token: "game", logit: 2.4 },
          { token: "piano", logit: 2.2 },
          { token: "guitar", logit: 2.1 },
          { token: "role", logit: 2.0 },
          { token: "violin", logit: 1.7 },
          { token: "lottery", logit: 1.2 },
        ],
        bothSides: [
          { token: "guitar", logit: 3.3 },
          { token: "piano", logit: 2.9 },
          { token: "violin", logit: 2.4 },
          { token: "drums", logit: 2.0 },
          { token: "role", logit: 0.4 },
          { token: "game", logit: -0.8 },
        ],
      },
      {
        index: 5,
        leftOnly: [
          { token: "stage", logit: 2.3 },
          { token: "repeat", logit: 1.6 },
          { token: "tour", logit: 1.5 },
          { token: "time", logit: 1.4 },
          { token: "purpose", logit: 1.2 },
          { token: "vinyl", logit: 1.0 },
        ],
        bothSides: [
          { token: "stage", logit: 3.4 },
          { token: "tour", logit: 2.0 },
          { token: "TV", logit: 1.6 },
          { token: "radio", logit: 1.3 },
          { token: "repeat", logit: 0.6 },
          { token: "purpose", logit: -0.5 },
        ],
      },
    ],
  },
];

function softmax(logits: number[]): number[] {
  const max = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - max));
  const s = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / s);
}

export function MaskedWordLab() {
  const [mode, setMode] = React.useState<SimMode>("beginner");
  const [sentenceId, setSentenceId] = React.useState(SENTENCES[0].id);
  const [context, setContext] = React.useState<"left" | "both">("both");
  const sentence = SENTENCES.find((s) => s.id === sentenceId)!;
  const [maskedIndex, setMaskedIndex] = React.useState(sentence.slots[0].index);

  React.useEffect(() => {
    const s = SENTENCES.find((x) => x.id === sentenceId)!;
    setMaskedIndex(s.slots[0].index);
  }, [sentenceId]);

  const slot = sentence.slots.find((s) => s.index === maskedIndex)!;
  const candidates = context === "left" ? slot.leftOnly : slot.bothSides;
  const probs = softmax(candidates.map((c) => c.logit));
  const topProb = Math.max(...probs);
  const topToken = candidates[probs.indexOf(topProb)].token;

  const bothProbs = softmax(slot.bothSides.map((c) => c.logit));
  const bothTop = Math.max(...bothProbs);
  const leftTop = Math.max(...softmax(slot.leftOnly.map((c) => c.logit)));

  const explanation =
    context === "left"
      ? `Reading left-to-right only (GPT-style), the model reaches “${sentence.words
          .slice(0, maskedIndex)
          .join(" ")} …” and must guess: its best bet, “${topToken}”, gets only ${Math.round(
          topProb * 100
        )}%. It can't see the giveaway words that come AFTER the blank.`
      : `Seeing BOTH sides (BERT-style), the words after the blank give it away — “${topToken}” jumps to ${Math.round(
          topProb * 100
        )}%, versus ${Math.round(leftTop * 100)}% confidence with left context alone. That confidence gap is the entire argument for bidirectional pre-training.`;

  const controls = (
    <div className="space-y-5">
      <div>
        <p className="mb-1.5 text-xs font-medium text-ink-dim">Sentence</p>
        <Segmented
          size="sm"
          options={SENTENCES.map((s) => ({
            label: s.id === "chef" ? "The chef…" : "She played…",
            value: s.id,
          }))}
          value={sentenceId}
          onChange={(v) => setSentenceId(v as string)}
        />
      </div>
      <div>
        <p className="mb-1.5 text-xs font-medium text-ink-dim">What the model can see</p>
        <Segmented
          size="sm"
          options={[
            { label: "Left only (GPT)", value: "left" },
            { label: "Both sides (BERT)", value: "both" },
          ]}
          value={context}
          onChange={(v) => setContext(v as "left" | "both")}
          className="w-full justify-between"
        />
        <p className="mt-1.5 text-[11px] leading-snug text-ink-faint">
          BERT masks 15% of tokens in training and predicts them from both
          directions at once — that&apos;s its whole pre-training game.
        </p>
      </div>
      <div className="space-y-1.5 border-t border-line pt-4 font-mono text-[11px]">
        <p className="flex justify-between text-ink-faint">
          <span>left-only confidence</span>
          <span className="text-ink-dim">{Math.round(leftTop * 100)}%</span>
        </p>
        <p className="flex justify-between text-ink-faint">
          <span>both-sides confidence</span>
          <span className="text-accent">{Math.round(bothTop * 100)}%</span>
        </p>
      </div>
    </div>
  );

  return (
    <SimulatorShell
      icon={VenetianMask}
      title="Masked Word Lab"
      subtitle="BERT's training game: fill in the blank — with X-ray vision"
      mode={mode}
      onModeChange={setMode}
      analogy="A crossword clue you can read from both ends: knowing the words after the blank is often worth more than everything before it."
      explanation={explanation}
      controls={controls}
    >
      {/* the sentence with a movable mask */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-xl border border-line bg-void/60 p-5">
        {sentence.words.map((word, i) => {
          const isSlot = sentence.slots.some((s) => s.index === i);
          const isMasked = i === maskedIndex;
          const hidden = context === "left" && i > maskedIndex;
          return (
            <button
              key={i}
              disabled={!isSlot}
              onClick={() => isSlot && setMaskedIndex(i)}
              className={cn(
                "rounded-lg border px-2.5 py-1.5 font-mono text-sm transition-all",
                isMasked
                  ? "border-amber bg-amber/15 text-amber shadow-[0_0_16px_-4px_rgba(240,184,102,0.7)]"
                  : hidden
                    ? "border-line/50 bg-white/[0.01] text-ink-faint/40 line-through"
                    : isSlot
                      ? "border-primary/35 bg-primary/[0.06] text-ink cursor-pointer hover:border-primary/60"
                      : "border-line bg-white/[0.03] text-ink-dim"
              )}
            >
              {isMasked ? "[MASK]" : hidden ? "▓▓" : word}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-center text-[10px] text-ink-faint">
        Blue-bordered words are maskable — click one to move the blank.
        {context === "left" && " Struck-out words are invisible in left-only mode."}
      </p>

      {/* prediction bars — real softmax */}
      <div className="mt-4 space-y-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
          The model&apos;s guesses for [MASK]
        </p>
        {candidates
          .map((c, i) => ({ ...c, p: probs[i] }))
          .sort((a, b) => b.p - a.p)
          .map((c, rank) => (
            <div key={c.token} className="flex items-center gap-2">
              <span
                className={cn(
                  "w-16 shrink-0 truncate text-right font-mono text-xs",
                  rank === 0 ? "text-amber" : "text-ink-dim"
                )}
              >
                {c.token}
              </span>
              <div className="h-5 flex-1 overflow-hidden rounded-md bg-white/[0.04]">
                <motion.div
                  animate={{ width: `${(c.p / topProb) * 100}%` }}
                  transition={{ type: "spring", stiffness: 160, damping: 24 }}
                  className={cn(
                    "h-full rounded-md",
                    rank === 0 ? "bg-amber/80" : "bg-gradient-to-r from-primary/70 to-accent/60"
                  )}
                />
              </div>
              <span className="w-12 shrink-0 font-mono text-[11px] text-ink-faint">
                {(c.p * 100).toFixed(1)}%
              </span>
              {mode === "advanced" && (
                <span className="hidden w-16 shrink-0 font-mono text-[10px] text-ink-faint sm:block">
                  logit {c.logit.toFixed(1)}
                </span>
              )}
            </div>
          ))}
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">
        Note: candidate words and their scores are curated illustrations of
        real BERT behavior (the softmax over them is computed live); the
        left-vs-both comparison is the paper&apos;s actual case for bidirectional
        pre-training.
      </p>
    </SimulatorShell>
  );
}
