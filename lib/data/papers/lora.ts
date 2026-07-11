import type { Paper } from "../types";

export const loraPaper: Paper = {
  id: "2106.09685",
  slug: "lora",
  arxivId: "2106.09685",
  title: "LoRA: Low-Rank Adaptation of Large Language Models",
  authors: [
    "Edward J. Hu",
    "Yelong Shen",
    "Phillip Wallis",
    "Zeyuan Allen-Zhu",
    "Yuanzhi Li",
    "Shean Wang",
    "Lu Wang",
    "Weizhu Chen",
  ],
  year: 2021,
  venue: "ICLR 2022",
  citationCount: 15000,
  tags: ["Fine-tuning", "Efficiency", "LLM", "Foundational"],
  abstract:
    "An important paradigm of natural language processing consists of large-scale pre-training on general domain data and adaptation to particular tasks or domains. As we pre-train larger models, full fine-tuning, which retrains all model parameters, becomes less feasible. We propose Low-Rank Adaptation, or LoRA, which freezes the pre-trained model weights and injects trainable rank decomposition matrices into each layer of the Transformer architecture, greatly reducing the number of trainable parameters for downstream tasks. Compared to GPT-3 175B fine-tuned with Adam, LoRA can reduce the number of trainable parameters by 10,000 times and the GPU memory requirement by 3 times.",
  oneLiner:
    "This paper made customizing giant AI models 10,000× cheaper with one insight: the CHANGE a model needs is tiny in structure — so learn two skinny matrices instead of rewriting billions of weights.",
  readingTime: "9 min interactive",
  difficulty: "Foundational",

  explainLevels: {
    beginner: [
      {
        heading: "The customization problem",
        body: "Say you want GPT-3 to write in your company's style. The classic answer — fine-tuning — means adjusting all 175 billion of its numbers and saving a complete 350GB copy for every single use case. Ten customizations, ten full copies, each needing a GPU farm to train. Personalizing giant models was becoming a rich-labs-only sport.",
      },
      {
        heading: "The insight: the change is simple",
        body: "Here's the surprise the paper builds on: when you fine-tune a giant model, the CHANGE to its weights is highly redundant — like a full-page edit that's really just three repeated corrections. In math terms, the update matrix has 'low rank': it can be rebuilt almost perfectly from a few building blocks. The lab on this page shows this with a real decomposition — slide the rank up and watch a full update reappear from just 3 layers.",
      },
      {
        heading: "So learn the summary, not the edit",
        body: "LoRA freezes the original model completely and learns just two skinny matrices per layer whose product IS the update. Result: 10,000× fewer trainable numbers, 3× less GPU memory, zero extra slowness once merged in — and quality matching full fine-tuning. Today, when someone fine-tunes a model on a single gaming GPU, or an app hot-swaps between custom personalities, that's LoRA.",
      },
    ],
    developer: [
      {
        heading: "The mechanism",
        body: "For a pretrained weight matrix W₀ ∈ ℝ^{d×k}, LoRA parameterizes the update as ΔW = BA where B ∈ ℝ^{d×r}, A ∈ ℝ^{r×k}, and rank r ≪ min(d,k). Forward pass: h = W₀x + BAx, scaled by α/r. A is initialized Gaussian, B to zero — so ΔW = 0 at start and training begins exactly at the pretrained model. W₀ stays frozen; only A and B get gradients.",
      },
      {
        heading: "Where and how small",
        body: "In the paper, LoRA targets the attention projections — adapting just W_q and W_v is enough. And r is startlingly small: on GPT-3, r = 1 or 2 is often competitive, with r = 4–8 typical. Sanity check on the numbers: adapting one 12,288×12,288 projection at r=8 costs 2×12,288×8 ≈ 197K parameters versus 151M — per-matrix savings of ~770×, and 10,000× overall versus full fine-tuning with Adam (which also stores optimizer states for every parameter — the 3× memory win).",
      },
      {
        heading: "The deployment story",
        body: "Unlike adapter layers (which add sequential modules and inference latency) or prefix tuning (which eats context window), LoRA merges: at deployment compute W = W₀ + BA once and inference is byte-identical in cost to the base model. Swapping tasks = subtracting one BA and adding another — checkpoints are megabytes, not hundreds of gigabytes. Quality: on-par or better than full fine-tuning across RoBERTa, DeBERTa, GPT-2, and GPT-3 benchmarks.",
      },
    ],
    researcher: [
      {
        heading: "The intrinsic rank hypothesis",
        body: "The paper's conceptual contribution follows Aghajanyan et al.'s intrinsic-dimensionality findings: over-parameterized models, once pretrained, need only low-dimensional task adjustments. LoRA operationalizes this per-matrix: constrain ΔW to rank r and measure what breaks. Empirically, almost nothing — the paper's §7 analysis shows the top singular directions of learned updates dominate, that ΔW amplifies directions already present-but-unemphasized in W₀ (with large amplification factors), and that the subspaces learned at r=8 and r=64 substantially overlap: the extra rank was mostly noise.",
      },
      {
        heading: "Positioning against alternatives",
        body: "The efficiency-adaptation landscape circa 2021: adapters (Houlsby et al.) add latency that bites hard at batch-size-1 online inference (the paper measures it); prefix/prompt tuning is hard to optimize and consumes sequence length; BitFit is cheap but weaker. LoRA's specific win is the merge property — structurally zero inference overhead — combined with full-fine-tuning-level quality. The design also composes: it's orthogonal to prefix methods and, later, to quantization (QLoRA fine-tunes 4-bit bases with LoRA on top).",
      },
      {
        heading: "Impact",
        body: "LoRA became the default adaptation method of the open-model era: fine-tuning on consumer GPUs, per-customer adapters served from one frozen base, LoRA marketplaces for image models (Stable Diffusion communities), and a research lineage (QLoRA, DoRA, AdaLoRA, and analysis work on what rank actually captures). Its deeper legacy is economic: adaptation stopped scaling with model size, which is a prerequisite for the many-custom-models world we now inhabit.",
      },
    ],
  },

  psi: {
    problem: {
      title: "Fine-tuning giants didn't scale",
      points: [
        "Full fine-tuning of GPT-3 updates all 175B parameters — with Adam states, far beyond most GPU budgets.",
        "Every task or customer needs a complete model copy: ~350GB per checkpoint, per use case.",
        "Existing shortcuts paid real costs: adapter layers slow inference; prefix tuning eats context and optimizes poorly.",
      ],
      analogy:
        "Rebinding the entire encyclopedia — all 175 billion words — every time you want to add a page of company notes.",
    },
    solution: {
      title: "Freeze everything; learn a low-rank update",
      points: [
        "Keep W₀ frozen; train only ΔW = B·A with tiny rank r (often 1–8), initialized so training starts at the pretrained model.",
        "Target the attention projections (W_q, W_v) — enough to match full fine-tuning quality.",
        "Merge W₀ + BA at deployment: zero added latency, and task-swapping is swapping megabyte-sized adapters.",
      ],
      analogy:
        "Leave the encyclopedia untouched and clip in a thin sheet of corrections — the reading experience is identical, and you can carry a different sheet for every purpose.",
    },
    impact: {
      title: "Customization for everyone",
      points: [
        "10,000× fewer trainable parameters and 3× less GPU memory on GPT-3 — with matching quality.",
        "Made fine-tuning possible on consumer hardware; spawned QLoRA and the open fine-tuning ecosystem.",
        "One frozen base + thousands of hot-swappable adapters became the standard serving pattern.",
      ],
      analogy:
        "Custom AI went from bespoke tailoring (rebuild the suit) to accessories (swap the tie) — same suit, endless outfits.",
    },
  },

  architecture: {
    nodes: [
      {
        id: "base",
        label: "Frozen Pretrained Model",
        sublabel: "W₀ — 175B params, untouched",
        kind: "io",
        description:
          "The giant base model with all its knowledge. In LoRA it is read-only: not one of its weights receives a gradient, ever.",
        example: "GPT-3, exactly as pretrained — shared by every task you'll ever adapt it to.",
        detail:
          "Freezing is what kills the per-task storage cost: the 350GB base is stored once, no matter how many adaptations exist.",
      },
      {
        id: "target",
        label: "Target Matrices",
        sublabel: "attention W_q and W_v",
        kind: "process",
        description:
          "LoRA doesn't touch every layer — the paper finds adapting just the query and value projections inside attention is sufficient.",
        example: "In GPT-3, each is a 12,288 × 12,288 matrix (~151M parameters) — per layer, per head group.",
        detail:
          "Ablations (Table 5) show spreading a fixed parameter budget across W_q AND W_v beats spending it all on one matrix type. These are the same Q/V roles you explored in the Attention Lab.",
      },
      {
        id: "matA",
        label: "Matrix A",
        sublabel: "r × k, Gaussian init",
        kind: "core",
        description:
          "The 'compressor': a skinny matrix projecting the 12,288-dimensional input down to r dimensions — the few directions of change this task needs.",
        example: "With r = 4: a 4 × 12,288 matrix — reading the input through 4 learned lenses.",
        detail: "Initialized with random Gaussian values so the low-rank subspace starts unbiased.",
      },
      {
        id: "matB",
        label: "Matrix B",
        sublabel: "d × r, initialized to ZERO",
        kind: "core",
        description:
          "The 'expander': projects the r-dimensional signal back up to full width. Starting B at zero means BA = 0 — on step one, the model is EXACTLY the pretrained model. Adaptation grows from nothing.",
        example: "With r = 4: a 12,288 × 4 matrix. A and B together: ~98K params vs the target's 151M.",
        detail:
          "The zero init is load-bearing: no random perturbation of a working model, and a stable start for optimization.",
      },
      {
        id: "delta",
        label: "The Update ΔW = B·A",
        sublabel: "rank ≤ r by construction",
        kind: "core",
        description:
          "The product of the two skinny matrices is the full-size update — but it can only express rank-r changes. That constraint is the entire bet, and the LoRA Lab above shows why it's safe: real updates are low-rank anyway.",
        example: "The lab's slider IS this node: rank 3 rebuilding ~93% of a full update from 25% of the numbers.",
        detail:
          "Scaled by α/r so the update's magnitude stays comparable as you change r — one less hyperparameter to retune.",
      },
      {
        id: "forward",
        label: "Adapted Forward Pass",
        sublabel: "h = W₀x + BAx",
        kind: "process",
        description:
          "During training, the frozen path and the LoRA path run in parallel and their outputs add. Gradients flow only into A and B.",
        example: "The base model's opinion, plus a small learned correction — computed side by side.",
        detail:
          "Training memory drops ~3× on GPT-3: no optimizer states for 175B frozen parameters, only for the adapters.",
      },
      {
        id: "merge",
        label: "Merge for Deployment",
        sublabel: "W = W₀ + BA",
        kind: "core",
        description:
          "Before serving, add BA into W₀ once. The adapted model is now a single ordinary matrix — inference is bit-for-bit as fast as the base model. This is LoRA's edge over adapter layers.",
        example: "No extra modules, no longer prompts, no latency tax — unlike every alternative of its time.",
        detail:
          "Un-merge (subtract BA) to get the base back; add a different BA for a different task. Checkpoints: megabytes.",
      },
      {
        id: "output",
        label: "Per-Task Adapters",
        sublabel: "one base, a thousand skills",
        kind: "io",
        description:
          "The endgame: a single frozen foundation model plus a library of tiny adapters — per customer, per style, per task — swapped in and out at will.",
        example: "A 35MB legal-writing adapter, a 35MB support-chat adapter… all sharing one 350GB brain.",
        detail:
          "This serving pattern — and its descendants like QLoRA — is how the open-model fine-tuning ecosystem actually runs today.",
      },
    ],
    edges: [
      { source: "base", target: "target" },
      { source: "target", target: "matA" },
      { source: "matA", target: "matB" },
      { source: "matB", target: "delta" },
      { source: "delta", target: "forward" },
      { source: "forward", target: "merge" },
      { source: "merge", target: "output" },
    ],
  },

  math: [
    {
      id: "lora-forward",
      name: "The LoRA Forward Pass",
      formula: "h = W_0 x + \\Delta W x = W_0 x + \\frac{\\alpha}{r} B A x",
      meaning:
        "The frozen model's output plus a learned correction, where the correction is forced through an r-dimensional bottleneck. B starts at zero, so training begins exactly at the pretrained model and grows the change from nothing.",
      analogy:
        "A master chef's recipe (frozen) plus your pencil marks in the margin (B·A) — the dish is recipe-plus-marks, and erasing the marks restores the original perfectly.",
      breakdown: [
        { symbol: "W_0", meaning: "The pretrained matrix — frozen, shared across all tasks." },
        { symbol: "B A", meaning: "d×r times r×k: a full-size update built from 2·d·r numbers instead of d·k." },
        { symbol: "\\alpha / r", meaning: "A scale keeping update magnitude stable across ranks — tune r without retuning learning rates." },
      ],
    },
    {
      id: "rank",
      name: "Rank: the Budget of Change",
      formula: "\\mathrm{rank}(\\Delta W) \\le r \\ll \\min(d, k)",
      meaning:
        "A rank-r matrix is a sum of r rank-1 'layers' (σ·u·vᵀ each) — r independent directions of change. LoRA bets a handful suffice, and the paper measures it: on GPT-3, r = 1–4 already matches full fine-tuning on many tasks.",
      analogy:
        "An orchestra re-tuning for a new hall doesn't need 100 individual instructions — 'strings up a touch, brass softer' covers it. Few directions, big effect.",
      breakdown: [
        { symbol: "r", meaning: "The rank budget — the lab's slider. Typical values: 1, 2, 4, 8." },
        { symbol: "\\sigma_i u_i v_i^{T}", meaning: "One direction of change — exactly the layers you add one at a time in the LoRA Lab." },
        { symbol: "\\ll \\min(d,k)", meaning: "12,288 possible directions; a handful needed. That gap IS the 10,000× savings." },
      ],
    },
    {
      id: "params",
      name: "The Parameter Arithmetic",
      formula: "|\\Theta_{\\text{LoRA}}| = 2 \\cdot d \\cdot r \\quad \\text{vs} \\quad |\\Theta_{\\text{full}}| = d \\cdot k",
      meaning:
        "Two skinny matrices versus one full one. For GPT-3's 12,288-wide projections at r = 8: ~197K versus ~151M per matrix — and 10,000× fewer trainable parameters overall versus full fine-tuning (which also drags Adam's optimizer states for every weight).",
      analogy:
        "Describing a page edit as 'swap these two paragraphs' instead of retyping the page: the description scales with the CHANGE, not the document.",
      breakdown: [
        { symbol: "2dr", meaning: "A (r×k) + B (d×r) — grows linearly with rank, not quadratically with width." },
        { symbol: "dk", meaning: "The full matrix — what classic fine-tuning must store, differentiate, and optimize." },
        { symbol: "10{,}000\\times", meaning: "The paper's headline on GPT-3 175B, with the 3× GPU memory reduction alongside." },
      ],
    },
    {
      id: "merge",
      name: "The Zero-Latency Merge",
      formula: "W_{\\text{deploy}} = W_0 + \\frac{\\alpha}{r} B A",
      meaning:
        "After training, fold the adapter into the base with one addition. The deployed model is a plain weight matrix — identical inference cost to the original. Adapters compose by addition and remove by subtraction.",
      analogy:
        "Transparent sheets over a map: draw your route on the sheet, and when you need speed, photocopy map+sheet into one page. Swap sheets for different journeys; the map never changes.",
      breakdown: [
        { symbol: "W_{\\text{deploy}}", meaning: "An ordinary matrix — no extra modules, no latency, unlike adapter layers." },
        { symbol: "+ / -", meaning: "Merging and un-merging are exact — the frozen base is always recoverable." },
      ],
    },
  ],

  applications: [
    {
      icon: "code",
      title: "Fine-tuning on consumer GPUs",
      description:
        "LoRA (and QLoRA, its 4-bit descendant) is how individuals fine-tune 7B–70B open models on a single gaming card — the open-model ecosystem's workhorse.",
    },
    {
      icon: "message-square",
      title: "Per-customer AI",
      description:
        "SaaS platforms serve one frozen base model with thousands of hot-swappable customer adapters — personalization without per-customer GPU farms.",
    },
    {
      icon: "eye",
      title: "Image-generation styles",
      description:
        "Stable Diffusion communities trade LoRA files as portable art styles and characters — megabyte adapters that restyle a multi-gigabyte model.",
    },
    {
      icon: "languages",
      title: "Domain specialists",
      description:
        "Medical, legal, and code-specific model variants ship as adapters on shared bases — auditable, cheap to update, trivial to roll back.",
    },
    {
      icon: "search",
      title: "The PEFT field",
      description:
        "LoRA anchored parameter-efficient fine-tuning as a research area: AdaLoRA (adaptive ranks), DoRA (direction/magnitude), and dozens of variants iterate on this recipe.",
    },
    {
      icon: "dna",
      title: "On-device adaptation",
      description:
        "Tiny trainable footprints make on-device personalization plausible — a phone-sized adapter atop a shared foundation, keeping user data local.",
    },
  ],

  codeExample: {
    language: "python",
    title: "A LoRA layer from scratch",
    explanation:
      "The entire method in one module: freeze W₀, train two skinny matrices, add their product. Note the zero-init on B — training starts exactly at the pretrained model — and the merge that makes deployment free.",
    code: `import torch
import torch.nn as nn


class LoRALinear(nn.Module):
    """A frozen linear layer with a trainable low-rank bypass."""

    def __init__(self, base: nn.Linear, r: int = 8, alpha: int = 16):
        super().__init__()
        self.base = base
        self.base.weight.requires_grad_(False)   # W0 is FROZEN

        d, k = base.weight.shape
        self.A = nn.Parameter(torch.randn(r, k) * 0.01)  # Gaussian init
        self.B = nn.Parameter(torch.zeros(d, r))         # ZERO init:
        self.scale = alpha / r                   # so BA = 0 at step one --
                                                 # training starts at W0 exactly.

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        #        frozen path      +   low-rank correction
        return self.base(x) + self.scale * (x @ self.A.T @ self.B.T)

    @torch.no_grad()
    def merge(self):
        """Fold the adapter in: zero-latency deployment."""
        self.base.weight += self.scale * (self.B @ self.A)


# --- The arithmetic that changed the economics ---
d = k = 12_288                        # one GPT-3 attention projection
full = d * k                          # 150,994,944 trainable params
lora = 2 * d * 8                      #     196,608 at rank 8
print(f"trainable: {full:,} -> {lora:,}  ({full // lora}x fewer)")

# Applied to W_q and W_v across all 96 layers, versus full fine-tuning
# with Adam states for 175B params: ~10,000x fewer trainable parameters,
# ~3x less GPU memory -- and the merged model runs at base-model speed.`,
  },

  chatSuggestions: [
    "Why are weight updates low-rank?",
    "What do matrices A and B do?",
    "Why is B initialized to zero?",
    "How does LoRA compare to adapter layers?",
    "What made LoRA 10,000× cheaper?",
  ],

  course: {
    title: "LoRA: the 10,000× discount on customization",
    description:
      "A 4-lesson mini course: why fine-tuning giants broke, the low-rank insight, the B·A mechanism, and the ecosystem it unlocked.",
    lessons: [
      {
        id: "lesson-1",
        number: 1,
        title: "The fine-tuning wall",
        duration: "5 min",
        summary: "When adapting a model costs as much as owning it.",
        sections: [
          {
            heading: "Full fine-tuning, honestly priced",
            body: "Adapting GPT-3 the classic way means gradients for all 175B parameters — plus Adam's optimizer states, which multiply the memory bill several-fold. Then storage: every task yields a complete ~350GB checkpoint. Ten customers with ten styles? Ten full copies of one of the largest artifacts ever trained.",
          },
          {
            heading: "The shortcuts and their taxes",
            body: "The field had workarounds, each with a tax. Adapter layers (small modules inserted between layers) train cheaply but run at inference forever — the paper measures the latency hit, worst exactly where products live (batch size 1, short sequences). Prefix tuning learns magic tokens but is finicky to optimize and spends your context window. Cheap training OR clean inference — pick one.",
          },
          {
            heading: "The question worth asking",
            body: "Underneath it all sits an assumption: that adaptation NEEDS billions of adjustable numbers. Does it? How much information is actually in the difference between 'GPT-3' and 'GPT-3, but good at your task'? That measurement is the next lesson — and the answer is the whole paper.",
          },
        ],
        keyTakeaway:
          "Full fine-tuning scales with model size (compute, memory, and 350GB per task); prior shortcuts taxed inference or context. The open question: how big is the change, really?",
        quiz: {
          question: "What was the key drawback of adapter layers that LoRA set out to beat?",
          options: [
            { text: "They required labeled data", correct: false, explanation: "All fine-tuning methods use task data — that's not the differentiator." },
            { text: "They add permanent inference latency, since extra modules run on every forward pass", correct: true, explanation: "Exactly — adapters train cheaply but tax every future inference. LoRA's merge (W₀ + BA) eliminates that tax structurally." },
            { text: "They only worked on small models", correct: false, explanation: "Adapters scale fine — the latency follows them up." },
            { text: "They changed the base model's weights", correct: false, explanation: "Adapters also freeze the base — freezing wasn't LoRA's novelty; the merge property was." },
          ],
        },
      },
      {
        id: "lesson-2",
        number: 2,
        title: "The low-rank discovery",
        duration: "7 min",
        summary: "The change is simple, even when the model is vast.",
        sections: [
          {
            heading: "What rank means, by hand",
            body: "A matrix has low rank when it's secretly a stack of a few simple 'layers' — each layer one column pattern times one row pattern (σ·u·vᵀ). A 24×24 matrix has 576 numbers; if it's rank 3, three layers (144 numbers) rebuild it almost exactly. The LoRA Lab in this lesson makes this physical: drag the rank slider and watch a real decomposition reassemble a full update.",
          },
          {
            heading: "The empirical surprise",
            body: "Building on intrinsic-dimensionality work, the paper checks fine-tuning updates themselves — and finds their singular values crash after the first few directions (the lab's bar chart shows exactly this shape). A 12,288-wide matrix has 12,288 possible directions of change; the ones that matter for a task number in the single digits. The model is vast; the ADJUSTMENT is simple.",
          },
          {
            heading: "Why that makes sense",
            body: "Pretraining already built every skill's ingredients — attention patterns, features, circuits. Adapting to a task mostly re-weights what exists: amplify these directions, quiet those. Section 7 of the paper measures precisely this: ΔW amplifies directions already present in W₀ but under-emphasized — a few knobs turned, not a rewiring.",
          },
        ],
        keyTakeaway:
          "Fine-tuning updates have low intrinsic rank: a handful of σ·u·vᵀ layers rebuilds them (watch it in the lab). Adaptation re-weights existing abilities rather than creating new ones.",
        quiz: {
          question: "What does it mean that a weight update has 'low rank'?",
          options: [
            { text: "Its values are all small numbers", correct: false, explanation: "Magnitude isn't rank — a low-rank matrix can have huge entries." },
            { text: "It can be rebuilt from a few column-pattern × row-pattern layers — few independent directions of change", correct: true, explanation: "Exactly — rank counts independent directions. Three σ·u·vᵀ layers rebuilding 93% of the lab's matrix is low rank in action." },
            { text: "It only affects the model's final layer", correct: false, explanation: "Low-rank updates occur across layers — rank is about structure within each matrix, not location." },
            { text: "It contains mostly zeros", correct: false, explanation: "That's sparsity — a different kind of simplicity. LoRA's updates are dense but low-rank." },
          ],
        },
      },
      {
        id: "lesson-3",
        number: 3,
        title: "The B·A mechanism",
        duration: "7 min",
        summary: "Two skinny matrices and three careful choices.",
        sections: [
          {
            heading: "Build the bottleneck",
            body: "If updates are rank-r anyway, don't learn ΔW and compress it — construct it compressed: ΔW = B·A with B (d×r) and A (r×k). The product is full-sized but can only express rank-r changes, by construction. Parameters: 2dr instead of dk — for GPT-3's projections at r=8, about 197 thousand instead of 151 million.",
          },
          {
            heading: "Three quiet design choices",
            body: "First: B starts at ZERO, so BA = 0 and step one of training is exactly the pretrained model — no random damage to a working system. Second: the update is scaled by α/r, keeping its magnitude stable when you change rank — no hyperparameter re-hunt. Third: target selection — adapting only attention's W_q and W_v turns out to be enough; spreading budget across both beats concentrating it (the paper's ablation).",
          },
          {
            heading: "Then make deployment free",
            body: "The signature move: after training, compute W = W₀ + BA once. The adapted model is now an ordinary matrix — zero extra latency, unlike adapters' permanent modules. Subtract to un-merge; add a different BA for a different task. The base ships once; skills ship as megabytes.",
          },
        ],
        keyTakeaway:
          "ΔW = B·A imposes the low-rank bet by construction; zero-init B starts training at W₀; α/r stabilizes across ranks; merging makes inference cost identical to the base model.",
        quiz: {
          question: "Why is matrix B initialized to zero?",
          options: [
            { text: "To save memory at initialization", correct: false, explanation: "Zeros and random values cost identical memory." },
            { text: "So B·A = 0 at the start — training begins exactly at the pretrained model, with adaptation growing from nothing", correct: true, explanation: "Exactly — a random ΔW would perturb a working model before learning anything. Zero-init makes step one harmless and optimization stable." },
            { text: "Because gradients can't flow through random matrices", correct: false, explanation: "They can — A is random and trains fine. The zero is about where training STARTS." },
            { text: "To force the update to be sparse", correct: false, explanation: "B fills in densely during training — the constraint is rank, not sparsity." },
          ],
        },
      },
      {
        id: "lesson-4",
        number: 4,
        title: "The ecosystem it unlocked",
        duration: "6 min",
        summary: "From 10,000× savings to a many-models world.",
        sections: [
          {
            heading: "The scoreboard",
            body: "On GPT-3 175B: 10,000× fewer trainable parameters, 3× less GPU memory, checkpoints measured in megabytes — and quality on-par with or better than full fine-tuning across RoBERTa, DeBERTa, GPT-2, and GPT-3 benchmarks. Rank ablations landed the twist: r = 1 or 2 is often already competitive. The bet wasn't just safe; it was conservative.",
          },
          {
            heading: "What it changed outside the paper",
            body: "LoRA re-priced customization. QLoRA stacked it on 4-bit quantized bases, putting 33B–70B fine-tunes on single consumer GPUs. Communities built adapter marketplaces (most visibly for Stable Diffusion styles). Serving stacks learned to hot-swap per-customer adapters over one frozen base. 'Fine-tune your own model' went from a lab budget line to a weekend project.",
          },
          {
            heading: "The idea underneath",
            body: "LoRA endures because its premise is about learning itself: pretrained models already contain their abilities, and tasks mostly need a re-weighting — a low-rank nudge. The same intuition drives its successors (AdaLoRA's adaptive ranks, DoRA's direction/magnitude split) and echoes this site's other papers: attention decides where to look, RLHF decides what to prefer, and LoRA shows how little must change to make either happen.",
          },
        ],
        keyTakeaway:
          "Matching quality at 10,000× fewer trainable parameters made per-task adapters the norm — one frozen base, thousands of megabyte-sized skills, fine-tuning for everyone.",
        quiz: {
          question: "After merging (W = W₀ + BA), how much slower is LoRA inference than the base model?",
          options: [
            { text: "About 2× slower", correct: false, explanation: "There's nothing extra to run — merging leaves one ordinary matrix." },
            { text: "Not slower at all — the merged model is a plain weight matrix, identical in cost to the base", correct: true, explanation: "Exactly — this zero-latency property is LoRA's decisive edge over adapter layers, whose modules run forever." },
            { text: "Slower only for long sequences", correct: false, explanation: "That's prefix tuning's tax (consumed context) — LoRA doesn't touch the sequence." },
            { text: "It depends on the rank r", correct: false, explanation: "Rank affects training cost; after the merge, r leaves no runtime trace at all." },
          ],
        },
      },
    ],
  },
};
