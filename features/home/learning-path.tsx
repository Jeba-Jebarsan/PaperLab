"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FlaskConical, Clock } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

interface PathEntry {
  number: string;
  title: string;
  year: number;
  blurb: string;
  status: "ready" | "labs" | "soon";
  href?: string;
}

interface PathGroup {
  numeral: string;
  name: string;
  entries: PathEntry[];
}

const PATH: PathGroup[] = [
  {
    numeral: "I",
    name: "Deep Learning Foundations",
    entries: [
      {
        number: "01",
        title: "AlexNet: ImageNet Classification with Deep CNNs",
        year: 2012,
        blurb: "The Big Bang of modern AI — GPU-trained convolutions crush ImageNet by 10 points.",
        status: "ready",
        href: "/paper/alexnet-2012",
      },
      {
        number: "02",
        title: "Generative Adversarial Networks",
        year: 2014,
        blurb: "Forger vs detective — two live networks duel until fakes match reality.",
        status: "ready",
        href: "/paper/1406.2661",
      },
      {
        number: "03",
        title: "Deep Residual Learning (ResNet)",
        year: 2015,
        blurb: "Skip connections fix the depth mystery — watch two real networks race to prove it.",
        status: "ready",
        href: "/paper/1512.03385",
      },
      {
        number: "04",
        title: "You Only Look Once (YOLO)",
        year: 2015,
        blurb: "Real-time detection in a single glance — tune confidence and NMS live.",
        status: "ready",
        href: "/paper/1506.02640",
      },
    ],
  },
  {
    numeral: "II",
    name: "The Transformer Era",
    entries: [
      {
        number: "05",
        title: "Attention Is All You Need",
        year: 2017,
        blurb: "The paper that started modern AI — attention simulators, math, and a mini course.",
        status: "ready",
        href: "/paper/1706.03762",
      },
      {
        number: "06",
        title: "BERT: Bidirectional Transformers",
        year: 2018,
        blurb: "Fill-in-the-blank with X-ray vision — play the masking game that broke 11 records.",
        status: "ready",
        href: "/paper/1810.04805",
      },
      {
        number: "07",
        title: "GPT-3: Few-Shot Learners",
        year: 2020,
        blurb: "Scale the decoder far enough and it learns tasks from your prompt alone.",
        status: "ready",
        href: "/paper/2005.14165",
      },
      {
        number: "08",
        title: "An Image is Worth 16x16 Words (ViT)",
        year: 2020,
        blurb: "Transformers leave language and beat CNNs at their own game — cut a photo into 'words' and watch attention read it.",
        status: "ready",
        href: "/paper/2010.11929",
      },
    ],
  },
  {
    numeral: "III",
    name: "Alignment & Efficiency",
    entries: [
      {
        number: "09",
        title: "Learning to Summarize from Human Feedback (RLHF)",
        year: 2020,
        blurb: "The recipe behind ChatGPT — feel the reward-vs-leash trade-off yourself.",
        status: "ready",
        href: "/paper/2009.01325",
      },
      {
        number: "10",
        title: "LoRA: Low-Rank Adaptation",
        year: 2021,
        blurb: "Customization 10,000× cheaper — watch a real SVD rebuild a full update from rank 3.",
        status: "ready",
        href: "/paper/2106.09685",
      },
    ],
  },
];

const STATUS_META = {
  ready: { label: "Ready", icon: CheckCircle2, cls: "text-accent" },
  labs: { label: "Lab ready", icon: FlaskConical, cls: "text-primary-bright" },
  soon: { label: "Coming soon", icon: Clock, cls: "text-ink-faint" },
};

export function LearningPath() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
      <SectionHeading
        eyebrow="Interactive learning series"
        title="A guided path: basics → advanced"
        description="Ten papers that built modern AI, in order. Each 'Ready' stop is a full interactive deep-dive — live simulators, clickable architecture, math with analogies, a quiz, and a mini course."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        {PATH.map((group, gi) => (
          <motion.div
            key={group.numeral}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: gi * 0.08, duration: 0.5 }}
          >
            <div className="flex items-baseline gap-3 border-b border-line pb-3">
              <span className="font-mono text-lg text-primary-bright">{group.numeral}</span>
              <h3 className="text-sm font-semibold tracking-wide">{group.name}</h3>
            </div>

            <div className="mt-4 space-y-3">
              {group.entries.map((entry) => {
                const meta = STATUS_META[entry.status];
                const clickable = Boolean(entry.href);
                const card = (
                  <div
                    className={cn(
                      "group rounded-xl border border-line bg-white/[0.02] p-4 transition-all",
                      clickable &&
                        "cursor-pointer hover:border-primary/40 hover:bg-primary/[0.04]"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] text-ink-faint">
                        {entry.number}
                        {entry.year > 0 && ` · ${entry.year}`}
                      </span>
                      <span className={cn("flex items-center gap-1 text-[11px]", meta.cls)}>
                        <meta.icon className="size-3" />
                        {meta.label}
                      </span>
                    </div>
                    <p className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold leading-snug">
                      {entry.title}
                      {clickable && (
                        <ArrowRight className="size-3.5 shrink-0 text-primary-bright opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                      )}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-dim">{entry.blurb}</p>
                  </div>
                );
                return entry.href ? (
                  <Link key={entry.number} href={entry.href} className="block">
                    {card}
                  </Link>
                ) : (
                  <div key={entry.number}>{card}</div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
