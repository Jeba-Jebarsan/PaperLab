/**
 * Gradient descent engine for the Optimization Lab.
 *
 * A 1-D non-convex loss landscape with a shallow local minimum and a deeper
 * global one — enough structure to demonstrate learning rate, momentum,
 * overshooting, and getting stuck. All analytic, all deterministic.
 */

export const W_MIN = -4.6;
export const W_MAX = 4.6;

/** Loss landscape: two valleys, global minimum on the right. */
export function loss(w: number): number {
  return 0.05 * w ** 4 - 0.9 * w ** 2 - 0.35 * w + 6;
}

export function gradient(w: number): number {
  return 0.2 * w ** 3 - 1.8 * w - 0.35;
}

export interface DescentStep {
  w: number;
  loss: number;
  velocity: number;
}

export function simulateDescent(
  startW: number,
  learningRate: number,
  momentum: number,
  steps: number
): DescentStep[] {
  const path: DescentStep[] = [{ w: startW, loss: loss(startW), velocity: 0 }];
  let w = startW;
  let v = 0;

  for (let i = 0; i < steps; i++) {
    v = momentum * v - learningRate * gradient(w);
    w += v;
    // clamp to the visible landscape so divergence is drawable
    w = Math.max(W_MIN * 1.4, Math.min(W_MAX * 1.4, w));
    path.push({ w, loss: loss(w), velocity: v });
    if (Math.abs(v) < 1e-4 && Math.abs(gradient(w)) < 1e-3) break; // converged
  }
  return path;
}

export type DescentOutcome =
  | "converged-global"
  | "converged-local"
  | "oscillating"
  | "diverged"
  | "running";

export function classifyOutcome(path: DescentStep[]): DescentOutcome {
  const last = path[path.length - 1];
  const tail = path.slice(-6);

  if (Math.abs(last.w) > W_MAX * 1.3) return "diverged";

  const tailRange =
    Math.max(...tail.map((p) => p.w)) - Math.min(...tail.map((p) => p.w));
  if (tailRange < 0.05) {
    // settled — which valley? global minimum is near w ≈ 3.1, local near w ≈ -2.9
    return last.w > 0 ? "converged-global" : "converged-local";
  }
  if (tailRange > 3) return "oscillating";
  return "running";
}

export const OUTCOME_EXPLANATIONS: Record<DescentOutcome, string> = {
  "converged-global":
    "The ball settled in the deepest valley — the global minimum. This learning rate is well matched to the landscape.",
  "converged-local":
    "The ball got trapped in the shallow valley on the left — a local minimum. Try more momentum (to roll through) or a different starting point.",
  oscillating:
    "The steps are too big: the ball keeps jumping across the valley instead of settling. This is overshooting — lower the learning rate.",
  diverged:
    "The learning rate is so high that each step makes things worse — the loss exploded. This is divergence, the classic failure of a too-aggressive optimizer.",
  running: "Still descending — each step moves opposite the slope, scaled by the learning rate.",
};
