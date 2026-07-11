import { NextResponse } from "next/server";
import { searchPapers, getAllSearchablePapers } from "@/lib/data/papers";

/**
 * GET /api/search?q=attention
 *
 * Phase 1: mock index. Phase 7: replace the body with
 * `searchArxiv(q)` from services/arxiv.ts (already implemented).
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const results = q ? searchPapers(q) : getAllSearchablePapers();
  return NextResponse.json({ results });
}
