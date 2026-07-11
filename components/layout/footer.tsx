import Link from "next/link";
import { FlaskConical } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-line mt-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent text-void">
            <FlaskConical className="size-3.5" strokeWidth={2.5} />
          </span>
          <div>
            <p className="text-sm font-semibold">PaperLab</p>
            <p className="text-xs text-ink-faint">
              Understand AI research by interacting with it.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-xs text-ink-faint">
          <Link href="/search" className="hover:text-ink-dim transition-colors">
            Explore
          </Link>
          <Link
            href="/paper/1706.03762"
            className="hover:text-ink-dim transition-colors"
          >
            Featured paper
          </Link>
          <span>© {new Date().getFullYear()} PaperLab</span>
        </div>
      </div>
    </footer>
  );
}
