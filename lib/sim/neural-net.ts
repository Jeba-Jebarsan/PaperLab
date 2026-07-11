/**
 * Neural network engine for the Backpropagation Lab.
 *
 * This is NOT an illustration: a real multi-layer perceptron is created,
 * run forward, and trained with genuine backpropagation (full-batch gradient
 * descent, binary cross-entropy loss) directly in the browser. Every weight,
 * activation, gradient, loss value, and decision boundary shown in the UI is
 * the true value from this network.
 */

export type Activation = "tanh" | "relu";

export interface DataPoint {
  x: number;
  y: number;
  label: 0 | 1;
}

export interface Net {
  /** layer sizes, e.g. [2, 4, 4, 1] */
  sizes: number[];
  /** weights[l][from][to] connects layer l to layer l+1 */
  weights: number[][][];
  /** biases[l][to] for layer l+1 */
  biases: number[][];
  activation: Activation;
}

// ---- deterministic RNG so every reset reproduces the same experiment ------

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

// ---- datasets --------------------------------------------------------------

export const DATASETS = [
  { id: "xor", name: "XOR quadrants", hint: "Not linearly separable — the classic test." },
  { id: "circle", name: "Circle", hint: "Inner ring vs outer ring." },
  { id: "spiral", name: "Two spirals", hint: "Hard mode — needs more neurons and patience." },
] as const;

export type DatasetId = (typeof DATASETS)[number]["id"];

export function makeDataset(id: DatasetId, seed = 7): DataPoint[] {
  const rand = mulberry32(seed);
  const pts: DataPoint[] = [];

  if (id === "xor") {
    while (pts.length < 90) {
      const x = rand() * 2 - 1;
      const y = rand() * 2 - 1;
      if (Math.abs(x) < 0.08 || Math.abs(y) < 0.08) continue; // margin
      pts.push({ x, y, label: (x > 0) !== (y > 0) ? 1 : 0 });
    }
  } else if (id === "circle") {
    while (pts.length < 90) {
      const x = rand() * 2 - 1;
      const y = rand() * 2 - 1;
      const r = Math.hypot(x, y);
      if (r > 1 || (r > 0.48 && r < 0.62)) continue; // margin band
      pts.push({ x, y, label: r < 0.55 ? 1 : 0 });
    }
  } else {
    const perClass = 55;
    for (let c = 0 as 0 | 1; c <= 1; c++) {
      for (let i = 0; i < perClass; i++) {
        const r = (i / perClass) * 0.9 + 0.05;
        const t = 1.6 * (i / perClass) * 2 * Math.PI + c * Math.PI;
        pts.push({
          x: r * Math.sin(t) + (rand() - 0.5) * 0.08,
          y: r * Math.cos(t) + (rand() - 0.5) * 0.08,
          label: c as 0 | 1,
        });
      }
    }
  }
  return pts;
}

// ---- network ----------------------------------------------------------------

export function createNet(hidden: number, activation: Activation, seed = 42): Net {
  const sizes = [2, hidden, hidden, 1];
  const rand = mulberry32(seed);
  const weights: number[][][] = [];
  const biases: number[][] = [];

  for (let l = 0; l < sizes.length - 1; l++) {
    const fanIn = sizes[l];
    const fanOut = sizes[l + 1];
    const limit = Math.sqrt(6 / (fanIn + fanOut)); // Xavier/Glorot init
    weights.push(
      Array.from({ length: fanIn }, () =>
        Array.from({ length: fanOut }, () => (rand() * 2 - 1) * limit)
      )
    );
    biases.push(Array.from({ length: fanOut }, () => 0));
  }
  return { sizes, weights, biases, activation };
}

function act(net: Net, z: number): number {
  return net.activation === "tanh" ? Math.tanh(z) : Math.max(0, z);
}
function actDeriv(net: Net, z: number, a: number): number {
  return net.activation === "tanh" ? 1 - a * a : z > 0 ? 1 : 0;
}
function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

export interface ForwardResult {
  /** activations[0] is the input; last layer is the sigmoid output */
  activations: number[][];
  zs: number[][];
}

