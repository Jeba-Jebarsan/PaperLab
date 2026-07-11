/**
 * GAN engine for the Adversarial Lab.
 *
 * A REAL 1-D generative adversarial network: a generator MLP maps noise to
 * samples, a discriminator MLP judges real vs fake, and both train
 * adversarially with genuine backpropagation — including gradients flowing
 * through the discriminator INTO the generator, exactly as in the paper.
 * The instability you may see (oscillation, mode collapse) is real too.
 */

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

// ---- tiny MLP with input-gradient support ----------------------------------

interface Mlp {
  sizes: number[];
  w: number[][][];
  b: number[][];
  // momentum buffers
  vw: number[][][];
  vb: number[][];
}

function createMlp(sizes: number[], rand: () => number): Mlp {
  const w: number[][][] = [];
  const b: number[][] = [];
  for (let l = 0; l < sizes.length - 1; l++) {
    const limit = Math.sqrt(6 / (sizes[l] + sizes[l + 1]));
    w.push(
      Array.from({ length: sizes[l] }, () =>
        Array.from({ length: sizes[l + 1] }, () => (rand() * 2 - 1) * limit)
      )
    );
    b.push(Array.from({ length: sizes[l + 1] }, () => 0));
  }
  return {
    sizes,
    w,
    b,
    vw: w.map((wl) => wl.map((r) => r.map(() => 0))),
    vb: b.map((bl) => bl.map(() => 0)),
  };
}

/** forward with tanh hidden layers, linear output */
function mlpForward(net: Mlp, input: number[]) {
  const activations = [input];
  const zs: number[][] = [];
  const L = net.w.length;
  for (let l = 0; l < L; l++) {
    const prev = activations[l];
    const z = net.b[l].map((bias, j) => {
      let s = bias;
      for (let i = 0; i < prev.length; i++) s += prev[i] * net.w[l][i][j];
      return s;
    });
    zs.push(z);
    activations.push(l === L - 1 ? z : z.map(Math.tanh));
  }
  return { activations, zs };
}

/**
 * Backward from dL/d(output). Accumulates grads into the provided buffers and
 * returns dL/d(input) — the piece that lets generator gradients flow through
 * the discriminator.
 */
function mlpBackward(
  net: Mlp,
  fwd: { activations: number[][]; zs: number[][] },
  dOut: number[],
  gradW: number[][][] | null,
  gradB: number[][] | null
): number[] {
  const L = net.w.length;
  let deltaZ = dOut; // linear output layer: dL/dz = dL/dout
  for (let l = L - 1; l >= 0; l--) {
    const aIn = fwd.activations[l];
    if (gradW && gradB) {
      for (let j = 0; j < deltaZ.length; j++) {
        gradB[l][j] += deltaZ[j];
        for (let i = 0; i < aIn.length; i++) gradW[l][i][j] += aIn[i] * deltaZ[j];
      }
    }
    const dIn = new Array<number>(aIn.length).fill(0);
    for (let i = 0; i < aIn.length; i++)
      for (let j = 0; j < deltaZ.length; j++) dIn[i] += net.w[l][i][j] * deltaZ[j];
    if (l > 0) {
      // through the tanh of the previous layer
      deltaZ = dIn.map((d, i) => {
        const t = Math.tanh(fwd.zs[l - 1][i]);
        return d * (1 - t * t);
      });
    } else {
      return dIn;
    }
  }
  return [];
}

function sgdStep(net: Mlp, gradW: number[][][], gradB: number[][], lr: number, n: number) {
  const mom = 0.5;
  for (let l = 0; l < net.w.length; l++) {
    for (let j = 0; j < net.b[l].length; j++) {
      net.vb[l][j] = mom * net.vb[l][j] - (lr * gradB[l][j]) / n;
      net.b[l][j] += net.vb[l][j];
      for (let i = 0; i < net.w[l].length; i++) {
        net.vw[l][i][j] = mom * net.vw[l][i][j] - (lr * gradW[l][i][j]) / n;
        net.w[l][i][j] += net.vw[l][i][j];
      }
    }
  }
}

const zeroLike = (net: Mlp) => ({
  gw: net.w.map((wl) => wl.map((r) => r.map(() => 0))),
  gb: net.b.map((bl) => bl.map(() => 0)),
});

const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));

// ---- the GAN ----------------------------------------------------------------

