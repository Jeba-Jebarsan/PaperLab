"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FlaskConical, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AttentionSimulator } from "@/features/simulators/attention/attention-simulator";
import { CnnSimulator } from "@/features/simulators/cnn/cnn-simulator";
import { YoloSimulator } from "@/features/simulators/yolo/yolo-simulator";
import { GradientDescentSimulator } from "@/features/simulators/gradient-descent/gradient-descent-simulator";
import { NeuralNetSimulator } from "@/features/simulators/neural-net/neural-net-simulator";
import { ResnetRace } from "@/features/simulators/resnet/resnet-race";
import { LlmPlayground } from "@/features/simulators/llm-playground/llm-playground";
import { DigitVision } from "@/features/simulators/digit-vision/digit-vision";
import { GanLab } from "@/features/simulators/gan/gan-lab";
import { LoraLab } from "@/features/simulators/lora/lora-lab";
import { MaskedWordLab } from "@/features/simulators/masked-word/masked-word-lab";
import { RlhfLab } from "@/features/simulators/rlhf/rlhf-lab";

interface LabEntry {
  id: string;
  number: string;
  title: string;
  question: string;
  intro: string;
  tryThis: string[];
  paper?: { label: string; href: string };
  component: React.ReactNode;
}

const LABS: LabEntry[] = [
  {
    id: "attention",
    number: "01",
    title: "Self-Attention",
    question: "How does AI understand which words belong together?",
    intro:
      "When you read “the dog chased its tail”, you instantly know “its” means the dog’s. AI learns the same trick: every word looks at every other word and decides who matters. That one idea powers ChatGPT.",
    tryThis: [
      "Hover “it” in the animal sentence — watch it find “animal”",
      "Switch to 1 head, then 8 — see how more heads notice more things",
      "Type your own sentence and explore it",
    ],
    paper: { label: "From: Attention Is All You Need (2017)", href: "/paper/1706.03762" },
    component: <AttentionSimulator />,
  },
  {
    id: "cnn",
    number: "02",
    title: "Convolution (CNN)",
    question: "How does a computer actually see a picture?",
    intro:
      "A computer sees only a grid of numbers. To find shapes, it slides a tiny stencil (a “filter”) across the image, asking at every spot: does this patch match my pattern? Stack thousands of these and you get computer vision.",
    tryThis: [
      "Press play and watch the filter scan the digit 7",
      "Switch to “Outline” — only the edges survive",
      "Set stride to 2 — the output image shrinks. Why?",
    ],
    component: <CnnSimulator />,
  },
  {
    id: "yolo",
    number: "03",
    title: "Object Detection (YOLO)",
    question: "How do self-driving cars spot people in real time?",
    intro:
      "YOLO looks at an image once and shouts out every object it might see, each with a confidence score. Then two filters clean up: ignore weak guesses, and merge duplicate boxes pointing at the same object.",
    tryThis: [
      "Drop confidence to 20% — a cat appears that isn’t there!",
      "Raise confidence to 70% — the dog disappears",
      "Push IoU to 0.9 — the car gets detected three times",
    ],
    paper: { label: "From: You Only Look Once (2015)", href: "/paper/1506.02640" },
    component: <YoloSimulator />,
  },
  {
    id: "gradient-descent",
    number: "04",
    title: "Gradient Descent",
    question: "How does a neural network actually learn?",
    intro:
      "Learning = rolling a ball downhill in the fog. The ball is the model, the hill height is “how wrong am I?”, and every step moves toward less wrong. The learning rate — how big each hop is — makes or breaks everything.",
    tryThis: [
      "Get the ball to the flag with the default settings",
      "Set learning rate to 1.0 — watch training explode",
      "Start at −4.5 with momentum 0 — stuck in the trap! Now add momentum 0.8",
    ],
    component: <GradientDescentSimulator />,
  },
  {
    id: "backprop",
    number: "05",
    title: "Backpropagation",
    question: "How does the network know which connection to fix?",
    intro:
      "Watch an actual neural network learn, live in your browser. It guesses, measures its error, then sends the blame backward through every connection — each weight shifts a tiny real step. This lab is 100% real: real network, real gradients, real learning.",
    tryThis: [
      "Press play on XOR — watch the background snap into a checkerboard",
      "Click the map to quiz the trained network on any point",
      "Try the spiral with 3 neurons (it fails), then 8 (it works)",
    ],
    component: <NeuralNetSimulator />,
  },
  {
    id: "resnet",
    number: "06",
    title: "Skip Connections (ResNet)",
    question: "Why did deeper networks get WORSE — and what fixed it?",
    intro:
      "In 2015, adding layers made networks dumber — a 56-layer net lost to a 20-layer one. ResNet fixed it with one addition: let every layer add its input back to its output. Watch two real networks of identical depth race — the only difference is that one wire.",
    tryThis: [
      "Press play on the spiral — the plain net flatlines at ~50% while ResNet hits 100%",
      "Check the gradient bars: the skips carry ~40× more signal to layer 1",
      "Drop depth to 8 — shallow enough that even the plain net survives",
    ],
    paper: { label: "From: Deep Residual Learning (2015)", href: "/paper/1512.03385" },
    component: <ResnetRace />,
  },
  {
    id: "llm",
    number: "07",
    title: "Next-Token Prediction",
    question: "How does ChatGPT choose every single word?",
    intro:
      "A language model never “knows” the next word — it holds a raffle. Every possible word gets tickets based on how likely it is, and one is drawn. Temperature controls how fair the raffle is.",
    tryThis: [
      "Set temperature to 0.1 — you almost always get “Paris”",
      "Set it to 2.0 and sample five times — chaos!",
      "Set Top-K to 1 — now there’s no raffle at all",
    ],
    paper: { label: "Related: Attention Is All You Need (2017)", href: "/paper/1706.03762" },
    component: <LlmPlayground />,
  },
  {
    id: "digit-vision",
    number: "08",
    title: "Digit Recognition",
    question: "Can you watch a neural network think?",
    intro:
      "The grand finale, honoring 3Blue1Brown's famous video: a real 100→16→16→10 network trains in your browser, then you draw digits and literally watch the neurons light up as it reads your handwriting. Hover any neuron to see the stencil it learned.",
    tryThis: [
      "Press play and watch accuracy climb from 10% (guessing) to ~100%",
      "Draw a 7 — then slowly erase its top bar and watch the prediction waver",
      "Hover layer-1 neurons: their stencils are real learned stroke detectors",
    ],
    component: <DigitVision />,
  },
  {
    id: "gan",
    number: "09",
    title: "Adversarial Networks (GAN)",
    question: "Can two AIs teach each other by fighting?",
    intro:
      "A forger network invents data; a detective network calls real-or-fake; each one's mistakes train the other. Both networks are real and train live — including the famous failure, mode collapse, which you can trigger on purpose.",
    tryThis: [
      "Press play on 'two hills' — watch the teal fakes fill the amber outline",
      "Watch the white detective curve flatten to 0.5 (its surrender)",
      "Drop the detective's learning rate to 0.03 — real mode collapse!",
    ],
    paper: { label: "From: Generative Adversarial Networks (2014)", href: "/paper/1406.2661" },
    component: <GanLab />,
  },
  {
    id: "lora",
    number: "10",
    title: "Low-Rank Adaptation (LoRA)",
    question: "How can fine-tuning get 10,000× cheaper?",
    intro:
      "Fine-tuning a giant model changes billions of weights — but the CHANGE itself is secretly simple. A real SVD slices a weight update into layers: slide the rank and watch 25% of the numbers rebuild 93% of the update.",
    tryThis: [
      "Slide rank from 1 to 3 — the reconstruction snaps into focus",
      "Check the singular value bars: after 3, they crash to a noise floor",
      "Compare the parameter counts at rank 3 vs the full matrix",
    ],
    paper: { label: "From: LoRA (2021)", href: "/paper/2106.09685" },
    component: <LoraLab />,
  },
  {
    id: "masked-word",
    number: "11",
    title: "Masked Words (BERT)",
    question: "Why does reading BOTH directions matter?",
    intro:
      "BERT learns language by fill-in-the-blank — with X-ray vision. Move the mask around a sentence, then toggle between left-only reading (how GPT sees) and both-sides reading (how BERT sees), and watch the confidence jump when the clue sits after the blank.",
    tryThis: [
      "Mask “guitar”, read left-only — it's a coin toss",
      "Switch to both sides — “on stage” gives it away",
      "Try each maskable word and compare the confidence gap",
    ],
    paper: { label: "From: BERT (2018)", href: "/paper/1810.04805" },
    component: <MaskedWordLab />,
  },
  {
    id: "rlhf",
    number: "12",
    title: "Reward vs Leash (RLHF)",
    question: "How do you teach AI what humans actually want — without it cheating?",
    intro:
      "A robot judge scores summaries; the writer chases high scores on a leash (the KL penalty). Drag the leash slider and feel all three regimes: too tight (nothing improves), just right (genuinely better answers), and cut loose — real reward hacking, where gibberish wins.",
    tryThis: [
      "Set β to 1.0 — the good summary (A) takes the lead",
      "Drop β below 0.4 — watch the gibberish hack take over",
      "Check the KL number: that's the real 'distance from normal' cost",
    ],
    paper: { label: "From: Learning to Summarize from Human Feedback (2020)", href: "/paper/2009.01325" },
    component: <RlhfLab />,
  },
];

