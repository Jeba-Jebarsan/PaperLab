"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import type { Quiz } from "@/lib/data/types";
import { cn } from "@/lib/utils";

export function QuizCard({
  quiz,
  onAnswered,
}: {
  quiz: Quiz;
  onAnswered?: (correct: boolean) => void;
}) {
  const [picked, setPicked] = React.useState<number | null>(null);
  const answered = picked !== null;

  // reset when the question changes
  React.useEffect(() => setPicked(null), [quiz.question]);

  function pick(i: number) {
    if (answered) return;
    setPicked(i);
    onAnswered?.(quiz.options[i].correct);
  }

  return (
    <div className="rounded-2xl border border-line bg-white/[0.02] p-5 md:p-6">
      <p className="flex items-start gap-2.5 text-[15px] font-semibold leading-snug">
        <HelpCircle className="mt-0.5 size-4.5 shrink-0 text-primary-bright" />
        {quiz.question}
      </p>

      <div className="mt-4 space-y-2">
        {quiz.options.map((opt, i) => {
          const isPicked = picked === i;
          const showCorrect = answered && opt.correct;
          const showWrong = isPicked && !opt.correct;

          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={answered}
              className={cn(
                "w-full rounded-xl border px-4 py-3 text-left text-sm transition-all",
                !answered &&
                  "border-line bg-white/[0.02] text-ink-dim cursor-pointer hover:border-primary/40 hover:text-ink",
                showCorrect && "border-accent/60 bg-accent/10 text-ink",
                showWrong && "border-rose/60 bg-rose/10 text-ink",
                answered && !showCorrect && !showWrong && "border-line text-ink-faint opacity-60"
              )}
            >
              <span className="flex items-center justify-between gap-3">
                {opt.text}
                {showCorrect && <CheckCircle2 className="size-4.5 shrink-0 text-accent" />}
                {showWrong && <XCircle className="size-4.5 shrink-0 text-rose" />}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="overflow-hidden"
          >
            <div
              className={cn(
                "mt-4 rounded-xl border p-4 text-sm leading-relaxed",
                quiz.options[picked].correct
                  ? "border-accent/25 bg-accent/[0.06] text-ink-dim"
                  : "border-rose/25 bg-rose/[0.06] text-ink-dim"
              )}
            >
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em]">
                {quiz.options[picked].correct ? (
                  <span className="text-accent">Correct</span>
                ) : (
                  <span className="text-rose">Not quite</span>
                )}
              </p>
              {quiz.options[picked].explanation}
              {!quiz.options[picked].correct && (
                <p className="mt-2 text-ink-faint">
                  {quiz.options.find((o) => o.correct)?.explanation}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
