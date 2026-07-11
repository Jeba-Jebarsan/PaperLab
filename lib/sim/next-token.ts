/**
 * Next-token prediction engine for the LLM Playground.
 *
 * Curated logits for example prompts, with real sampling math: temperature
 * scaling, top-k truncation, nucleus (top-p) filtering, softmax
 * renormalization. The math is exactly what production LLM samplers do —
 * only the logits are canned. Phase 8 swaps in live model logits.
 */

export interface TokenCandidate {
  token: string;
  logit: number;
}

export interface PromptCase {
  id: string;
  prompt: string;
  candidates: TokenCandidate[];
}

export const PROMPT_CASES: PromptCase[] = [
  {
    id: "paris",
    prompt: "The capital of France is",
    candidates: [
      { token: " Paris", logit: 9.1 },
      { token: " the", logit: 5.6 },
      { token: " located", logit: 4.9 },
      { token: " a", logit: 4.4 },
      { token: " known", logit: 3.8 },
      { token: " Lyon", logit: 3.1 },
      { token: " France", logit: 2.7 },
      { token: " Berlin", logit: 2.3 },
      { token: " beautiful", logit: 2.0 },
      { token: " Marseille", logit: 1.7 },
    ],
  },
  {
    id: "cat",
    prompt: "The cat sat on the",
    candidates: [
      { token: " mat", logit: 8.4 },
      { token: " floor", logit: 6.8 },
      { token: " couch", logit: 6.2 },
      { token: " windowsill", logit: 5.5 },
      { token: " bed", logit: 5.3 },
      { token: " table", logit: 4.9 },
      { token: " roof", logit: 4.1 },
      { token: " keyboard", logit: 3.9 },
      { token: " fence", logit: 3.2 },
      { token: " moon", logit: 0.8 },
    ],
  },
  {
    id: "attention",
    prompt: "Attention is all you",
    candidates: [
      { token: " need", logit: 9.6 },
      { token: " have", logit: 4.2 },
      { token: " get", logit: 3.5 },
      { token: " require", logit: 3.1 },
      { token: " want", logit: 2.9 },
      { token: " deserve", logit: 2.4 },
      { token: " pay", logit: 2.1 },
      { token: " crave", logit: 1.6 },
      { token: " know", logit: 1.4 },
      { token: " see", logit: 1.1 },
    ],
  },
];

export interface SamplingParams {
  temperature: number; // 0.1 – 2
  topK: number; // 1 – 10
  topP: number; // 0.1 – 1
}

export interface TokenProbability {
  token: string;
  logit: number;
  /** probability after temperature, before truncation */
  rawProb: number;
  /** probability after top-k + top-p filtering and renormalization; 0 if filtered out */
  prob: number;
  filtered: boolean;
}

export function computeDistribution(
  candidates: TokenCandidate[],
  { temperature, topK, topP }: SamplingParams
): TokenProbability[] {
  const t = Math.max(0.05, temperature);
  const scaled = candidates.map((c) => c.logit / t);
  const max = Math.max(...scaled);
  const exps = scaled.map((s) => Math.exp(s - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  const raw = exps.map((e) => e / sum);

  // rank by probability
  const order = raw
    .map((p, i) => ({ p, i }))
    .sort((a, b) => b.p - a.p);

  const kept = new Set<number>();
  let cumulative = 0;
  order.forEach(({ p, i }, rank) => {
    if (rank >= topK) return;
    if (cumulative >= topP && kept.size > 0) return;
    kept.add(i);
    cumulative += p;
  });

  const keptSum = [...kept].reduce((acc, i) => acc + raw[i], 0);

  return candidates.map((c, i) => ({
    token: c.token,
    logit: c.logit,
    rawProb: raw[i],
    prob: kept.has(i) ? raw[i] / keptSum : 0,
    filtered: !kept.has(i),
  }));
}

export function sampleToken(dist: TokenProbability[], rand = Math.random()): string {
  let acc = 0;
  for (const d of dist) {
    acc += d.prob;
    if (rand <= acc) return d.token;
  }
  return dist.find((d) => d.prob > 0)?.token ?? dist[0].token;
}

export function explainSampling({ temperature, topK, topP }: SamplingParams): string {
  const parts: string[] = [];
  if (temperature <= 0.35)
    parts.push(
      `Temperature ${temperature.toFixed(2)} makes the model nearly deterministic — the top token dominates.`
    );
  else if (temperature >= 1.4)
    parts.push(
      `Temperature ${temperature.toFixed(2)} flattens the distribution — unlikely tokens get real chances, so output turns creative (or chaotic).`
    );
  else
    parts.push(
      `Temperature ${temperature.toFixed(2)} keeps a balanced distribution — mostly confident, with some variety.`
    );

  if (topK <= 3) parts.push(`Top-K ${topK} hard-limits sampling to the ${topK} best tokens.`);
  if (topP < 0.95)
    parts.push(
      `Top-P ${topP.toFixed(2)} cuts the long tail once ${Math.round(topP * 100)}% of probability mass is covered.`
    );
  return parts.join(" ");
}
