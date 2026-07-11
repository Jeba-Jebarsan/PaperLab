"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format = (v: number) => String(v),
  hint,
  className,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  hint?: string;
  className?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <label className={cn("block select-none", className)}>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium text-ink-dim">{label}</span>
        <span className="rounded-md bg-white/5 px-1.5 py-0.5 font-mono text-[11px] text-primary-bright">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="paperlab-range w-full"
        style={{
          background: `linear-gradient(90deg, rgba(59, 130, 246,0.8) ${pct}%, rgba(255,255,255,0.08) ${pct}%)`,
        }}
      />
      {hint && <p className="mt-1 text-[11px] leading-snug text-ink-faint">{hint}</p>}
    </label>
  );
}
