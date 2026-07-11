import type { Paper, PaperSearchResult } from "../types";
import { attentionPaper } from "./attention";
import { yoloPaper } from "./yolo";
import { resnetPaper } from "./resnet";
import { gpt3Paper } from "./gpt3";
import { bertPaper } from "./bert";
import { alexnetPaper } from "./alexnet";
import { gansPaper } from "./gans";
import { rlhfPaper } from "./rlhf";
import { loraPaper } from "./lora";
import { vitPaper } from "./vit";

/**
 * Paper registry.
 *
 * Phase 1: fully-analyzed papers live here as curated modules.
 * Phase 3+: `searchPapers` is replaced by the arXiv API (services/arxiv.ts)
 * and `getPaper` by a database lookup + on-demand AI analysis.
 */

const ANALYZED_PAPERS: Record<string, Paper> = {
  [attentionPaper.id]: attentionPaper,
  [attentionPaper.slug]: attentionPaper,
  [yoloPaper.id]: yoloPaper,
  [yoloPaper.slug]: yoloPaper,
  [resnetPaper.id]: resnetPaper,
  [resnetPaper.slug]: resnetPaper,
  [gpt3Paper.id]: gpt3Paper,
  [gpt3Paper.slug]: gpt3Paper,
  [bertPaper.id]: bertPaper,
  [bertPaper.slug]: bertPaper,
  [alexnetPaper.id]: alexnetPaper,
  [alexnetPaper.slug]: alexnetPaper,
  [gansPaper.id]: gansPaper,
  [gansPaper.slug]: gansPaper,
  [rlhfPaper.id]: rlhfPaper,
  [rlhfPaper.slug]: rlhfPaper,
  [loraPaper.id]: loraPaper,
  [loraPaper.slug]: loraPaper,
  [vitPaper.id]: vitPaper,
  [vitPaper.slug]: vitPaper,
};

/** Compact search entry for a fully-analyzed paper. */
function toSearchEntry(paper: Paper): PaperSearchResult {
  return {
    id: paper.id,
    arxivId: paper.arxivId,
    title: paper.title,
    authors: paper.authors,
    year: paper.year,
    venue: paper.venue,
    citationCount: paper.citationCount,
    abstract: paper.abstract,
    tags: paper.tags,
    analyzed: true,
  };
}

/** Papers surfaced in search that are not yet interactively analyzed. */
const SEARCH_INDEX: PaperSearchResult[] = [
  {
    id: attentionPaper.id,
    arxivId: attentionPaper.arxivId,
    title: attentionPaper.title,
    authors: attentionPaper.authors,
    year: attentionPaper.year,
    venue: attentionPaper.venue,
    citationCount: attentionPaper.citationCount,
    abstract: attentionPaper.abstract,
    tags: attentionPaper.tags,
    analyzed: true,
  },
  toSearchEntry(bertPaper),
  toSearchEntry(alexnetPaper),
  toSearchEntry(gansPaper),
  toSearchEntry(rlhfPaper),
  toSearchEntry(loraPaper),
  toSearchEntry(vitPaper),
  {
    id: gpt3Paper.id,
    arxivId: gpt3Paper.arxivId,
    title: gpt3Paper.title,
    authors: gpt3Paper.authors,
    year: gpt3Paper.year,
    venue: gpt3Paper.venue,
    citationCount: gpt3Paper.citationCount,
    abstract: gpt3Paper.abstract,
    tags: gpt3Paper.tags,
    analyzed: true,
  },
  {
    id: yoloPaper.id,
    arxivId: yoloPaper.arxivId,
    title: yoloPaper.title,
    authors: yoloPaper.authors,
    year: yoloPaper.year,
    venue: yoloPaper.venue,
    citationCount: yoloPaper.citationCount,
    abstract: yoloPaper.abstract,
    tags: yoloPaper.tags,
    analyzed: true,
  },
  {
    id: "2010.11929",
    arxivId: "2010.11929",
    title: "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale (ViT)",
    authors: ["Alexey Dosovitskiy", "Lucas Beyer", "Alexander Kolesnikov", "et al."],
    year: 2020,
    venue: "ICLR 2021",
    citationCount: 60000,
    abstract:
      "While the Transformer architecture has become the de-facto standard for natural language processing tasks, its applications to computer vision remain limited. We show that a pure transformer applied directly to sequences of image patches can perform very well on image classification tasks.",
    tags: ["Computer Vision", "Transformers", "Classification"],
    analyzed: false,
  },
  {
    id: resnetPaper.id,
    arxivId: resnetPaper.arxivId,
    title: resnetPaper.title,
    authors: resnetPaper.authors,
    year: resnetPaper.year,
    venue: resnetPaper.venue,
    citationCount: resnetPaper.citationCount,
    abstract: resnetPaper.abstract,
    tags: resnetPaper.tags,
    analyzed: true,
  },
];

export function getPaper(idOrSlug: string): Paper | undefined {
  return ANALYZED_PAPERS[idOrSlug];
}

export function getFeaturedPapers(): PaperSearchResult[] {
  // interactive papers first, then the most-cited upcoming ones
  return [...SEARCH_INDEX]
    .sort((a, b) => Number(b.analyzed) - Number(a.analyzed))
    .slice(0, 3);
}

export function getAllSearchablePapers(): PaperSearchResult[] {
  return SEARCH_INDEX;
}

/**
 * Naive relevance search over the mock index.
 * Phase 3 swaps this for services/arxiv.ts `searchArxiv()`.
 */
export function searchPapers(query: string): PaperSearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return SEARCH_INDEX;

  const terms = q.split(/\s+/).filter((t) => t.length > 1);

  return SEARCH_INDEX.map((paper) => {
    const haystack = [
      paper.title,
      paper.abstract,
      paper.authors.join(" "),
      paper.tags.join(" "),
      paper.arxivId,
    ]
      .join(" ")
      .toLowerCase();

    let score = 0;
    if (haystack.includes(q)) score += 10;
    for (const term of terms) {
      if (paper.title.toLowerCase().includes(term)) score += 5;
      else if (haystack.includes(term)) score += 1;
    }
    return { paper, score };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || b.paper.citationCount - a.paper.citationCount)
    .map((r) => r.paper);
}
