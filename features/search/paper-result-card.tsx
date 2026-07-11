"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Quote, Sparkles, Users, Calendar } from "lucide-react";
import type { PaperSearchResult } from "@/lib/data/types";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { formatCitations } from "@/lib/utils";

export function PaperResultCard({
  paper,
  index,
}: {
  paper: PaperSearchResult;
  index: number;
}) {
  const href = paper.analyzed ? `/paper/${paper.id}` : undefined;

  const card = (
    <GlassCard hover={paper.analyzed} className="p-6">
      <div className="flex flex-wrap items-center gap-2">
        {paper.analyzed ? (
          <Badge tone="accent">
            <Sparkles className="size-3" />
            Interactive lab ready
          </Badge>
        ) : (
          <Badge>Analysis coming soon</Badge>
        )}
        {paper.tags.slice(0, 3).map((tag) => (
          <Badge key={tag} tone="primary">
            {tag}
          </Badge>
        ))}
      </div>

      <h3 className="mt-3 text-lg font-semibold leading-snug">{paper.title}</h3>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-faint">
        <span className="flex items-center gap-1.5">
          <Users className="size-3.5" />
          {paper.authors.slice(0, 3).join(", ")}
          {paper.authors.length > 3 && " et al."}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="size-3.5" />
          {paper.venue} · {paper.year}
        </span>
        {paper.citationCount > 0 && (
          <span className="flex items-center gap-1.5">
            <Quote className="size-3.5" />
            {formatCitations(paper.citationCount)} citations
          </span>
        )}
      </div>

      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-dim">
        {paper.abstract}
      </p>

      {paper.analyzed ? (
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-bright">
          Open the interactive lab
          <ArrowRight className="size-4" />
        </span>
      ) : (
        <span className="mt-4 inline-block text-xs text-ink-faint">
          AI analysis for this paper lands in an upcoming phase — the pipeline is ready.
        </span>
      )}
    </GlassCard>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index, duration: 0.4 }}
    >
      {href ? <Link href={href}>{card}</Link> : card}
    </motion.div>
  );
}
