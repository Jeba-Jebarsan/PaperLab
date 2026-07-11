"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionLink {
  id: string;
  label: string;
}

export function SectionNav({ sections }: { sections: SectionLink[] }) {
  const [active, setActive] = React.useState(sections[0]?.id);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="sticky top-16 z-40 border-b border-line bg-void/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-5 py-2 [scrollbar-width:none]">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={cn(
              "whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              active === s.id
                ? "bg-primary/15 text-primary-bright"
                : "text-ink-faint hover:text-ink-dim"
            )}
          >
            {s.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
