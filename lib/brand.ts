/** Shared brand constants — single source of truth for name, tagline, and colors. */
export const BRAND = {
  name: "PaperLab",
  tagline: "Understand AI research papers by interacting with them.",
  description:
    "PaperLab turns landmark AI papers into interactive learning experiences — animated stories, live simulations, clickable architecture diagrams, and a paper-aware AI tutor.",
  colors: {
    primary: "#3b82f6",
    accent: "#4fd1c5",
    void: "#05050a",
    ink: "#ecedf2",
  },
} as const;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
