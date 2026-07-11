"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Trophy } from "lucide-react";
import type { Paper } from "@/lib/data/types";
import { QuizCard } from "@/features/learn/quiz";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";

export function PaperQuiz({ paper }: { paper: Paper }) {
  const quizzes = paper.course.lessons.map((l) => l.quiz);
  const [index, setIndex] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [answeredCurrent, setAnsweredCurrent] = React.useState(false);
  const done = index >= quizzes.length;

  return (
    <GlassCard className="p-6 md:p-8">
      {!done ? (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs text-ink-faint">
              Question <span className="text-ink-dim">{index + 1}</span> of {quizzes.length}
            </p>
            <div className="flex gap-1">
              {quizzes.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 w-6 rounded-full ${
                    i < index ? "bg-primary" : i === index ? "bg-primary/50" : "bg-white/10"
                  }`}
                />
              ))}
            </div>
          </div>

          <QuizCard
            quiz={quizzes[index]}
            onAnswered={(correct) => {
              setAnsweredCurrent(true);
              if (correct) setScore((s) => s + 1);
            }}
          />

          {answeredCurrent && (
            <div className="mt-4 flex justify-end">
              <Button
                variant="secondary"
                onClick={() => {
                  setIndex((i) => i + 1);
                  setAnsweredCurrent(false);
                }}
              >
                {index === quizzes.length - 1 ? "See results" : "Next question"}
                <ArrowRight className="size-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center py-6 text-center"
        >
          <Trophy className="size-10 text-amber" />
          <h4 className="mt-4 text-xl font-semibold">
            {score}/{quizzes.length} correct
          </h4>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-dim">
            {score === quizzes.length
              ? "Perfect score — you genuinely understand this paper. Ready to go deeper?"
              : score >= quizzes.length / 2
                ? "Solid understanding. The mini course will lock in the parts you missed."
                : "Good start — the mini course walks through each idea step by step with simulations."}
          </p>
          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIndex(0);
                setScore(0);
                setAnsweredCurrent(false);
              }}
            >
              Retry quiz
            </Button>
            <Link href={`/paper/${paper.id}/learn`}>
              <Button>
                <GraduationCap className="size-4" />
                Take the mini course
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </GlassCard>
  );
}
