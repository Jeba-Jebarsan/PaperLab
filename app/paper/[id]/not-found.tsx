import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaperNotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-5 pt-40 pb-24 text-center">
      <FileQuestion className="size-10 text-ink-faint" />
      <h1 className="mt-5 text-2xl font-semibold">No interactive lab for this paper yet</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-dim">
        This paper hasn&apos;t been analyzed yet. The AI analysis pipeline (Phase 8)
        will generate labs for any arXiv paper on demand.
      </p>
      <Link href="/search" className="mt-7">
        <Button>Browse available papers</Button>
      </Link>
    </div>
  );
}
