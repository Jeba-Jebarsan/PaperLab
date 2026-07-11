/**
 * Digit-recognition engine for the "But what is a neural network?" lab —
 * an homage to 3Blue1Brown's chapter 1, at 100% reality.
 *
 * A genuine 100 → 16 → 16 → 10 multilayer perceptron (the video's 16-16
 * hidden architecture, on a 10×10 canvas) trains in the browser with real
 * mini-batch SGD on softmax cross-entropy. Every activation, weight image,
 * probability, and accuracy number shown in the UI is truly computed.
 */

export const GRID = 10;
export const N_INPUT = GRID * GRID;
export const HIDDEN = 16;
export const N_CLASSES = 10;

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

// ---- 10×10 pixel-art digit glyphs -----------------------------------------

const GLYPH_ART: Record<number, string[]> = {
  0: [
    "..######..",
    ".##....##.",
    ".##....##.",
    ".##....##.",
    ".##....##.",
    ".##....##.",
    ".##....##.",
    ".##....##.",
    ".##....##.",
    "..######..",
  ],
  1: [
    "....##....",
    "...###....",
    "..####....",
    "....##....",
    "....##....",
    "....##....",
    "....##....",
    "....##....",
    "....##....",
    "..######..",
  ],
  2: [
    "..######..",
    ".##....##.",
    ".......##.",
    "......##..",
    ".....##...",
    "....##....",
    "...##.....",
    "..##......",
    ".##.......",
    ".########.",
  ],
  3: [
    "..######..",
    ".##....##.",
    ".......##.",
    ".......##.",
    "...####...",
    ".......##.",
    ".......##.",
    ".......##.",
    ".##....##.",
    "..######..",
  ],
  4: [
    ".....###..",
    "....####..",
    "...##.##..",
    "..##..##..",
    ".##...##..",
    ".########.",
    "......##..",
    "......##..",
    "......##..",
    "......##..",
  ],
  5: [
    ".########.",
    ".##.......",
    ".##.......",
    ".##.......",
    ".#######..",
    ".......##.",
    ".......##.",
    ".......##.",
    ".##....##.",
    "..######..",
  ],
  6: [
    "..######..",
    ".##....##.",
    ".##.......",
    ".##.......",
    ".#######..",
    ".##....##.",
    ".##....##.",
    ".##....##.",
    ".##....##.",
    "..######..",
  ],
  7: [
    ".########.",
    ".......##.",
    ".......##.",
    "......##..",
    "......##..",
    ".....##...",
    ".....##...",
    "....##....",
    "....##....",
    "....##....",
  ],
  8: [
    "..######..",
    ".##....##.",
    ".##....##.",
    ".##....##.",
    "..######..",
    ".##....##.",
    ".##....##.",
    ".##....##.",
    ".##....##.",
    "..######..",
  ],
  9: [
    "..######..",
    ".##....##.",
    ".##....##.",
    ".##....##.",
    ".##....##.",
    "..#######.",
    ".......##.",
    ".......##.",
    ".##....##.",
    "..######..",
  ],
};

export function glyphPixels(digit: number): number[] {
  const art = GLYPH_ART[digit];
  const px: number[] = [];
  for (const row of art) for (const ch of row) px.push(ch === "#" ? 1 : 0);
  return px;
}

export interface DigitSample {
  pixels: number[];
  label: number;
}

/**
 * Procedural training set: each glyph, randomly shifted ±1px, with pixel
 * dropout, salt noise, and intensity jitter — enough variety that the
 * network must learn shapes, not memorize exact pixels.
 */
export function makeDigitDataset(perDigit: number, seed = 5): DigitSample[] {
  const rand = mulberry32(seed);
  const samples: DigitSample[] = [];

  for (let digit = 0; digit < N_CLASSES; digit++) {
    const base = glyphPixels(digit);
    for (let v = 0; v < perDigit; v++) {
      const dx = Math.floor(rand() * 3) - 1;
      const dy = Math.floor(rand() * 3) - 1;
      const intensity = 0.75 + rand() * 0.25;
      const px = new Array<number>(N_INPUT).fill(0);
      for (let r = 0; r < GRID; r++) {
        for (let c = 0; c < GRID; c++) {
          const sr = r - dy;
          const sc = c - dx;
          if (sr < 0 || sr >= GRID || sc < 0 || sc >= GRID) continue;
          let val = base[sr * GRID + sc] * intensity;
          if (val > 0 && rand() < 0.08) val = 0; // dropout: broken strokes
          px[r * GRID + c] = val;
        }
      }
      // salt noise
      for (let i = 0; i < N_INPUT; i++) {
        if (px[i] === 0 && rand() < 0.02) px[i] = 0.2 + rand() * 0.3;
      }
      samples.push({ pixels: px, label: digit });
    }
  }
  return samples;
}

