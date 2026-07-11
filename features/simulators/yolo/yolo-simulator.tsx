"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ScanSearch } from "lucide-react";
import {
  CANDIDATES,
  filterDetections,
  explainResult,
  SCENE_W,
  SCENE_H,
  type Detection,
} from "@/lib/sim/yolo";
import { SimulatorShell, type SimMode } from "../engine/simulator-shell";
import { Slider } from "@/components/ui/slider";
import { Segmented } from "@/components/ui/segmented";

const CLASS_COLORS: Record<string, string> = {
  car: "#60a5fa",
  person: "#f0b866",
  dog: "#4fd1c5",
  cat: "#f27d98",
};

function Scene() {
  return (
    <g>
      {/* sky + ground */}
      <rect width={SCENE_W} height={SCENE_H} fill="#0d1420" />
      <rect y={210} width={SCENE_W} height={90} fill="#141a26" />
      <line x1="0" y1="210" x2={SCENE_W} y2="210" stroke="rgba(255,255,255,0.12)" />
      {/* road markings */}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={20 + i * 100} y={252} width={44} height={4} rx={2} fill="rgba(255,255,255,0.12)" />
      ))}
      {/* moon */}
      <circle cx={430} cy={40} r={16} fill="rgba(236,237,242,0.35)" />
      {/* tree */}
      <rect x={408} y={140} width={10} height={70} fill="#2a2118" />
      <circle cx={413} cy={116} r={34} fill="#16281e" />
      <circle cx={393} cy={132} r={22} fill="#16281e" />
      <circle cx={434} cy={132} r={22} fill="#16281e" />
      {/* car */}
      <g>
        <rect x={258} y={190} width={144} height={38} rx={9} fill="#22304a" />
        <path d="M 282 192 L 296 170 L 364 170 L 380 192 Z" fill="#22304a" />
        <rect x={300} y={174} width={26} height={16} rx={3} fill="rgba(160,200,255,0.28)" />
        <rect x={332} y={174} width={26} height={16} rx={3} fill="rgba(160,200,255,0.28)" />
        <circle cx={288} cy={230} r={13} fill="#0a0d14" stroke="#333d52" strokeWidth={3} />
        <circle cx={372} cy={230} r={13} fill="#0a0d14" stroke="#333d52" strokeWidth={3} />
        <rect x={396} y={202} width={7} height={6} rx={2} fill="#f0b866" />
      </g>
      {/* person */}
      <g>
        <circle cx={119} cy={144} r={12} fill="#3a3346" />
        <rect x={108} y={158} width={22} height={40} rx={8} fill="#443c52" />
        <rect x={110} y={198} width={8} height={42} rx={4} fill="#3a3346" />
        <rect x={121} y={198} width={8} height={42} rx={4} fill="#3a3346" />
        <rect x={102} y={162} width={7} height={30} rx={3.5} fill="#3a3346" />
        <rect x={130} y={162} width={7} height={30} rx={3.5} fill="#3a3346" />
      </g>
      {/* dog */}
      <g>
        <rect x={178} y={214} width={34} height={18} rx={8} fill="#4a3b2a" />
        <circle cx={212} cy={214} r={9} fill="#4a3b2a" />
        <path d="M 206 208 L 210 200 L 214 208 Z" fill="#4a3b2a" />
        <rect x={180} y={230} width={5} height={12} rx={2} fill="#3c3022" />
        <rect x={202} y={230} width={5} height={12} rx={2} fill="#3c3022" />
        <path d="M 178 218 Q 168 212 170 204" stroke="#4a3b2a" strokeWidth={4} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
}

function BoxOverlay({
  det,
  variant,
}: {
  det: Detection;
  variant: "kept" | "suppressed" | "belowConf";
}) {
  const color = CLASS_COLORS[det.label] ?? "#9a9cae";
  const kept = variant === "kept";
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: kept ? 1 : 0.55, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.25 }}
      style={{ transformOrigin: `${det.x + det.w / 2}px ${det.y + det.h / 2}px` }}
    >
      <rect
        x={det.x}
        y={det.y}
        width={det.w}
        height={det.h}
        fill={kept ? `${color}14` : "transparent"}
        stroke={kept ? color : variant === "suppressed" ? "#f27d98" : "rgba(255,255,255,0.3)"}
        strokeWidth={kept ? 2 : 1.25}
        strokeDasharray={kept ? undefined : "5 4"}
        rx={4}
      />
      <g>
        <rect
          x={det.x}
          y={det.y - 16}
          width={det.label.length * 7 + 40}
          height={15}
          rx={3}
          fill={kept ? color : "rgba(20,22,32,0.85)"}
        />
        <text
          x={det.x + 5}
          y={det.y - 4.5}
          fontSize={10}
          fontFamily="var(--font-mono, monospace)"
          fill={kept ? "#05050a" : "rgba(255,255,255,0.55)"}
        >
          {det.label} {Math.round(det.confidence * 100)}%
        </text>
      </g>
    </motion.g>
  );
}

