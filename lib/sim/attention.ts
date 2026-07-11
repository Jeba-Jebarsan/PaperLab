/**
 * Pseudo-attention engine for the Self-Attention Lab.
 *
 * Produces plausible, deterministic attention patterns without running a real
 * model in the browser. Each head has a linguistic "personality" mirroring
 * patterns found in trained Transformers (previous-token heads, syntactic
 * heads, coreference heads…). Phase 8 can swap this for real attention
 * weights served from the FastAPI model service — the output shape is
 * identical: weights[head][from][to], rows softmax-normalized.
 */

export interface HeadSpec {
  name: string;
  description: string;
}

export const HEAD_SPECS: HeadSpec[] = [
  {
    name: "Previous word",
    description: "Tracks local order — each word leans on the word right before it.",
  },
  {
    name: "Syntax",
    description: "Connects grammatical partners, like verbs with their subjects and objects.",
  },
  {
    name: "Coreference",
    description: "Resolves references — pronouns like “it” reach back to the noun they mean.",
  },
  {
    name: "Next word",
    description: "Looks one step ahead, useful for phrase boundaries.",
  },
  {
    name: "Sentence start",
    description: "Anchors on the first token — a common ‘default’ pattern in real models.",
  },
  {
    name: "Content words",
    description: "Focuses on meaning-heavy words (nouns, verbs) and skips filler words.",
  },
  {
    name: "Self focus",
    description: "Mostly keeps each word's own information, mixing in little context.",
  },
  {
    name: "Long range",
    description: "Prefers distant words — the head that stitches far-apart context together.",
  },
];

export const EXAMPLE_SENTENCES = [
  "The cat sat on the mat.",
  "The animal didn't cross the street because it was too tired.",
  "Attention is all you need.",
];

const STOPWORDS = new Set([
  "the", "a", "an", "on", "in", "at", "of", "to", "is", "was", "it",
  "and", "or", "because", "too", "you", "all", "didn't", "not",
]);

const PRONOUNS = new Set(["it", "they", "he", "she", "this", "that"]);

export function tokenize(sentence: string): string[] {
  return sentence
    .replace(/([.,!?;])/g, " $1")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 12); // keep the visualization readable
}

/** Deterministic pseudo-random in [0,1) from integers — keeps patterns stable. */
function noise(...seeds: number[]): number {
  let h = 2166136261;
  for (const s of seeds) {
    h ^= s + 0x9e3779b9;
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}

function isContent(token: string): boolean {
  const t = token.toLowerCase().replace(/[^a-z']/g, "");
  return t.length > 0 && !STOPWORDS.has(t) && /[a-z]/.test(t);
}

function softmaxRow(row: number[]): number[] {
  const max = Math.max(...row);
  const exps = row.map((v) => Math.exp(v - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

/** Raw affinity of token i attending to token j under a given head personality. */
function affinity(head: number, tokens: string[], i: number, j: number): number {
  const n = tokens.length;
  const ti = tokens[i].toLowerCase();
  const tj = tokens[j].toLowerCase();
  const base = noise(head * 131, i * 17, j) * 0.8; // organic variation

  switch (head % HEAD_SPECS.length) {
    case 0: // previous word
      return (j === i - 1 ? 4 : j === i ? 1.2 : 0) + base;
    case 1: {
      // syntax: content words attend to other content words nearby
      const both = isContent(ti) && isContent(tj);
      const dist = Math.abs(i - j);
      return (both && dist > 0 && dist <= 4 ? 3.2 - dist * 0.4 : 0.3) + base;
    }
    case 2: {
      // coreference: pronouns reach back to the first content noun
      if (PRONOUNS.has(ti) && j < i && isContent(tj)) {
        // earliest content words (likely the subject noun) score highest
        const firstContent = tokens.findIndex((t) => isContent(t));
        return (j === firstContent + 1 || j === firstContent ? 5 : 2.4) + base;
      }
      return (j === i ? 1.5 : 0.2) + base;
    }
    case 3: // next word
      return (j === i + 1 ? 4 : j === i ? 1 : 0) + base;
    case 4: // sentence start anchor
      return (j === 0 ? 3.5 : j === i ? 1.4 : 0.2) + base;
    case 5: // content words
      return (isContent(tj) ? 2.8 : 0.2) + (j === i ? 0.8 : 0) + base;
    case 6: // self focus
      return (j === i ? 4.5 : 0.4) + base;
    default: {
      // long range
      const dist = Math.abs(i - j);
      return (dist >= Math.min(4, n - 1) ? 3 : dist === 0 ? 1 : 0.4) + base;
    }
  }
}

export interface AttentionResult {
  tokens: string[];
  /** weights[head][from][to], each row sums to 1 */
  heads: number[][][];
  /** mean across heads */
  average: number[][];
}

export function computeAttention(sentence: string, numHeads: number): AttentionResult {
  const tokens = tokenize(sentence);
  const n = tokens.length;

  const heads: number[][][] = [];
  for (let h = 0; h < numHeads; h++) {
    const matrix: number[][] = [];
    for (let i = 0; i < n; i++) {
      const row: number[] = [];
      for (let j = 0; j < n; j++) row.push(affinity(h, tokens, i, j));
      matrix.push(softmaxRow(row.map((v) => v * 1.6))); // sharpen for visibility
    }
    heads.push(matrix);
  }

  const average = Array.from({ length: n }, (_, i) =>
    Array.from(
      { length: n },
      (_, j) => heads.reduce((acc, m) => acc + m[i][j], 0) / numHeads
    )
  );

  return { tokens, heads, average };
}

/** Human explanation of what a token is attending to, for the lab-notes strip. */
export function explainAttention(
  result: AttentionResult,
  tokenIndex: number,
  headIndex: number | "all"
): string {
  const matrix = headIndex === "all" ? result.average : result.heads[headIndex];
  const row = matrix[tokenIndex];
  const token = result.tokens[tokenIndex];

  const ranked = row
    .map((w, j) => ({ w, j }))
    .filter(({ j }) => j !== tokenIndex)
    .sort((a, b) => b.w - a.w);

  const top = ranked[0];
  const second = ranked[1];
  const headName =
    headIndex === "all" ? "Averaged across all heads" : `The “${HEAD_SPECS[headIndex].name}” head`;

  let s = `${headName}: “${token}” attends most strongly to “${result.tokens[top.j]}” (${Math.round(
    top.w * 100
  )}%)`;
  if (second && second.w > 0.12) {
    s += `, then “${result.tokens[second.j]}” (${Math.round(second.w * 100)}%)`;
  }
  s += ".";

  if (headIndex !== "all") s += ` ${HEAD_SPECS[headIndex].description}`;
  return s;
}
