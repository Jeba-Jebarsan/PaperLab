"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchBar({
  size = "lg",
  initialQuery = "",
  autoFocus = false,
}: {
  size?: "md" | "lg";
  initialQuery?: string;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [pending, setPending] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setPending(true);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div
        className={cn(
          "glass glass-hover flex items-center gap-3 rounded-2xl pl-4 pr-2 transition-shadow",
          size === "lg" ? "h-14 md:h-16" : "h-12"
        )}
      >
        <Search className="size-5 shrink-0 text-ink-faint" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus={autoFocus}
          placeholder='Search a paper — try "Attention Is All You Need"'
          className="h-full flex-1 bg-transparent text-[15px] text-ink placeholder:text-ink-faint focus:outline-none"
        />
        <button
          type="submit"
          disabled={!query.trim() || pending}
          className={cn(
            "grid shrink-0 place-items-center rounded-xl bg-primary text-void transition-all hover:bg-primary-bright disabled:opacity-40 cursor-pointer",
            size === "lg" ? "size-10 md:size-11" : "size-9"
          )}
          aria-label="Search"
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ArrowRight className="size-4" />
          )}
        </button>
      </div>
    </form>
  );
}
