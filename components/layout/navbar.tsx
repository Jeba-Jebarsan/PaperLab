import Link from "next/link";
import { FlaskConical, Search } from "lucide-react";

export function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-line bg-void/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent text-void shadow-[0_0_20px_-4px_rgba(59,130,246,0.7)]">
            <FlaskConical className="size-4" strokeWidth={2.5} />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">
            Paper<span className="text-primary-bright">Lab</span>
          </span>
        </Link>

        <div className="flex items-center gap-1 md:gap-2">
          <Link
            href="/search"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-dim transition-colors hover:text-ink hover:bg-white/5"
          >
            <Search className="size-4" />
            <span className="hidden sm:inline">Explore papers</span>
          </Link>
          <Link
            href="/labs"
            className="rounded-lg px-3 py-2 text-sm text-ink-dim transition-colors hover:text-ink hover:bg-white/5"
          >
            Labs
          </Link>
          <Link
            href="/paper/1706.03762"
            className="hidden md:block rounded-lg px-3 py-2 text-sm text-ink-dim transition-colors hover:text-ink hover:bg-white/5"
          >
            Featured paper
          </Link>
          <Link
            href="/search"
            className="ml-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-void transition-colors hover:bg-primary-bright"
          >
            Start learning
          </Link>
        </div>
      </nav>
    </header>
  );
}
