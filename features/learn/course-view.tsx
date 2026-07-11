"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  KeyRound,
  PartyPopper,
} from "lucide-react";
import type { Paper } from "@/lib/data/types";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QuizCard } from "./quiz";
import { AttentionSimulator } from "@/features/simulators/attention/attention-simulator";
import { GradientDescentSimulator } from "@/features/simulators/gradient-descent/gradient-descent-simulator";
import { YoloSimulator } from "@/features/simulators/yolo/yolo-simulator";
import { CnnSimulator } from "@/features/simulators/cnn/cnn-simulator";
import { ResnetRace } from "@/features/simulators/resnet/resnet-race";
import { LlmPlayground } from "@/features/simulators/llm-playground/llm-playground";
import { MaskedWordLab } from "@/features/simulators/masked-word/masked-word-lab";
import { DigitVision } from "@/features/simulators/digit-vision/digit-vision";
import { GanLab } from "@/features/simulators/gan/gan-lab";
import { RlhfLab } from "@/features/simulators/rlhf/rlhf-lab";
import { LoraLab } from "@/features/simulators/lora/lora-lab";
import { ArchitectureExplorer } from "@/features/paper/architecture-explorer";
import { CodeExampleBlock } from "@/features/paper/code-example";
import { cn } from "@/lib/utils";

/**
 * Maps each lesson to its hands-on activity. When the AI pipeline generates
 * courses (Phase 8+), lessons will carry a simulator reference; for the
 * curated courses this mapping lives here.
 */
function LessonActivity({ paper, lessonNumber }: { paper: Paper; lessonNumber: number }) {
  const architecture = (
    <ArchitectureExplorer
      nodes={paper.architecture.nodes}
      edges={paper.architecture.edges}
    />
  );
  const code = <CodeExampleBlock example={paper.codeExample} />;

  if (paper.id === "2010.11929") {
    // ViT: convolution's assumption → patch architecture → global attention → code
    switch (lessonNumber) {
      case 1:
        return <CnnSimulator />;
      case 2:
        return architecture;
      case 3:
        return <AttentionSimulator />;
      case 4:
        return code;
      default:
        return null;
    }
  }

  if (paper.id === "1810.04805") {
    // BERT: masking game → attention → architecture → code
    switch (lessonNumber) {
      case 1:
        return <MaskedWordLab />;
      case 2:
        return <MaskedWordLab />;
      case 3:
        return <AttentionSimulator />;
      case 4:
        return code;
      default:
        return null;
    }
  }

  if (paper.id === "alexnet-2012") {
    // AlexNet: convolution → train a real net → architecture → code
    switch (lessonNumber) {
      case 1:
        return <CnnSimulator />;
      case 2:
        return <CnnSimulator />;
      case 3:
        return <DigitVision />;
      case 4:
        return code;
      default:
        return null;
    }
  }

  if (paper.id === "1406.2661") {
    // GANs: the duel throughout, architecture in the middle
    switch (lessonNumber) {
      case 1:
        return <GanLab />;
      case 2:
        return architecture;
      case 3:
        return <GanLab />;
      case 4:
        return <GanLab />;
      default:
        return null;
    }
  }

  if (paper.id === "2009.01325") {
    // RLHF: token model → architecture → the leash lab → the leash lab
    switch (lessonNumber) {
      case 1:
        return <LlmPlayground />;
      case 2:
        return architecture;
      case 3:
        return <RlhfLab />;
      case 4:
        return <RlhfLab />;
      default:
        return null;
    }
  }

  if (paper.id === "2106.09685") {
    // LoRA: architecture → the rank lab → the rank lab → code
    switch (lessonNumber) {
      case 1:
        return architecture;
      case 2:
        return <LoraLab />;
      case 3:
        return <LoraLab />;
      case 4:
        return code;
      default:
        return null;
    }
  }

  if (paper.id === "2005.14165") {
    // GPT-3 course: prompting → attention (in-context mechanism) → architecture → code
    switch (lessonNumber) {
      case 1:
        return <LlmPlayground />;
      case 2:
        return <AttentionSimulator />;
      case 3:
        return architecture;
      case 4:
        return code;
      default:
        return null;
    }
  }

  if (paper.id === "1512.03385") {
    // ResNet course: the race (degradation) → block anatomy → the race again (gradients) → code
    switch (lessonNumber) {
      case 1:
        return <ResnetRace />;
      case 2:
        return architecture;
      case 3:
        return <ResnetRace />;
      case 4:
        return code;
      default:
        return null;
    }
  }

  if (paper.id === "1506.02640") {
    // YOLO course: convolution → grid architecture → detection tuning → code
    switch (lessonNumber) {
      case 1:
        return <CnnSimulator />;
      case 2:
        return architecture;
      case 3:
        return <YoloSimulator />;
      case 4:
        return code;
      default:
        return null;
    }
  }

  // Transformer course (default)
  switch (lessonNumber) {
    case 1:
      return <GradientDescentSimulator />;
    case 2:
      return <AttentionSimulator />;
    case 3:
      return architecture;
    case 4:
      return code;
    default:
      return null;
  }
}