// ---- the network ------------------------------------------------------------

export interface DigitNet {
  sizes: number[]; // [100, 16, 16, 10]
  weights: number[][][];
  biases: number[][];
}

export function createDigitNet(seed = 77): DigitNet {
  const sizes = [N_INPUT, HIDDEN, HIDDEN, N_CLASSES];
  const rand = mulberry32(seed);
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
  return { sizes, weights, biases };
}

export interface DigitForward {
  /** activations[0]=input, [1],[2]=hidden (ReLU), [3]=softmax probabilities */
  activations: number[][];
  zs: number[][];
}

export function forwardDigit(net: DigitNet, pixels: number[]): DigitForward {
  const activations: number[][] = [pixels];
  const zs: number[][] = [];
  const L = net.weights.length;

  for (let l = 0; l < L; l++) {
    const prev = activations[l];
    const size = net.biases[l].length;
    const z = new Array<number>(size);
    for (let j = 0; j < size; j++) {
      let sum = net.biases[l][j];
      for (let i = 0; i < prev.length; i++) {
        if (prev[i] !== 0) sum += prev[i] * net.weights[l][i][j];
      }
      z[j] = sum;
    }
    zs.push(z);
    if (l === L - 1) {
      // softmax
      const max = Math.max(...z);
      const exps = z.map((v) => Math.exp(v - max));
      const s = exps.reduce((a, b) => a + b, 0);
      activations.push(exps.map((e) => e / s));
    } else {
      activations.push(z.map((v) => Math.max(0, v))); // ReLU
    }
  }
  return { activations, zs };
}

export interface DigitTrainResult {
  loss: number;
  accuracy: number;
}

/** Real mini-batch SGD on softmax cross-entropy. Mutates the net. */
export function trainDigit(
  net: DigitNet,
  samples: DigitSample[],
  learningRate: number,
  epochs: number,
  batchSize = 32,
  seed = 11
): DigitTrainResult {
  const rand = mulberry32(seed + Math.floor(Math.random() * 1e9));
  const L = net.weights.length;
  let loss = 0;
  let correct = 0;

  for (let epoch = 0; epoch < epochs; epoch++) {
    // shuffle
    const order = samples.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }

    loss = 0;
    correct = 0;

    for (let start = 0; start < order.length; start += batchSize) {
      const batch = order.slice(start, start + batchSize);
      const gradW = net.weights.map((wl) => wl.map((row) => row.map(() => 0)));
      const gradB = net.biases.map((bl) => bl.map(() => 0));

      for (const idx of batch) {
        const { pixels, label } = samples[idx];
        const { activations, zs } = forwardDigit(net, pixels);
        const probs = activations[L];
        loss += -Math.log(Math.max(1e-9, probs[label]));
        if (probs.indexOf(Math.max(...probs)) === label) correct++;

        // softmax + CE: deltaZ = p - onehot
        let deltaZ = probs.map((p, j) => p - (j === label ? 1 : 0));

        for (let l = L - 1; l >= 0; l--) {
          const aIn = activations[l];
          for (let j = 0; j < deltaZ.length; j++) {
            if (deltaZ[j] === 0) continue;
            gradB[l][j] += deltaZ[j];
            for (let i = 0; i < aIn.length; i++) {
              if (aIn[i] !== 0) gradW[l][i][j] += aIn[i] * deltaZ[j];
            }
          }
          if (l === 0) break;
          const prevSize = aIn.length;
          const newDelta = new Array<number>(prevSize).fill(0);
          for (let i = 0; i < prevSize; i++) {
            if (zs[l - 1][i] <= 0) continue; // ReLU gate
            let sum = 0;
            for (let j = 0; j < deltaZ.length; j++)
              sum += net.weights[l][i][j] * deltaZ[j];
            newDelta[i] = sum;
          }
          deltaZ = newDelta;
        }
      }

      const n = batch.length;
      for (let l = 0; l < L; l++) {
        for (let j = 0; j < net.biases[l].length; j++) {
          net.biases[l][j] -= (learningRate * gradB[l][j]) / n;
          for (let i = 0; i < net.weights[l].length; i++)
            net.weights[l][i][j] -= (learningRate * gradW[l][i][j]) / n;
        }
      }
    }
  }

  return { loss: loss / samples.length, accuracy: correct / samples.length };
}

export function evaluateDigit(net: DigitNet, samples: DigitSample[]): number {
  let correct = 0;
  for (const s of samples) {
    const probs = forwardDigit(net, s.pixels).activations[net.weights.length];
    if (probs.indexOf(Math.max(...probs)) === s.label) correct++;
  }
  return correct / samples.length;
}
