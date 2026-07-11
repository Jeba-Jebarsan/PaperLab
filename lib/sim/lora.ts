/**
 * Low-rank engine for the LoRA Lab.
 *
 * Real linear algebra: a weight-update matrix ΔW is decomposed with a genuine
 * SVD (power iteration + deflation), and the rank-r reconstruction shown for
 * every slider position is truly Σᵢ σᵢ uᵢ vᵢᵀ. The demo matrix is synthetic
 * (built with realistic low intrinsic rank, as the paper found in real
 * fine-tuning updates) — the decomposition and error math are exact.
 */

export const DIM = 24;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** smooth random vector (random walk, mean-removed, normalized) */
function smoothVec(n: number, rand: () => number): number[] {
  const v: number[] = [];
  let acc = 0;
  for (let i = 0; i < n; i++) {
    acc += rand() * 2 - 1;
    v.push(acc);
  }
  const mean = v.reduce((a, b) => a + b, 0) / n;
  const centered = v.map((x) => x - mean);
  const norm = Math.hypot(...centered) || 1;
  return centered.map((x) => x / norm);
}

/**
 * A synthetic "full fine-tuning update" ΔW with strong low-rank structure
 * plus a little full-rank noise — mirroring the paper's finding that real
 * adaptation updates have very low intrinsic rank.
 */
function orthogonalize(v: number[], basis: number[][]): number[] {
  const out = [...v];
  for (const b of basis) {
    const dot = out.reduce((s, x, i) => s + x * b[i], 0);
    for (let i = 0; i < out.length; i++) out[i] -= dot * b[i];
  }
  const norm = Math.hypot(...out) || 1;
  return out.map((x) => x / norm);
}

export function makeUpdateMatrix(seed = 9): number[][] {
  const rand = mulberry32(seed);
  const M: number[][] = Array.from({ length: DIM }, () => new Array(DIM).fill(0));
  const strengths = [3.0, 1.6, 0.7];
  const uBasis: number[][] = [];
  const vBasis: number[][] = [];
  for (const s of strengths) {
    const u = orthogonalize(smoothVec(DIM, rand), uBasis);
    const v = orthogonalize(smoothVec(DIM, rand), vBasis);
    uBasis.push(u);
    vBasis.push(v);
    for (let i = 0; i < DIM; i++)
      for (let j = 0; j < DIM; j++) M[i][j] += s * u[i] * v[j];
  }
  for (let i = 0; i < DIM; i++)
    for (let j = 0; j < DIM; j++) M[i][j] += (rand() * 2 - 1) * 0.02;
  return M;
}

// ---- real SVD via power iteration with deflation ----------------------------

export interface SvdResult {
  singularValues: number[];
  us: number[][];
  vs: number[][];
}

export function topSvd(matrix: number[][], k: number, seed = 3): SvdResult {
  const rand = mulberry32(seed);
  const n = matrix.length;
  const m = matrix[0].length;
  // working copy for deflation
  const A = matrix.map((row) => [...row]);
  const singularValues: number[] = [];
  const us: number[][] = [];
  const vs: number[][] = [];

  const matVec = (Am: number[][], v: number[]) =>
    Am.map((row) => row.reduce((s, a, j) => s + a * v[j], 0));
  const matTVec = (Am: number[][], u: number[]) => {
    const out = new Array<number>(m).fill(0);
    for (let i = 0; i < n; i++)
      for (let j = 0; j < m; j++) out[j] += Am[i][j] * u[i];
    return out;
  };
  const normalize = (v: number[]) => {
    const norm = Math.hypot(...v) || 1;
    return v.map((x) => x / norm);
  };

  for (let comp = 0; comp < k; comp++) {
    let v = normalize(Array.from({ length: m }, () => rand() * 2 - 1));
    for (let iter = 0; iter < 60; iter++) {
      v = normalize(matTVec(A, matVec(A, v)));
    }
    const Av = matVec(A, v);
    const sigma = Math.hypot(...Av);
    const u = sigma > 1e-12 ? Av.map((x) => x / sigma) : Av;
    singularValues.push(sigma);
    us.push(u);
    vs.push(v);
    // deflate
    for (let i = 0; i < n; i++)
      for (let j = 0; j < m; j++) A[i][j] -= sigma * u[i] * v[j];
  }
  return { singularValues, us, vs };
}

/** Rank-r reconstruction Σᵢ σᵢ uᵢ vᵢᵀ — exactly what LoRA's B·A can express. */
export function reconstruct(svd: SvdResult, r: number): number[][] {
  const n = svd.us[0].length;
  const m = svd.vs[0].length;
  const M: number[][] = Array.from({ length: n }, () => new Array(m).fill(0));
  for (let c = 0; c < r; c++) {
    const s = svd.singularValues[c];
    for (let i = 0; i < n; i++)
      for (let j = 0; j < m; j++) M[i][j] += s * svd.us[c][i] * svd.vs[c][j];
  }
  return M;
}

export function frobenius(M: number[][]): number {
  let s = 0;
  for (const row of M) for (const x of row) s += x * x;
  return Math.sqrt(s);
}

/** Relative reconstruction error ‖ΔW − ΔWᵣ‖F / ‖ΔW‖F — real. */
export function relativeError(original: number[][], approx: number[][]): number {
  let diff = 0;
  for (let i = 0; i < original.length; i++)
    for (let j = 0; j < original[0].length; j++)
      diff += (original[i][j] - approx[i][j]) ** 2;
  return Math.sqrt(diff) / (frobenius(original) || 1);
}
