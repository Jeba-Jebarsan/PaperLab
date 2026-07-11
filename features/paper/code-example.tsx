"use client";

import * as React from "react";
import { Check, Copy, TerminalSquare } from "lucide-react";
import type { CodeExample } from "@/lib/data/types";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

/** Minimal, safe line styling: comments and docstrings rendered dimmer. */
function lineClass(line: string): string {
  const t = line.trim();
  if (t.startsWith("#")) return "text-accent/60 italic";
  if (t.startsWith('"""') || t.endsWith('"""')) return "text-amber/60 italic";
  return "text-ink-dim";
}

export function CodeExampleBlock({ example }: { example: CodeExample }) {
  const [copied, setCopied] = React.useState(false);
  const lines = example.code.split("\n");

  async function copy() {
    await navigator.clipboard.writeText(example.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <GlassCard className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <TerminalSquare className="size-4 text-primary-bright" />
          <span className="text-sm font-semibold">{example.title}</span>
          <span className="rounded-md bg-white/5 px-1.5 py-0.5 font-mono text-[10px] uppercase text-ink-faint">
            {example.language}
          </span>
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-xs text-ink-dim transition-colors hover:text-ink hover:border-line-strong cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-accent" /> Copied
            </>
          ) : (
            <>
              <Copy className="size-3.5" /> Copy
            </>
          )}
        </button>
      </div>

      <p className="border-b border-line bg-white/[0.02] px-5 py-3 text-[13px] leading-relaxed text-ink-dim">
        {example.explanation}
      </p>

      <div className="code-scroll bg-void/70 p-5">
        <pre>
          {lines.map((line, i) => (
            <div key={i} className="flex">
              <span className="w-9 shrink-0 select-none pr-4 text-right text-white/15">
                {i + 1}
              </span>
              <span className={cn("whitespace-pre", lineClass(line))}>
                {line || " "}
              </span>
            </div>
          ))}
        </pre>
      </div>
    </GlassCard>
  );
}
