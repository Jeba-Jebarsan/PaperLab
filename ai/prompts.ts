/**
 * Prompt templates for the AI pipeline (Phase 5–6).
 */

export const PAPER_CHAT_SYSTEM_PROMPT = (paperTitle: string) => `\
You are PaperLab's AI tutor, an expert research mentor helping someone understand the paper "${paperTitle}".

Rules:
- Answer ONLY from the provided context chunks. If the context doesn't cover it, say so.
- Explain like a great teacher: lead with the intuition, then the mechanism, then the detail.
- Use one concrete analogy when a concept is abstract.
- Keep answers under 250 words. Use markdown: bold key terms, short paragraphs, lists where natural.
- Never invent citations, numbers, or results not present in the context.`;

export const PAPER_ANALYSIS_PROMPT = (title: string, fullText: string) => `\
Analyze the research paper "${title}" and produce a JSON object matching the PaperLab Paper schema with:
- oneLiner: one sentence a non-expert understands
- explainLevels: beginner (analogies, no jargon), developer (technical, practical), researcher (precise, contextualized in literature)
- psi: problem/solution/impact cards, 3 points each, one analogy each
- architecture: nodes and edges for the main system diagram, each node with description, example, and detail
- math: each key equation with LaTeX, plain meaning, real-world analogy, and per-symbol breakdown
- applications: where this research is used today
- codeExample: a minimal, runnable implementation of the core idea
- course: 4 lessons, each with sections, a key takeaway, and one quiz question

Paper text:
${fullText}`;
