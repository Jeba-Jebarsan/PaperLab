"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Eraser, PenLine, ScanEye, Stamp } from "lucide-react";
import {
  GRID,
  N_INPUT,
  HIDDEN,
  N_CLASSES,
  createDigitNet,
  makeDigitDataset,
  trainDigit,
  forwardDigit,
  evaluateDigit,
  glyphPixels,
  type DigitNet,
} from "@/lib/sim/digit-net";
import { SimulatorShell, type SimMode } from "../engine/simulator-shell";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const TEAL = "79,209,197";
const ROSE = "242,125,152";
const BLUE = "96,165,250";

// network diagram geometry
const NET_W = 400;
const NET_H = 330;
const X_H1 = 70;
const X_H2 = 210;
const X_OUT = 350;

function neuronY(count: number, i: number) {
  const gap = NET_H / (count + 1);
  return gap * (i + 1);
}

export function DigitVision() {
  const [mode, setMode] = React.useState<SimMode>("beginner");
  const [pixels, setPixels] = React.useState<number[]>(() =>
    new Array(N_INPUT).fill(0)
  );
  const [lr, setLr] = React.useState(0.5);
  const [training, setTraining] = React.useState(false);
  const [epoch, setEpoch] = React.useState(0);
  const [trainAcc, setTrainAcc] = React.useState<number | null>(null);
  const [testAcc, setTestAcc] = React.useState<number | null>(null);
  const [hovered, setHovered] = React.useState<{ layer: 1 | 2; index: number } | null>(
    null
  );
  const [, setTick] = React.useState(0);
  const drawing = React.useRef(false);

  const trainData = React.useMemo(() => makeDigitDataset(40, 5), []);
  const testData = React.useMemo(() => makeDigitDataset(12, 999), []);
  const netRef = React.useRef<DigitNet>(createDigitNet());

  const reset = React.useCallback(() => {
    netRef.current = createDigitNet();
    setEpoch(0);
    setTrainAcc(null);
    setTestAcc(null);
    setTraining(false);
    setTick((t) => t + 1);
  }, []);

  const runEpochs = React.useCallback(
    (count: number) => {
      const r = trainDigit(netRef.current, trainData, lr, count);
      setTrainAcc(r.accuracy);
      setEpoch((e) => e + count);
      setTick((t) => t + 1);
    },
    [trainData, lr]
  );

  React.useEffect(() => {
    if (!training) return;
    const id = setInterval(() => runEpochs(2), 140);
    return () => clearInterval(id);
  }, [training, runEpochs]);

  // auto-stop when genuinely trained; measure held-out accuracy
  React.useEffect(() => {
    if (training && ((trainAcc !== null && trainAcc >= 0.999 && epoch >= 30) || epoch >= 120)) {
      setTraining(false);
      setTestAcc(evaluateDigit(netRef.current, testData));
    }
  }, [training, trainAcc, epoch, testData]);

  const net = netRef.current;
  const fwd = React.useMemo(
    () => forwardDigit(net, pixels),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pixels, epoch, net]
  );
  const probs = fwd.activations[3];
  const predicted = probs.indexOf(Math.max(...probs));
  const hasInk = pixels.some((p) => p > 0);

  const maxH1 = Math.max(...fwd.activations[1], 1e-6);
  const maxH2 = Math.max(...fwd.activations[2], 1e-6);

  function paint(index: number) {
    setPixels((prev) => {
      const next = [...prev];
      next[index] = 1;
      const r = Math.floor(index / GRID);
      const c = index % GRID;
      for (const [dr, dc] of [[0, 1], [0, -1], [1, 0], [-1, 0]] as const) {
        const rr = r + dr;
        const cc = c + dc;
        if (rr >= 0 && rr < GRID && cc >= 0 && cc < GRID)
          next[rr * GRID + cc] = Math.max(next[rr * GRID + cc], 0.45);
      }
      return next;
    });
  }

  const explanation =
    epoch === 0
      ? "This 100→16→16→10 network is untrained — draw something and every digit gets ~10%, a pure guess. Press play to train it live on 400 noisy digits."
      : training
        ? `Epoch ${epoch}: the network has sorted ${Math.round((trainAcc ?? 0) * 100)}% of its training digits correctly. Real mini-batch gradient descent is adjusting all ${(N_INPUT * HIDDEN + HIDDEN * HIDDEN + HIDDEN * N_CLASSES).toLocaleString()} weights right now.`
        : hasInk
          ? `The network reads your drawing as a ${predicted} (${Math.round(probs[predicted] * 100)}% confident). Watch the two hidden columns — those glowing neurons are the real activations your ink produced.`
          : `Trained: ${Math.round((trainAcc ?? 0) * 100)}% on training data${testAcc !== null ? `, ${Math.round(testAcc * 100)}% on digits it has never seen` : ""}. Now draw a digit — or hover any neuron to see what it learned to look for.`;

  const controls = (
    <div className="space-y-5">
      <Slider
        label="Learning rate"
        value={lr}
        min={0.1}
        max={1}
        step={0.05}
        onChange={setLr}
        format={(v) => v.toFixed(2)}
        hint="How big each of the network's correction steps is."
      />

      <div>
        <p className="mb-1.5 text-xs font-medium text-ink-dim">Stamp a clean digit</p>
        <div className="grid grid-cols-5 gap-1">
          {Array.from({ length: 10 }, (_, d) => (
            <button
              key={d}
              onClick={() => setPixels(glyphPixels(d))}
              className="rounded-md border border-line bg-white/[0.03] py-1.5 font-mono text-xs text-ink-dim transition-all hover:border-primary/40 hover:text-ink cursor-pointer"
            >
              {d}
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-[11px] leading-snug text-ink-faint">
          Stamp one, then erase parts of it — find out what the network really
          relies on.
        </p>
      </div>

      <button
        onClick={() => setPixels(new Array(N_INPUT).fill(0))}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-line py-2 text-xs text-ink-dim transition-all hover:border-line-strong hover:text-ink cursor-pointer"
      >
        <Eraser className="size-3.5" />
        Clear canvas
      </button>

      <div className="space-y-1.5 border-t border-line pt-4 font-mono text-[11px]">
        <p className="flex justify-between text-ink-faint">
          <span>epochs</span>
          <span className="text-ink-dim">{epoch}</span>
        </p>
        <p className="flex justify-between text-ink-faint">
          <span>train accuracy</span>
          <span className="text-accent">
            {trainAcc === null ? "—" : `${Math.round(trainAcc * 100)}%`}
          </span>
        </p>
        <p className="flex justify-between text-ink-faint">
          <span>unseen digits</span>
          <span className="text-amber">
            {testAcc === null ? "—" : `${Math.round(testAcc * 100)}%`}
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <SimulatorShell
      icon={ScanEye}
      title="“But what is a neural network?” Lab"
      subtitle="Draw a digit, watch 1,860 real weights read it — an homage to 3Blue1Brown"
      mode={mode}
      onModeChange={setMode}
      analogy="Each neuron is a tiny inspector holding a stencil. Layer 1 inspectors look for strokes and edges; later layers combine their reports: “loop on top + line below… that's a 9.”"
      explanation={explanation}
      transport={{
        playing: training,
        onPlayPause: () => setTraining((t) => !t),
        onStep: () => runEpochs(1),
        onReset: reset,
      }}
      controls={controls}
    >
      <div className="flex flex-wrap items-start justify-center gap-5">
        {/* Drawing canvas */}
        <div>
          <p className="mb-2 flex items-center justify-center gap-1.5 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
            <PenLine className="size-3" />
            Draw here
          </p>
          <div
            className="grid touch-none gap-px rounded-lg border border-line bg-void/70 p-1.5 select-none"
            style={{ gridTemplateColumns: `repeat(${GRID}, 19px)` }}
            onPointerDown={() => (drawing.current = true)}
            onPointerUp={() => (drawing.current = false)}
            onPointerLeave={() => (drawing.current = false)}
          >
            {pixels.map((v, i) => (
              <div
                key={i}
                onPointerDown={(e) => {
                  e.currentTarget.releasePointerCapture?.(e.pointerId);
                  paint(i);
                }}
                onPointerEnter={(e) => {
                  if (drawing.current || e.buttons === 1) paint(i);
                }}
                className="size-[19px] cursor-crosshair rounded-[2px]"
                style={{ backgroundColor: `rgba(236,237,242,${0.05 + v * 0.92})` }}
              />
            ))}
          </div>
          <p className="mt-1.5 text-center text-[10px] text-ink-faint">
            {GRID}×{GRID} pixels = the network&apos;s {N_INPUT} input neurons
          </p>
        </div>

        {/* Network diagram */}
        <div className="min-w-0">
          <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
            100 → 16 → 16 → 10
          </p>
          <svg
            viewBox={`0 0 ${NET_W} ${NET_H}`}
            className="w-full max-w-105 rounded-lg border border-line bg-void/70"
          >
            {/* edges h1→h2 and h2→out: real weights */}
            {net.weights[1].map((row, i) =>
              row.map((w, j) => (
                <line
                  key={`e1-${i}-${j}`}
                  x1={X_H1}
                  y1={neuronY(HIDDEN, i)}
                  x2={X_H2}
                  y2={neuronY(HIDDEN, j)}
                  stroke={w > 0 ? `rgba(${TEAL},1)` : `rgba(${ROSE},1)`}
                  strokeWidth={Math.min(2, Math.abs(w) * 1.6)}
                  opacity={
                    hovered?.layer === 2 && hovered.index === j
                      ? 0.85
                      : 0.04 + Math.min(0.3, Math.abs(w) * 0.22)
                  }
                />
              ))
            )}
            {net.weights[2].map((row, i) =>
              row.map((w, j) => (
                <line
                  key={`e2-${i}-${j}`}
                  x1={X_H2}
                  y1={neuronY(HIDDEN, i)}
                  x2={X_OUT}
                  y2={neuronY(N_CLASSES, j)}
                  stroke={w > 0 ? `rgba(${TEAL},1)` : `rgba(${ROSE},1)`}
                  strokeWidth={Math.min(2, Math.abs(w) * 1.6)}
                  opacity={0.04 + Math.min(0.3, Math.abs(w) * 0.22)}
                />
              ))
            )}

            {/* hidden layer 1 — hover to see its learned stencil */}
            {fwd.activations[1].map((a, i) => (
              <circle
                key={`h1-${i}`}
                cx={X_H1}
                cy={neuronY(HIDDEN, i)}
                r={8}
                fill={`rgba(${BLUE},${0.08 + (a / maxH1) * 0.85})`}
                stroke={
                  hovered?.layer === 1 && hovered.index === i
                    ? `rgb(${BLUE})`
                    : "rgba(255,255,255,0.25)"
                }
                strokeWidth={hovered?.layer === 1 && hovered.index === i ? 2 : 1}
                className="cursor-pointer"
                onMouseEnter={() => setHovered({ layer: 1, index: i })}
                onMouseLeave={() => setHovered(null)}
              />
            ))}
            {/* hidden layer 2 */}
            {fwd.activations[2].map((a, i) => (
              <circle
                key={`h2-${i}`}
                cx={X_H2}
                cy={neuronY(HIDDEN, i)}
                r={8}
                fill={`rgba(${BLUE},${0.08 + (a / maxH2) * 0.85})`}
                stroke={
                  hovered?.layer === 2 && hovered.index === i
                    ? `rgb(${BLUE})`
                    : "rgba(255,255,255,0.25)"
                }
                strokeWidth={hovered?.layer === 2 && hovered.index === i ? 2 : 1}
                className="cursor-pointer"
                onMouseEnter={() => setHovered({ layer: 2, index: i })}
                onMouseLeave={() => setHovered(null)}
              />
            ))}
            {/* output layer */}
            {probs.map((p, d) => (
              <g key={`out-${d}`}>
                <circle
                  cx={X_OUT}
                  cy={neuronY(N_CLASSES, d)}
                  r={9}
                  fill={`rgba(${TEAL},${0.08 + p * 0.9})`}
                  stroke={
                    hasInk && d === predicted ? `rgb(${TEAL})` : "rgba(255,255,255,0.25)"
                  }
                  strokeWidth={hasInk && d === predicted ? 2 : 1}
                />
                <text
                  x={X_OUT + 18}
                  y={neuronY(N_CLASSES, d) + 3.5}
                  fontSize={10}
                  fontFamily="var(--font-mono, monospace)"
                  fill={hasInk && d === predicted ? `rgb(${TEAL})` : "rgba(255,255,255,0.4)"}
                >
                  {d}
                </text>
              </g>
            ))}
            {/* layer labels */}
            <text x={X_H1} y={NET_H - 6} fontSize={8.5} fill="rgba(255,255,255,0.3)" textAnchor="middle">
              hidden 1
            </text>
            <text x={X_H2} y={NET_H - 6} fontSize={8.5} fill="rgba(255,255,255,0.3)" textAnchor="middle">
              hidden 2
            </text>
            <text x={X_OUT} y={NET_H - 6} fontSize={8.5} fill="rgba(255,255,255,0.3)" textAnchor="middle">
              output
            </text>
          </svg>
        </div>

        {/* Prediction + neuron stencil panel */}
        <div className="w-44 space-y-4">
          {hovered ? (
            <div>
              <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
                What this neuron looks for
              </p>
              {hovered.layer === 1 ? (
                <div
                  className="mx-auto grid w-fit gap-px rounded-lg border border-line bg-void/70 p-1.5"
                  style={{ gridTemplateColumns: `repeat(${GRID}, 12px)` }}
                >
                  {Array.from({ length: N_INPUT }, (_, px) => {
                    const w = net.weights[0][px][hovered.index];
                    const maxAbs = Math.max(
                      ...net.weights[0].map((r) => Math.abs(r[hovered.index])),
                      1e-6
                    );
                    const s = Math.abs(w) / maxAbs;
                    return (
                      <div
                        key={px}
                        className="size-3 rounded-[1.5px]"
                        style={{
                          backgroundColor:
                            w >= 0 ? `rgba(${TEAL},${s})` : `rgba(${ROSE},${s})`,
                        }}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="mx-auto grid w-fit grid-cols-8 gap-1 rounded-lg border border-line bg-void/70 p-2">
                  {net.weights[1].map((row, i) => {
                    const w = row[hovered.index];
                    const maxAbs = Math.max(
                      ...net.weights[1].map((r) => Math.abs(r[hovered.index])),
                      1e-6
                    );
                    return (
                      <div
                        key={i}
                        className="size-3.5 rounded-[2px]"
                        title={`from hidden-1 #${i + 1}: ${w.toFixed(2)}`}
                        style={{
                          backgroundColor:
                            w >= 0
                              ? `rgba(${TEAL},${Math.abs(w) / maxAbs})`
                              : `rgba(${ROSE},${Math.abs(w) / maxAbs})`,
                        }}
                      />
                    );
                  })}
                </div>
              )}
              <p className="mt-2 text-center text-[10px] leading-snug text-ink-faint">
                {hovered.layer === 1
                  ? "Its real learned weights over the canvas — teal pixels excite it, rose pixels inhibit it."
                  : "Its real weights from all 16 layer-1 neurons — it combines their stroke reports."}
              </p>
            </div>
          ) : (
            <div>
              <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
                The network says
              </p>
              <motion.p
                key={hasInk ? predicted : -1}
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center font-mono text-5xl font-bold text-ink"
              >
                {hasInk ? predicted : "·"}
              </motion.p>
              <div className="mt-3 space-y-1">
                {probs.map((p, d) => (
                  <div key={d} className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "w-3 font-mono text-[10px]",
                        hasInk && d === predicted ? "text-accent" : "text-ink-faint"
                      )}
                    >
                      {d}
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.05]">
                      <motion.div
                        animate={{ width: `${p * 100}%` }}
                        transition={{ type: "spring", stiffness: 200, damping: 26 }}
                        className={cn(
                          "h-full rounded-full",
                          hasInk && d === predicted
                            ? "bg-accent"
                            : "bg-gradient-to-r from-primary/70 to-accent/50"
                        )}
                      />
                    </div>
                    {mode === "advanced" && (
                      <span className="w-9 text-right font-mono text-[9px] text-ink-faint">
                        {(p * 100).toFixed(1)}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-2 flex items-center justify-center gap-1 text-center text-[10px] text-ink-faint">
                <Stamp className="size-3" />
                hover any neuron to see inside it
              </p>
            </div>
          )}
        </div>
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-ink-faint">
        100% real, in homage to 3Blue1Brown&apos;s “But what is a neural
        network?”: this is a genuine 100→16→16→10 network (the video&apos;s
        16-16 hidden architecture on a 10×10 canvas) trained in your browser
        with real mini-batch gradient descent. Neuron glow = actual
        activations from your ink; edge colors = actual signed weights; the
        hover stencils are the network&apos;s true learned first-layer weights.
      </p>
    </SimulatorShell>
  );
}
