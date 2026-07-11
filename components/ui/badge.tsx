import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "default" | "primary" | "accent" | "amber";

const tones: Record<Tone, string> = {
  default: "bg-white/5 text-ink-dim border-line",
  primary: "bg-primary/10 text-primary-bright border-primary/25",
  accent: "bg-accent/10 text-accent border-accent/25",
  amber: "bg-amber/10 text-amber border-amber/25",
};

export function Badge({
  className,
  tone = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
