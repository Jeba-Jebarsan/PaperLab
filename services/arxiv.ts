import type { PaperSearchResult } from "@/lib/data/types";

/**
 * arXiv API integration (Phase 3).
 *
 * The arXiv Atom API needs no key: http://export.arxiv.org/api/query
 * This module is wired and tested against the real endpoint shape;
 * flip `USE_ARXIV_API` (or set NEXT_PUBLIC_USE_ARXIV=1) to go live.
 */

const ARXIV_API = "https://export.arxiv.org/api/query";

export async function searchArxiv(
  query: string,
  maxResults = 10
): Promise<PaperSearchResult[]> {
  const url = `${ARXIV_API}?search_query=all:${encodeURIComponent(
    query
  )}&start=0&max_results=${maxResults}&sortBy=relevance`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`arXiv API error: ${res.status}`);

  const xml = await res.text();
  return parseArxivFeed(xml);
}

/** Minimal Atom feed parser — avoids an XML dependency for a stable feed shape. */
function parseArxivFeed(xml: string): PaperSearchResult[] {
  const entries = xml.split("<entry>").slice(1);

  return entries.map((entry) => {
    const pick = (tag: string) => {
      const m = entry.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
      return m ? m[1].replace(/\s+/g, " ").trim() : "";
    };

    const idUrl = pick("id"); // e.g. http://arxiv.org/abs/1706.03762v7
    const arxivId = idUrl.split("/abs/")[1]?.replace(/v\d+$/, "") ?? idUrl;
    const authors = [...entry.matchAll(/<name>([\s\S]*?)<\/name>/g)].map((m) =>
      m[1].trim()
    );
    const published = pick("published");

    return {
      id: arxivId,
      arxivId,
      title: pick("title"),
      authors,
      year: published ? new Date(published).getFullYear() : 0,
      venue: "arXiv",
      citationCount: 0, // enriched later via Semantic Scholar API
      abstract: pick("summary"),
      tags: [...entry.matchAll(/<category[^>]*term="([^"]+)"/g)].map((m) => m[1]),
      analyzed: false,
    };
  });
}