export function LabsView() {
  return (
    <div className="mx-auto max-w-5xl px-5 pt-28 pb-16 md:pt-32">
      {/* Header */}
      <div className="text-center">
        <Badge tone="primary" className="px-3 py-1 text-xs">
          <FlaskConical className="size-3" />
          Interactive Labs
        </Badge>
        <h1 className="mx-auto mt-5 max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl">
          Learn AI by <span className="text-gradient">playing with it</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-ink-dim">
          Five core ideas behind modern AI, each as a hands-on experiment.
          No paper reading, no math background needed — just curiosity.
        </p>

        {/* quick nav */}
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          {LABS.map((lab) => (
            <a
              key={lab.id}
              href={`#${lab.id}`}
              className="rounded-full border border-line bg-white/[0.03] px-3.5 py-1.5 text-xs text-ink-dim transition-all hover:border-primary/40 hover:text-ink"
            >
              <span className="mr-1.5 font-mono text-primary-bright">{lab.number}</span>
              {lab.title}
            </a>
          ))}
        </div>
      </div>

      {/* Labs */}
      <div className="mt-16 space-y-20">
        {LABS.map((lab, i) => (
          <motion.section
            key={lab.id}
            id={lab.id}
            className="scroll-mt-24"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i === 0 ? 0.1 : 0 }}
          >
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-primary-bright">{lab.number}</span>
                  <span className="h-px w-10 glow-line" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-faint">
                    {lab.title}
                  </span>
                </div>
                <h2 className="mt-3 text-xl font-semibold tracking-tight md:text-2xl">
                  {lab.question}
                </h2>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-dim">{lab.intro}</p>
                {lab.paper && (
                  <Link
                    href={lab.paper.href}
                    className="mt-2 inline-flex items-center gap-1 text-xs text-primary-bright transition-colors hover:text-ink"
                  >
                    {lab.paper.label}
                    <ArrowUpRight className="size-3" />
                  </Link>
                )}
              </div>

              <div className="shrink-0 rounded-xl border border-line bg-white/[0.02] p-3.5 md:max-w-64">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                  Try this
                </p>
                <ul className="mt-1.5 space-y-1">
                  {lab.tryThis.map((t) => (
                    <li key={t} className="flex gap-1.5 text-[12px] leading-snug text-ink-dim">
                      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {lab.component}
          </motion.section>
        ))}
      </div>
    </div>
  );
}
