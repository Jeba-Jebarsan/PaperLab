import type { Paper } from "../types";

export const bertPaper: Paper = {
  id: "1810.04805",
  slug: "bert",
  arxivId: "1810.04805",
  title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
  authors: ["Jacob Devlin", "Ming-Wei Chang", "Kenton Lee", "Kristina Toutanova"],
  year: 2018,
  venue: "NAACL 2019",
  citationCount: 110000,
  tags: ["NLP", "Transformers", "Pre-training", "Foundational"],
  abstract:
    "We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers. As a result, the pre-trained BERT model can be fine-tuned with just one additional output layer to create state-of-the-art models for a wide range of tasks. BERT obtains new state-of-the-art results on eleven natural language processing tasks.",
  oneLiner:
    "This paper taught AI to read in both directions at once — by playing fill-in-the-blank on the internet — and instantly broke the record on eleven language tasks.",
  readingTime: "10 min interactive",
  difficulty: "Foundational",

  explainLevels: {
    beginner: [
      {
        heading: "Reading with both eyes open",
        body: "GPT-style models read like a flashlight moving left to right — when guessing a word, they only see what came before it. BERT reads like the room lights are on: for the blank in 'She played the ___ on stage last night', it sees 'on stage last night' too, and instantly knows the blank is an instrument. Both-sides context is often the whole clue.",
      },
      {
        heading: "Training by fill-in-the-blank",
        body: "How do you teach both-directions reading? Hide words and make the model guess them. BERT's training covers 15% of the words in billions of sentences with a [MASK] sticker and grades the guesses. No human labeling needed — the text itself is the answer key. Try the Masked Word Lab below to play the exact same game.",
      },
      {
        heading: "One brain, many jobs",
        body: "After this fill-in-the-blank school, BERT deeply 'gets' language. Then comes the magic: bolt one tiny layer on top and briefly tune it, and the same brain answers questions, rates reviews, or detects paraphrases — eleven records broken with one recipe. Within a year it was reading every Google search you typed.",
      },
    ],
    developer: [
      {
        heading: "Architecture: the Transformer's encoder half",
        body: "BERT is a Transformer encoder stack — bidirectional self-attention with no causal mask. BERT-Base: 12 layers, hidden size 768, 12 heads, 110M parameters. BERT-Large: 24 layers, 1024 hidden, 16 heads, 340M. Inputs are WordPiece tokens (30,522 vocab) with special [CLS] (sequence-level representation) and [SEP] (sentence boundary) tokens, plus learned segment and position embeddings.",
      },
      {
        heading: "The two pre-training tasks",
        body: "Masked LM: 15% of tokens are selected; of those, 80% become [MASK], 10% a random token, 10% stay unchanged (so the model can't rely on seeing [MASK] at fine-tuning time). The model predicts the originals from full bidirectional context. Next Sentence Prediction: given sentence pairs, classify whether B actually followed A (50/50 real/random) — teaching inter-sentence relationships for tasks like QA and inference.",
      },
      {
        heading: "Data, scale, and results",
        body: "Pre-training corpus: BooksCorpus (800M words) + English Wikipedia (2.5B words). Fine-tuning is cheap — typically a few epochs, replicable in ~1 hour on a Cloud TPU or a few GPU-hours per task. Results: GLUE 80.5% (a 7.7-point absolute jump over the prior state of the art), SQuAD v1.1 F1 93.2, SQuAD v2.0 F1 83.1 — new SOTA on eleven NLP tasks with the same pre-trained checkpoint.",
      },
    ],
    researcher: [
      {
        heading: "The core claim: deep bidirectionality",
        body: "The paper's positioning is precise: ELMo is only shallowly bidirectional (independent LTR/RTL LSTMs concatenated), and GPT is unidirectional by construction. Standard LM objectives cannot condition on both sides without the target leaking through multi-layer self-attention — the masked LM (a Cloze-style denoising objective) is the trick that makes deep bidirectionality trainable. Ablations back the claim: removing NSP hurts QNLI/MNLI/SQuAD, and an LTR-only model degrades substantially (e.g., large drops on SQuAD), even with a BiLSTM patch on top.",
      },
      {
        heading: "The fine-tuning paradigm",
        body: "Against the feature-based approach (frozen embeddings fed to task architectures), BERT demonstrated that a single pre-trained encoder plus a minimal output head, fine-tuned end-to-end, dominates across sentence-level and token-level tasks. The paper also shows the feature-based variant is competitive (concatenating the top four layers gets within 0.3 F1 on CoNLL NER), which mattered for compute-constrained deployment. The masking scheme's 80/10/10 split is itself ablated — pure [MASK]ing creates a pre-train/fine-tune mismatch.",
      },
      {
        heading: "Impact",
        body: "BERT split NLP history into before and after: encoder pre-training became the default (RoBERTa, ALBERT, ELECTRA, DeBERTa are direct refinements), 'BERTology' became a research subfield, and Google deployed it in Search in 2019 — at the time affecting ~10% of English queries. Together with GPT, it established the two poles of the Transformer world: bidirectional encoders for understanding, autoregressive decoders for generation — a division of labor that still organizes the field.",
      },
    ],
  },

  psi: {
    problem: {
      title: "Language models could only read one way",
      points: [
        "GPT-style pre-training is left-to-right: when representing a word, everything after it is invisible.",
        "For understanding tasks — QA, inference, entity tagging — the right context is often the decisive clue.",
        "Bidirectional LSTMs (ELMo) only glued two shallow one-way readings together after the fact.",
      ],
      analogy:
        "Solving a crossword while only allowed to read each clue's first half.",
    },
    solution: {
      title: "Mask words, predict them from both sides",
      points: [
        "Take the Transformer's encoder (no causal mask) so every token attends to its full context, every layer.",
        "Train with a denoising game: hide 15% of tokens (80% [MASK], 10% random, 10% unchanged) and predict the originals.",
        "Add Next Sentence Prediction so the model also learns how sentences relate.",
      ],
      analogy:
        "Fill-in-the-blank worksheets generated for free from the entire internet — with the answer key built in.",
    },
    impact: {
      title: "Pre-train once, fine-tune everywhere",
      points: [
        "New state of the art on 11 NLP tasks — GLUE jumped 7.7 points, SQuAD reached 93.2 F1.",
        "Fine-tuning became the default NLP workflow; a family of successors (RoBERTa, ALBERT, ELECTRA) followed.",
        "Deployed in Google Search from 2019 — billions of queries read bidirectionally every day.",
      ],
      analogy:
        "One universally educated brain, given a one-day orientation for each new job — instead of raising a specialist from scratch every time.",
    },
  },

  architecture: {
    nodes: [
      {
        id: "input",
        label: "Input Text",
        sublabel: "[CLS] sentence A [SEP] sentence B",
        kind: "io",
        description:
          "One or two sentences, wrapped with special tokens: [CLS] collects a summary of the whole input; [SEP] marks sentence boundaries.",
        example: "[CLS] The chef cooked a meal [SEP] It was delicious [SEP]",
        detail:
          "The two-sentence format exists so pre-training can include the Next Sentence Prediction task, and so fine-tuning handles pair tasks (QA, inference) natively.",
      },
      {
        id: "wordpiece",
        label: "WordPiece Tokens",
        sublabel: "30,522 vocabulary",
        kind: "process",
        description:
          "Words split into subword pieces, so rare words become combinations of common chunks and nothing is ever out-of-vocabulary.",
        example: "\"playing\" → \"play\" + \"##ing\"; \"unbelievable\" → \"un\" + \"##believ\" + \"##able\"",
        detail:
          "The ## prefix marks continuation pieces. Same family of ideas as the BPE used by GPT — different algorithm, same purpose.",
      },
      {
        id: "embeddings",
        label: "Three Embeddings, Summed",
        sublabel: "token + segment + position",
        kind: "process",
        description:
          "Each token's vector is the sum of what it is (token embedding), which sentence it's in (segment A/B), and where it sits (position) — all learned.",
        example: "\"meal\" in sentence A at position 5 = E(meal) + E(A) + E(pos₅).",
        detail:
          "Unlike the original Transformer's sinusoids, BERT learns its position embeddings (up to 512 positions).",
      },
      {
        id: "mask",
        label: "Masking (pre-training only)",
        sublabel: "15% → 80/10/10",
        kind: "core",
        description:
          "The training game: 15% of tokens are chosen as targets. 80% become [MASK], 10% become a random word, 10% are left alone — and the model must reconstruct the originals.",
        example: "\"The chef cooked a [MASK] in the kitchen\" → predict \"meal\".",
        detail:
          "The 10/10 tricks exist because [MASK] never appears at fine-tuning time — the model must stay suspicious of every token, keeping representations useful for real inputs.",
      },
      {
        id: "encoder",
        label: "Bidirectional Encoder Stack",
        sublabel: "12 or 24 Transformer layers",
        kind: "core",
        description:
          "The heart: self-attention with NO causal mask, so every token attends to every other token — left and right — at every layer. This is exactly the encoder half of the 2017 Transformer.",
        example:
          "Predicting the mask in \"played the [MASK] on stage\", attention flows from \"stage\" backwards into the blank — the direction GPT structurally can't use.",
        detail:
          "BERT-Base: 12 layers × 768 hidden × 12 heads (110M params). BERT-Large: 24 × 1024 × 16 (340M). Explore the mechanism in the Attention Lab below — its bidirectional view is BERT's view.",
      },
      {
        id: "heads",
        label: "Pre-training Heads",
        sublabel: "MLM + NSP",
        kind: "process",
        description:
          "Two small output heads during pre-training: one predicts each masked token over the vocabulary; one reads [CLS] and predicts whether sentence B truly followed sentence A.",
        example: "MLM: [MASK] → \"meal\" (92%). NSP: IsNext / NotNext (50/50 during training).",
        detail:
          "Both heads are discarded after pre-training — they were only scaffolding to shape the encoder's representations.",
      },
      {
        id: "finetune",
        label: "Fine-tuning Head",
        sublabel: "one thin layer per task",
        kind: "core",
        description:
          "For a new task, add a single output layer (a classifier on [CLS], or start/end pointers for QA spans) and briefly train everything end-to-end.",
        example:
          "Sentiment: [CLS] → positive/negative. SQuAD: point to the answer's start and end tokens in the passage.",
        detail:
          "Fine-tuning typically takes a few epochs — about an hour on a Cloud TPU. This cheap-adaptation recipe is what made BERT ubiquitous.",
      },
      {
        id: "output",
        label: "Task Output",
        sublabel: "11 records, one checkpoint",
        kind: "io",
        description:
          "The same pre-trained encoder, with different thin heads, set new state of the art on eleven tasks — GLUE, SQuAD v1.1/v2.0, SWAG, and more.",
        example: "GLUE 80.5 (+7.7 absolute), SQuAD v1.1 F1 93.2.",
        detail:
          "This 'one pre-trained model, many cheap fine-tunes' pattern became the organizing principle of applied NLP.",
      },
    ],
    edges: [
      { source: "input", target: "wordpiece" },
      { source: "wordpiece", target: "embeddings" },
      { source: "embeddings", target: "mask" },
      { source: "mask", target: "encoder" },
      { source: "encoder", target: "heads" },
      { source: "heads", target: "finetune" },
      { source: "finetune", target: "output" },
    ],
  },

  math: [
    {
      id: "mlm",
      name: "The Masked LM Objective",
      formula:
        "\\mathcal{L}_{\\text{MLM}} = -\\sum_{i \\in \\text{masked}} \\log P(x_i \\mid \\tilde{x})",
      meaning:
        "Only the hidden tokens are graded: maximize the probability of each original token given the corrupted sentence. Because the corrupted sentence contains BOTH sides of every blank, the model is forced to learn bidirectional understanding.",
      analogy:
        "A worksheet where a few words are covered by stickers — you're only graded on the stickers, but to fill them you must genuinely read the whole sentence.",
      breakdown: [
        { symbol: "\\tilde{x}", meaning: "The corrupted input — 15% of tokens masked, randomized, or left as bait." },
        { symbol: "i \\in \\text{masked}", meaning: "Loss is computed only at the ~15% of selected positions, not every token." },
        { symbol: "P(x_i \\mid \\tilde{x})", meaning: "Softmax over the 30,522-token vocabulary at each blank — conditioned on full two-sided context." },
      ],
    },
    {
      id: "bidirectional-attention",
      name: "Unmasked Self-Attention",
      formula:
        "\\mathrm{Attention}(Q,K,V) = \\mathrm{softmax}\\!\\left(\\frac{QK^{T}}{\\sqrt{d_k}}\\right)V",
      meaning:
        "The original Transformer attention with the causal mask simply removed: every token's query scores against every key in the sentence, before AND after it. One deleted mask is the entire architectural difference from GPT.",
      analogy:
        "GPT reads through a moving slot that hides the future; BERT reads the page whole. Same eyes, no slot.",
      breakdown: [
        { symbol: "QK^{T}", meaning: "All-pairs relevance — with no −∞ mask blocking future positions." },
        { symbol: "\\sqrt{d_k}", meaning: "The same scaling trick as the 2017 paper (d_k = 64 per head here too)." },
        { symbol: "12/16 \\text{ heads}", meaning: "Base uses 12 heads × 12 layers; Large 16 × 24 — all fully bidirectional." },
      ],
    },
    {
      id: "nsp",
      name: "Next Sentence Prediction",
      formula: "P(\\text{IsNext} \\mid \\mathbf{h}_{[\\text{CLS}]})",
      meaning:
        "A binary classifier on the [CLS] vector: did sentence B really follow sentence A (true 50% of the time), or was it randomly sampled? This teaches relationships BETWEEN sentences, which single-sentence masking can't.",
      analogy:
        "A shuffled-story quiz: 'does this sentence belong right after that one?' — you can only pass by understanding how ideas connect.",
      breakdown: [
        { symbol: "\\mathbf{h}_{[\\text{CLS}]}", meaning: "The final hidden state of the [CLS] token — trained to summarize the whole input pair." },
        { symbol: "\\text{IsNext}", meaning: "The binary label; ablations show dropping NSP hurts QA and inference tasks." },
      ],
    },
    {
      id: "masking-split",
      name: "The 80/10/10 Masking Recipe",
      formula: "15\\% \\to \\begin{cases} 80\\% \\; [\\text{MASK}] \\\\ 10\\% \\; \\text{random token} \\\\ 10\\% \\; \\text{unchanged} \\end{cases}",
      meaning:
        "Of the 15% of selected tokens: most become [MASK], some become a wrong word, some stay correct — but all must be predicted. Since [MASK] never appears in real downstream text, the model must maintain rich representations for EVERY token, not just stickers.",
      analogy:
        "A teacher who mostly covers words, sometimes swaps in a wrong word, and sometimes changes nothing — so students learn to check every word instead of only the covered ones.",
      breakdown: [
        { symbol: "80\\%", meaning: "Standard masking — the core denoising signal." },
        { symbol: "10\\% \\text{ random}", meaning: "Injected errors — the model learns to distrust and verify observed tokens." },
        { symbol: "10\\% \\text{ unchanged}", meaning: "Keeps representations of unmasked-looking tokens honest, closing the pre-train/fine-tune gap." },
      ],
    },
  ],

  applications: [
    {
      icon: "search",
      title: "Google Search",
      description:
        "Deployed in 2019 to understand queries bidirectionally — famously fixing searches where a preposition like 'to' or 'for' flips the meaning. It initially affected ~10% of English queries.",
    },
    {
      icon: "message-square",
      title: "Understanding pipelines everywhere",
      description:
        "Sentiment analysis, intent detection, content moderation, spam filtering — encoder models descended from BERT remain the workhorses for classify-and-understand tasks.",
    },
    {
      icon: "languages",
      title: "Multilingual NLP",
      description:
        "Multilingual BERT and its successors (XLM-R) brought pre-trained understanding to 100+ languages from a single model.",
    },
    {
      icon: "eye",
      title: "Semantic search & RAG",
      description:
        "Dense retrieval — embedding queries and documents so meaning, not keywords, matches — grew directly out of BERT-style encoders. Modern RAG systems' retrievers are its grandchildren.",
    },
    {
      icon: "dna",
      title: "Beyond language",
      description:
        "The masked-prediction recipe transferred to proteins (ESM), code, and chemistry — mask part of a sequence, predict it, learn deep structure without labels.",
    },
    {
      icon: "code",
      title: "The refinement family",
      description:
        "RoBERTa (better training), ALBERT (parameter sharing), ELECTRA (replaced-token detection), DeBERTa (disentangled attention) — an entire lineage of encoders iterating on this paper's recipe.",
    },
  ],

  codeExample: {
    language: "python",
    title: "Masked language modeling, from scratch",
    explanation:
      "The pre-training data pipeline in miniature: corrupt a sentence with the 80/10/10 recipe, then train the encoder to reconstruct the hidden words. This loop, run over 3.3 billion words, is all of BERT's schooling.",
    code: `import random

MASK, VOCAB = "[MASK]", ["meal", "song", "cake", "plan", "dish"]  # toy vocab


def corrupt(tokens: list[str], mask_rate: float = 0.15):
    """BERT's 80/10/10 masking recipe. Returns (corrupted, targets)."""
    corrupted, targets = [], {}
    for i, tok in enumerate(tokens):
        if random.random() < mask_rate:
            targets[i] = tok              # we must predict the ORIGINAL
            roll = random.random()
            if roll < 0.8:
                corrupted.append(MASK)    # 80%: hide it
            elif roll < 0.9:
                corrupted.append(random.choice(VOCAB))  # 10%: wrong word
            else:
                corrupted.append(tok)     # 10%: leave it (stay suspicious!)
        else:
            corrupted.append(tok)
    return corrupted, targets


def training_step(encoder, tokens):
    corrupted, targets = corrupt(tokens)

    # The encoder sees the FULL corrupted sentence — both sides of
    # every blank. No causal mask. This is the bidirectional part.
    hidden = encoder(corrupted)           # (seq_len, d_model)

    loss = 0.0
    for pos, original in targets.items():
        # Predict the original token from its two-sided context
        probs = softmax(hidden[pos] @ encoder.vocab_matrix.T)
        loss += -log(probs[vocab_id(original)])
    return loss / max(1, len(targets))


sentence = "the chef cooked a delicious meal in the kitchen".split()
# corrupt() might yield: the chef cooked a delicious [MASK] in the kitchen
# ...and the model learns that both "delicious" AND "kitchen" point to "meal".`,
  },

  chatSuggestions: [
    "Why does bidirectional context matter?",
    "How does the masking recipe work?",
    "What's the difference between BERT and GPT?",
    "What results did BERT achieve?",
    "What is the [CLS] token for?",
  ],

  course: {
    title: "BERT: reading in both directions",
    description:
      "A 4-lesson mini course: why one-way reading fails, the masking game, the encoder machinery, and the fine-tuning revolution.",
    lessons: [
      {
        id: "lesson-1",
        number: 1,
        title: "The one-way problem",
        duration: "6 min",
        summary: "When the clue comes after the blank.",
        sections: [
          {
            heading: "Two ways to read",
            body: "By 2018 there were two pre-training camps. GPT read strictly left-to-right — powerful for generating text, but when representing a word it was blind to everything after it. ELMo ran one forward LSTM and one backward LSTM and glued their outputs together — technically two directions, but each reading was still one-eyed; they never truly combined.",
          },
          {
            heading: "Why understanding needs both sides",
            body: "Try it in the Masked Word Lab below: for 'She played the ___ on stage last night', left context alone leaves you torn between game, piano, and role. The words AFTER the blank — 'on stage' — are the giveaway. Question answering, entity tagging, and inference are full of cases where the decisive clue sits to the right.",
          },
          {
            heading: "The blocker",
            body: "So why not just train a deep bidirectional model on next-word prediction? Because it cheats: with both directions flowing through multiple attention layers, each word can indirectly 'see itself' and the objective collapses. BERT's masking trick is exactly the workaround — and the next lesson plays it.",
          },
        ],
        keyTakeaway:
          "One-way reading misses right-side clues; shallow gluing (ELMo) doesn't fix it; naive deep bidirectional LM training self-leaks. A new objective was needed.",
        quiz: {
          question: "Why couldn't a deep bidirectional model just train on next-word prediction?",
          options: [
            { text: "It would be too slow on GPUs", correct: false, explanation: "Speed wasn't the issue — information leakage was." },
            { text: "Through multi-layer bidirectional attention, each word can indirectly see itself — the task becomes trivial cheating", correct: true, explanation: "Exactly — the target leaks through the layers. Masking removes the answer from the input entirely, making the game honest." },
            { text: "Bidirectional attention hadn't been invented", correct: false, explanation: "The Transformer encoder (2017) already had it — the problem was the training objective." },
            { text: "There wasn't enough text data", correct: false, explanation: "Unlabeled text was abundant — that's exactly what BERT exploits." },
          ],
        },
      },
      {
        id: "lesson-2",
        number: 2,
        title: "The masking game",
        duration: "7 min",
        summary: "80/10/10 and the free answer key.",
        sections: [
          {
            heading: "Self-supervision",
            body: "BERT's genius is getting labeled data for free: take any sentence, hide some words, and the hidden words ARE the labels. 15% of tokens are selected in every training sentence, across BooksCorpus (800M words) and English Wikipedia (2.5B words) — billions of fill-in-the-blank exercises, no annotators required.",
          },
          {
            heading: "The 80/10/10 subtlety",
            body: "Of the selected tokens, only 80% actually become [MASK]. 10% are swapped for a random word, and 10% are left untouched — but all must be predicted. Why? Because [MASK] never appears in real downstream text. If the model only worked hard at [MASK] positions, its representations of normal words would go stale. The mixed recipe keeps it suspicious of — and informative about — every token.",
          },
          {
            heading: "Plus a sentence-level game",
            body: "Masking teaches within-sentence understanding; Next Sentence Prediction adds between-sentence understanding. Half the time sentence B genuinely follows A, half the time it's random, and the [CLS] token must judge which — a skill that transfers directly to question answering and inference.",
          },
        ],
        keyTakeaway:
          "Mask 15% (80% [MASK] / 10% random / 10% unchanged), predict originals from both sides, plus a next-sentence quiz. Free labels, deep bidirectional learning.",
        quiz: {
          question: "Why are 10% of selected tokens left UNCHANGED (yet still predicted)?",
          options: [
            { text: "To save computation on easy tokens", correct: false, explanation: "Compute is identical — it's about what the model learns." },
            { text: "Because [MASK] never appears at fine-tuning time, the model must keep rich representations of ordinary-looking tokens too", correct: true, explanation: "Right — it closes the pre-train/fine-tune mismatch: every token could be a target, so every token gets a careful representation." },
            { text: "It's a bug the authors documented", correct: false, explanation: "It's a deliberate, ablated design choice in the paper." },
            { text: "To make training converge faster", correct: false, explanation: "If anything it makes the game harder — the payoff is representation quality, not speed." },
          ],
        },
      },
      {
        id: "lesson-3",
        number: 3,
        title: "Inside the encoder",
        duration: "7 min",
        summary: "The Transformer's other half, at work.",
        sections: [
          {
            heading: "One deleted mask",
            body: "Architecturally, BERT vs GPT is a single difference: GPT's decoder blocks mask future positions (−∞ before softmax); BERT's encoder blocks don't. Every token attends to every other token, in every one of the 12 (Base) or 24 (Large) layers. The attention math — Q, K, V, √d_k — is character-for-character the 2017 paper's.",
          },
          {
            heading: "Watch it in the lab",
            body: "The Attention Lab in this course shows bidirectional attention by default — hover a word and see connections flowing from BOTH sides. That's BERT's native view of language. GPT's view is the same picture with all rightward connections cut.",
          },
          {
            heading: "Inputs with structure",
            body: "Each token enters as the sum of three learned embeddings: token identity, segment (sentence A or B), and position. [CLS] leads every input and is trained (via NSP) to summarize the whole sequence — making it a natural handle for classification heads later. [SEP] marks boundaries so pair tasks fit the same format.",
          },
        ],
        keyTakeaway:
          "BERT = Transformer encoder: full bidirectional attention (no causal mask), 12–24 layers, with token+segment+position embeddings and [CLS]/[SEP] scaffolding.",
        quiz: {
          question: "Architecturally, what separates BERT from GPT?",
          options: [
            { text: "BERT uses LSTMs instead of attention", correct: false, explanation: "Both are pure Transformers — no recurrence anywhere." },
            { text: "GPT masks future positions in self-attention; BERT doesn't — that's essentially it", correct: true, explanation: "Correct — encoder vs decoder is one causal mask. The consequences (understanding vs generation) all flow from that." },
            { text: "BERT has no positional information", correct: false, explanation: "It has learned position embeddings — order still matters." },
            { text: "BERT is much deeper than any GPT", correct: false, explanation: "BERT-Large is 24 layers; GPT models range far deeper. Depth isn't the distinction." },
          ],
        },
      },
      {
        id: "lesson-4",
        number: 4,
        title: "Fine-tuning: one brain, eleven records",
        duration: "6 min",
        summary: "The recipe that reorganized NLP.",
        sections: [
          {
            heading: "The cheap adaptation",
            body: "After pre-training, adapting BERT to a task means adding one thin layer — a classifier reading [CLS], or two pointers marking an answer span — and training the whole stack briefly. A few epochs, roughly an hour on a Cloud TPU. Compare that to designing and training a bespoke architecture per task, the previous norm.",
          },
          {
            heading: "The scoreboard",
            body: "One checkpoint, eleven new records: GLUE 80.5% (a 7.7-point absolute jump), SQuAD v1.1 F1 93.2 (surpassing human-level on the leaderboard), SQuAD v2.0 F1 83.1, SWAG, CoNLL NER, and more. The ablations traced the gains to the two big bets: deep bidirectionality (an LTR-only variant drops sharply) and scale (Large > Base everywhere).",
          },
          {
            heading: "After BERT",
            body: "The recipe became the industry: RoBERTa showed better training alone adds points; ELECTRA made the masking game adversarial; distilled BERTs went into phones; Google Search adopted it in 2019. And the encoder/decoder split — BERT for understanding, GPT for generation — still frames how we build language systems today.",
          },
        ],
        keyTakeaway:
          "Pre-train once on unlabeled text, fine-tune cheaply per task: 11 records from one checkpoint, and the workflow that defined modern NLP.",
        quiz: {
          question: "What made BERT's fine-tuning recipe so influential?",
          options: [
            { text: "It required no training at all downstream", correct: false, explanation: "Fine-tuning is training — just brief and cheap. Zero-training-from-prompts came later, with GPT-3." },
            { text: "One pre-trained encoder plus a thin per-task head beat bespoke architectures across 11 tasks", correct: true, explanation: "Exactly — general pre-training + minimal adaptation replaced per-task architecture design as the default workflow." },
            { text: "It eliminated the need for GPUs", correct: false, explanation: "Fine-tuning still uses accelerators — it's just hours instead of weeks." },
            { text: "It worked without any labeled data", correct: false, explanation: "Pre-training is label-free, but fine-tuning uses each task's labeled examples — far fewer than before, though." },
          ],
        },
      },
    ],
  },
};
