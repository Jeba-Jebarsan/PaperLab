import type { Metadata } from "next";
import { SearchX } from "lucide-react";
import { searchPapers, getAllSearchablePapers } from "@/lib/data/papers";
import { SearchBar } from "@/features/search/search-bar";
import { PaperResultCard } from "@/features/search/paper-result-card";

export const metadata: Metadata = {
  title: "Explore papers",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query ? searchPapers(query) : getAllSearchablePapers();

  return (
    <div className="mx-auto max-w-3xl px-5 pt-28 pb-16 md:pt-32">
      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
        Explore research papers
      </h1>
      <p className="mt-2 text-sm text-ink-dim">
        Search by title, keywords, or authors. Papers with an interactive lab open
        instantly; the rest are queued for AI analysis.
      </p>

      <div className="mt-6">
        <SearchBar size="md" initialQuery={query} autoFocus={!query} />
      </div>

      <div className="mt-8 space-y-4">
        {query && (
          <p className="text-xs text-ink-faint">
            {results.length} result{results.length === 1 ? "" : "s"} for{" "}
            <span className="text-ink-dim">“{query}”</span>
          </p>
        )}

        {results.length === 0 ? (
          <div className="glass flex flex-col items-center gap-3 rounded-2xl px-6 py-14 text-center">
            <SearchX className="size-8 text-ink-faint" />
            <p className="text-sm font-medium">No papers found</p>
            <p className="max-w-sm text-xs leading-relaxed text-ink-faint">
              Try “attention”, “transformer”, “YOLO”, or an author name. Live arXiv
              search arrives in Phase 7 — the integration is already wired in{" "}
              <code className="text-ink-dim">services/arxiv.ts</code>.
            </p>
          </div>
        ) : (
          results.map((paper, i) => (
            <PaperResultCard key={paper.id} paper={paper} index={i} />
          ))
        )}
      </div>
    </div>
  );
}
