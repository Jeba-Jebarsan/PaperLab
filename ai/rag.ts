import type { Paper } from "@/lib/data/types";
import { getProvider } from "./provider";
import { PAPER_CHAT_SYSTEM_PROMPT } from "./prompts";

/**
 * RAG pipeline for paper chat.
 *
 * Production flow (Phase 6):
 *   PDF → text extraction (FastAPI service) → chunking → embeddings
 *   → ChromaDB → top-k retrieval → LLM answer with citations.
 *
 * Phase 1 implements the same retrieve-then-answer contract with:
 *   - chunks derived from the paper's structured analysis
 *   - lexical scoring instead of vector similarity
 *   - a curated answer bank instead of an LLM call (unless a key is set)
 *
 * The API surface (`answerQuestion`) is identical in both worlds, so
 * upgrading the internals never touches the UI.
 */

interface Chunk {
  id: string;
  source: string;
  text: string;
}

export function chunkPaper(paper: Paper): Chunk[] {
  const chunks: Chunk[] = [];
  const add = (id: string, source: string, text: string) =>
    chunks.push({ id, source, text });

  add("abstract", "Abstract", paper.abstract);

  for (const level of ["beginner", "developer", "researcher"] as const) {
    paper.explainLevels[level].forEach((s, i) =>
      add(`${level}-${i}`, s.heading, `${s.heading}. ${s.body}`)
    );
  }
  for (const node of paper.architecture.nodes) {
    add(
      `arch-${node.id}`,
      `Architecture: ${node.label}`,
      `${node.label}. ${node.description} ${node.example} ${node.detail}`
    );
  }
  for (const m of paper.math) {
    add(
      `math-${m.id}`,
      `Math: ${m.name}`,
      `${m.name}. ${m.meaning} ${m.analogy} ${m.breakdown
        .map((b) => `${b.symbol}: ${b.meaning}`)
        .join(" ")}`
    );
  }
  for (const [key, card] of Object.entries(paper.psi)) {
    add(`psi-${key}`, card.title, `${card.title}. ${card.points.join(" ")} ${card.analogy}`);
  }
  return chunks;
}

