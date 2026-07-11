/**
 * Deep-network engine for the ResNet Lab.
 *
 * Two REAL deep networks — one plain, one with identity skip connections
 * (y = F(x) + x, exactly the paper's formulation) — train live with true
 * backpropagation. Every loss value, gradient magnitude, and decision
 * boundary shown is genuinely computed. This reproduces, at toy scale, the
 * degradation problem from Figure 1 of the paper and how residual learning
 * fixes it.
 */

import type { DataPoint } from "./neural-net";

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

export interface DeepNet {
  /** number of hidden layers (equal width, so identity skips fit) */
  depth: number;
  width: number;
  /** true = residual: a[l+1] = tanh(z) + a[l] on hidden→hidden transitions */
  residual: boolean;
  /** weights[l][from][to]; l=0: input→hidden, 1..depth-1: hidden→hidden, depth: hidden→output */
  weights: number[][][];
  biases: number[][];
}

export function createDeepNet(
  depth: number,
  width: number,
  residual: boolean,
  seed = 1234
): DeepNet {
  const rand = mulberry32(seed);
  const sizes = [2, ...Array.from({ length: depth }, () => width), 1];
  const weights: number[][][] = [];
  const biases: number[][] = [];
  for (let l = 0; l < sizes.length - 1; l++) {
    const limit = Math.sqrt(6 / (sizes[l] + sizes[l + 1]));
    weights.push(
      Array.from({ length: sizes[l] }, () =>
        Array.from({ length: sizes[l + 1] }, () => (rand() * 2 - 1) * limit)
      )
    );
    biases.push(Array.from({ length: sizes[l + 1] }, () => 0));
  }
  return { depth, width, residual, weights, biases };
}

function sigmoid(z: number) {
  return 1 / (1 + Math.exp(-z));
}

/** Is transition l a residual (skip) transition? Hidden→hidden only. */
function hasSkip(net: DeepNet, l: number): boolean {
  return net.residual && l >= 1 && l <= net.weights.length - 2;
}

export interface DeepForward {
  /** activations[0] = input, [1..depth] = hidden layers, last = output */
  activations: number[][];
  zs: number[][];
}

export function forwardDeep(net: DeepNet, input: [number, number]): DeepForward {
  const L = net.weights.length;
  const activations: number[][] = [[input[0], input[1]]];
  const zs: number[][] = [];

  for (let l = 0; l < L; l++) {
    const prev = activations[l];
    const size = net.biases[l].length;
    const z = new Array<number>(size);
    const a = new Array<number>(size);
    for (let j = 0; j < size; j++) {
      let sum = net.biases[l][j];
      for (let i = 0; i < prev.length; i++) sum += prev[i] * net.weights[l][i][j];
      z[j] = sum;
      a[j] =
        l === L - 1
          ? sigmoid(sum)
          : hasSkip(net, l)
            ? Math.tanh(sum) + prev[j] // y = F(x) + x
            : Math.tanh(sum);
    }
    zs.push(z);
    activations.push(a);
  }
  return { activations, zs };
}

export function predictDeep(net: DeepNet, x: number, y: number): number {
  const fwd = forwardDeep(net, [x, y]);
  return fwd.activations[fwd.activations.length - 1][0];
}

export interface DeepTrainResult {
  loss: number;
  /** mean |dL/dw| per weight layer — the learning signal reaching each depth */
  layerGradNorms: number[];
}

export function trainDeep(
  net: DeepNet,
  data: DataPoint[],
  learningRate: number,
  epochs: number
): DeepTrainResult {
  const L = net.weights.length;
  let loss = 0;
  let gradW: number[][][] = [];
  let gradB: number[][] = [];

  for (let epoch = 0; epoch < epochs; epoch++) {
    gradW = net.weights.map((wl) => wl.map((row) => row.map(() => 0)));
    gradB = net.biases.map((bl) => bl.map(() => 0));
    loss = 0;

    for (const point of data) {
      const { activations, zs } = forwardDeep(net, [point.x, point.y]);
      const out = activations[L][0];
      const p = Math.min(1 - 1e-7, Math.max(1e-7, out));
      loss += -(point.label * Math.log(p) + (1 - point.label) * Math.log(1 - p));

      // Backward. deltaZ = dL/dz for the current transition;
      // prevDeltaA = dL/da[l+1] from the transition above (for the identity path).
      let deltaZ: number[] = [out - point.label]; // sigmoid + BCE
      let prevDeltaA: number[] = [];

      for (let l = L - 1; l >= 0; l--) {
        const aIn = activations[l];
        // accumulate real gradients
        for (let j = 0; j < deltaZ.length; j++) {
          gradB[l][j] += deltaZ[j];
          for (let i = 0; i < aIn.length; i++)
            gradW[l][i][j] += aIn[i] * deltaZ[j];
        }
        if (l === 0) break;

        // dL/da[l] = weight path + identity path (the "+1 highway")
        const dA = new Array<number>(aIn.length).fill(0);
        for (let i = 0; i < aIn.length; i++) {
          for (let j = 0; j < deltaZ.length; j++)
            dA[i] += net.weights[l][i][j] * deltaZ[j];
          if (hasSkip(net, l)) dA[i] += prevDeltaA[i];
        }
        prevDeltaA = dA;

        // convert to dL/dz of transition l-1 (its activation is tanh)
        const newDeltaZ = new Array<number>(aIn.length);
        for (let i = 0; i < aIn.length; i++) {
          const t = Math.tanh(zs[l - 1][i]);
          newDeltaZ[i] = dA[i] * (1 - t * t);
        }
        deltaZ = newDeltaZ;
      }
    }

    const n = data.length;
    for (let l = 0; l < L; l++) {
      for (let j = 0; j < net.biases[l].length; j++) {
        net.biases[l][j] -= (learningRate * gradB[l][j]) / n;
        for (let i = 0; i < net.weights[l].length; i++)
          net.weights[l][i][j] -= (learningRate * gradW[l][i][j]) / n;
      }
    }
    loss /= n;
  }

  const n = data.length;
  const layerGradNorms = gradW.map((wl) => {
    let sum = 0;
    let count = 0;
    for (const row of wl)
      for (const g of row) {
        sum += Math.abs(g) / n;
        count++;
      }
    return sum / count;
  });

  return { loss, layerGradNorms };
}

export function accuracyDeep(net: DeepNet, data: DataPoint[]): number {
  let correct = 0;
  for (const p of data)
    if ((predictDeep(net, p.x, p.y) > 0.5 ? 1 : 0) === p.label) correct++;
  return correct / data.length;
}
