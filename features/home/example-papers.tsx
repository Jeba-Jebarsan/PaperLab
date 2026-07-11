"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Quote, Sparkles } from "lucide-react";
import type { PaperSearchResult } from "@/lib/data/types";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { formatCitations } from "@/lib/utils";

export function ExamplePapers({ papers }: { papers: PaperSearchResult[] }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
      <SectionHeading
        eyebrow="Start here"
        title="Landmark papers, ready to explore"
        description="The papers that defined modern AI — each one an interactive learning experience."
      />

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {papers.map((paper, i) => {
          const href = paper.analyzed ? `/paper/${paper.id}` : `/search?q=${encodeURIComponent(paper.title)}`;
          return (
            <motion.div
              key={paper.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.08 * i, duration: 0.5 }}
            >
              <Link href={href} className="block h-full">
                <GlassCard hover className="flex h-full flex-col p-6">
                  <div className="flex items-center justify-between">
                    <Badge tone={paper.analyzed ? "accent" : "default"}>
                      {paper.analyzed ? (
                        <>
                          <Sparkles className="size-3" /> Interactive
                        </>
                      ) : (
                        "Coming soon"
                      )}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-ink-faint">
                      <Quote className="size-3" />
                      {formatCitations(paper.citationCount)} citations
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-semibold leading-snug">
                    {paper.title}
                  </h3>
                  <p className="mt-1 text-xs text-ink-faint">
                    {paper.authors[0]} et al. · {paper.venue} · {paper.year}
                  </p>
                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-dim">
                    {paper.abstract}
                  </p>

                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary-bright">
                    {paper.analyzed ? "Start learning" : "View paper"}
                    <ArrowRight className="size-3.5" />
                  </span>
                </GlassCard>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
