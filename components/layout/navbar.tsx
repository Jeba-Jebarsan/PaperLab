import Link from "next/link";
import { FlaskConical, Search } from "lucide-react";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.57.11.79-.25.79-.55 0-.27-.01-1.16-.02-2.11-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.12 3.04.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14 0 1.54-.01 2.79-.01 3.17 0 .3.21.66.79.55A10.51 10.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

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
          <a
            href="https://github.com/Jeba-Jebarsan/PaperLab"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
            title="Open source — view on GitHub"
            className="rounded-lg p-2 text-ink-dim transition-colors hover:text-ink hover:bg-white/5"
          >
            <GithubIcon className="size-4" />
          </a>
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
