/**
 * Convolution engine for the CNN Lab.
 *
 * Real 2-D convolution math on small grayscale pixel-art images — the exact
 * operation inside every convolutional network layer, small enough to watch
 * cell by cell.
 */

export interface InputImage {
  id: string;
  name: string;
  /** rows of pixel values in [0,1] (0 = black, 1 = white) */
  pixels: number[][];
}

export interface KernelPreset {
  id: string;
  name: string;
  /** Plain-language description of what this filter detects. */
  story: string;
  kernel: number[][];
}

// ---- 12x12 pixel-art inputs ----------------------------------------------

function fromArt(art: string[]): number[][] {
  return art.map((row) =>
    row.split("").map((ch) => (ch === "#" ? 1 : ch === "+" ? 0.55 : 0))
  );
}

export const INPUT_IMAGES: InputImage[] = [
  {
    id: "seven",
    name: "Digit 7",
    pixels: fromArt([
      "............",
      ".##########.",
      ".##########.",
      ".........##.",
      "........##..",
      ".......##...",
      "......##....",
      ".....##.....",
      "....##......",
      "...##.......",
      "...##.......",
      "............",
    ]),
  },
  {
    id: "cross",
    name: "Cross",
    pixels: fromArt([
      "............",
      "....####....",
      "....####....",
      "....####....",
      ".##########.",
      ".##########.",
      ".##########.",
      "....####....",
      "....####....",
      "....####....",
      "....####....",
      "............",
    ]),
  },
  {
    id: "face",
    name: "Smiley",
    pixels: fromArt([
      "............",
      "...######...",
      "..########..",
      ".##+####+##.",
      ".##+####+##.",
      ".##########.",
      ".##########.",
      ".#+######+#.",
      ".##+####+##.",
      "..##++++##..",
      "...######...",
      "............",
    ]),
  },
];

// ---- Classic 3x3 kernels ---------------------------------------------------

export const KERNEL_PRESETS: KernelPreset[] = [
  {
    id: "vertical",
    name: "Vertical edge finder",
    story:
      "Compares each pixel's left side to its right side. Big difference = a vertical edge lives here.",
    kernel: [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1],
    ],
  },
  {
    id: "horizontal",
    name: "Horizontal edge finder",
    story:
      "Compares above vs. below. It lights up where the image changes from top to bottom — horizontal edges.",
    kernel: [
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1],
    ],
  },
  {
    id: "sharpen",
    name: "Sharpen",
    story:
      "Boosts each pixel and subtracts its neighbors — differences get exaggerated, so details pop.",
    kernel: [
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0],
    ],
  },
  {
    id: "blur",
    name: "Blur (average)",
    story:
      "Replaces every pixel with the average of its neighborhood — details smear together and noise fades.",
    kernel: [
      [1 / 9, 1 / 9, 1 / 9],
      [1 / 9, 1 / 9, 1 / 9],
      [1 / 9, 1 / 9, 1 / 9],
    ],
  },
  {
    id: "outline",
    name: "Outline (all edges)",
    story:
      "Subtracts all neighbors from the center. Flat areas cancel to zero; only outlines survive.",
    kernel: [
      [-1, -1, -1],
      [-1, 8, -1],
      [-1, -1, -1],
    ],
  },
];

// ---- Convolution -----------------------------------------------------------

export interface ConvResult {
  /** raw signed outputs */
  values: number[][];
  /** |value| normalized to [0,1] for display */
  display: number[][];
  outH: number;
  outW: number;
  /** input coordinates (top-left of window) for each output cell */
  windowOrigin: (row: number, col: number) => { r: number; c: number };
  /** input size after padding */
  padded: number[][];
  pad: number;
}

export function convolve(
  image: number[][],
  kernel: number[][],
  stride: number,
  padding: boolean
): ConvResult {
  const k = kernel.length;
  const pad = padding ? Math.floor(k / 2) : 0;
  const h = image.length;
  const w = image[0].length;

  // build padded input (zero padding)
  const padded: number[][] = Array.from({ length: h + 2 * pad }, (_, r) =>
    Array.from({ length: w + 2 * pad }, (_, c) => {
      const rr = r - pad;
      const cc = c - pad;
      return rr >= 0 && rr < h && cc >= 0 && cc < w ? image[rr][cc] : 0;
    })
  );

  const outH = Math.floor((h + 2 * pad - k) / stride) + 1;
  const outW = Math.floor((w + 2 * pad - k) / stride) + 1;

  const values: number[][] = [];
  let maxAbs = 0;
  for (let r = 0; r < outH; r++) {
    const row: number[] = [];
    for (let c = 0; c < outW; c++) {
      let sum = 0;
      for (let kr = 0; kr < k; kr++) {
        for (let kc = 0; kc < k; kc++) {
          sum += padded[r * stride + kr][c * stride + kc] * kernel[kr][kc];
        }
      }
      row.push(sum);
      maxAbs = Math.max(maxAbs, Math.abs(sum));
    }
    values.push(row);
  }

  const display = values.map((row) =>
    row.map((v) => (maxAbs === 0 ? 0 : Math.abs(v) / maxAbs))
  );

  return {
    values,
    display,
    outH,
    outW,
    windowOrigin: (row, col) => ({ r: row * stride, c: col * stride }),
    padded,
    pad,
  };
}
