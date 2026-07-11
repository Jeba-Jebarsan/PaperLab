# PaperLab 🧪

**Understand AI research papers by interacting with them.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

PaperLab turns landmark AI papers into interactive learning experiences — animated picture-book stories, live simulations you can experiment with, clickable architecture diagrams, math with real-world analogies, quizzes, mini courses, and a paper-aware AI tutor. Think *3Blue1Brown + Notion + PhET Simulations*, not a PDF summarizer.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

No API keys or database needed — everything runs on curated content, real in-browser math, and a lexical RAG fallback.

## What's inside

**10 fully interactive papers — the entire Learning Path is complete:**

| # | Paper | Year | Signature experience |
|---|---|---|---|
| 01 | AlexNet | 2012 | CNN Lab + train a real digit recognizer |
| 02 | GANs | 2014 | A real forger-vs-detective duel training live (mode collapse included) |
| 03 | ResNet | 2015 | Two real deep nets race — with vs without skip connections |
| 04 | YOLO | 2015 | Live confidence/IoU tuning with real NMS math |
| 05 | Attention Is All You Need | 2017 | Self-attention visualizer + token playground |
| 06 | BERT | 2018 | Masked-word game: left-only vs both-sides reading |
| 07 | GPT-3 | 2020 | Real temperature/top-k/top-p sampling |
| 08 | Vision Transformer (ViT) | 2020 | Attention Lab reframed over image patches, vs. the CNN Lab it replaced |
| 09 | RLHF (Learn to Summarize) | 2020 | Reward-vs-KL-leash lab with real reward hacking |
| 10 | LoRA | 2021 | Real SVD rank slider — watch an update rebuild from rank 3 |

**Every paper page has:**
- **The Story** — 5 bespoke animated scenes; the whole paper understandable with zero reading
- 3-level explanations (beginner / developer / researcher)
- Problem → Solution → Impact cards
- Interactive simulators (chosen per paper)
- Architecture explorer (React Flow) with an auto-guided "Follow the data" tour
- Math cards: formula → plain meaning → analogy, with hoverable symbols (KaTeX)
- Runnable code example
- 4-lesson mini course with per-lesson hands-on labs, quizzes, and saved progress
- AI tutor chat (RAG: chunking → retrieval → grounded answers)

**12 labs** on `/labs` — attention, convolution, detection, gradient descent, backpropagation, skip connections, token sampling, digit recognition (a 3Blue1Brown homage: draw digits, watch a real 100→16→16→10 network read them), GANs, LoRA, masked words, and RLHF.

**Honesty rule:** every lab states what's real. The GAN, backprop, digit, ResNet-race, gradient-descent, CNN, and LoRA labs run genuine math (training verified headless; backprop gradient-checked to ~1e-10). Curated pieces (LLM logits, YOLO boxes, attention patterns, BERT candidates, RLHF summaries) are labeled, with the surrounding algorithms exact.

## Architecture

```
app/                  Next.js 15 App Router pages + API routes
components/           UI primitives (glass cards, sliders, KaTeX…)
features/
  home/               Landing: hero, learning path, demo sim
  paper/              Paper-page blocks + visual-story player + stories/
  learn/              Course view, quizzes, progress
  labs/               The /labs gallery
  simulators/         12 simulators + the shared SimulatorShell engine
lib/
  data/               Paper domain types + 10 curated paper analyses
  sim/                Pure simulation math (all verified headless)
services/arxiv.ts     Real arXiv API client (ready to wire in)
ai/                   LLM provider abstraction + RAG pipeline + prompts
prisma/schema.prisma  PostgreSQL schema for the hosted phase
```

### Upgrade path (already wired)
- **Live arXiv search** — swap `services/arxiv.ts` into `app/api/search/route.ts`.
- **Real LLM tutor** — set `GEMINI_API_KEY` or `OPENAI_API_KEY`; `ai/rag.ts` upgrades automatically from curated answers to live completions over retrieved chunks.
- **Database & auth** — `prisma/schema.prisma` models papers, chunks, chats, and progress; Clerk keys in `.env.example`.

## Scripts

```bash
npm run dev      # dev server (Turbopack)
npm run build    # production build
npm start        # serve production build
npm run lint     # eslint
```

## Contributing

Issues and PRs are welcome — new simulators, new papers, or improvements to existing ones. A new paper is typically one file in `lib/data/papers/` plus a matching story in `features/paper/stories/`; look at an existing one (e.g. `lib/data/papers/resnet.ts`) as a template.

## License

MIT — see [LICENSE](./LICENSE). The source PDFs referenced during development are not included in this repository (they're third-party copyrighted publications); all analysis content here is original writing.