export function YoloSimulator() {
  const [mode, setMode] = React.useState<SimMode>("beginner");
  const [conf, setConf] = React.useState(0.5);
  const [iouThr, setIouThr] = React.useState(0.45);
  const [showRemoved, setShowRemoved] = React.useState(false);

  const result = React.useMemo(
    () => filterDetections(CANDIDATES, conf, iouThr),
    [conf, iouThr]
  );

  const explanation = explainResult(result, conf, iouThr);
  const displayRemoved = mode === "advanced" || showRemoved;

  const controls = (
    <div className="space-y-5">
      <Slider
        label="Confidence threshold"
        value={conf}
        min={0.05}
        max={0.95}
        step={0.05}
        onChange={setConf}
        format={(v) => `${Math.round(v * 100)}%`}
        hint="How sure must the model be before it reports an object?"
      />
      <Slider
        label="IoU threshold (NMS)"
        value={iouThr}
        min={0.1}
        max={0.9}
        step={0.05}
        onChange={setIouThr}
        format={(v) => v.toFixed(2)}
        hint="How much may two boxes overlap before one is deleted as a duplicate?"
      />
      <div>
        <p className="mb-1.5 text-xs font-medium text-ink-dim">Show removed boxes</p>
        <Segmented
          size="sm"
          options={[
            { label: "Hide", value: 0 },
            { label: "Show", value: 1 },
          ]}
          value={displayRemoved ? 1 : 0}
          onChange={(v) => setShowRemoved(v === 1)}
        />
        <p className="mt-1.5 text-[11px] leading-snug text-ink-faint">
          Dashed red = deleted duplicate. Dashed grey = below confidence.
        </p>
      </div>

      {/* live pipeline stats */}
      <div className="space-y-1.5 border-t border-line pt-4 font-mono text-[11px]">
        <p className="flex justify-between text-ink-faint">
          <span>candidate boxes</span>
          <span className="text-ink-dim">{CANDIDATES.length}</span>
        </p>
        <p className="flex justify-between text-ink-faint">
          <span>after confidence</span>
          <span className="text-ink-dim">
            {CANDIDATES.length - result.belowConfidence.length}
          </span>
        </p>
        <p className="flex justify-between text-ink-faint">
          <span>after NMS</span>
          <span className="text-accent">{result.kept.length}</span>
        </p>
      </div>
    </div>
  );

  return (
    <SimulatorShell
      icon={ScanSearch}
      title="YOLO Detection Lab"
      subtitle="One glance, every object — then keep only the best guesses"
      mode={mode}
      onModeChange={setMode}
      analogy="The model shouts out everything it thinks it sees, each with a confidence score. Your sliders decide which shouts to trust and which duplicate shouts to merge."
      explanation={explanation}
      controls={controls}
    >
      <div className="overflow-hidden rounded-xl border border-line">
        <svg viewBox={`0 0 ${SCENE_W} ${SCENE_H}`} className="w-full">
          <Scene />
          <AnimatePresence>
            {displayRemoved &&
              result.belowConfidence.map((d) => (
                <BoxOverlay key={d.id} det={d} variant="belowConf" />
              ))}
            {displayRemoved &&
              result.suppressed.map(({ det }) => (
                <BoxOverlay key={det.id} det={det} variant="suppressed" />
              ))}
            {result.kept.map((d) => (
              <BoxOverlay key={d.id} det={d} variant="kept" />
            ))}
          </AnimatePresence>
        </svg>
      </div>

      {mode === "advanced" && result.suppressed.length > 0 && (
        <div className="mt-4 rounded-xl border border-line bg-void/60 p-3 font-mono text-[11px] text-ink-dim">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
            NMS decisions
          </p>
          {result.suppressed.map(({ det, by, overlap }) => (
            <p key={det.id}>
              {det.label} {Math.round(det.confidence * 100)}% suppressed by{" "}
              {by.label} {Math.round(by.confidence * 100)}% (IoU{" "}
              {overlap.toFixed(2)} &gt; {iouThr.toFixed(2)})
            </p>
          ))}
        </div>
      )}

      <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">
        Note: the scene and candidate boxes are illustrative, but the filtering
        is YOLO&apos;s real post-processing math — confidence thresholding and
        Non-Maximum Suppression with true Intersection-over-Union geometry.
      </p>
    </SimulatorShell>
  );
}