export type TargetId = "one-hill" | "two-hills";

export const TARGETS: { id: TargetId; name: string; hint: string }[] = [
  { id: "one-hill", name: "One hill", hint: "A single bell curve — the friendly case." },
  { id: "two-hills", name: "Two hills", hint: "Two modes — watch for real mode collapse!" },
];

export interface Gan {
  g: Mlp;
  d: Mlp;
  target: TargetId;
  rand: () => number;
  steps: number;
}

export function createGan(target: TargetId, seed = 31): Gan {
  const rand = mulberry32(seed);
  return {
    g: createMlp([1, 12, 12, 1], rand),
    d: createMlp([1, 12, 12, 1], rand),
    target,
    rand,
    steps: 0,
  };
}

/** Draw one sample from the real data distribution (Box–Muller). */
function sampleReal(gan: Gan): number {
  const u1 = Math.max(1e-9, gan.rand());
  const u2 = gan.rand();
  const n = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  if (gan.target === "one-hill") return 0.8 + 0.35 * n;
  return (gan.rand() < 0.5 ? -1.2 : 1.2) + 0.3 * n;
}

export function generate(gan: Gan, count: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    const z = gan.rand() * 2 - 1;
    out.push(mlpForward(gan.g, [z]).activations[3][0]);
  }
  return out;
}

export function discriminate(gan: Gan, x: number): number {
  return sigmoid(mlpForward(gan.d, [x]).activations[3][0]);
}

export interface GanStepResult {
  dLoss: number;
  gLoss: number;
}

/** One adversarial round: update D on real+fake, then update G (non-saturating). */
export function trainGanSteps(
  gan: Gan,
  rounds: number,
  lrD: number,
  lrG: number,
  batch = 32
): GanStepResult {
  let dLoss = 0;
  let gLoss = 0;

  for (let round = 0; round < rounds; round++) {
    // ---- Discriminator step ----
    const { gw: dGw, gb: dGb } = zeroLike(gan.d);
    dLoss = 0;
    for (let i = 0; i < batch; i++) {
      // real sample, target 1
      const xr = sampleReal(gan);
      const fr = mlpForward(gan.d, [xr]);
      const pr = sigmoid(fr.activations[3][0]);
      dLoss += -Math.log(Math.max(1e-9, pr));
      mlpBackward(gan.d, fr, [pr - 1], dGw, dGb);

      // fake sample, target 0
      const z = gan.rand() * 2 - 1;
      const xf = mlpForward(gan.g, [z]).activations[3][0];
      const ff = mlpForward(gan.d, [xf]);
      const pf = sigmoid(ff.activations[3][0]);
      dLoss += -Math.log(Math.max(1e-9, 1 - pf));
      mlpBackward(gan.d, ff, [pf], dGw, dGb);
    }
    sgdStep(gan.d, dGw, dGb, lrD, batch * 2);

    // ---- Generator step (non-saturating: maximize log D(G(z))) ----
    const { gw: gGw, gb: gGb } = zeroLike(gan.g);
    gLoss = 0;
    for (let i = 0; i < batch; i++) {
      const z = gan.rand() * 2 - 1;
      const gf = mlpForward(gan.g, [z]);
      const x = gf.activations[3][0];
      const df = mlpForward(gan.d, [x]);
      const p = sigmoid(df.activations[3][0]);
      gLoss += -Math.log(Math.max(1e-9, p));
      // dL/d(D input) with target 1, WITHOUT updating D
      const dIn = mlpBackward(gan.d, df, [p - 1], null, null);
      // continue into the generator
      mlpBackward(gan.g, gf, dIn, gGw, gGb);
    }
    sgdStep(gan.g, gGw, gGb, lrG, batch);
    gan.steps++;
  }

  return { dLoss: dLoss / (32 * 2), gLoss: gLoss / 32 };
}

/** Histogram helper over [-3, 3]. */
export function histogram(values: number[], bins = 30): number[] {
  const h = new Array<number>(bins).fill(0);
  for (const v of values) {
    const idx = Math.floor(((v + 3) / 6) * bins);
    if (idx >= 0 && idx < bins) h[idx]++;
  }
  const max = Math.max(...h, 1);
  return h.map((c) => c / max);
}

export function realSamples(gan: Gan, count: number): number[] {
  return Array.from({ length: count }, () => sampleReal(gan));
}