/** Lexical retrieval — swapped for ChromaDB cosine similarity in Phase 6. */
export function retrieve(chunks: Chunk[], query: string, k = 3): Chunk[] {
  const terms = query
    .toLowerCase()
    .split(/[^a-z0-9√ᵀ]+/)
    .filter((t) => t.length > 2);

  return chunks
    .map((chunk) => {
      const text = chunk.text.toLowerCase();
      const score = terms.reduce((acc, t) => acc + (text.includes(t) ? 1 : 0), 0);
      return { chunk, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((r) => r.chunk);
}

export async function answerQuestion(
  paper: Paper,
  question: string
): Promise<{ answer: string; sources: string[] }> {
  const chunks = chunkPaper(paper);
  const relevant = retrieve(chunks, question);
  const provider = getProvider();

  if (provider) {
    const context = relevant.map((c) => `[${c.source}]\n${c.text}`).join("\n\n");
    const answer = await provider.complete([
      { role: "system", content: PAPER_CHAT_SYSTEM_PROMPT(paper.title) },
      { role: "user", content: `Context from the paper analysis:\n${context}\n\nQuestion: ${question}` },
    ]);
    return { answer, sources: relevant.map((c) => c.source) };
  }

  // Phase 1 fallback: curated answers + retrieval-grounded synthesis.
  const curated = matchCuratedAnswer(paper, question);
  if (curated) return { answer: curated, sources: relevant.map((c) => c.source) };

  if (relevant.length > 0) {
    const best = relevant[0];
    return {
      answer: `Based on the paper's **${best.source}** section:\n\n${best.text}${
        relevant[1] ? `\n\nRelated — *${relevant[1].source}*: ${relevant[1].text}` : ""
      }`,
      sources: relevant.map((c) => c.source),
    };
  }

  return {
    answer:
      "I couldn't find that in this paper's analysis. Try asking about the attention mechanism, the architecture, the math, or the paper's impact — or rephrase your question.",
    sources: [],
  };
}

/** Hand-written answers for the questions people actually ask about each paper. */
function matchCuratedAnswer(paper: Paper, question: string): string | null {
  const q = question.toLowerCase();
  const has = (...words: string[]) => words.some((w) => q.includes(w));

  if (paper.id === "1506.02640") return matchYoloAnswer(q, has);
  if (paper.id === "1512.03385") return matchResnetAnswer(q, has);
  if (paper.id === "2005.14165") return matchGpt3Answer(q, has);
  if (paper.id === "2010.11929") return matchVitAnswer(q, has);
  if (paper.id !== "1706.03762") return null;

  if (has("main innovation", "key idea", "main contribution", "big idea", "novel")) {
    return `The main innovation is **replacing recurrence entirely with self-attention**.\n\nBefore this paper, sequence models processed text word-by-word through RNNs, with attention only as an add-on. The Transformer showed that attention *alone* — computed in parallel across the whole sequence — is sufficient, and actually better:\n\n1. **O(1) path length** between any two words (RNNs need O(n) steps)\n2. **Full parallelism** — the entire sequence is one matrix multiplication, ideal for GPUs\n3. **Multi-head attention** — 8 parallel heads that each learn different relationship types\n\nThe result: better translation quality at a fraction of the training cost, and an architecture that scaled into GPT, BERT, and every modern LLM.`;
  }

  if (has("better than previous", "better than rnn", "why is this better", "vs rnn", "compared to")) {
    return `Three concrete advantages over RNN/LSTM-based models:\n\n**1. Speed.** RNNs must process word *t* before word *t+1* — GPUs sit idle. Self-attention computes all positions simultaneously; the base Transformer trained in 12 hours on 8 GPUs, versus weeks for comparable RNN systems.\n\n**2. Long-range memory.** In an RNN, information from word 1 must survive 49 sequential updates to influence word 50 — it usually doesn't (vanishing gradients). In a Transformer, word 50 attends to word 1 *directly*, in one step.\n\n**3. Quality.** 28.4 BLEU on WMT14 English→German beat every previous model *and ensemble* by over 2 BLEU — a large margin in machine translation.`;
  }

  if (has("scaling", "√d", "sqrt", "scale factor", "divide")) {
    return `The **√d_k scaling factor** solves a subtle numerical problem.\n\nAttention scores are dot products of 64-dimensional vectors. As dimensionality grows, dot products grow too — their variance scales with d_k. Large scores push softmax into its saturated region, where one word gets ~100% attention and all gradients become nearly zero. Learning stalls.\n\nDividing by √d_k (= 8 in the paper) keeps scores in a range where softmax stays 'soft' — attention can be distributed across several words, and gradients flow.\n\n**Analogy:** it's like turning down an amplifier that's clipping — the signal shape (relative preferences) is preserved, but nothing saturates.`;
  }

  if (has("heads", "multi-head", "8 attention")) {
    return `Each of the **8 attention heads** learns its own Q/K/V projections, so each can specialize in a different relationship type.\n\nStudies of trained Transformers found heads that track:\n- **Syntax** — verbs attending to their subjects\n- **Coreference** — pronouns like "it" attending to their antecedents\n- **Position** — attending to the previous or next word\n- **Rare words** — copying behavior for unusual tokens\n\nWhy not one big head? A single softmax must average all these patterns into one distribution — the ablations (Table 3 of the paper) show single-head attention loses ~0.9 BLEU. Splitting 512 dimensions into 8×64 lets specialists coexist at the same total cost.`;
  }

  if (has("gpt", "chatgpt", "led to", "modern", "llm", "claude")) {
    return `The path from this paper to GPT is surprisingly direct:\n\n**2017 — Transformer** (this paper): encoder-decoder with attention, 65M–213M parameters, built for translation.\n\n**2018 — GPT-1**: OpenAI keeps only the *decoder* stack (masked self-attention, no cross-attention) and trains it to predict the next token on books. Same core math.\n\n**2018 — BERT**: Google keeps only the *encoder* for understanding tasks.\n\n**2019–2023 — GPT-2/3/4**: essentially the same decoder architecture scaled from 1.5B → 175B+ parameters, with more data. The forward pass of the attention layer is nearly unchanged from this paper.\n\nModern assistants like ChatGPT, Claude, and Gemini are all descendants of the decoder half of this architecture. The paper's real legacy was making that scaling *possible* — full parallelism meant bigger models were just a matter of more GPUs.`;
  }

  if (has("positional", "position", "order", "sinusoid")) {
    return `Self-attention has no built-in sense of word order — shuffle the input and you get the same attention scores. So the paper **adds a positional encoding** to each word embedding before the first layer.\n\nEach position gets a unique vector of sine and cosine values at geometrically spaced frequencies:\n\nPE(pos, 2i) = sin(pos / 10000^(2i/d))\n\n**The clock analogy:** imagine a clock with many hands moving at different speeds. Any moment is uniquely identified by the combined hand positions. Likewise, each word position gets a unique 'reading' across the 512 dimensions — and because sinusoids are periodic, the model can also learn *relative* offsets ("3 words apart") easily.\n\nThe authors tested learned position embeddings too — nearly identical results — but chose sinusoids hoping they'd extrapolate to longer sequences than seen in training.`;
  }

  return null;
}

function matchGpt3Answer(
  q: string,
  has: (...words: string[]) => boolean
): string | null {
  if (has("in-context", "in context", "what is few-shot", "few shot learning", "prompt learning")) {
    return `**In-context learning** is GPT-3's headline discovery: a frozen model can learn a task from examples placed *in its prompt*.\n\nGive it:\n\n\`sea otter => loutre de mer\`\n\`cheese =>\`\n\nand it completes \`fromage\` — having inferred the task from one example, with **zero gradient updates**. Mechanically it's just conditional probability, P(answer | examples, query): masked self-attention lets every generated token look back at your demonstrations, so the examples reshape the next-token distribution.\n\nThe paper's deepest finding: this ability **grows with scale**. Small models barely benefit from prompt examples; the 175B model exploits them expertly. In-context learning is what all that size actually buys.`;
  }

  if (has("how big", "175", "parameters", "size", "compared to earlier", "gpt-2", "gpt2")) {
    return `GPT-3's vital statistics:\n\n- **175 billion parameters** — 10× larger than any previous non-sparse language model, and over 100× GPT-2's 1.5B\n- **96 Transformer decoder layers**, d_model = 12,288, **96 attention heads** of dimension 128\n- **2,048-token context window**\n- Trained on **~300 billion tokens**: filtered Common Crawl (60% of the mix), WebText2, two book corpora, and Wikipedia\n- Training compute: about **3,640 petaflop/s-days**\n\nArchitecturally it's essentially GPT-2 (a decoder-only Transformer, with alternating dense and locally-banded sparse attention) — the paper's contribution isn't a new architecture, it's proving what happens when you scale the old one relentlessly. The paper trained **8 sizes** (125M → 175B) to measure exactly that.`;
  }

  if (has("zero-shot", "zero shot", "one-shot", "one shot", "difference between")) {
    return `The three evaluation settings — all with **frozen weights**:\n\n**Zero-shot**: instruction only.\n\`Translate English to French: cheese =>\`\n\n**One-shot**: instruction + one worked example before the query.\n\n**Few-shot**: instruction + as many examples as fit in the 2,048-token window, typically **10–100**.\n\nThe key result is how the gaps between them behave: for small models, examples barely help. As models grow, the few-shot advantage **widens steadily** — evidence that scale creates better in-context learners, not just better memorizers. Few-shot GPT-3 reached 86.4% on LAMBADA and beat the fine-tuned open-domain state of the art on TriviaQA (71.2%).`;
  }

  if (has("limit", "weakness", "couldn't", "cannot", "fail", "bad at", "struggle")) {
    return `The paper is refreshingly honest about GPT-3's limits:\n\n- **Comparison tasks**: judging whether a word is used the same way in two sentences (WiC), and natural language inference generally — near chance in some settings\n- **Long-form coherence**: it can lose the thread, repeat itself, or contradict itself over long passages\n- **Arithmetic**: ~100% on 2-digit addition but accuracy collapses as digits grow — pattern matching, not calculation\n- **Structural**: as an autoregressive (left-to-right) model it forfeits bidirectional context, which encoder models like BERT exploit\n- **Bias and misuse**: the paper documents gender/race/religion associations in generations and dedicates a full section to potential misuse\n\nMany of these gaps — instruction-following especially — were later addressed not by more scale but by **alignment**: InstructGPT's RLHF, which led directly to ChatGPT.`;
  }

  if (has("chatgpt", "led to", "instructgpt", "rlhf", "claude", "descendant", "modern")) {
    return `The path from this paper to your chat window:\n\n**2020 — GPT-3** (this paper): proves a frozen 175B model can perform tasks from prompt examples alone. Powerful, but awkward — you had to phrase everything as a text completion.\n\n**2022 — InstructGPT**: the same model family fine-tuned with **RLHF** (reinforcement learning from human feedback) to follow instructions directly instead of just continuing text.\n\n**Late 2022 — ChatGPT**: InstructGPT-style training wrapped in a conversational interface. The world meets in-context learning.\n\nEvery modern assistant — ChatGPT, Claude, Gemini — runs on this paper's recipe: a huge decoder-only Transformer whose in-context ability is shaped by alignment training. The capabilities were discovered here; alignment made them usable.`;
  }

  return null;
}

function matchVitAnswer(
  q: string,
  has: (...words: string[]) => boolean
): string | null {
  if (has("data", "hungry", "why does vit need", "so much training data", "why so much data")) {
    return `ViT needs so much data because it's missing something CNNs get for free.\n\nA CNN's convolution *hard-codes* an assumption: nearby pixels are related, and that pattern repeats the same way across the whole image (translation equivariance). ViT has no such built-in rule — every spatial relationship between patches must be **learned from scratch** through the position embeddings and attention.\n\n**The measured trade-off:** on ImageNet-1k alone (1.3M images), ViT trails ResNets of similar size by several points. Pretrained on JFT-300M (~300 million images), the same architecture reaches **88.55% top-1** — beating those same ResNets. Given enough examples, it learns better structure than anyone hard-coded; given too few, the missing shortcut hurts.`;
  }

  if (has("turned into", "turn an image", "patch", "16x16", "16×16", "words")) {
    return `An image becomes "words" through a simple **patchify** step:\n\n1. Chop a 224×224 photo into a grid of **16×16 pixel squares** — that's 196 patches (224÷16 = 14, so 14×14 = 196).\n2. **Flatten** each patch into a single vector (16×16×3 = 768 numbers).\n3. Run every patch through the **same learned projection matrix** — exactly like a shared word-embedding table.\n4. Prepend a **[class] token** and add **position embeddings**, since attention has no built-in sense of order.\n\nAfter this, the 197-token sequence (196 patches + 1 [class] token) is structurally identical to a sentence of word embeddings — the Transformer literally cannot tell the difference.`;
  }

  if (has("[class]", "cls", "class token", "classification token")) {
    return `The **[class] token** is a single learnable vector prepended to the patch sequence — an idea borrowed directly from BERT's [CLS] token.\n\nIt starts with no information of its own. But as it passes through every encoder layer, self-attention lets it look at (and absorb information from) all 196 image patches, repeatedly. By the final layer, this one vector has effectively summarized the *entire image*.\n\nThat final [class] vector — not any of the 196 patch vectors — is what the classification head reads to make its prediction. It's the designated "note-taker" that sat through every round of attention.`;
  }

  if (has("different from a cnn", "vs cnn", "compared to cnn", "how is this different", "convolution")) {
    return `The core difference is **how information travels across the image**:\n\n**CNN:** a small filter slides over local neighborhoods. Connecting two far-apart patches (say, a bird's beak and its tail) requires stacking enough layers for the receptive field to grow that large — information travels slowly, layer by layer.\n\n**ViT:** self-attention lets *any* patch query *any* other patch directly, in a single layer — the beak can attend straight to the tail from layer one. The paper's attention-distance analysis found some heads are already fully global at the very first layer, something no single CNN layer can do by construction.\n\n**The trade:** CNNs bake in "nearby pixels matter" as a hard-coded assumption; ViT must learn that (or discover something better) from data — which is why it needs so much of it.`;
  }

  if (has("led to", "clip", "gpt-4v", "multimodal", "what did vit", "legacy", "influence")) {
    return `ViT reframed vision as a sequence-modeling problem — and multimodal AI ran with it:\n\n**CLIP** uses a ViT as its image encoder, trained so images and text captions land in the same embedding space — the visual half of most modern vision-language models.\n\n**GPT-4V, Gemini-class assistants:** because image patches embed just like text tokens, a single Transformer can process a picture and a question together — the basis of "show it a photo and ask about it."\n\n**Detection & segmentation:** DETR and Swin-based models replaced hand-designed detection heads with attention over patches.\n\n**Data-efficiency fixes:** DeiT (distillation, no JFT-300M needed) and Swin (windowed attention, bringing back some locality) closed much of ViT's small-data gap within a year of publication.`;
  }

  return null;
}

function matchResnetAnswer(
  q: string,
  has: (...words: string[]) => boolean
): string | null {
  if (has("deeper", "worse", "degradation", "why did", "56", "mystery")) {
    return `Before ResNet, stacking layers past ~20 made networks **worse — even at training**.\n\nThe paper's Figure 1 shows a 56-layer plain network with *higher training error* than a 20-layer one on CIFAR-10. That rules out overfitting: the deep network couldn't even fit data it had seen.\n\nThe paradox: a 56-layer net could trivially match the 20-layer one (copy its layers, make the other 36 pass input through unchanged). The solution existed — **gradient descent just couldn't find it**. This is the *degradation problem*, and it's an optimization failure, not a capacity problem.\n\nYou can reproduce it live in the ResNet Lab on this page: a plain 12-layer network flatlines while its skip-connected twin learns the same data perfectly.`;
  }

  if (has("skip connection", "shortcut", "what is a skip", "identity", "residual block")) {
    return `A **skip connection** is a wire that routes a block's input around its layers and adds it back to the output:\n\n**y = F(x) + x**\n\n- **F(x)** — two or three conv+BN layers that compute a small *correction*\n- **+x** — the input, added back element-wise. Zero parameters, zero meaningful compute cost.\n\nThe reframe: instead of asking layers to produce the whole answer H(x), ResNet asks for the *difference* F(x) = H(x) − x. If a layer has nothing useful to add, it can output zero and become invisible — so extra depth can never hurt.\n\nWhen dimensions change between stages, a 1×1 projection Wₛx reshapes the shortcut — used only where shapes disagree.`;
  }

  if (has("gradient", "vanish", "highway", "backprop", "why does it help", "why do skips")) {
    return `Differentiate a residual block and you get the paper's magic:\n\n**∂y/∂x = ∂F/∂x + I**\n\nIn a plain network, the backward error signal is multiplied by each layer's local slope — many numbers below 1 — so it shrinks toward zero before reaching early layers. They learn from whispers.\n\nThe skip's **identity term (I)** gives the gradient a lane that multiplies by exactly 1, crossing any number of blocks undiminished — a gradient highway.\n\nThis is measurable, not metaphor: in this page's ResNet Lab, at initialization the residual network delivers roughly **40× more gradient signal to layer 1** than its plain twin (real backpropagation, verified against finite differences).`;
  }

  if (has("result", "imagenet", "3.57", "won", "competition", "accuracy", "error rate")) {
    return `ResNet's 2015 results:\n\n- **ImageNet classification**: single-model ResNet-152 hit **4.49% top-5 error**; the ensemble reached **3.57%** — first place, ILSVRC 2015\n- **152 layers, 8× deeper than VGG-19**, yet computationally cheaper (11.3 vs 19.6 GFLOPs) thanks to bottleneck blocks and global average pooling\n- **The controlled proof**: plain-34 lost to plain-18 (degradation), but ResNet-34 beat ResNet-18 — shortcuts flipped the ordering at identical depth\n- **CIFAR-10**: 110 layers reached 6.43% error; a 1202-layer net trained without difficulty (it overfit, but it *trained*)\n- Same backbones won **ImageNet detection & localization and COCO detection & segmentation** — five first places from one idea.`;
  }

  if (has("transformer", "gpt", "llm", "influence", "add & norm", "add and norm", "legacy", "claude")) {
    return `ResNet's skip connection became **the load-bearing wire of modern AI**.\n\nLook at the Transformer architecture ('Attention Is All You Need', 2017): every sub-layer is wrapped as **LayerNorm(x + Sublayer(x))** — that '+x' is a residual connection, directly descended from this paper.\n\nWithout it, 96-layer GPT models, Claude, and Gemini simply would not train — the same degradation that killed 56-layer CNNs would kill deep Transformers.\n\nBeyond LLMs: AlphaGo Zero and AlphaFold are residual towers; Stable Diffusion's U-Net is packed with residual blocks; ConvNeXt and Vision Transformers keep them too. Nearly every successful architecture since 2015 kept the skip connection while replacing everything else around it.`;
  }

  return null;
}

function matchYoloAnswer(
  q: string,
  has: (...words: string[]) => boolean
): string | null {
  if (has("faster", "speed", "fast", "r-cnn", "rcnn", "why is yolo")) {
    return `YOLO is faster because it **looks at the image exactly once**.\n\nR-CNN-style detectors generate ~2,000 region proposals and run each through a network separately — thousands of evaluations per photo, in a multi-stage pipeline (proposals → features → classifier → box refinement).\n\nYOLO replaces all of that with **one forward pass** of a single CNN that outputs every box and class simultaneously as a 7×7×30 tensor.\n\n**The numbers (VOC 2007):**\n- YOLO: 63.4 mAP at **45 fps**\n- Fast YOLO: 52.7 mAP at **155 fps**\n- Faster R-CNN: 73.2 mAP at ~7 fps\n\nLess accurate, but 6× faster — and for live video, a detection that arrives late is useless.`;
  }

  if (has("grid", "cell", "predict", "7x7", "7×7")) {
    return `The image is divided into a **7×7 grid**, and the cell containing an object's *center* is responsible for detecting it.\n\nEach of the 49 cells predicts:\n- **2 bounding boxes**, each with 5 numbers: x, y (box center, relative to the cell), w, h (relative to the image), and a confidence score\n- **20 class probabilities** (PASCAL VOC classes) — one set shared by both boxes\n\nThat's 2×5 + 20 = **30 numbers per cell**, so the network's entire output is one 7×7×30 tensor. All 49 cells answer simultaneously in a single forward pass — that's the whole trick.`;
  }

  if (has("nms", "suppression", "duplicate", "overlap")) {
    return `**Non-Maximum Suppression (NMS)** removes duplicate detections of the same object.\n\nWith 49 cells × 2 boxes, YOLO emits 98 candidate boxes for maybe 3 real objects — neighboring cells often report the same car. NMS cleans up:\n\n1. Sort surviving boxes by confidence\n2. Keep the most confident box\n3. Delete any same-class box that overlaps it beyond an IoU threshold\n4. Repeat with the next survivor\n\nIn the paper, NMS adds **2–3% mAP**. You can run this exact algorithm yourself with the IoU slider in the Detection Lab — push it to 0.9 and watch the duplicates come back.`;
  }

  if (has("weakness", "limitation", "fail", "struggle", "bird", "small object")) {
    return `YOLO's weaknesses come directly from its grid design:\n\n**1. Small, grouped objects.** Each cell predicts only 2 boxes and *one* class distribution. When many small objects crowd into one cell — the paper's own example is a **flock of birds** — most get missed.\n\n**2. Localization errors.** Its boxes are less precise: localization accounts for 19.0% of YOLO's errors vs 8.6% for Fast R-CNN. The 7×7 grid is coarse, and the √w/√h loss trick only partially fixes size sensitivity.\n\n**The flip side:** it makes ~3× *fewer background false positives* (4.75% vs 13.6%) because it sees the whole image at once. The two error profiles are complementary — combining Fast R-CNN with YOLO gained +3.2 mAP.`;
  }

  if (has("accurate", "accuracy", "map", "voc", "compare", "faster r-cnn")) {
    return `On **PASCAL VOC 2007**:\n\n- **YOLO: 63.4 mAP at 45 fps**\n- Fast YOLO: 52.7 mAP at 155 fps (fastest detector of its era)\n- Faster R-CNN (VGG-16): 73.2 mAP at ~7 fps\n\nSo YOLO gave up roughly 10 mAP for a 6× speedup — the first accurate detector that could run on live video. Its errors also *differ* from R-CNN's: worse localization, but far fewer background false positives, and it generalized better to out-of-domain imagery like artwork.`;
  }

  return null;
}
