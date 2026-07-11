import { NextResponse } from "next/server";
import { getPaper } from "@/lib/data/papers";

/** GET /api/papers/:id — full analyzed paper payload. */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const paper = getPaper(id);
  if (!paper) {
    return NextResponse.json({ error: "Paper not found" }, { status: 404 });
  }
  return NextResponse.json({ paper });
}
