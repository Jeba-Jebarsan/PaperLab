"use client";

import { cn } from "@/lib/utils";

export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  size = "md",
  className,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-lg border border-line bg-white/[0.03] p-0.5",
        className
      )}
      role="tablist"
    >
      {options.map((opt) => (
        <button
          key={String(opt.value)}
          role="tab"
          aria-selected={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded-md font-medium transition-all cursor-pointer",
            size === "sm" ? "px-2 py-1 text-[11px]" : "px-3 py-1.5 text-xs",
            value === opt.value
              ? "bg-primary/20 text-primary-bright shadow-[inset_0_0_0_1px_rgba(59,130,246,0.35)]"
              : "text-ink-faint hover:text-ink-dim"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
