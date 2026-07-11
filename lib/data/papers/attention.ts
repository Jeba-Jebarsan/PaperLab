import type { Paper } from "../types";

export const attentionPaper: Paper = {
  id: "1706.03762",
  slug: "attention-is-all-you-need",
  arxivId: "1706.03762",
  title: "Attention Is All You Need",
  authors: [
    "Ashish Vaswani",
    "Noam Shazeer",
    "Niki Parmar",
    "Jakob Uszkoreit",
    "Llion Jones",
    "Aidan N. Gomez",
    "Łukasz Kaiser",
    "Illia Polosukhin",
  ],
  year: 2017,
  venue: "NeurIPS 2017",
  citationCount: 180000,
  tags: ["Transformers", "NLP", "Attention", "Deep Learning", "Foundational"],
  abstract:
    "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train. Our model achieves 28.4 BLEU on the WMT 2014 English-to-German translation task, improving over the existing best results, including ensembles, by over 2 BLEU.",
  oneLiner:
    "This paper introduced the Transformer — the architecture that replaced recurrent networks with pure attention and became the foundation of GPT, BERT, and modern AI.",
  readingTime: "12 min interactive",
  difficulty: "Foundational",

  explainLevels: {
    beginner: [
      {
        heading: "The big idea",
        body: "Imagine a classroom where students must pass a message down a line, one person at a time. By the end, the message is garbled — that's how older AI models (RNNs) read sentences: word by word, slowly forgetting the beginning. The Transformer changes the classroom: now every student can listen to every other student at the same time. Each word in a sentence can directly 'look at' every other word and decide which ones matter for understanding it.",
      },
      {
        heading: "Why 'attention'?",
        body: "When you read the sentence 'The animal didn't cross the street because it was too tired', your brain instantly knows 'it' means the animal, not the street. You paid attention to the right word. The Transformer gives AI that same skill — a mathematical way for each word to focus on the words that explain it.",
      },
      {
        heading: "Why it was a breakthrough",
        body: "Because every word is processed at the same time instead of one-by-one, Transformers train dramatically faster on modern hardware (GPUs love parallel work). Faster training meant researchers could build much bigger models — and those bigger models became GPT, ChatGPT, and almost every AI system you use today.",
      },
    ],
    developer: [
      {
        heading: "Architecture in one paragraph",
        body: "The Transformer is an encoder–decoder model with no recurrence and no convolutions. The encoder is a stack of 6 identical layers, each containing multi-head self-attention followed by a position-wise feed-forward network, with residual connections and layer normalization around each sub-layer. The decoder adds a third sub-layer that performs attention over the encoder output, plus causal masking so position i can only attend to positions < i during generation.",
      },
      {
        heading: "The core operation",
        body: "Self-attention projects each token embedding into three vectors — Query, Key, Value — via learned weight matrices. Attention scores are computed as scaled dot products between queries and keys, softmaxed into weights, then used to take a weighted sum of values. Multi-head attention runs this 8 times in parallel with different projections (d_model=512 split into 8 heads of d_k=64), letting different heads specialize — one may track syntax, another coreference.",
      },
      {
        heading: "Engineering wins",
        body: "Self-attention is O(1) sequential operations per layer versus O(n) for RNNs — the whole sequence is one batched matrix multiply, which saturates GPU throughput. Since attention itself is permutation-invariant, sinusoidal positional encodings are added to embeddings to inject word order. Training used Adam with warmup + inverse-sqrt LR decay, dropout 0.1, and label smoothing 0.1. Base model: ~65M params, 12 hours on 8× P100s.",
      },
    ],
    researcher: [
      {
        heading: "Motivation and prior work",
        body: "Sequence transduction was dominated by RNN encoder-decoders (Sutskever et al., 2014) augmented with attention (Bahdanau et al., 2015), and by convolutional approaches (ByteNet, ConvS2S) that improved parallelism but required O(n) or O(log n) operations to relate distant positions. The Transformer reduces path length between any two positions to O(1), directly addressing the long-range dependency bottleneck, at the cost of O(n²·d) per-layer complexity — favorable when sequence length n < representation dimensionality d, as is typical for sentence-level MT.",
      },
      {
        heading: "Key design decisions",
        body: "Scaled dot-product attention divides logits by √d_k to counteract the variance growth of dot products in high dimensions, which pushes softmax into low-gradient saturation. Multi-head attention (h=8, d_k=d_v=64) restores the model's ability to attend to different representational subspaces, which a single averaged head suppresses. The position-wise FFN (d_ff=2048) is equivalent to two 1×1 convolutions and stores the bulk of parameters. Sinusoidal encodings were chosen over learned embeddings for potential extrapolation to longer sequences (both performed near-identically).",
      },
      {
        heading: "Results and significance",
        body: "WMT 2014 En→De: 28.4 BLEU (big model), beating all prior single models and ensembles by >2 BLEU. En→Fr: 41.8 BLEU at a fraction of prior training cost (3.5 days on 8 GPUs). Ablations (Table 3) show head count has an optimum (single-head is −0.9 BLEU; too many heads also degrades), and d_k reduction hurts, suggesting dot-product compatibility is non-trivial. The architecture also generalized to English constituency parsing with minimal tuning. In retrospect, the paper's deepest contribution was establishing a maximally parallelizable, scale-friendly backbone — the substrate for the scaling-law era (BERT, GPT-2/3/4, ViT, AlphaFold 2).",
      },
    ],
  },

  psi: {
    problem: {
      title: "Sequential processing was the bottleneck",
      points: [
        "RNNs read text one word at a time — computation cannot be parallelized across a sequence.",
        "Information from early words degrades over long distances (vanishing gradients).",
        "Training large models on large datasets was painfully slow and expensive.",
      ],
      analogy:
        "Like passing a message down a long line of people — slow, and the start of the message gets garbled.",
    },
    solution: {
      title: "Self-attention replaces recurrence entirely",
      points: [
        "Every word directly attends to every other word in one step — no chain of dependencies.",
        "Multi-head attention lets the model track several relationship types simultaneously.",
        "The whole sequence becomes one big matrix multiplication — perfect for GPUs.",
      ],
      analogy:
        "Like a meeting where everyone hears everyone at once, and each person decides who to listen to.",
    },
    impact: {
      title: "The foundation of modern AI",
      points: [
        "Direct ancestor of GPT, BERT, Claude, Gemini, and every modern large language model.",
        "Extended beyond text: Vision Transformers, AlphaFold 2, Whisper, and multimodal models.",
        "One of the most-cited AI papers ever — it started the scaling era of AI.",
      ],
      analogy:
        "The 'internal combustion engine' moment of AI — one design that everything since is built on.",
    },
  },

  architecture: {
    nodes: [
      {
        id: "input",
        label: "Input Tokens",
        sublabel: '"The cat sat"',
        kind: "io",
        description:
          "The raw sentence is split into tokens (roughly words or word-pieces). Each token gets an ID from a fixed vocabulary of ~37,000 entries.",
        example:
          '"The cat sat" → [1996, 4937, 2938] — just numbers pointing into a vocabulary table.',
        detail:
          "The paper uses byte-pair encoding (BPE), which splits rare words into common sub-pieces so the model never sees a truly unknown word.",
      },
      {
        id: "embedding",
        label: "Embedding",
        sublabel: "tokens → vectors",
        kind: "process",
        description:
          "Each token ID is converted to a 512-dimensional vector of learned numbers. Words with similar meanings end up with similar vectors.",
        example:
          '"cat" → [0.21, -1.30, 0.77, …] (512 numbers). "kitten" gets a nearby vector; "carburetor" a distant one.',
        detail:
          "Embeddings are multiplied by √d_model, and the same weight matrix is shared with the final output projection — a parameter-saving trick from the paper.",
      },
      {
        id: "posenc",
        label: "Positional Encoding",
        sublabel: "inject word order",
        kind: "process",
        description:
          "Attention treats input as an unordered set, so a unique 'position fingerprint' made of sine and cosine waves is added to each embedding.",
        example:
          "Without it, 'dog bites man' and 'man bites dog' would look identical to the model.",
        detail:
          "PE(pos, 2i) = sin(pos/10000^(2i/d)). Different frequencies per dimension act like the hands of a clock — together they encode position uniquely and let the model learn relative offsets.",
      },
      {
        id: "attention",
        label: "Multi-Head Self-Attention",
        sublabel: "every word looks at every word",
        kind: "core",
        description:
          "The heart of the paper. Each word asks a question (Query), every word advertises what it offers (Key), and information flows from the best matches (Values). Eight heads run in parallel, each learning a different kind of relationship.",
        example:
          "For 'it' in \"The animal didn't cross the street because it was too tired\", one attention head links 'it' strongly to 'animal'.",
        detail:
          "Attention(Q,K,V) = softmax(QKᵀ/√d_k)V. With 8 heads of dimension 64, one head may track subject–verb agreement, another coreference, another adjacent-word syntax.",
      },
      {
        id: "addnorm1",
        label: "Add & Norm",
        sublabel: "residual + layer norm",
        kind: "support",
        description:
          "The layer's input is added back to its output (a residual 'shortcut'), then values are normalized. This keeps gradients healthy in deep stacks.",
        example:
          "Like keeping your original draft and stapling the edits on top, instead of rewriting from scratch each round.",
        detail:
          "output = LayerNorm(x + Sublayer(x)). Residual connections are why a 6-layer (and later 96-layer) stack can train stably.",
      },
      {
        id: "ffn",
        label: "Feed-Forward Network",
        sublabel: "per-word thinking step",
        kind: "core",
        description:
          "After gathering context via attention, each word is processed independently by a small 2-layer neural network that expands to 2048 dimensions, applies ReLU, and compresses back to 512.",
        example:
          "Attention is the 'group discussion'; the FFN is each word going away to 'think about' what it heard.",
        detail:
          "FFN(x) = max(0, xW₁ + b₁)W₂ + b₂. Applied identically at every position. Later research showed these layers act like key–value memories storing factual knowledge.",
      },
      {
        id: "addnorm2",
        label: "Add & Norm",
        sublabel: "×6 layers total",
        kind: "support",
        description:
          "Another residual + normalization closes the encoder layer. The full block (attention → FFN) is stacked 6 times, each stack refining the representation.",
        example:
          "Layer 1 might resolve basic syntax; by layer 6 the vectors encode rich, contextual meaning.",
        detail:
          "The encoder output is a sequence of context-rich vectors — one per input token — consumed by the decoder's cross-attention.",
      },
      {
        id: "decoder",
        label: "Decoder Stack",
        sublabel: "masked attention + cross-attention",
        kind: "core",
        description:
          "The decoder generates output one token at a time. It uses masked self-attention (can't peek at future words) plus cross-attention that queries the encoder's output — this is where translation actually 'happens'.",
        example:
          "Generating French word 3, the decoder attends to French words 1–2 (masked self-attention) and to the entire English sentence (cross-attention).",
        detail:
          "The mask sets future positions to −∞ before softmax. Cross-attention uses decoder Queries against encoder Keys/Values — the same mechanism GPT later dropped by using a decoder-only design.",
      },
      {
        id: "output",
        label: "Linear + Softmax",
        sublabel: "next-word probabilities",
        kind: "io",
        description:
          "A final linear layer maps each 512-dim vector to a score for every vocabulary word, and softmax turns scores into probabilities. The most likely token becomes the next output word.",
        example:
          'After "Le chat s\'est", the model might assign: "assis" 84%, "endormi" 9%, everything else <1%.',
        detail:
          "Beam search with beam size 4 and length penalty 0.6 picks the final translation. This same 'predict the next token' head is how GPT models generate text today.",
      },
    ],
    edges: [
      { source: "input", target: "embedding" },
      { source: "embedding", target: "posenc" },
      { source: "posenc", target: "attention" },
      { source: "attention", target: "addnorm1" },
      { source: "addnorm1", target: "ffn" },
      { source: "ffn", target: "addnorm2" },
      { source: "addnorm2", target: "decoder" },
      { source: "decoder", target: "output" },
    ],
  },

  math: [
    {
      id: "scaled-dot-attention",
      name: "Scaled Dot-Product Attention",
      formula:
        "\\mathrm{Attention}(Q, K, V) = \\mathrm{softmax}\\!\\left(\\frac{QK^{T}}{\\sqrt{d_k}}\\right)V",
      meaning:
        "For each word, compare its Query against every word's Key to get relevance scores, scale them down, convert to percentages with softmax, then blend the Values using those percentages.",
      analogy:
        "You're at a library with a question (Q). Every book has a title on its spine (K) and content inside (V). You compare your question to every title, decide how relevant each book is, then read a mix of the books weighted by relevance.",
      breakdown: [
        { symbol: "Q", meaning: "Query — what information is this word looking for?" },
        { symbol: "K", meaning: "Key — what information does each word advertise?" },
        { symbol: "V", meaning: "Value — the actual information each word carries." },
        { symbol: "\\sqrt{d_k}", meaning: "Scaling factor — keeps scores small so softmax doesn't saturate and kill gradients." },
        { symbol: "\\mathrm{softmax}", meaning: "Turns raw scores into attention weights that sum to 100%." },
      ],
    },
    {
      id: "multi-head",
      name: "Multi-Head Attention",
      formula:
        "\\mathrm{MultiHead}(Q,K,V) = \\mathrm{Concat}(\\mathrm{head}_1, \\ldots, \\mathrm{head}_h)W^{O}",
      meaning:
        "Instead of one attention computation, run 8 smaller ones in parallel — each with its own learned Q/K/V projections — then concatenate the results and mix them with one final matrix.",
      analogy:
        "Eight specialists read the same sentence: a grammar expert, a pronoun-tracker, a rhyme detector… Each reports what they noticed, and a manager (Wᴼ) combines their reports into one summary.",
      breakdown: [
        { symbol: "h = 8", meaning: "Number of parallel attention heads in the paper." },
        { symbol: "\\mathrm{head}_i", meaning: "One attention computation with its own learned projections — free to specialize." },
        { symbol: "W^{O}", meaning: "Output matrix that blends all heads back into a single 512-dim vector." },
      ],
    },
    {
      id: "positional-encoding",
      name: "Sinusoidal Positional Encoding",
      formula:
        "PE_{(pos, 2i)} = \\sin\\!\\left(\\frac{pos}{10000^{2i/d_{model}}}\\right)",
      meaning:
        "Each position in the sentence gets a unique fingerprint built from sine and cosine waves at different frequencies, which is added to the word's embedding.",
      analogy:
        "Like a clock with many hands moving at different speeds — hour, minute, second. Any moment in time is uniquely identified by the combination of all hand positions. Here, every word position gets its own unique 'clock reading'.",
      breakdown: [
        { symbol: "pos", meaning: "The word's position in the sentence (1st, 2nd, 3rd…)." },
        { symbol: "i", meaning: "Which of the 512 dimensions — each pair of dimensions gets its own wave frequency." },
        { symbol: "10000^{2i/d}", meaning: "Makes wavelengths range from very short to very long, so both nearby and distant positions are distinguishable." },
      ],
    },
    {
      id: "ffn",
      name: "Position-wise Feed-Forward Network",
      formula: "\\mathrm{FFN}(x) = \\max(0,\\, xW_1 + b_1)\\,W_2 + b_2",
      meaning:
        "Each word's vector is independently expanded to 2048 dimensions, passed through ReLU (which zeroes out negatives), and compressed back to 512. Same weights for every position.",
      analogy:
        "After the group discussion (attention), each student goes home to process their notes alone. Everyone uses the same 'thinking method', but on their own notes.",
      breakdown: [
        { symbol: "W_1", meaning: "Expands from 512 → 2048 dimensions — room to compute richer features." },
        { symbol: "\\max(0, \\cdot)", meaning: "ReLU activation — keeps positive signals, discards negative ones, adding non-linearity." },
        { symbol: "W_2", meaning: "Compresses 2048 → 512 so the output fits the next layer." },
      ],
    },
  ],

  applications: [
    {
      icon: "message-square",
      title: "ChatGPT, Claude & Gemini",
      description:
        "Every modern large language model is a Transformer. GPT models are decoder-only Transformers scaled to billions of parameters — architecturally, they're this paper minus the encoder.",
    },
    {
      icon: "search",
      title: "Google Search",
      description:
        "BERT — an encoder-only Transformer — has powered Google Search query understanding since 2019, affecting billions of searches daily.",
    },
    {
      icon: "languages",
      title: "Machine Translation",
      description:
        "The paper's original task. Google Translate, DeepL, and virtually all production translation systems moved to Transformer backbones within two years of publication.",
    },
    {
      icon: "eye",
      title: "Computer Vision",
      description:
        "Vision Transformers (ViT, 2020) treat image patches as 'words', beating convolutional networks at scale. They power modern image classification, detection, and generation.",
    },
    {
      icon: "dna",
      title: "AlphaFold 2",
      description:
        "DeepMind's protein-structure breakthrough — which earned a share of the 2024 Nobel Prize in Chemistry — is built on attention over amino-acid sequences.",
    },
    {
      icon: "code",
      title: "GitHub Copilot & code AI",
      description:
        "Code-generation models like Copilot and Claude Code are Transformers trained on source code — attention tracks variables and scope across a file the way it tracks pronouns in a sentence.",
    },
  ],

  codeExample: {
    language: "python",
    title: "Self-Attention from scratch in PyTorch",
    explanation:
      "This is a minimal, readable implementation of the paper's core idea — scaled dot-product self-attention with multiple heads. Real implementations add dropout, masking, and fused kernels, but this is the essence.",
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F


class MultiHeadSelfAttention(nn.Module):
    """The core mechanism from 'Attention Is All You Need'."""

    def __init__(self, d_model: int = 512, n_heads: int = 8):
        super().__init__()
        assert d_model % n_heads == 0
        self.d_k = d_model // n_heads   # 64 per head, as in the paper
        self.n_heads = n_heads

        # Learned projections for Query, Key, Value (+ output mix)
        self.w_q = nn.Linear(d_model, d_model)
        self.w_k = nn.Linear(d_model, d_model)
        self.w_v = nn.Linear(d_model, d_model)
        self.w_o = nn.Linear(d_model, d_model)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # x: (batch, seq_len, d_model)
        B, T, C = x.shape

        # 1. Project into Q, K, V and split into heads
        #    (batch, heads, seq_len, d_k)
        q = self.w_q(x).view(B, T, self.n_heads, self.d_k).transpose(1, 2)
        k = self.w_k(x).view(B, T, self.n_heads, self.d_k).transpose(1, 2)
        v = self.w_v(x).view(B, T, self.n_heads, self.d_k).transpose(1, 2)

        # 2. Attention scores: how relevant is every word to every word?
        #    scaled by sqrt(d_k) so softmax stays in a healthy range
        scores = (q @ k.transpose(-2, -1)) / (self.d_k ** 0.5)

        # 3. Softmax -> attention weights that sum to 1 per word
        weights = F.softmax(scores, dim=-1)

        # 4. Weighted sum of values: each word gathers information
        #    from the words it attends to
        context = weights @ v                     # (B, heads, T, d_k)

        # 5. Merge heads back together and mix
        context = context.transpose(1, 2).reshape(B, T, C)
        return self.w_o(context)


# --- Try it ---
attn = MultiHeadSelfAttention(d_model=512, n_heads=8)
sentence = torch.randn(1, 10, 512)   # batch of 1, 10 tokens
out = attn(sentence)
print(out.shape)                     # torch.Size([1, 10, 512])`,
  },

  chatSuggestions: [
    "What is the main innovation of this paper?",
    "Why is attention better than RNNs?",
    "Explain the √d_k scaling factor",
    "What do the 8 attention heads actually learn?",
    "How did this lead to GPT?",
  ],

  course: {
    title: "The Transformer, from zero",
    description:
      "A 4-lesson mini course that takes you from 'why old models failed' to building attention in code.",
    lessons: [
      {
        id: "lesson-1",
        number: 1,
        title: "Why RNNs failed",
        duration: "6 min",
        summary: "The bottleneck that made a revolution necessary.",
        sections: [
          {
            heading: "One word at a time",
            body: "Before 2017, language AI read text the way you read a ticker tape: strictly left to right, one word per step. A Recurrent Neural Network (RNN) keeps a single 'memory' vector that gets updated after each word. By the time it reaches word 50, that memory must somehow still contain word 1 — and mostly, it doesn't.",
          },
          {
            heading: "Two fatal problems",
            body: "First: long-range forgetting. Gradients shrink as they flow backward through many steps ('vanishing gradients'), so the model can't learn connections between distant words. Second: no parallelism. Step 50 needs step 49's result, so a GPU with thousands of cores sits mostly idle. Training was slow, and slow training capped how big models could get.",
          },
          {
            heading: "The patch that hinted at the cure",
            body: "In 2015, researchers bolted an 'attention' mechanism onto RNN translators: while producing each output word, the model could glance back at all input words. It helped enormously — and buried in that fix was a radical question: if attention does the heavy lifting, do we need the RNN at all?",
          },
        ],
        keyTakeaway:
          "RNNs were slow (sequential) and forgetful (vanishing gradients). Attention started as a patch for RNNs — this paper made it the whole engine.",
        quiz: {
          question: "Why couldn't RNNs take full advantage of GPUs?",
          options: [
            { text: "GPUs didn't support neural networks yet", correct: false, explanation: "GPUs powered deep learning well before 2017 — the problem was the RNN's structure, not the hardware." },
            { text: "Each step depends on the previous step, so words can't be processed in parallel", correct: true, explanation: "Exactly. Sequential dependency means thousands of GPU cores wait in line — the Transformer removed that dependency." },
            { text: "RNNs used too much memory", correct: false, explanation: "Memory wasn't the core issue — RNNs are actually compact. The bottleneck was sequential computation." },
            { text: "RNNs only worked on CPUs", correct: false, explanation: "RNNs ran on GPUs — they just couldn't fill them with parallel work." },
          ],
        },
      },
      {
        id: "lesson-2",
        number: 2,
        title: "The attention mechanism",
        duration: "8 min",
        summary: "Queries, Keys, and Values — the library analogy.",
        sections: [
          {
            heading: "Three roles for every word",
            body: "Self-attention gives every word three learned vectors. The Query asks: 'what am I looking for?' The Key advertises: 'here's what I offer.' The Value carries: 'here's my actual information.' The word 'it' might emit a query like 'seeking: a noun I refer to', and 'animal' emits a key that matches it strongly.",
          },
          {
            heading: "Scoring and blending",
            body: "Each word's query is compared (dot product) against every word's key, producing relevance scores. Scores are divided by √d_k — without this, scores grow large in high dimensions and softmax becomes a harsh winner-take-all with near-zero gradients. Softmax turns scores into percentages, and each word's new representation is the percentage-weighted blend of all the values.",
          },
          {
            heading: "Eight heads are better than one",
            body: "One attention pattern must average all relationship types together. Instead, the paper splits the 512-dimensional space into 8 heads of 64 dimensions, each with its own Q/K/V projections. Heads specialize: analyses of trained Transformers find heads tracking syntax, coreference, adjacent words, even rare-word copying.",
          },
        ],
        keyTakeaway:
          "Attention = every word querying every other word and blending the best matches. Multiple heads let different relationship types coexist.",
        quiz: {
          question: "In the library analogy, what does the Key represent?",
          options: [
            { text: "The question you walk in with", correct: false, explanation: "That's the Query — what a word is looking for." },
            { text: "The title on each book's spine, advertising its contents", correct: true, explanation: "Right — Keys are what each word advertises, matched against Queries to compute relevance." },
            { text: "The actual content inside the book", correct: false, explanation: "That's the Value — the information that flows once a match is found." },
            { text: "The librarian who sorts books", correct: false, explanation: "There's no librarian — matching is a direct dot product between Queries and Keys." },
          ],
        },
      },
      {
        id: "lesson-3",
        number: 3,
        title: "The full architecture",
        duration: "10 min",
        summary: "Stacking attention into encoders and decoders.",
        sections: [
          {
            heading: "The encoder: understanding",
            body: "The encoder's job is to read the input sentence and build rich representations. Each of its 6 layers does two things: multi-head self-attention (gather context from other words), then a feed-forward network (process that context independently per word). Residual connections and layer normalization around every sub-layer keep the deep stack trainable.",
          },
          {
            heading: "The decoder: generating",
            body: "The decoder writes the output one token at a time. Its self-attention is masked — position 5 can only see positions 1–4, never the future — which is what makes generation honest. A second attention block, cross-attention, lets each output word query the entire encoded input. For translation, this is where French words 'look up' the relevant English words.",
          },
          {
            heading: "Order from chaos",
            body: "Pure attention is order-blind: shuffle the input words and you get the same (shuffled) result. The fix is positional encoding — sine and cosine waves of different frequencies added to each embedding, giving every position a unique fingerprint the model can learn to use for both absolute and relative positioning.",
          },
        ],
        keyTakeaway:
          "Encoder = bidirectional understanding. Decoder = masked generation + cross-attention. Positional encodings restore word order. GPT later kept only the decoder; BERT kept only the encoder.",
        quiz: {
          question: "Why does the decoder mask future positions in its self-attention?",
          options: [
            { text: "To save computation", correct: false, explanation: "The mask barely changes compute — it changes what the model is allowed to see." },
            { text: "Because future tokens don't exist yet at generation time — training must match that", correct: true, explanation: "Exactly. If the model peeked at future words during training, it would learn to cheat and fail at real generation." },
            { text: "To prevent overfitting", correct: false, explanation: "Masking isn't a regularizer — dropout and label smoothing handle that." },
            { text: "Because the encoder already saw those positions", correct: false, explanation: "The encoder sees the *input* sentence; the mask concerns the decoder's own *output* so far." },
          ],
        },
      },
      {
        id: "lesson-4",
        number: 4,
        title: "Build attention in code",
        duration: "12 min",
        summary: "From equation to working PyTorch, line by line.",
        sections: [
          {
            heading: "The five steps",
            body: "Every attention implementation is the same five steps: (1) project the input into Q, K, V with three linear layers; (2) compute scores = QKᵀ/√d_k; (3) softmax the scores into weights; (4) multiply weights by V to gather information; (5) for multi-head, split dimensions into heads before step 2 and merge them after step 4.",
          },
          {
            heading: "Reading the shapes",
            body: "Shapes tell the story. Input: (batch, seq_len, 512). After projecting and splitting into 8 heads: (batch, 8, seq_len, 64). The score matrix is (batch, 8, seq_len, seq_len) — literally 'every word × every word' relevance, per head. That seq_len² is both the mechanism's power and its famous quadratic cost.",
          },
          {
            heading: "From toy to GPT",
            body: "Scale this exact code up — more layers, wider dimensions, trained on internet-scale text to predict the next token — and you get GPT. The 2017 base model had 65M parameters; GPT-3 has 175B. The core forward pass you just read is essentially unchanged. That's the mark of a great architecture: it scaled for eight years without needing to be redesigned.",
          },
        ],
        keyTakeaway:
          "Attention is ~20 lines of PyTorch: project, score, scale, softmax, blend. Everything since is mostly scale.",
        quiz: {
          question: "The attention score matrix has shape (batch, heads, seq_len, seq_len). What does this imply about cost?",
          options: [
            { text: "Cost grows linearly with sentence length", correct: false, explanation: "The seq_len × seq_len matrix means every word scores every word — that's quadratic, not linear." },
            { text: "Cost grows quadratically with sentence length", correct: true, explanation: "Correct — doubling the sequence quadruples the score matrix. This O(n²) cost is why long-context research (FlashAttention, sparse attention) exists." },
            { text: "Cost is constant regardless of length", correct: false, explanation: "The matrix dimensions literally scale with seq_len — twice." },
            { text: "Cost depends only on the number of heads", correct: false, explanation: "Heads add a constant factor; the quadratic term comes from seq_len × seq_len." },
          ],
        },
      },
    ],
  },
};
