"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Loader2, MessageSquareText, Send, X } from "lucide-react";
import type { ChatMessage } from "@/lib/data/types";
import { cn } from "@/lib/utils";

/** Tiny markdown renderer for tutor answers: **bold**, `code`, lists, paragraphs. */
function renderMarkdown(text: string): React.ReactNode {
  const inline = (s: string, keyPrefix: string) => {
    const parts = s.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g).filter(Boolean);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**"))
        return (
          <strong key={`${keyPrefix}-${i}`} className="font-semibold text-ink">
            {part.slice(2, -2)}
          </strong>
        );
      if (part.startsWith("`") && part.endsWith("`"))
        return (
          <code
            key={`${keyPrefix}-${i}`}
            className="rounded bg-white/10 px-1 py-0.5 font-mono text-[12px]"
          >
            {part.slice(1, -1)}
          </code>
        );
      if (part.startsWith("*") && part.endsWith("*") && part.length > 2)
        return <em key={`${keyPrefix}-${i}`}>{part.slice(1, -1)}</em>;
      return <React.Fragment key={`${keyPrefix}-${i}`}>{part}</React.Fragment>;
    });
  };

  return text.split(/\n\n+/).map((block, bi) => {
    const lines = block.split("\n");
    const isList = lines.every((l) => /^[-•\d]/.test(l.trim()) || l.trim() === "");
    if (isList && lines.length > 1) {
      return (
        <ul key={bi} className="my-1.5 space-y-1 pl-1">
          {lines
            .filter((l) => l.trim())
            .map((l, li) => (
              <li key={li} className="flex gap-2">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary-bright" />
                <span>{inline(l.replace(/^[-•\d.]+\s*/, ""), `${bi}-${li}`)}</span>
              </li>
            ))}
        </ul>
      );
    }
    return (
      <p key={bi} className="my-1.5 first:mt-0 last:mb-0">
        {lines.map((l, li) => (
          <React.Fragment key={li}>
            {li > 0 && <br />}
            {inline(l, `${bi}-${li}`)}
          </React.Fragment>
        ))}
      </p>
    );
  });
}

export function ChatPanel({
  paperId,
  paperTitle,
  suggestions,
}: {
  paperId: string;
  paperTitle: string;
  suggestions: string[];
}) {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function ask(question: string) {
    const q = question.trim();
    if (!q || loading) return;
    setInput("");
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", content: q }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paperId, question: q }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.answer ?? "Something went wrong — try again.",
          sources: data.sources,
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "I couldn't reach the tutor service. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating launcher */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-void shadow-[0_8px_32px_-8px_rgba(59,130,246,0.8)] transition-colors hover:bg-primary-bright cursor-pointer"
        aria-label="Open AI tutor"
      >
        {open ? <X className="size-4.5" /> : <MessageSquareText className="size-4.5" />}
        <span className="hidden sm:inline">{open ? "Close" : "Ask the paper"}</span>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="fixed bottom-20 right-4 z-50 flex h-[min(600px,72vh)] w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-line bg-surface/95 shadow-2xl backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary-bright">
                <Bot className="size-4.5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">AI Tutor</p>
                <p className="truncate text-[11px] text-ink-faint">
                  Answers from “{paperTitle}” only
                </p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed text-ink-dim">
                    Ask me anything about this paper — I answer using the paper&apos;s
                    own analysis (RAG), not general knowledge.
                  </p>
                  <div className="flex flex-col items-start gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => ask(s)}
                        className="rounded-xl border border-line bg-white/[0.03] px-3 py-2 text-left text-[13px] text-ink-dim transition-all hover:border-primary/40 hover:text-ink cursor-pointer"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed",
                      msg.role === "user"
                        ? "bg-primary/20 text-ink rounded-br-md"
                        : "border border-line bg-white/[0.03] text-ink-dim rounded-bl-md"
                    )}
                  >
                    {msg.role === "assistant" ? renderMarkdown(msg.content) : msg.content}
                    {msg.sources && msg.sources.length > 0 && (
                      <p className="mt-2 border-t border-line pt-1.5 text-[10px] text-ink-faint">
                        Sources: {msg.sources.join(" · ")}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-xs text-ink-faint">
                  <Loader2 className="size-3.5 animate-spin" />
                  Reading the paper…
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="flex items-center gap-2 border-t border-line p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Why is attention better than RNNs?"
                className="h-10 min-w-0 flex-1 rounded-xl border border-line bg-void/50 px-3 text-[13px] text-ink placeholder:text-ink-faint focus:outline-none focus:border-primary/50"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-void transition-colors hover:bg-primary-bright disabled:opacity-40 cursor-pointer"
                aria-label="Send"
              >
                <Send className="size-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
