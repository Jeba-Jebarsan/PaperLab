import { NextResponse } from "next/server";
import { getPaper } from "@/lib/data/papers";
import { answerQuestion } from "@/ai/rag";

export async function POST(req: Request) {
  let body: { paperId?: string; question?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { paperId, question } = body;
  if (!paperId || !question?.trim()) {
    return NextResponse.json(
      { error: "paperId and question are required" },
      { status: 400 }
    );
  }

  const paper = getPaper(paperId);
  if (!paper) {
    return NextResponse.json({ error: "Paper not found" }, { status: 404 });
  }

  try {
    const { answer, sources } = await answerQuestion(paper, question.trim());
    return NextResponse.json({ answer, sources });
  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json(
      { error: "Failed to generate an answer" },
      { status: 500 }
    );
  }
}
