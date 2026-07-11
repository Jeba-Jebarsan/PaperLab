/**
 * Core domain types for PaperLab.
 *
 * These types describe the fully-analyzed form of a paper — the shape the AI
 * pipeline (Phase 5) will produce and the UI renders. In Phase 1 they are
 * populated from curated mock data in `lib/data/papers/`.
 */

export type ExplainLevel = "beginner" | "developer" | "researcher";

export interface ExplainSection {
  heading: string;
  body: string;
}

export interface PsiCard {
  title: string;
  points: string[];
  analogy: string;
}

export type ArchNodeKind = "io" | "process" | "core" | "support";

export interface ArchNode {
  id: string;
  label: string;
  sublabel: string;
  kind: ArchNodeKind;
  /** Plain-language explanation shown when the node is selected. */
  description: string;
  /** A concrete example grounding the concept. */
  example: string;
  /** Deeper technical detail for curious readers. */
  detail: string;
}

export interface ArchEdge {
  source: string;
  target: string;
}

export interface MathSymbol {
  /** LaTeX for the symbol, rendered inline. */
  symbol: string;
  meaning: string;
}

export interface MathBlock {
  id: string;
  name: string;
  /** LaTeX source, rendered with KaTeX. */
  formula: string;
  /** What the equation does, in plain language. */
  meaning: string;
  /** A real-world analogy. */
  analogy: string;
  breakdown: MathSymbol[];
}

export interface Application {
  /** Lucide icon name (mapped in the UI layer). */
  icon: string;
  title: string;
  description: string;
}

export interface CodeExample {
  language: string;
  title: string;
  explanation: string;
  code: string;
}

export interface QuizOption {
  text: string;
  correct: boolean;
  explanation: string;
}

export interface Quiz {
  question: string;
  options: QuizOption[];
}

export interface Lesson {
  id: string;
  number: number;
  title: string;
  duration: string;
  summary: string;
  sections: ExplainSection[];
  keyTakeaway: string;
  quiz: Quiz;
}

export interface Course {
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Paper {
  id: string;
  slug: string;
  arxivId: string;
  title: string;
  authors: string[];
  year: number;
  venue: string;
  citationCount: number;
  tags: string[];
  abstract: string;
  oneLiner: string;
  readingTime: string;
  difficulty: string;

  explainLevels: Record<ExplainLevel, ExplainSection[]>;
  psi: { problem: PsiCard; solution: PsiCard; impact: PsiCard };
  architecture: { nodes: ArchNode[]; edges: ArchEdge[] };
  math: MathBlock[];
  applications: Application[];
  codeExample: CodeExample;
  chatSuggestions: string[];
  course: Course;
}

/** Lightweight shape used by search results (matches future arXiv API mapping). */
export interface PaperSearchResult {
  id: string;
  arxivId: string;
  title: string;
  authors: string[];
  year: number;
  venue: string;
  citationCount: number;
  abstract: string;
  tags: string[];
  /** True when a full interactive analysis exists (or has been generated). */
  analyzed: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** Source chunks used to answer (RAG citations). */
  sources?: string[];
}
