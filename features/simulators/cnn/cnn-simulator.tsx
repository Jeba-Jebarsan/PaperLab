"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Grid3x3, ArrowRight } from "lucide-react";
import {
  INPUT_IMAGES,
  KERNEL_PRESETS,
  convolve,
} from "@/lib/sim/convolution";
import { SimulatorShell, type SimMode } from "../engine/simulator-shell";
import { Segmented } from "@/components/ui/segmented";
import { cn } from "@/lib/utils";

export function CnnSimulator() {
  const [mode, setMode] = React.useState<SimMode>("beginner");
  const [imageId, setImageId] = React.useState(INPUT_IMAGES[0].id);
  const [kernelId, setKernelId] = React.useState(KERNEL_PRESETS[0].id);
  const [stride, setStride] = React.useState(1);
  const [padding, setPadding] = React.useState(false);
  const [step, setStep] = React.useState(-1); // -1 = show everything
  const [playing, setPlaying] = React.useState(false);

  const image = INPUT_IMAGES.find((i) => i.id === imageId)!;
  const preset = KERNEL_PRESETS.find((k) => k.id === kernelId)!;

  const result = React.useMemo(
    () => convolve(image.pixels, preset.kernel, stride, padding),
    [image, preset, stride, padding]
  );
  const totalSteps = result.outH * result.outW;

  // reset animation when inputs change
  React.useEffect(() => {
    setStep(-1);
    setPlaying(false);
  }, [imageId, kernelId, stride, padding]);

  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setStep((s) => {
        if (s >= totalSteps - 1) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 70);
    return () => clearInterval(id);
  }, [playing, totalSteps]);

  const animating = step >= 0 && step < totalSteps;
  const curRow = animating ? Math.floor(step / result.outW) : -1;
  const curCol = animating ? step % result.outW : -1;
  const origin = animating ? result.windowOrigin(curRow, curCol) : null;
  const k = preset.kernel.length;

  const paddedH = result.padded.length;
  const paddedW = result.padded[0].length;

  const explanation = animating
    ? `The ${k}×${k} filter is sliding across the picture (step ${step + 1}/${totalSteps}). At each stop it multiplies the ${k * k} pixels under it by its numbers, adds them up, and writes one pixel of the new image. ${preset.story}`
    : step >= totalSteps - 1 && step !== -1
      ? `Done! The feature map on the right shows where the filter "found" its pattern. Bright = strong match. ${preset.story}`
      : `${preset.story} Press play to watch the filter scan the image — this exact multiply-and-add is what every CNN layer does, millions of times.`;

  const controls = (
    <div className="space-y-5">
      <div>
        <p className="mb-1.5 text-xs font-medium text-ink-dim">Picture</p>
        <Segmented
          size="sm"
          options={INPUT_IMAGES.map((i) => ({ label: i.name, value: i.id }))}
          value={imageId}
          onChange={(v) => setImageId(v as string)}
          className="w-full justify-between"
        />
      </div>

      <div>
        <p className="mb-1.5 text-xs font-medium text-ink-dim">Filter (kernel)</p>
        <select
          value={kernelId}
          onChange={(e) => setKernelId(e.target.value)}
          className="w-full rounded-lg border border-line bg-raised px-2.5 py-2 text-xs text-ink focus:outline-none focus:border-primary/50"
        >
          {KERNEL_PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* kernel weights */}
        <div className="mt-2 grid w-fit grid-cols-3 gap-0.5">
          {preset.kernel.flat().map((v, i) => (
            <div
              key={i}
              className={cn(
                "grid size-8 place-items-center rounded font-mono text-[10px]",
                v > 0
                  ? "bg-accent/20 text-accent"
                  : v < 0
                    ? "bg-rose/20 text-rose"
                    : "bg-white/5 text-ink-faint"
              )}
            >
              {Number.isInteger(v) ? v : v.toFixed(2).replace("0.", ".")}
            </div>
          ))}
        </div>
        <p className="mt-1.5 text-[11px] leading-snug text-ink-faint">
          Green = add this pixel, red = subtract it.
        </p>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-medium text-ink-dim">Stride (step size)</p>
        <Segmented
          size="sm"
          options={[
            { label: "1", value: 1 },
            { label: "2", value: 2 },
          ]}
          value={stride}
          onChange={(v) => setStride(v as number)}
        />
        <p className="mt-1.5 text-[11px] leading-snug text-ink-faint">
          Stride 2 hops two pixels at a time — output shrinks to {""}
          {convolve(image.pixels, preset.kernel, 2, padding).outW}×
          {convolve(image.pixels, preset.kernel, 2, padding).outH}.
        </p>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-medium text-ink-dim">Padding</p>
        <Segmented
          size="sm"
          options={[
            { label: "Off", value: 0 },
            { label: "On", value: 1 },
          ]}
          value={padding ? 1 : 0}
          onChange={(v) => setPadding(v === 1)}
        />
        <p className="mt-1.5 text-[11px] leading-snug text-ink-faint">
          Adds a border of zeros so edge pixels get scanned too — output stays{" "}
          the same size.
        </p>
      </div>
    </div>
  );

  return (
    <SimulatorShell
      icon={Grid3x3}
      title="CNN Convolution Lab"
      subtitle="How computers see: a tiny magnifying glass scanning a picture"
      mode={mode}
      onModeChange={setMode}
      analogy="Sliding a small stencil over a photo and asking at every spot: how much does this patch look like my pattern?"
      explanation={explanation}
      transport={{
        playing,
        onPlayPause: () => {
          if (step >= totalSteps - 1) setStep(-1);
          setPlaying((p) => !p);
          if (step === -1) setStep(0);
        },
        onStep: () => setStep((s) => Math.min(s + 1, totalSteps - 1)),
        onReset: () => {
          setPlaying(false);
          setStep(-1);
        },
      }}
      controls={controls}
    >
      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5">
        {/* Input image with sliding window */}
        <div>
          <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
            Input {padding && <span className="text-primary-bright">(padded)</span>}
          </p>
          <div
            className="relative grid gap-px rounded-lg border border-line bg-void/70 p-1.5"
            style={{ gridTemplateColumns: `repeat(${paddedW}, 14px)` }}
          >
            {result.padded.map((row, r) =>
              row.map((v, c) => {
                const inWindow =
                  origin !== null &&
                  r >= origin.r &&
                  r < origin.r + k &&
                  c >= origin.c &&
                  c < origin.c + k;
                const isPad =
                  padding &&
                  (r < result.pad ||
                    c < result.pad ||
                    r >= paddedH - result.pad ||
                    c >= paddedW - result.pad);
                return (
                  <div
                    key={`${r}-${c}`}
                    className={cn(
                      "size-3.5 rounded-[2px] transition-shadow",
                      inWindow && "ring-2 ring-amber z-10",
                      isPad && "opacity-40"
                    )}
                    style={{
                      backgroundColor: `rgba(236,237,242,${0.06 + v * 0.9})`,
                    }}
                  />
                );
              })
            )}
            {/* sliding window frame */}
            {origin !== null && (
              <motion.div
                className="pointer-events-none absolute rounded-[3px] border-2 border-amber shadow-[0_0_14px_rgba(240,184,102,0.6)]"
                animate={{
                  left: 6 + origin.c * 15,
                  top: 6 + origin.r * 15,
                }}
                transition={{ duration: 0.06, ease: "linear" }}
                style={{ width: k * 15 - 1, height: k * 15 - 1 }}
              />
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 text-ink-faint">
          <ArrowRight className="size-5" />
          <span className="font-mono text-[10px]">{preset.name.split(" ")[0]}</span>
        </div>

        {/* Output feature map */}
        <div>
          <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
            Feature map ({result.outW}×{result.outH})
          </p>
          <div
            className="grid gap-px rounded-lg border border-line bg-void/70 p-1.5"
            style={{ gridTemplateColumns: `repeat(${result.outW}, 14px)` }}
          >
            {result.display.map((row, r) =>
              row.map((v, c) => {
                const idx = r * result.outW + c;
                const revealed = step === -1 || idx <= step;
                const isCurrent = animating && idx === step;
                return (
                  <motion.div
                    key={`${r}-${c}`}
                    className={cn(
                      "size-3.5 rounded-[2px]",
                      isCurrent && "ring-2 ring-amber"
                    )}
                    animate={{
                      backgroundColor: revealed
                        ? `rgba(79,209,197,${0.05 + v * 0.95})`
                        : "rgba(255,255,255,0.03)",
                      scale: isCurrent ? 1.35 : 1,
                    }}
                    transition={{ duration: 0.12 }}
                    title={
                      mode === "advanced"
                        ? `value: ${result.values[r][c].toFixed(2)}`
                        : undefined
                    }
                  />
                );
              })
            )}
          </div>
        </div>
      </div>

      {mode === "advanced" && animating && origin !== null && (
        <div className="mt-4 rounded-xl border border-line bg-void/60 p-3 text-center font-mono text-xs text-ink-dim">
          output[{curRow}][{curCol}] ={" "}
          {preset.kernel
            .flat()
            .map(
              (kv, i) =>
                `${kv < 0 ? "−" : i > 0 ? "+" : ""}${Math.abs(kv) % 1 === 0 ? Math.abs(kv) : Math.abs(kv).toFixed(2)}×${result.padded[
                  origin.r + Math.floor(i / k)
                ][origin.c + (i % k)].toFixed(1)}`
            )
            .join(" ")}{" "}
          = <span className="text-accent">{result.values[curRow][curCol].toFixed(2)}</span>
        </div>
      )}
    </SimulatorShell>
  );
}
