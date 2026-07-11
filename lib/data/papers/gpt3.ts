import type { Paper } from "../types";

export const gpt3Paper: Paper = {
  id: "2005.14165",
  slug: "gpt-3-few-shot-learners",
  arxivId: "2005.14165",
  title: "Language Models are Few-Shot Learners (GPT-3)",
  authors: ["Tom B. Brown", "Benjamin Mann", "Nick Ryder", "Melanie Subbiah", "et al. (31 authors, OpenAI)"],
  year: 2020,
  venue: "NeurIPS 2020",
  citationCount: 45000,
  tags: ["LLM", "Scaling", "Few-Shot Learning", "NLP", "Foundational"],
  abstract:
    "We train GPT-3, an autoregressive language model with 175 billion parameters, 10x more than any previous non-sparse language model, and test its performance in the few-shot setting. For all tasks, GPT-3 is applied without any gradient updates or fine-tuning, with tasks and few-shot demonstrations specified purely via text interaction with the model. GPT-3 achieves strong performance on many NLP datasets, including translation, question-answering, and cloze tasks, as well as several tasks that require on-the-fly reasoning or domain adaptation.",
  oneLiner:
    "This paper showed that a large enough language model needs no retraining to learn new tasks — just show it a few examples in the prompt. That discovery is why you can simply talk to AI today.",
  readingTime: "11 min interactive",
  difficulty: "Foundational",

  explainLevels: {
    beginner: [
      {
        heading: "One model, every task",
        body: "Before GPT-3, every AI task needed its own specially-trained model: one for translation, one for answering questions, one for summarizing. GPT-3 changed the deal: one giant model, frozen, never retrained — and you 'program' it just by typing. Show it two examples of English→French in your message, and it translates the third line. It learned the task from your prompt, in the moment.",
      },
      {
        heading: "How big is 175 billion?",
        body: "GPT-3 has 175 billion parameters — the little numbers the network tunes while learning. That was 10× larger than any comparable model before it, and over 100× larger than GPT-2. It read roughly 300 billion words' worth of internet text, books, and Wikipedia during training. The bet was simple and audacious: don't invent a cleverer architecture — take the Transformer and make it enormous.",
      },
      {
        heading: "Why this paper matters to you",
        body: "The skill GPT-3 revealed — 'in-context learning', where the model picks up a task from examples in the prompt — is the direct ancestor of chatting with AI. ChatGPT, Claude, and Gemini all work because scale made models that understand instructions written in plain language. This paper is the moment AI stopped needing programmers for every new task and started needing only a good prompt.",
      },
    ],
    developer: [
      {
        heading: "Architecture: GPT-2, scaled hard",
        body: "GPT-3 is a decoder-only Transformer — the same architecture family as GPT-2, with alternating dense and locally-banded sparse attention patterns. The 175B model: 96 layers, d_model = 12,288, 96 attention heads of dimension 128, context window of 2,048 tokens. The paper trains 8 sizes from 125M to 175B specifically to measure how ability scales. Training the largest model cost about 3,640 petaflop/s-days.",
      },
      {
        heading: "The evaluation protocol",
        body: "Every task is evaluated three ways with the weights frozen — no gradient updates ever. Zero-shot: instruction only ('Translate to French: cheese →'). One-shot: instruction plus one worked example. Few-shot: 10–100 examples packed into the 2,048-token context. Task 'learning' happens entirely inside the forward pass, conditioned on the prompt — that's in-context learning.",
      },
      {
        heading: "Data and results",
        body: "Training mix: ~300B tokens — filtered Common Crawl (60% of the mix), WebText2, two book corpora, and Wikipedia, with higher-quality sources oversampled. Few-shot results: LAMBADA 86.4%, TriviaQA 71.2% (beating fine-tuned open-domain SOTA), near fine-tuned-BERT-level SuperGLUE, ~100% on 2-digit addition. And the gap between zero-, one-, and few-shot widens with model size — bigger models are better in-context learners, which is the paper's core finding.",
      },
    ],
    researcher: [
      {
        heading: "The paradigm claim",
        body: "The paper positions few-shot prompting against the pretrain-then-fine-tune paradigm (BERT, T5): fine-tuning needs task-specific datasets, risks spurious in-distribution exploitation, and produces one checkpoint per task. GPT-3's claim is meta-learning via language modeling: pre-training implicitly trains a distribution over tasks, and conditioning on demonstrations at inference performs task inference. The consistent size-dependence of the zero/one/few-shot gaps (Figure 1.2) is the key evidence that in-context learning is an emergent capability of scale rather than a fixed property of the objective.",
      },
      {
        heading: "Methodological care and caveats",
        body: "Notable rigor: a train-test contamination study (a Common Crawl deduplication bug is disclosed and analyzed), 8-model scaling sweeps consistent with Kaplan et al.'s power laws, and human evaluation of generated news articles (detection accuracy ~52% — chance level). Known weaknesses are documented: text synthesis coherence over long spans, 'comparison' tasks (e.g., WIC), natural language inference, and bidirectional-context tasks where autoregressive decoding is structurally disadvantaged.",
      },
      {
        heading: "Impact and lineage",
        body: "GPT-3 validated compute-optimal scaling as a research strategy and effectively launched prompting as a field (chain-of-thought, instruction tuning, and RLHF all build on its in-context foundation — InstructGPT and ChatGPT are its direct descendants). The paper's societal-impact section (bias, misuse, energy) also set the template for model cards and staged release debates. In retrospect it marks the transition from NLP-as-benchmarks to general-purpose language interfaces.",
      },
    ],
  },

  psi: {
    problem: {
      title: "Every task demanded its own trained model",
      points: [
        "The dominant recipe — pretrain, then fine-tune — required thousands of labeled examples per task.",
        "Each new task meant a new dataset, a new training run, and a new model checkpoint to maintain.",
        "Humans don't work this way: we learn a new task from a couple of examples and a description.",
      ],
      analogy:
        "Like needing to send an employee back to school for a semester every time you want them to do a slightly different job.",
    },
    solution: {
      title: "Scale until examples in the prompt are enough",
      points: [
        "Train one decoder-only Transformer at unprecedented size: 175B parameters on ~300B tokens.",
        "Specify tasks purely in text: instructions plus 0, 1, or a few examples in the context window.",
        "No gradient updates at task time — the model infers the task during the forward pass.",
      ],
      analogy:
        "A hugely well-read new hire: show them two filled-out forms and they correctly fill out the third — no training course needed.",
    },
    impact: {
      title: "Prompting replaced programming",
      points: [
        "In-context learning became the interface: instruction tuning and RLHF turned it into ChatGPT and Claude.",
        "Validated the scaling hypothesis — capability grows smoothly and predictably with size and compute.",
        "Started the era of general-purpose AI: one model, any task you can describe in words.",
      ],
      analogy:
        "The moment computers stopped needing code for every new job and started taking instructions in plain English.",
    },
  },

  architecture: {
    nodes: [
      {
        id: "prompt",
        label: "The Prompt",
        sublabel: "instructions + examples",
        kind: "io",
        description:
          "Everything GPT-3 knows about your task fits here: an instruction and optionally a few worked examples, packed into a 2,048-token context window. This text IS the programming.",
        example:
          "\"Translate English to French. sea otter → loutre de mer. cheese →\" — two lines that teach a frozen model a task.",
        detail:
          "Few-shot evaluation uses 10–100 examples, limited by the context window. No weights change — this is the entire 'training' the model gets for your task.",
      },
      {
        id: "tokenize",
        label: "Tokenization",
        sublabel: "BPE, ~50k vocabulary",
        kind: "process",
        description:
          "The prompt is split into subword tokens — the same byte-pair encoding idea introduced for translation models, now covering all of internet text.",
        example: "\"cheese\" might be one token; \"loutre\" might split into pieces like \"lou\" + \"tre\".",
        detail:
          "GPT-3 uses GPT-2's tokenizer (~50,257 tokens). Everything downstream — the 2,048 window, the output distribution — is measured in these tokens.",
      },
      {
        id: "embedding",
        label: "Embeddings",
        sublabel: "tokens → 12,288-dim vectors",
        kind: "process",
        description:
          "Each token becomes a 12,288-dimensional vector, plus a learned position signal. Compare: the original Transformer used 512 dimensions — GPT-3's vectors are 24× wider.",
        example: "One token = a point in a space with 12,288 coordinates — room for enormous nuance.",
        detail:
          "d_model = 12,288 is where much of the 175B parameter count lives: the embedding matrix alone holds ~617M parameters.",
      },
      {
        id: "decoder",
        label: "96 Decoder Blocks",
        sublabel: "masked attention + FFN, ×96",
        kind: "core",
        description:
          "The heart: 96 stacked Transformer decoder blocks, each with masked multi-head self-attention (96 heads) and a feed-forward network, wrapped in residual connections. Each token can attend to everything before it — including your examples.",
        example:
          "While predicting the French translation, attention heads look back at your worked examples — this is where in-context learning physically happens.",
        detail:
          "Masked attention means position t sees only positions < t. The blocks alternate dense and locally-banded sparse attention. It's the 2017 Transformer's decoder, scaled: 512→12,288 dims, 6→96 layers, 8→96 heads.",
      },
      {
        id: "distribution",
        label: "Next-Token Distribution",
        sublabel: "50k probabilities",
        kind: "core",
        description:
          "The final layer outputs a probability for every token in the vocabulary — the model's complete belief about what comes next, shaped by your entire prompt.",
        example:
          "After \"cheese →\" with translation examples in context: 'from' gets ~1%, 'fro' + 'mage' dominate.",
        detail:
          "This is exactly the distribution you manipulate in the Next-Token Playground below — temperature and top-p act on these real numbers in production systems.",
      },
      {
        id: "sample",
        label: "Sampling",
        sublabel: "temperature, top-p",
        kind: "process",
        description:
          "One token is drawn from the distribution — deterministic-ish at low temperature, creative at high. The chosen token is appended to the context.",
        example: "The model samples 'fro', then 'mage' — building 'fromage' piece by piece.",
        detail:
          "The paper uses nucleus (top-p) sampling for generation tasks. Sampling settings are why the same prompt can give different answers.",
      },
      {
        id: "loop",
        label: "The Autoregressive Loop",
        sublabel: "append & repeat",
        kind: "core",
        description:
          "The new token joins the prompt and the whole process repeats — one token at a time until the answer is complete. Every word ChatGPT has ever 'said' came from this loop.",
        example: "prompt → 'fro' → prompt+'fro' → 'mage' → done: 'fromage'.",
        detail:
          "Generation cost scales with output length: each token requires a full forward pass through all 96 layers (with cached attention keys/values for the past).",
      },
      {
        id: "output",
        label: "Completion",
        sublabel: "the task, performed",
        kind: "io",
        description:
          "The final text: a translation, an answer, an essay, working code. The model was never trained for your specific task — it inferred it from the prompt alone.",
        example: "\"cheese → fromage\" — task learned and executed with zero gradient updates.",
        detail:
          "Few-shot GPT-3 hit 86.4% on LAMBADA and beat fine-tuned open-domain SOTA on TriviaQA (71.2%) this way — a frozen model competing with task-specific ones.",
      },
    ],
    edges: [
      { source: "prompt", target: "tokenize" },
      { source: "tokenize", target: "embedding" },
      { source: "embedding", target: "decoder" },
      { source: "decoder", target: "distribution" },
      { source: "distribution", target: "sample" },
      { source: "sample", target: "loop" },
      { source: "loop", target: "output" },
    ],
  },

  math: [
    {
      id: "autoregressive",
      name: "The Autoregressive Objective",
      formula: "P(x) = \\prod_{t=1}^{n} P(x_t \\mid x_1, \\ldots, x_{t-1})",
      meaning:
        "The probability of a whole text is built one token at a time: each token's probability depends on everything before it. Training just maximizes this on 300B tokens — 'predict the next word' is the entire objective.",
      analogy:
        "Reading a mystery novel and constantly guessing the next word. Get good enough at that game, and you've implicitly learned grammar, facts, logic, and style — because they all help you guess.",
      breakdown: [
        { symbol: "x_t", meaning: "The token at position t — the thing being predicted." },
        { symbol: "x_1, \\ldots, x_{t-1}", meaning: "The entire context before it — up to 2,047 tokens of prompt and prior output." },
        { symbol: "\\prod", meaning: "Multiply the per-token probabilities: a text is likely only if every step of it is." },
      ],
    },
    {
      id: "in-context",
      name: "In-Context Learning as Conditioning",
      formula: "P(\\text{answer} \\mid \\text{examples},\\ \\text{query})",
      meaning:
        "Few-shot 'learning' is just conditional probability: the examples sit in the context, and the model's next-token distribution shifts to be consistent with the pattern they establish. No weights move — the 'learning' is inference.",
      analogy:
        "A pub-quiz veteran who's seen a million question styles: read them two sample Q&As and they instantly adopt the format. They didn't study — they recognized.",
      breakdown: [
        { symbol: "\\text{examples}", meaning: "The K worked demonstrations in the prompt (K = 0, 1, or 10–100)." },
        { symbol: "\\text{query}", meaning: "The new instance the model must complete." },
        { symbol: "P(\\cdot \\mid \\cdot)", meaning: "Plain conditional probability — the same next-token machinery, pointed at a task." },
      ],
    },
    {
      id: "scaling",
      name: "The Scaling Law",
      formula: "L(C) \\approx \\left( \\frac{C_0}{C} \\right)^{\\alpha}",
      meaning:
        "Validation loss falls as a smooth power law of training compute — across the paper's 8 model sizes spanning three orders of magnitude. Capability isn't a lottery; it's purchasable and predictable.",
      analogy:
        "Like fuel efficiency curves for engines: you don't need to build the big engine to know roughly how it will perform — the small ones trace the curve for you.",
      breakdown: [
        { symbol: "L(C)", meaning: "Cross-entropy loss achieved with training compute C." },
        { symbol: "\\alpha", meaning: "The power-law exponent (small and stable — from Kaplan et al. 2020, which this paper's sweep follows)." },
        { symbol: "C_0", meaning: "A reference compute scale. GPT-3 175B: ~3,640 petaflop/s-days." },
      ],
    },
    {
      id: "masked-attention",
      name: "Masked (Causal) Self-Attention",
      formula:
        "\\mathrm{Attention}(Q,K,V) = \\mathrm{softmax}\\!\\left(\\frac{QK^{T} + M}{\\sqrt{d_k}}\\right)V",
      meaning:
        "The same attention as the 2017 Transformer, plus a mask M that sets all future positions to −∞ before softmax — so every token can only consult its past. That honesty at training time is what makes generation possible.",
      analogy:
        "Taking an exam where each question's answer may use all previous pages but the next pages are stapled shut — so you genuinely learn to continue, not to peek.",
      breakdown: [
        { symbol: "M", meaning: "The causal mask: 0 for allowed (past) positions, −∞ for future ones — softmax turns −∞ into exactly zero attention." },
        { symbol: "Q, K, V", meaning: "Queries, keys, values — identical to the original Transformer (explore them in the Attention Lab below)." },
        { symbol: "96 \\times", meaning: "GPT-3 runs 96 heads of this per layer, across 96 layers." },
      ],
    },
  ],

  applications: [
    {
      icon: "message-square",
      title: "ChatGPT & modern assistants",
      description:
        "ChatGPT is GPT-3's direct descendant: instruction tuning and RLHF layered on top of exactly this model family and its in-context abilities.",
    },
    {
      icon: "code",
      title: "AI pair programmers",
      description:
        "Codex — the model behind the original GitHub Copilot — was GPT-3 fine-tuned on code. Few-shot prompting is why it could adapt to your codebase's style.",
    },
    {
      icon: "languages",
      title: "Prompting as a discipline",
      description:
        "Few-shot prompting, chain-of-thought, system prompts — the entire craft of prompt engineering exists because this paper showed prompts can replace training.",
    },
    {
      icon: "search",
      title: "One model, thousands of products",
      description:
        "The API-first model business — where startups build on a frozen general model instead of training their own — began with GPT-3's launch.",
    },
    {
      icon: "eye",
      title: "The scaling roadmap",
      description:
        "GPT-4, Claude, Gemini, Llama — every frontier lab's strategy of predictable capability-from-scale traces to this paper's 8-model sweep.",
    },
    {
      icon: "dna",
      title: "Beyond language",
      description:
        "The recipe — huge autoregressive Transformer + in-context examples — now drives code, images, audio, robotics policies, and biology sequence models.",
    },
  ],

  codeExample: {
    language: "python",
    title: "In-context learning: the whole trick in one loop",
    explanation:
      "This is GPT-3's entire inference algorithm: build a few-shot prompt, then repeatedly sample the next token and append it. The model never trains on your task — swap `model.next_token_probs` for a real 175B forward pass and this is production code.",
    code: `# The few-shot prompt IS the programming.
prompt = """Translate English to French.

sea otter => loutre de mer
peppermint => menthe poivree
cheese =>"""


def generate(model, prompt: str, max_tokens: int = 20,
             temperature: float = 0.7, top_p: float = 0.9) -> str:
    """The autoregressive loop behind every GPT completion."""
    tokens = model.tokenize(prompt)          # BPE, ~50k vocabulary

    for _ in range(max_tokens):
        # One full forward pass: 96 layers of masked self-attention.
        # The model attends BACK over the examples in the prompt --
        # that attention is where in-context learning happens.
        probs = model.next_token_probs(tokens)

        # Temperature: reshape the distribution (see the Playground below)
        probs = probs ** (1.0 / temperature)
        probs = probs / probs.sum()

        # Nucleus (top-p) sampling: keep the smallest set of tokens
        # covering top_p of the probability mass, then sample.
        next_token = nucleus_sample(probs, top_p)

        if next_token == model.END_OF_TEXT:
            break
        tokens.append(next_token)            # append & repeat

    return model.detokenize(tokens)


# No gradient updates. No fine-tuning. The 'training' for the
# translation task is the two examples sitting in the prompt.
completion = generate(model, prompt)
print(completion.splitlines()[-1])           # cheese => fromage`,
  },

  chatSuggestions: [
    "What is in-context learning?",
    "How big is GPT-3 compared to earlier models?",
    "What's the difference between zero-shot, one-shot, and few-shot?",
    "What could GPT-3 not do well?",
    "How did GPT-3 lead to ChatGPT?",
  ],

  course: {
    title: "GPT-3: how scale taught AI to take instructions",
    description:
      "A 4-lesson mini course: the fine-tuning treadmill, in-context learning, the scaling bet, and an honest look at what 175B parameters bought.",
    lessons: [
      {
        id: "lesson-1",
        number: 1,
        title: "The fine-tuning treadmill",
        duration: "6 min",
        summary: "Why one-model-per-task had to end.",
        sections: [
          {
            heading: "The old deal",
            body: "By 2019, NLP had a winning recipe: pretrain a Transformer on raw text (like BERT or GPT-2), then fine-tune it on each task with thousands of labeled examples. It worked — but it meant a translation model, a sentiment model, a QA model… a new dataset, training run, and checkpoint for every single job.",
          },
          {
            heading: "Three cracks in the recipe",
            body: "The paper names the problems: labeled datasets are expensive and don't exist for most tasks; fine-tuned models can exploit quirks of their training data and look better than they truly are; and the recipe is nothing like humans, who pick up a new task from a description and a couple of examples.",
          },
          {
            heading: "The radical alternative",
            body: "GPT-2 had hinted that a language model could do tasks zero-shot, badly. GPT-3 asks: what if the model were 100× bigger? Could examples IN THE PROMPT replace fine-tuning entirely? Try the playground below and notice the model is frozen — everything you change is in the input, never the weights. That's the paradigm this paper proposed.",
          },
        ],
        keyTakeaway:
          "Pretrain-then-fine-tune required a dataset and training run per task. GPT-3's bet: make the model big enough and the prompt becomes the training.",
        quiz: {
          question: "What did fine-tuning require for EVERY new task?",
          options: [
            { text: "A new tokenizer", correct: false, explanation: "The tokenizer stays fixed — it was the labeled data and training that had to be redone." },
            { text: "Thousands of labeled examples and a separate training run", correct: true, explanation: "Exactly — a dataset, a gradient-update run, and a new checkpoint per task. GPT-3 replaces all of that with text in the prompt." },
            { text: "A bigger context window", correct: false, explanation: "Context size matters for prompting, not for the fine-tuning recipe." },
            { text: "Human feedback ratings", correct: false, explanation: "RLHF came later (InstructGPT) — classic fine-tuning used labeled task data." },
          ],
        },
      },
      {
        id: "lesson-2",
        number: 2,
        title: "In-context learning",
        duration: "7 min",
        summary: "Zero-shot, one-shot, few-shot — learning without learning.",
        sections: [
          {
            heading: "Three ways to ask",
            body: "Zero-shot: just the instruction — 'Translate to French: cheese →'. One-shot: instruction plus one worked example. Few-shot: as many examples as fit in the 2,048-token window, typically 10–100. In all three, the weights are frozen solid — no gradient ever flows.",
          },
          {
            heading: "Where the 'learning' happens",
            body: "Mechanically, it's conditional probability: P(answer | examples, query). The examples sit in the context, and masked self-attention lets every generated token consult them. The attention heads literally look back at your demonstrations while writing the answer — task inference happening inside a single forward pass. The Attention Lab in this course shows the exact mechanism doing the looking.",
          },
          {
            heading: "The result that stunned everyone",
            body: "Few-shot GPT-3 matched or approached models fine-tuned on thousands of examples: 86.4% on LAMBADA, 71.2% on TriviaQA (beating the fine-tuned open-domain state of the art), near-BERT SuperGLUE. A frozen generalist was suddenly competitive with an army of specialists.",
          },
        ],
        keyTakeaway:
          "In-context learning = task inference by conditioning. Examples in the prompt shift the next-token distribution; attention over demonstrations does the work — zero gradient updates.",
        quiz: {
          question: "During few-shot prompting, what happens to GPT-3's weights?",
          options: [
            { text: "They're fine-tuned briefly on the examples", correct: false, explanation: "No — that would be classic fine-tuning. The entire point is that no gradients flow at task time." },
            { text: "Absolutely nothing — the task is inferred inside the forward pass", correct: true, explanation: "Correct. The examples only change the INPUT; attention over them shifts the output distribution. Learning without weight updates." },
            { text: "Only the final layer updates", correct: false, explanation: "Not even the final layer — the model is completely frozen." },
            { text: "They're averaged with a task-specific model", correct: false, explanation: "There is no task-specific model — that's the paradigm being replaced." },
          ],
        },
      },
      {
        id: "lesson-3",
        number: 3,
        title: "Scale is the ingredient",
        duration: "7 min",
        summary: "8 models, one smooth curve, one emergent skill.",
        sections: [
          {
            heading: "An experiment, not just a model",
            body: "The paper trains EIGHT models — 125M, 350M, 760M, 1.3B, 2.7B, 6.7B, 13B, and 175B parameters — on the same data recipe (~300B tokens: filtered Common Crawl at 60% of the mix, WebText2, two book corpora, Wikipedia). That sweep turns 'is bigger better?' into a measured curve instead of an opinion.",
          },
          {
            heading: "Two curves that changed AI strategy",
            body: "First: validation loss falls as a smooth power law with compute — no plateau in sight, confirming Kaplan et al.'s scaling laws at 10× the scale. Second, subtler and more important: the GAP between zero-shot, one-shot, and few-shot performance WIDENS with size. Small models barely benefit from examples in the prompt; the 175B model exploits them expertly. In-context learning itself is what scale buys.",
          },
          {
            heading: "The price tag",
            body: "GPT-3 175B: 96 layers, 12,288-dimensional states, 96 attention heads, ~3,640 petaflop/s-days of compute. The architecture contains essentially nothing new — the paper's contribution is proving that the 2017 Transformer, fed enough compute and data, develops a qualitatively new interface: instructions.",
          },
        ],
        keyTakeaway:
          "Capability scales smoothly and predictably with compute — and in-context learning is an emergent ability that grows with size. Scale isn't just more; it's different.",
        quiz: {
          question: "Why did the paper train 8 model sizes instead of just the big one?",
          options: [
            { text: "As backups in case 175B failed to train", correct: false, explanation: "They weren't spares — each size is a data point." },
            { text: "To measure how ability — especially in-context learning — changes with scale", correct: true, explanation: "Exactly — the sweep shows loss following a power law AND the few-shot gap widening with size, the paper's central scientific claim." },
            { text: "To serve different price tiers in the API", correct: false, explanation: "Product tiers came later; in the paper the sizes are for science." },
            { text: "Because the dataset was too small for one big model", correct: false, explanation: "All sizes trained on the same ~300B-token recipe." },
          ],
        },
      },
      {
        id: "lesson-4",
        number: 4,
        title: "What 175B could and couldn't do",
        duration: "7 min",
        summary: "Honest results, honest limits, and the road to ChatGPT.",
        sections: [
          {
            heading: "The highlight reel",
            body: "Few-shot GPT-3: near-perfect 2-digit arithmetic (~100%) that degrades with more digits, unscrambling words, using novel words in sentences after one definition, and generating ~500-word news articles that humans identified as machine-written only ~52% of the time — statistically a coin flip.",
          },
          {
            heading: "The honest limits",
            body: "The paper is unusually frank: GPT-3 struggles with natural language inference and 'comparison' tasks (like judging if a word is used the same way in two sentences), can lose coherence over long passages, and its autoregressive design forfeits bidirectional context. It also documents bias in generated text and dedicates a section to misuse and energy costs — setting a template the field still follows.",
          },
          {
            heading: "From this paper to your chat window",
            body: "GPT-3 could do tasks but was awkward to instruct — you had to phrase everything as a completion. InstructGPT (2022) fine-tuned it to follow instructions using human feedback (RLHF), and ChatGPT wrapped that in a conversation. The abilities were all here in 2020; alignment made them usable. When you chat with Claude or ChatGPT today, you're using the interface this paper discovered.",
          },
        ],
        keyTakeaway:
          "GPT-3 proved frozen-model, prompt-based AI works — with documented limits in reasoning and coherence. Instruction tuning + RLHF turned this raw capability into ChatGPT.",
        quiz: {
          question: "How well could humans detect GPT-3's generated news articles?",
          options: [
            { text: "About 52% accuracy — barely better than a coin flip", correct: true, explanation: "Correct — for the largest model, human detection accuracy was ~52%, statistically indistinguishable from chance on ~500-word articles." },
            { text: "About 90% accuracy — the style was obviously robotic", correct: false, explanation: "That was true of much smaller models; the 175B model's articles fooled people." },
            { text: "100% — a watermark identified them", correct: false, explanation: "No watermarking existed here; detection was unaided human judgment." },
            { text: "Humans weren't tested", correct: false, explanation: "They were — it's one of the paper's most cited findings, and it drove the misuse discussion." },
          ],
        },
      },
    ],
  },
};