export function forward(net: Net, input: [number, number]): ForwardResult {
  const activations: number[][] = [[input[0], input[1]]];
  const zs: number[][] = [];
  const L = net.sizes.length - 1;

  for (let l = 0; l < L; l++) {
    const prev = activations[l];
    const z: number[] = [];
    const a: number[] = [];
    for (let j = 0; j < net.sizes[l + 1]; j++) {
      let sum = net.biases[l][j];
      for (let i = 0; i < net.sizes[l]; i++) sum += prev[i] * net.weights[l][i][j];
      z.push(sum);
      a.push(l === L - 1 ? sigmoid(sum) : act(net, sum));
    }
    zs.push(z);
    activations.push(a);
  }
  return { activations, zs };
}

export function predict(net: Net, x: number, y: number): number {
  const { activations } = forward(net, [x, y]);
  return activations[activations.length - 1][0];
}

export interface TrainResult {
  /** mean binary cross-entropy over the dataset */
  loss: number;
  /** mean |dL/dw| per weight from the final epoch — for gradient visualization */
  gradMagnitudes: number[][][];
}

/**
 * Full-batch gradient descent with real backpropagation.
 * Mutates the network in place; returns the loss and gradient magnitudes.
 */
export function trainEpochs(
  net: Net,
  data: DataPoint[],
  learningRate: number,
  epochs: number
): TrainResult {
  const L = net.sizes.length - 1;
  let loss = 0;
  let gradW: number[][][] = [];
  let gradB: number[][] = [];

  for (let epoch = 0; epoch < epochs; epoch++) {
    // zero gradient accumulators
    gradW = net.weights.map((wl) => wl.map((row) => row.map(() => 0)));
    gradB = net.biases.map((bl) => bl.map(() => 0));
    loss = 0;

    for (const point of data) {
      const { activations, zs } = forward(net, [point.x, point.y]);
      const out = activations[L][0];
      const clipped = Math.min(1 - 1e-7, Math.max(1e-7, out));
      loss += -(point.label * Math.log(clipped) + (1 - point.label) * Math.log(1 - clipped));

      // backward pass — delta[l][j] = dL/dz for layer l+1
      const deltas: number[][] = Array.from({ length: L }, (_, l) =>
        Array.from({ length: net.sizes[l + 1] }, () => 0)
      );
      // sigmoid + BCE: dL/dz = a - y
      deltas[L - 1][0] = out - point.label;

      for (let l = L - 2; l >= 0; l--) {
        for (let j = 0; j < net.sizes[l + 1]; j++) {
          let sum = 0;
          for (let k = 0; k < net.sizes[l + 2]; k++)
            sum += net.weights[l + 1][j][k] * deltas[l + 1][k];
          deltas[l][j] = sum * actDeriv(net, zs[l][j], activations[l + 1][j]);
        }
      }

      // accumulate gradients
      for (let l = 0; l < L; l++) {
        for (let j = 0; j < net.sizes[l + 1]; j++) {
          gradB[l][j] += deltas[l][j];
          for (let i = 0; i < net.sizes[l]; i++)
            gradW[l][i][j] += activations[l][i] * deltas[l][j];
        }
      }
    }

    // gradient descent step (averaged over the batch)
    const n = data.length;
    for (let l = 0; l < L; l++) {
      for (let j = 0; j < net.sizes[l + 1]; j++) {
        net.biases[l][j] -= (learningRate * gradB[l][j]) / n;
        for (let i = 0; i < net.sizes[l]; i++)
          net.weights[l][i][j] -= (learningRate * gradW[l][i][j]) / n;
      }
    }
    loss /= n;
  }

  const n = data.length;
  return {
    loss,
    gradMagnitudes: gradW.map((wl) => wl.map((row) => row.map((g) => Math.abs(g) / n))),
  };
}

/** Accuracy over the dataset — real predictions vs true labels. */
export function accuracy(net: Net, data: DataPoint[]): number {
  let correct = 0;
  for (const p of data) {
    if ((predict(net, p.x, p.y) > 0.5 ? 1 : 0) === p.label) correct++;
  }
  return correct / data.length;
}
