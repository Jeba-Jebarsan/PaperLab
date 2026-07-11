"use client";

import * as React from "react";
import { Layers2 } from "lucide-react";
import {
  DIM,
  makeUpdateMatrix,
  topSvd,
  reconstruct,
  relativeError,
} from "@/lib/sim/lora";
import { SimulatorShell, type SimMode } from "../engine/simulator-shell";
import { Slider } from "@/components/ui/slider";

const TEAL = "79,209,197";
const ROSE = "242,125,152";

function MatrixHeatmap({
  matrix,
  title,
  maxAbs,
}: {
  matrix: number[][];
  title: string;
  maxAbs: number;
}) {
  return (
    <div>
      <p className="mb-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.15em] text-ink-faint">
        {title}
      </p>
      <div
        className="grid gap-px rounded-lg border border-line bg-void/70 p-1"
        style={{ gridTemplateColumns: `repeat(${DIM}, 6px)` }}
      >
        {matrix.flat().map((v, i) => {
          const s = Math.min(1, Math.abs(v) / maxAbs);
          return (
            <div
              key={i}
              className="size-1.5 rounded-[1px]"
              style={{
                backgroundColor: v >= 0 ? `rgba(${TEAL},${s})` : `rgba(${ROSE},${s})`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export function LoraLab() {
  const [mode, setMode] = React.useState<SimMode>("beginner");
  const [rank, setRank] = React.useState(2);

  const original = React.useMemo(() => makeUpdateMatrix(), []);
  const svd = React.useMemo(() => topSvd(original, 8), [original]);
  const approx = React.useMemo(() => reconstruct(svd, rank), [svd, rank]);
  const residual = React.useMemo(
    () =>
      original.map((row, i) => row.map((v, j) => v - approx[i][j])),
    [original, approx]
  );

  const error = relativeError(original, approx);
  const captured = Math.round((1 - error) * 100);
  const fullParams = DIM * DIM;
  const loraParams = 2 * DIM * rank;
  const maxAbs = Math.max(...original.flat().map(Math.abs));
  const maxSigma = Math.max(...svd.singularValues);

  const explanation =
    rank <= 2 && error > 0.15
      ? `Rank ${rank} uses only ${loraParams} numbers (${Math.round((loraParams / fullParams) * 100)}% of the full update) and already captures ${captured}% of the change. Look at the "difference" panel — mostly faint noise.`
      : error < 0.1
        ? `Rank ${rank}: ${captured}% of the full fine-tuning update captured with ${loraParams} of ${fullParams} numbers. This is LoRA's whole bet — weight updates have low intrinsic rank, so two skinny matrices (B·A) are enough. On GPT-3 this trick cut trainable parameters 10,000×.`
        : `Drag the rank up and watch the reconstruction sharpen. Each step adds one more σ·u·vᵀ layer — one more "direction of change" from the real SVD.`;

  const controls = (
    <div className="space-y-5">
      <Slider
        label="LoRA rank (r)"
        value={rank}
        min={1}
        max={8}
        step={1}
        onChange={setRank}
        hint="How many rank-1 layers the adapter B·A may use."
      />
      <div className="space-y-1.5 border-t border-line pt-4 font-mono text-[11px]">
        <p className="flex justify-between text-ink-faint">
          <span>full update</span>
          <span className="text-ink-dim">{fullParams} params</span>
        </p>
        <p className="flex justify-between text-ink-faint">
          <span>LoRA (r={rank})</span>
          <span className="text-primary-bright">{loraParams} params</span>
        </p>
        <p className="flex justify-between text-ink-faint">
          <span>update captured</span>
          <span className="text-accent">{captured}%</span>
        </p>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
            style={{ width: `${captured}%` }}
          />
        </div>
      </div>
      <p className="text-[11px] leading-snug text-ink-faint">
        In real LoRA the full update is never computed — the network learns
        the skinny B and A matrices directly. Here we compare against it to
        show how little is lost.
      </p>
    </div>
  );

  return (
    <SimulatorShell
      icon={Layers2}
      title="LoRA Lab: how much of a weight update is really there?"
      subtitle="A real SVD, sliced rank by rank"
      mode={mode}
      onModeChange={setMode}
      analogy="A photo that's secretly just 3 layered gradients: store the 3 layers instead of every pixel and you keep almost the whole picture at a fraction of the cost."
      explanation={explanation}
      controls={controls}
    >
      <div className="flex flex-wrap items-start justify-center gap-4">
        <MatrixHeatmap matrix={original} title="Full fine-tune ΔW" maxAbs={maxAbs} />
        <div className="self-center text-lg text-ink-faint">≈</div>
        <MatrixHeatmap matrix={approx} title={`LoRA rank ${rank} (B·A)`} maxAbs={maxAbs} />
        <div className="self-center text-lg text-ink-faint">+</div>
        <MatrixHeatmap matrix={residual} title="Difference (lost)" maxAbs={maxAbs} />
      </div>

      {/* real singular value spectrum */}
      <div className="mt-5 rounded-xl border border-line bg-void/70 p-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-ink-faint">
          The matrix&apos;s real singular values — its &quot;directions of change&quot;, strongest first
        </p>
        <div className="flex items-end gap-1.5" style={{ height: 72 }}>
          {svd.singularValues.map((s, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t-md transition-all duration-300"
                style={{
                  height: `${(s / maxSigma) * 58}px`,
                  backgroundColor:
                    i < rank ? `rgba(${TEAL},0.85)` : "rgba(255,255,255,0.12)",
                }}
                title={`σ${i + 1} = ${s.toFixed(3)}`}
              />
              <span
                className={
                  i < rank
                    ? "font-mono text-[9px] text-accent"
                    : "font-mono text-[9px] text-ink-faint"
                }
              >
                {mode === "advanced" ? s.toFixed(2) : `σ${i + 1}`}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[10px] leading-snug text-ink-faint">
          Teal bars = directions your rank-{rank} adapter keeps. After the
          first three, the values crash to a noise floor — the update was
          low-rank all along. That is the paper&apos;s &quot;low intrinsic rank&quot;
          hypothesis, visible.
        </p>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">
        The decomposition, reconstructions, error percentages, and singular
        values are all real (SVD via power iteration, computed live). The ΔW
        matrix itself is synthetic, built with the low intrinsic rank the
        paper measured in genuine fine-tuning updates.
      </p>
    </SimulatorShell>
  );
}