export function CourseView({ paper }: { paper: Paper }) {
  const course = paper.course;
  const storageKey = `paperlab-progress-${paper.id}`;

  const [completed, setCompleted] = React.useState<Set<string>>(new Set());
  const [activeId, setActiveId] = React.useState(course.lessons[0].id);
  const [quizPassed, setQuizPassed] = React.useState(false);

  // hydrate progress from localStorage
  React.useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? "[]") as string[];
      setCompleted(new Set(saved));
    } catch {
      /* fresh start */
    }
  }, [storageKey]);

  const lesson = course.lessons.find((l) => l.id === activeId)!;
  const lessonIndex = course.lessons.indexOf(lesson);
  const progress = Math.round((completed.size / course.lessons.length) * 100);
  const allDone = completed.size === course.lessons.length;

  function completeLesson() {
    const next = new Set(completed).add(lesson.id);
    setCompleted(next);
    localStorage.setItem(storageKey, JSON.stringify([...next]));
    const following = course.lessons[lessonIndex + 1];
    if (following) {
      setActiveId(following.id);
      setQuizPassed(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  React.useEffect(() => setQuizPassed(false), [activeId]);

  return (
    <div className="mx-auto max-w-6xl px-5 pt-24 pb-16 md:pt-28">
      {/* Course header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            href={`/paper/${paper.id}`}
            className="inline-flex items-center gap-1.5 text-xs text-ink-faint transition-colors hover:text-ink-dim"
          >
            <ArrowLeft className="size-3.5" />
            Back to the paper
          </Link>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
            {course.title}
          </h1>
          <p className="mt-1.5 max-w-xl text-sm text-ink-dim">{course.description}</p>
        </div>
        <div className="min-w-44">
          <div className="flex items-center justify-between text-xs">
            <span className="text-ink-faint">Course progress</span>
            <span className="font-mono text-primary-bright">{progress}%</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/8">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Lesson rail */}
        <aside className="space-y-2 lg:sticky lg:top-24 lg:self-start">
          {course.lessons.map((l) => {
            const done = completed.has(l.id);
            const isActive = l.id === activeId;
            return (
              <button
                key={l.id}
                onClick={() => setActiveId(l.id)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-all cursor-pointer",
                  isActive
                    ? "border-primary/50 bg-primary/[0.08]"
                    : "border-line bg-white/[0.02] hover:border-line-strong"
                )}
              >
                {done ? (
                  <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 text-accent" />
                ) : (
                  <Circle
                    className={cn(
                      "mt-0.5 size-4.5 shrink-0",
                      isActive ? "text-primary-bright" : "text-ink-faint"
                    )}
                  />
                )}
                <span>
                  <span
                    className={cn(
                      "block text-sm font-medium",
                      isActive ? "text-ink" : "text-ink-dim"
                    )}
                  >
                    {l.number}. {l.title}
                  </span>
                  <span className="mt-0.5 flex items-center gap-1 text-[11px] text-ink-faint">
                    <Clock className="size-3" />
                    {l.duration} · {l.summary}
                  </span>
                </span>
              </button>
            );
          })}

          {allDone && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-accent/30 bg-accent/[0.07] p-4 text-center"
            >
              <PartyPopper className="mx-auto size-5 text-accent" />
              <p className="mt-2 text-sm font-semibold text-accent">Course complete!</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-dim">
                You've worked through the whole paper, hands-on.
              </p>
            </motion.div>
          )}
        </aside>

        {/* Lesson body */}
        <AnimatePresence mode="wait">
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="min-w-0 space-y-6"
          >
            <GlassCard className="p-6 md:p-8">
              <div className="flex items-center gap-2.5">
                <Badge tone="primary">Lesson {lesson.number}</Badge>
                <Badge>{lesson.duration}</Badge>
                {completed.has(lesson.id) && <Badge tone="accent">Completed</Badge>}
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight">{lesson.title}</h2>

              <div className="mt-6 space-y-6">
                {lesson.sections.map((s) => (
                  <div key={s.heading}>
                    <h3 className="text-sm font-semibold text-primary-bright">{s.heading}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-ink-dim">{s.body}</p>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex items-start gap-3 rounded-xl border border-amber/25 bg-amber/[0.05] p-4">
                <KeyRound className="mt-0.5 size-4 shrink-0 text-amber" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber">
                    Key takeaway
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-dim">
                    {lesson.keyTakeaway}
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* Hands-on activity */}
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-faint">
                Hands-on — experiment before the quiz
              </p>
              <LessonActivity paper={paper} lessonNumber={lesson.number} />
            </div>

            {/* Checkpoint quiz */}
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-faint">
                Checkpoint
              </p>
              <QuizCard quiz={lesson.quiz} onAnswered={() => setQuizPassed(true)} />
            </div>

            {quizPassed && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end"
              >
                <Button onClick={completeLesson} size="lg">
                  {lessonIndex === course.lessons.length - 1
                    ? "Finish course"
                    : "Complete & continue"}
                  <ArrowRight className="size-4" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
