"use client";

import * as React from "react";
import { Swords } from "lucide-react";
import {
  createGan,
  trainGanSteps,
  generate,
  discriminate,
  histogram,
  realSamples,
  TARGETS,
  type Gan,
  type TargetId,
} from "@/lib/sim/gan";
import { SimulatorShell, type SimMode } from "../engine/simulator-shell";
import { Slider } from "@/components/ui/slider";
import { Segmented } from "@/components/ui/segmented";

const W = 560;
const H = 230;
const BINS = 30;
const TEAL = "79,209,197";
const AMBER = "240,184,102";

export function GanLab() {
  const [mode, setMode] = React.useState<SimMode>("beginner");
  const [target, setTarget] = React.useState<TargetId>("two-hills");
  const [lrD, setLrD] = React.useState(0.08);
  const [lrG, setLrG] = React.useState(0.05);
  const [playing, setPlaying] = React.useState(false);
  const [steps, setSteps] = React.useState(0);
  const [, setTick] = React.useState(0);

  const ganRef = React.useRef<Gan>(createGan(target));
  const realHistRef = React.useRef<number[]>(histogram(realSamples(ganRef.current, 3000)));

  const reset = React.useCallback(() => {
    ganRef.current = createGan(target);
    realHistRef.current = histogram(realSamples(ganRef.current, 3000));
    setSteps(0);
    setPlaying(false);
    setTick((t) => t + 1);
  }, [target]);

  React.useEffect(() => {
    reset();
  }, [target, reset]);

  const runSteps = React.useCallback(
    (rounds: number) => {
      trainGanSteps(ganRef.current, rounds, lrD, lrG);
      setSteps(ganRef.current.steps);
      setTick((t) => t + 1);
    },
    [lrD, lrG]
  );

  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => runSteps(25), 120);
    return () => clearInterval(id);
  }, [playing, runSteps]);

  React.useEffect(() => {
    if (playing && steps > 5000) setPlaying(false);
  }, [playing, steps]);

  const gan = ganRef.current;
  const fakeSamples = React.useMemo(
    () => generate(gan, 600),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [steps, target]
  );
  const fakeHist = histogram(fakeSamples);
  const realHist = realHistRef.current;

  // real discriminator curve
  const dCurve = React.useMemo(() => {
    const pts: { x: number; p: number }[] = [];
    for (let i = 0; i <= 60; i++) {
      const x = -3 + (i / 60) * 6;
      pts.push({ x, p: discriminate(gan, x) });
    }
    return pts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps, target]);

  // mode coverage for narration (real measurement)
  const leftShare =
    fakeSamples.filter((x) => x < 0).length / Math.max(1, fakeSamples.length);
  const overlap =
    realHist.reduce((s, r, i) => s + Math.min(r, fakeHist[i]), 0) /
    realHist.reduce((s, r) => s + r, 0);

  const collapsed =
    target === "two-hills" && steps > 800 && (leftShare < 0.08 || leftShare > 0.92);

  const explanation =
    steps === 0
      ? "Two networks, one duel: the forger (teal) turns random noise into samples; the detective (white curve) rates every point — 1 means 'looks real'. Press play to start the arms race."
      : collapsed
        ? `Mode collapse — a real, famous GAN failure! The forger is producing only ${leftShare < 0.08 ? "the right" : "the left"} hill and ignoring the other. It found one thing that fools the detective and got lazy. Try a higher detective learning rate, or reset.`
        : overlap > 0.75
          ? `After ${steps} rounds the forgeries cover ${Math.round(overlap * 100)}% of the real distribution, and the detective's curve is flattening toward 0.5 — it can no longer tell real from fake. That's the equilibrium the paper proves optimal.`
          : `Round ${steps}: the forger currently fools ${Math.round(overlap * 100)}% of the target shape. Watch the detective's curve dip where fakes cluster — and the forger then chase the regions the detective still trusts.`;

  const controls = (
    <div className="space-y-5">
      <div>
        <p className="mb-1.5 text-xs font-medium text-ink-dim">Real data shape</p>
        <Segmented
          size="sm"
          options={TARGETS.map((t) => ({ label: t.name, value: t.id }))}
          value={target}
          onChange={(v) => setTarget(v as TargetId)}
        />
        <p className="mt-1.5 text-[11px] leading-snug text-ink-faint">
          {TARGETS.find((t) => t.id === target)!.hint}
        </p>
      </div>
      <Slider
        label="Detective learning rate"
        value={lrD}
        min={0.01}
        max={0.2}
        step={0.01}
        onChange={setLrD}
        format={(v) => v.toFixed(2)}
        hint="Too weak a detective lets the forger get away with one trick (mode collapse)."
      />
      <Slider
        label="Forger learning rate"
        value={lrG}
        min={0.01}
        max={0.2}
        step={0.01}
        onChange={setLrG}
        format={(v) => v.toFixed(2)}
        hint="The forger only ever learns from the detective's reactions."
      />
      <div className="space-y-1.5 border-t border-line pt-4 font-mono text-[11px]">
        <p className="flex justify-between text-ink-faint">
          <span>duel rounds</span>
          <span className="text-ink-dim">{steps}</span>
        </p>
        <p className="flex justify-between text-ink-faint">
          <span>distribution overlap</span>
          <span className="text-accent">{Math.round(overlap * 100)}%</span>
        </p>
      </div>
    </div>
  );

  return (
    <SimulatorShell
      icon={Swords}
      title="GAN Lab: forger vs detective"
      subtitle="Two real networks in a live adversarial duel"
      mode={mode}
      onModeChange={setMode}
      analogy="A counterfeiter and an art detective training each other: every caught fake teaches the counterfeiter, every convincing fake sharpens the detective — until the fakes are indistinguishable."
      explanation={explanation}
      transport={{
        playing,
        onPlayPause: () => setPlaying((p) => !p),
        onStep: () => runSteps(25),
        onReset: reset,
      }}
      controls={controls}
    >
      <div className="rounded-xl border border-line bg-void/70 p-2">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
          {/* real distribution (amber, hollow) */}
          {realHist.map((h, i) => (
            <rect
              key={`r-${i}`}
              x={(i / BINS) * W + 1}
              y={H - 24 - h * (H - 60)}
              width={W / BINS - 2}
              height={h * (H - 60)}
              fill="none"
              stroke={`rgba(${AMBER},0.75)`}
              strokeWidth={1.25}
              rx={2}
            />
          ))}
          {/* generated distribution (teal, filled) */}
          {fakeHist.map((h, i) => (
            <rect
              key={`f-${i}`}
              x={(i / BINS) * W + 1}
              y={H - 24 - h * (H - 60)}
              width={W / BINS - 2}
              height={h * (H - 60)}
              fill={`rgba(${TEAL},0.45)`}
              rx={2}
            />
          ))}
          {/* discriminator curve */}
          <polyline
            fill="none"
            stroke="rgba(236,237,242,0.85)"
            strokeWidth={1.75}
            strokeDasharray="1 0"
            points={dCurve
              .map(
                (pt) =>
                  `${(((pt.x + 3) / 6) * W).toFixed(1)},${(H - 24 - pt.p * (H - 60)).toFixed(1)}`
              )
              .join(" ")}
          />
          {/* D = 0.5 reference */}
          <line
            x1={0}
            x2={W}
            y1={H - 24 - 0.5 * (H - 60)}
            y2={H - 24 - 0.5 * (H - 60)}
            stroke="rgba(255,255,255,0.15)"
            strokeDasharray="4 4"
          />
          <text x={6} y={H - 27 - 0.5 * (H - 60)} fontSize={8.5} fill="rgba(255,255,255,0.35)">
            detective unsure (0.5)
          </text>
          {/* legend */}
          <g transform={`translate(${W - 190}, 12)`} fontSize={9}>
            <rect width={10} height={10} fill="none" stroke={`rgba(${AMBER},0.8)`} rx={2} />
            <text x={14} y={9} fill="rgba(255,255,255,0.5)">real data</text>
            <rect x={72} width={10} height={10} fill={`rgba(${TEAL},0.45)`} rx={2} />
            <text x={86} y={9} fill="rgba(255,255,255,0.5)">forgeries</text>
            <line x1={148} y1={5} x2={162} y2={5} stroke="rgba(236,237,242,0.85)" strokeWidth={1.75} />
            <text x={166} y={9} fill="rgba(255,255,255,0.5)">D(x)</text>
          </g>
        </svg>
      </div>

      {mode === "advanced" && (
        <p className="mt-3 rounded-xl border border-line bg-void/60 p-3 font-mono text-[11px] leading-relaxed text-ink-dim">
          G: noise z∼U(−1,1) → MLP(1–12–12–1) → sample. D: MLP(1–12–12–1) →
          sigmoid. D trains on BCE (real=1, fake=0); G trains on the
          non-saturating loss max log D(G(z)) — its gradients flow through the
          frozen detective, exactly as in the paper.
        </p>
      )}

      <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">
        100% real: both networks train live with true backpropagation —
        generator gradients genuinely flow through the discriminator. The
        instabilities you can trigger (oscillation, mode collapse) are the
        same ones that made GANs famously hard to train.
      </p>
    </SimulatorShell>
  );
}
