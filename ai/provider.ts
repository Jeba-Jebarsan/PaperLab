/**
 * LLM provider abstraction (Phase 5+).
 *
 * One interface, multiple backends. Gemini is the default; any
 * OpenAI-compatible endpoint (OpenAI, Together, local vLLM) plugs into
 * the same shape. Phase 1 ships MockProvider so the whole UX works
 * end-to-end without keys.
 */

export interface LlmMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LlmProvider {
  name: string;
  complete(messages: LlmMessage[]): Promise<string>;
}

export class GeminiProvider implements LlmProvider {
  name = "gemini";
  constructor(
    private apiKey = process.env.GEMINI_API_KEY ?? "",
    private model = process.env.GEMINI_MODEL ?? "gemini-2.0-flash"
  ) {}

  async complete(messages: LlmMessage[]): Promise<string> {
    const system = messages.find((m) => m.role === "system")?.content;
    const contents = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          ...(system && { systemInstruction: { parts: [{ text: system }] } }),
        }),
      }
    );
    if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  }
}

export class OpenAICompatibleProvider implements LlmProvider {
  name = "openai-compatible";
  constructor(
    private apiKey = process.env.OPENAI_API_KEY ?? "",
    private baseUrl = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1",
    private model = process.env.OPENAI_MODEL ?? "gpt-4o-mini"
  ) {}

  async complete(messages: LlmMessage[]): Promise<string> {
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ model: this.model, messages }),
    });
    if (!res.ok) throw new Error(`OpenAI-compatible API error: ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "";
  }
}

export function getProvider(): LlmProvider | null {
  if (process.env.GEMINI_API_KEY) return new GeminiProvider();
  if (process.env.OPENAI_API_KEY) return new OpenAICompatibleProvider();
  return null; // Phase 1: callers fall back to the mock RAG pipeline
}
