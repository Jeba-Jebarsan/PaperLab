/**
 * Detection engine for the YOLO Lab.
 *
 * The candidate boxes are curated for the illustrated scene, but the
 * filtering math is exactly YOLO's post-processing: confidence thresholding
 * followed by per-class Non-Maximum Suppression using real IoU
 * (Intersection over Union) geometry.
 */

export interface Detection {
  id: string;
  label: string;
  /** model confidence in [0,1] */
  confidence: number;
  /** box in scene coordinates (480 x 300) */
  x: number;
  y: number;
  w: number;
  h: number;
  /** true when this candidate is a hallucination (nothing is really there) */
  falsePositive?: boolean;
}

export const SCENE_W = 480;
export const SCENE_H = 300;

/** Raw candidate boxes, as a one-stage detector would emit before filtering. */
export const CANDIDATES: Detection[] = [
  // the car — three overlapping guesses, classic duplicate problem
  { id: "car-1", label: "car", confidence: 0.94, x: 250, y: 168, w: 158, h: 76 },
  { id: "car-2", label: "car", confidence: 0.81, x: 262, y: 176, w: 138, h: 66 },
  { id: "car-3", label: "car", confidence: 0.57, x: 238, y: 160, w: 180, h: 88 },
  // the person — two guesses
  { id: "person-1", label: "person", confidence: 0.89, x: 96, y: 128, w: 46, h: 118 },
  { id: "person-2", label: "person", confidence: 0.64, x: 90, y: 122, w: 58, h: 128 },
  // the dog — weaker detections
  { id: "dog-1", label: "dog", confidence: 0.68, x: 168, y: 206, w: 56, h: 40 },
  { id: "dog-2", label: "dog", confidence: 0.42, x: 162, y: 200, w: 68, h: 48 },
  // hallucinations
  { id: "cat-fp", label: "cat", confidence: 0.31, x: 396, y: 96, w: 44, h: 36, falsePositive: true },
  { id: "person-fp", label: "person", confidence: 0.22, x: 30, y: 60, w: 34, h: 80, falsePositive: true },
];

export function iou(a: Detection, b: Detection): number {
  const x1 = Math.max(a.x, b.x);
  const y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.w, b.x + b.w);
  const y2 = Math.min(a.y + a.h, b.y + b.h);
  const inter = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  const union = a.w * a.h + b.w * b.h - inter;
  return union === 0 ? 0 : inter / union;
}

export interface FilterResult {
  kept: Detection[];
  /** removed because confidence < threshold */
  belowConfidence: Detection[];
  /** removed by NMS (suppressed duplicate), with the winner that beat them */
  suppressed: { det: Detection; by: Detection; overlap: number }[];
}

/** Confidence filter + per-class Non-Maximum Suppression. */
export function filterDetections(
  candidates: Detection[],
  confThreshold: number,
  iouThreshold: number
): FilterResult {
  const belowConfidence = candidates.filter((d) => d.confidence < confThreshold);
  const pool = candidates
    .filter((d) => d.confidence >= confThreshold)
    .sort((a, b) => b.confidence - a.confidence);

  const kept: Detection[] = [];
  const suppressed: FilterResult["suppressed"] = [];

  for (const det of pool) {
    const winner = kept.find(
      (k) => k.label === det.label && iou(k, det) > iouThreshold
    );
    if (winner) {
      suppressed.push({ det, by: winner, overlap: iou(winner, det) });
    } else {
      kept.push(det);
    }
  }
  return { kept, belowConfidence, suppressed };
}

export function explainResult(
  result: FilterResult,
  confThreshold: number,
  iouThreshold: number
): string {
  const { kept, suppressed } = result;
  const fpKept = kept.filter((d) => d.falsePositive);
  const carCount = kept.filter((d) => d.label === "car").length;
  const missedDog = !kept.some((d) => d.label === "dog");
  const missedPerson = !kept.some((d) => d.label === "person" && !d.falsePositive);

  if (fpKept.length > 0)
    return `Confidence ${Math.round(confThreshold * 100)}% is too forgiving — the model now reports a ${fpKept[0].label} that isn't really there (a false positive). Raise the confidence slider to make it pickier.`;
  if (carCount > 1)
    return `The same car got detected ${carCount} times! With IoU threshold at ${iouThreshold.toFixed(2)}, overlapping boxes don't count as duplicates. Lower the IoU slider and NMS will merge them.`;
  if (missedDog && missedPerson)
    return `Confidence ${Math.round(confThreshold * 100)}% is very strict — the dog AND the person are gone (missed detections). Real systems tune this trade-off carefully.`;
  if (missedDog)
    return `The dog vanished! Its best detection was only 68% confident, below your ${Math.round(confThreshold * 100)}% bar. Every threshold trades false alarms against missed objects.`;
  if (suppressed.length > 0)
    return `Clean result: ${kept.length} objects. NMS quietly removed ${suppressed.length} duplicate box${suppressed.length > 1 ? "es" : ""} — for each object, only the most confident box survives.`;
  return `${kept.length} detections shown. Drag the sliders and watch boxes appear, disappear, and merge in real time.`;
}
