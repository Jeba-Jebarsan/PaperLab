"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Calendar,
  Clock,
  ExternalLink,
  GraduationCap,
  Quote,
  Users,
} from "lucide-react";
import type { Paper } from "@/lib/data/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCitations } from "@/lib/utils";

export function PaperHero({ paper }: { paper: Paper }) {
  return (
    <div className="relative overflow-hidden border-b border-line">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute -top-24 left-1/3 h-72 w-96 rounded-full bg-primary/15 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-5xl px-5 pt-28 pb-10 md:pt-32 md:pb-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="primary">{paper.difficulty}</Badge>
            {paper.tags.slice(0, 4).map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>

          <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            {paper.title}
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-dim md:text-lg">
            {paper.oneLiner}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-faint">
            <span className="flex items-center gap-1.5">
              <Users className="size-3.5" />
              {paper.authors.slice(0, 4).join(", ")}
              {paper.authors.length > 4 && ` +${paper.authors.length - 4} more`}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              {paper.venue} · {paper.year}
            </span>
            <span className="flex items-center gap-1.5">
              <Quote className="size-3.5" />
              {formatCitations(paper.citationCount)}+ citations
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5" />
              {paper.readingTime}
            </span>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href={`/paper/${paper.id}/learn`}>
              <Button size="lg">
                <GraduationCap className="size-4.5" />
                Turn into a mini course
              </Button>
            </Link>
            {paper.arxivId && (
              <a
                href={`https://arxiv.org/abs/${paper.arxivId}`}
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="outline" size="lg">
                  <ExternalLink className="size-4" />
                  Original paper
                </Button>
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
