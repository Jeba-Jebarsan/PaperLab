"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Network } from "lucide-react";
import {
  computeAttention,
  explainAttention,
  EXAMPLE_SENTENCES,
  HEAD_SPECS,
} from "@/lib/sim/attention";
import { SimulatorShell, type SimMode } from "../engine/simulator-shell";
import { Segmented } from "@/components/ui/segmented";
import { cn } from "@/lib/utils";

const HEAD_COUNTS = [1, 2, 4, 8];

export function AttentionSimulator() {
  const [mode, setMode] = React.useState<SimMode>("beginner");
  const [sentence, setSentence] = React.useState(EXAMPLE_SENTENCES[1]);
  const [customText, setCustomText] = React.useState("");
  const [numHeads, setNumHeads] = React.useState(4);
  const [headView, setHeadView] = React.useState<number | "all">("all");
  const [active, setActive] = React.useState<number | null>(null);
  const [hovered, setHovered] = React.useState<number | null>(null);
  const [playing, setPlaying] = React.useState(false);

  const result = React.useMemo(
    () => computeAttention(sentence, numHeads),
    [sentence, numHeads]
  );
  const n = result.tokens.length;
  const focusIndex = hovered ?? active;
  const matrix =
    headView === "all" || headView >= numHeads
      ? result.average
      : result.heads[headView];

  // Play mode: sweep the focus token
  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setActive((prev) => (prev === null ? 0 : (prev + 1) % n));
    }, 1400);
    return () => clearInterval(id);
  }, [playing, n]);

  // keep head view valid when head count shrinks
  React.useEffect(() => {
    if (headView !== "all" && headView >= numHeads) setHeadView("all");
  }, [numHeads, headView]);

  // ---- token position measurement for the connection lines ----
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const tokenRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const [positions, setPositions] = React.useState<{ x: number; y: number }[]>([]);
  const [canvasSize, setCanvasSize] = React.useState({ w: 0, h: 0 });

  const measure = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cRect = canvas.getBoundingClientRect();
    setCanvasSize({ w: cRect.width, h: cRect.height });
    setPositions(
      result.tokens.map((_, i) => {
        const el = tokenRefs.current[i];
        if (!el) return { x: 0, y: 0 };
        const r = el.getBoundingClientRect();
        return {
          x: r.left - cRect.left + r.width / 2,
          y: r.top - cRect.top + r.height,
        };
      })
    );
  }, [result.tokens]);

  React.useLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const explanation =
    focusIndex !== null
      ? explainAttention(result, focusIndex, headView === "all" ? "all" : headView)
      : playing
        ? "Watch the glowing word ask every other word for help. Thicker, brighter lines mean \"I'm listening to you more!\""
        : "Hover or tap any word. The lines show where that word is \"looking\" — this is attention, the paper's big idea.";

  const controls = (
    <div className="space-y-5">
      <div>
        <p className="mb-1.5 text-xs font-medium text-ink-dim">Sentence</p>
        <select
          value={EXAMPLE_SENTENCES.includes(sentence) ? sentence : "__custom"}
          onChange={(e) => {
            if (e.target.value !== "__custom") {
              setSentence(e.target.value);
              setActive(null);
            }
          }}
          className="w-full rounded-lg border border-line bg-raised px-2.5 py-2 text-xs text-ink focus:outline-none focus:border-primary/50"
        >
          {EXAMPLE_SENTENCES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
          {!EXAMPLE_SENTENCES.includes(sentence) && (
            <option value="__custom">Custom: {sentence}</option>
          )}
        </select>
        <div className="mt-2 flex gap-1.5">
          <input
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Or type your own…"
            className="min-w-0 flex-1 rounded-lg border border-line bg-raised px-2.5 py-1.5 text-xs text-ink placeholder:text-ink-faint focus:outline-none focus:border-primary/50"
            onKeyDown={(e) => {
              if (e.key === "Enter" && customText.trim()) {
                setSentence(customText.trim());
                setActive(null);
              }
            }}
          />
          <button
            onClick={() => {
              if (customText.trim()) {
                setSentence(customText.trim());
                setActive(null);
              }
            }}
            className="rounded-lg border border-line px-2.5 text-xs text-ink-dim hover:text-ink hover:border-line-strong cursor-pointer"
          >
            Go
          </button>
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-medium text-ink-dim">Attention heads</p>
        <Segmented
          size="sm"
          options={HEAD_COUNTS.map((c) => ({ label: String(c), value: c }))}
          value={numHeads}
          onChange={(v) => setNumHeads(v as number)}
          className="w-full justify-between"
        />
        <p className="mt-1.5 text-[11px] leading-snug text-ink-faint">
          More heads = more relationship types tracked in parallel.
        </p>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-medium text-ink-dim">View head</p>
        <select
          value={String(headView)}
          onChange={(e) =>
            setHeadView(e.target.value === "all" ? "all" : Number(e.target.value))
          }
          className="w-full rounded-lg border border-line bg-raised px-2.5 py-2 text-xs text-ink focus:outline-none focus:border-primary/50"
        >
          <option value="all">All heads (averaged)</option>
          {Array.from({ length: numHeads }, (_, h) => (
            <option key={h} value={h}>
              Head {h + 1} — {HEAD_SPECS[h % HEAD_SPECS.length].name}
            </option>
          ))}
        </select>
        {headView !== "all" && (
          <p className="mt-1.5 text-[11px] leading-snug text-ink-faint">
            {HEAD_SPECS[headView % HEAD_SPECS.length].description}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <SimulatorShell
      icon={Network}
      title="Self-Attention Lab"
      subtitle="Every word attends to every other word — see it happen"
      mode={mode}
      onModeChange={setMode}
      analogy="A classroom where every student can listen to every other student at the same time — and each decides who is worth listening to."
      explanation={explanation}
      transport={{
        playing,
        onPlayPause: () => setPlaying((p) => !p),
        onReset: () => {
          setPlaying(false);
          setActive(null);
          setHovered(null);
        },
      }}
      controls={controls}
    >
      {/* Token canvas with attention lines */}
      <div
        ref={canvasRef}
        className="relative rounded-xl border border-line bg-void/60 px-4 pt-6 pb-24 min-h-44"
      >
        {/* idle hint */}
        {focusIndex === null && !playing && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="pointer-events-none absolute inset-x-0 bottom-6 text-center text-xs text-ink-faint"
          >
            <span className="inline-block animate-bounce">👆</span> touch a word to
            see its attention
          </motion.p>
        )}

        <div className="relative z-10 flex flex-wrap justify-center gap-2">
          {result.tokens.map((token, i) => {
            const isFocus = focusIndex === i;
            const incoming =
              focusIndex !== null && !isFocus ? matrix[focusIndex][i] : 0;
            return (
              <motion.button
                key={`${token}-${i}`}
                ref={(el) => {
                  tokenRefs.current[i] = el;
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setActive((a) => (a === i ? null : i))}
                animate={
                  isFocus
                    ? { scale: 1.12, y: -3 }
                    : { scale: 1 + incoming * 0.12, y: 0 }
                }
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn(
                  "rounded-lg border px-3 py-1.5 font-mono text-sm transition-colors duration-200 cursor-pointer",
                  isFocus
                    ? "border-primary bg-primary/25 text-ink shadow-[0_0_20px_-4px_rgba(59,130,246,0.9)]"
                    : focusIndex !== null
                      ? "border-line text-ink-dim"
                      : "border-line bg-white/[0.03] text-ink-dim hover:border-primary/40 hover:text-ink"
                )}
                style={
                  !isFocus && focusIndex !== null
                    ? {
                        backgroundColor: `rgba(79, 209, 197, ${incoming * 0.55})`,
                        borderColor: `rgba(79, 209, 197, ${Math.min(0.9, incoming * 1.2)})`,
                      }
                    : undefined
                }
              >
                {token}
                {mode === "advanced" && focusIndex !== null && !isFocus && (
                  <span className="ml-1.5 text-[10px] text-accent">
                    {Math.round(incoming * 100)}%
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Attention arcs with flowing information particles */}
        <svg
          className="pointer-events-none absolute inset-0 z-0"
          width={canvasSize.w}
          height={canvasSize.h}
        >
          <defs>
            <linearGradient id="attn-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#4fd1c5" />
            </linearGradient>
          </defs>
          {focusIndex !== null &&
            positions.length === n &&
            positions.map((pos, j) => {
              if (j === focusIndex) return null;
              const from = positions[focusIndex];
              const w = matrix[focusIndex][j];
              if (w < 0.03) return null;
              const midY =
                Math.max(from.y, pos.y) + 24 + Math.abs(from.x - pos.x) * 0.18;
              const d = `M ${pos.x} ${pos.y} Q ${(from.x + pos.x) / 2} ${midY} ${from.x} ${from.y}`;
              return (
                <g key={`${focusIndex}-${j}-${sentence}-${String(headView)}`}>
                  <motion.path
                    d={d}
                    fill="none"
                    stroke="url(#attn-grad)"
                    strokeWidth={Math.max(1, w * 9)}
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.25 + w * 0.75 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  />
                  {/* information particle flowing from the attended word back to the focus word */}
                  {w > 0.1 && (
                    <circle r={Math.max(2, w * 5)} fill="#4fd1c5" opacity={0.9}>
                      <animateMotion
                        dur={`${1.6 - w * 0.8}s`}
                        repeatCount="indefinite"
                        path={d}
                      />
                    </circle>
                  )}
                </g>
              );
            })}
        </svg>
      </div>

      {/* Heatmap (advanced) */}
      {mode === "advanced" && (
        <div className="mt-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
            Attention matrix — rows attend to columns
          </p>
          <div className="overflow-x-auto">
            <div
              className="grid gap-px"
              style={{
                gridTemplateColumns: `72px repeat(${n}, minmax(28px, 1fr))`,
                minWidth: n * 32 + 72,
              }}
            >
              <div />
              {result.tokens.map((t, j) => (
                <div
                  key={`col-${j}`}
                  className="truncate px-0.5 pb-1 text-center font-mono text-[9px] text-ink-faint"
                  title={t}
                >
                  {t}
                </div>
              ))}
              {result.tokens.map((rowTok, i) => (
                <React.Fragment key={`row-${i}`}>
                  <div
                    className="truncate pr-2 text-right font-mono text-[10px] leading-7 text-ink-faint"
                    title={rowTok}
                  >
                    {rowTok}
                  </div>
                  {result.tokens.map((_, j) => {
                    const w = matrix[i][j];
                    return (
                      <div
                        key={`cell-${i}-${j}`}
                        onMouseEnter={() => setHovered(i)}
                        onMouseLeave={() => setHovered(null)}
                        className={cn(
                          "h-7 rounded-[3px] transition-colors",
                          focusIndex === i && "ring-1 ring-primary/60"
                        )}
                        style={{ backgroundColor: `rgba(59, 130, 246, ${w})` }}
                        title={`${rowTok} → ${result.tokens[j]}: ${(w * 100).toFixed(1)}%`}
                      />
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">
        Note: these attention patterns are an illustration modeled on head
        behaviors observed in trained Transformers (previous-word heads,
        coreference heads, …) — not the output of a live model. The equations
        and mechanism shown are exactly those of the paper.
      </p>
    </SimulatorShell>
  );
}
