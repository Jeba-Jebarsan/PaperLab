import type { Paper } from "../types";

export const vitPaper: Paper = {
  id: "2010.11929",
  slug: "vision-transformer",
  arxivId: "2010.11929",
  title: "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale",
  authors: [
    "Alexey Dosovitskiy",
    "Lucas Beyer",
    "Alexander Kolesnikov",
    "Dirk Weissenborn",
    "Xiaohua Zhai",
    "Thomas Unterthiner",
    "Mostafa Dehghani",
    "Matthias Minderer",
    "Georg Heigold",
    "Sylvain Gelly",
    "Jakob Uszkoreit",
    "Neil Houlsby",
  ],
  year: 2020,
  venue: "ICLR 2021",
  citationCount: 60000,
  tags: ["Computer Vision", "Transformers", "Classification", "Foundational"],
  abstract:
    "While the Transformer architecture has become the de-facto standard for natural language processing tasks, its applications to computer vision remain limited. We show that this reliance on CNNs is not necessary and a pure transformer applied directly to sequences of image patches can perform very well on image classification tasks. When pre-trained on large amounts of data and transferred to multiple mid-sized or small image recognition benchmarks (ImageNet, CIFAR-100, VTAB, etc.), Vision Transformer (ViT) attains excellent results compared to state-of-the-art convolutional networks while requiring substantially fewer computational resources to train.",
  oneLiner:
    "This paper cut photos into little squares, called them 'words', and fed them to the same attention machine that reads sentences — proving Transformers could see as well as they read.",
  readingTime: "9 min interactive",
  difficulty: "Foundational",

  explainLevels: {
    beginner: [
      {
        heading: "Two ways to look at a picture",
        body: "A CNN (like AlexNet or ResNet) looks at a photo the way you'd read with a magnifying glass held very close: it slides a tiny window over small patches, one neighborhood at a time, and only slowly — layer after layer — connects far-apart parts of the image. This paper asks: what if we looked at the WHOLE photo at once instead, the way attention lets a sentence's first and last word talk directly?",
      },
      {
        heading: "A photo, cut into 'words'",
        body: "The trick is almost silly in its simplicity: slice the image into a grid of small squares — 16×16 pixels each — and treat every square like a word in a sentence. A 224×224 photo becomes 196 'words'. Feed that sequence of patches into the exact same Transformer that powers ChatGPT, and self-attention lets any patch look at any other patch, near or far, from the very first layer.",
      },
      {
        heading: "The catch — and the payoff",
        body: "There's an honest twist: unlike a CNN, this method has no built-in assumption that nearby pixels matter more than far ones — it must LEARN that from scratch. So on a modest dataset it actually loses to CNNs. But given hundreds of millions of training photos, it learns those patterns itself and then matches or beats the best CNNs, while costing less compute to train. Today, this patches-and-attention idea sits behind image search, self-driving perception, and any AI that looks at a picture and understands it in words (like this website's tutor).",
      },
    ],
    developer: [
      {
        heading: "The architecture, precisely",
        body: "An image x ∈ ℝ^(H×W×C) is reshaped into N = HW/P² flattened patches of size P×P (P=16 in the base model). Each patch is linearly projected to dimension D via a trainable embedding matrix E, producing patch embeddings. A learnable [class] token is prepended (as in BERT), and learnable 1D position embeddings are added — the whole sequence z₀ then enters a standard Transformer encoder: alternating pre-norm multi-head self-attention and MLP (GELU) blocks with residual connections, exactly per Vaswani et al. (2017). The final [class] token representation feeds an MLP classification head.",
      },
      {
        heading: "Model family and training",
        body: "Three sizes, denoted Model/patch-size: ViT-Base/16 (12 layers, D=768, 12 heads, ~86M params), ViT-Large/16 (24 layers, D=1024, 16 heads, ~307M params), ViT-Huge/14 (32 layers, D=1280, 16 heads, ~632M params). Pre-trained on ImageNet-21k (14M images) or Google's internal JFT-300M (~303M images), then fine-tuned at higher resolution on downstream tasks — which requires 2D-interpolating the pre-trained position embeddings since patch count changes with resolution.",
      },
      {
        heading: "The headline results and the honest caveat",
        body: "ViT-H/14 pre-trained on JFT-300M reaches 88.55% top-1 on ImageNet, 94.55% on CIFAR-100, and 77.63% average on the 19-task VTAB suite — matching or beating prior state-of-the-art CNNs (BiT, Noisy Student) while the paper reports substantially lower pre-training compute. But trained from scratch on ImageNet-1k alone (1.3M images, no extra data), ViT trails ResNets of comparable size by several points — the paper attributes this directly to the missing convolutional inductive biases (locality, translation equivariance) that ViT must instead learn from data.",
      },
    ],
    researcher: [
      {
        heading: "The inductive-bias trade",
        body: "CNNs bake in locality, 2D neighborhood structure, and translation equivariance at every layer; ViT has vastly less image-specific inductive bias — only the patch-extraction step and resolution-adjustment interpolation use 2D structure, and spatial relations among patches must be learned entirely from position-embedding data. The paper's core empirical claim is that this trade is favorable exactly when data is abundant: with insufficient data the missing bias hurts (ViT loses to ResNets on ImageNet-1k-only training), but at JFT-300M scale, learned structure transfers better than hard-coded structure.",
      },
      {
        heading: "What attention reveals about global reasoning",
        body: "The paper's attention-distance analysis (Figure 7) measures, per head and layer, the average pixel distance attended to. Some heads attend locally even in the earliest layers — recovering something like a small convolutional receptive field — while other heads attend globally already at layer one, integrating information across the entire image before a CNN's receptive field could physically reach that far. This is presented as evidence that self-attention lets the model choose its own effective receptive field per head, rather than having it fixed architecturally.",
      },
      {
        heading: "Legacy",
        body: "ViT reframed vision as a sequence-modeling problem, and the field absorbed it fast: DeiT showed data-efficient training via distillation (no JFT needed), Swin introduced hierarchical windowed attention for dense prediction, and hybrid CNN-ViT designs (using CNN feature maps as the patch source) narrowed the small-data gap the original paper reported. Perhaps most consequentially, ViT-style encoders became the default visual backbone for multimodal systems — CLIP, and eventually GPT-4V/Gemini-class vision-language models — because a patch sequence embeds naturally alongside a token sequence in one shared Transformer.",
      },
    ],
  },

  psi: {
    problem: {
      title: "Convolution was the only serious way to see",
      points: [
        "CNNs process images through small local windows, connecting distant pixels only after many stacked layers.",
        "Attention had transformed language by 2020, but almost nobody had tried removing convolution from vision entirely.",
        "It was unclear whether a general-purpose sequence model could match CNNs' hard-won, vision-specific design.",
      ],
      analogy:
        "Reading a photo through a moving magnifying glass instead of glancing at the whole thing at once.",
    },
    solution: {
      title: "Cut the image into 'words', and use pure attention",
      points: [
        "Slice the photo into a grid of 16×16 patches — 196 of them for a standard 224×224 image.",
        "Linearly embed each patch, add a position embedding and a [class] token, and feed the sequence to a standard Transformer encoder.",
        "No convolutions anywhere — every patch can attend to every other patch from the very first layer.",
      ],
      analogy:
        "Chopping a photo into puzzle pieces, numbering them, and handing the whole pile to the same reading machine that understands sentences.",
    },
    impact: {
      title: "Vision became a language problem",
      points: [
        "Matched or beat state-of-the-art CNNs (88.55% ImageNet top-1) once pretrained on hundreds of millions of images, at lower pretraining compute.",
        "Became the default visual backbone for multimodal AI — CLIP, and GPT-4V/Gemini-class vision-language models.",
        "Spawned an entire lineage: DeiT, Swin, hybrid CNN-ViT designs, and segmentation/detection Transformers.",
      ],
      analogy:
        "The moment cameras and keyboards started speaking the same language inside one brain.",
    },
  },

  architecture: {
    nodes: [
      {
        id: "input",
        label: "Input Image",
        sublabel: "224 × 224 × 3",
        kind: "io",
        description:
          "An ordinary photo. Unlike a CNN, nothing here assumes nearby pixels are related — that has to be learned.",
        example: "A photo of a bird, about to be sliced into a grid of small squares.",
        detail:
          "Resolution can be increased at fine-tuning time; the patch size stays fixed, so a bigger image just means more patches (a longer sequence).",
      },
      {
        id: "patches",
        label: "Patchify",
        sublabel: "16 × 16 patches → 196 “words”",
        kind: "process",
        description:
          "The image is chopped into a grid of fixed-size squares, each flattened into a single vector — exactly the way a sentence is chopped into tokens.",
        example: "224 ÷ 16 = 14, so 14×14 = 196 patches, each a 16×16×3 = 768-number vector.",
        detail:
          "This is the paper's only real vision-specific step besides the final resolution interpolation — everything after this is generic sequence processing.",
      },
      {
        id: "embed",
        label: "Linear Projection",
        sublabel: "patch → D-dim embedding",
        kind: "process",
        description:
          "A single learned matrix E projects each flattened patch into the model's working dimension D (768 for the Base model) — the same role word embeddings play for text.",
        example: "A 768-number raw patch becomes a 768-dim learned embedding — same size here, but conceptually transformed.",
        detail:
          "Because this is just a linear layer, it's mathematically equivalent to a single large convolution with stride equal to the patch size — the one convolution-flavored step in the whole model.",
      },
      {
        id: "cls",
        label: "[class] Token + Position",
        sublabel: "prepend + add position embeddings",
        kind: "process",
        description:
          "A learnable [class] token is prepended to the patch sequence (borrowed from BERT's [CLS]), and a learnable position embedding is added to every token so the model can tell patches apart by location.",
        example: "Sequence becomes: [class], patch₁, patch₂, …, patch₁₉₆ — 197 tokens total.",
        detail:
          "Position embeddings start with zero knowledge of 2D layout — the paper finds the model discovers sensible 2D neighborhood structure on its own during training.",
      },
      {
        id: "encoder",
        label: "Transformer Encoder",
        sublabel: "alternating MSA + MLP, ×12 to ×32",
        kind: "core",
        description:
          "The exact same bidirectional encoder architecture as BERT: multi-head self-attention lets every patch attend to every other patch, followed by a per-patch MLP, both wrapped in residual connections and layer norm.",
        example: "The patch covering the bird's eye can attend directly to the patch covering its tail — one hop, any distance.",
        detail:
          "ViT-Base: 12 layers, 12 heads, D=768 (~86M params). ViT-Large: 24 layers, 16 heads, D=1024 (~307M). ViT-Huge: 32 layers, 16 heads, D=1280 (~632M). Explore this exact mechanism in the Attention Lab below.",
      },
      {
        id: "attndist",
        label: "Global From Layer One",
        sublabel: "attention distance analysis",
        kind: "process",
        description:
          "Unlike a CNN, whose receptive field grows slowly layer by layer, some attention heads attend across the whole image already in the very first layer — while other heads stay local, like a learned convolution.",
        example: "One early head might connect only neighboring patches; another jumps straight to the opposite corner.",
        detail:
          "The model chooses its own effective receptive field per head, rather than having it fixed by architecture — the paper's key evidence that attention offers something structurally different from convolution.",
      },
      {
        id: "clsout",
        label: "[class] Output",
        sublabel: "the image's summary vector",
        kind: "process",
        description:
          "After the final encoder layer, the [class] token's vector has absorbed information from every patch through repeated attention — it now represents the whole image.",
        example: "197 vectors go in; the one at position 0 comes out holding the 'gist' of the photo.",
        detail:
          "This mirrors exactly how BERT's [CLS] token is used for sentence-level classification — vision borrowing language's own trick.",
      },
      {
        id: "output",
        label: "MLP Head",
        sublabel: "classification",
        kind: "io",
        description:
          "A small classifier head reads the [class] output and predicts the image's category.",
        example: "88.55% top-1 accuracy on ImageNet for the largest model, pretrained on 300M images.",
        detail:
          "At pre-training time this head has one hidden layer; at fine-tuning time it's reduced to a single linear layer.",
      },
    ],
    edges: [
      { source: "input", target: "patches" },
      { source: "patches", target: "embed" },
      { source: "embed", target: "cls" },
      { source: "cls", target: "encoder" },
      { source: "encoder", target: "attndist" },
      { source: "attndist", target: "clsout" },
      { source: "clsout", target: "output" },
    ],
  },

  math: [
    {
      id: "patch-embed",
      name: "Patch Embedding",
      formula: "z_0 = [x_{\\text{class}}; \\; x_p^1 E; \\; x_p^2 E; \\ldots; x_p^N E] + E_{pos}",
      meaning:
        "Flatten each of the N image patches, project them all with the same learned matrix E (exactly like a word-embedding table), stick a learnable [class] token on the front, and add position information. The result is one sequence — indistinguishable, structurally, from a sentence of token embeddings.",
      analogy:
        "Turning a jigsaw puzzle into a numbered list of pieces, then handing that list to a reader who processes lists for a living.",
      breakdown: [
        { symbol: "x_p^i", meaning: "The i-th flattened image patch — a 16×16×3 = 768-number vector." },
        { symbol: "E", meaning: "One shared learned projection matrix — every patch uses the same one, like a shared vocabulary table." },
        { symbol: "x_{\\text{class}}", meaning: "A learnable token prepended to collect a whole-image summary, borrowed directly from BERT's [CLS]." },
        { symbol: "E_{pos}", meaning: "Learnable position embeddings — the model's only clue about where each patch sits in the grid." },
      ],
    },
    {
      id: "vit-block",
      name: "The Encoder Block",
      formula:
        "z'_\\ell = \\mathrm{MSA}(\\mathrm{LN}(z_{\\ell-1})) + z_{\\ell-1}, \\qquad z_\\ell = \\mathrm{MLP}(\\mathrm{LN}(z'_\\ell)) + z'_\\ell",
      meaning:
        "Every layer does exactly two things, each wrapped in a residual shortcut: let patches exchange information via attention, then let each patch think it over independently in an MLP. This is character-for-character the same recipe as the 2017 Transformer and BERT — nothing about it is vision-specific.",
      analogy:
        "A committee round (attention: patches compare notes) followed by solo reflection (MLP: each patch updates its own opinion) — repeated a dozen or more times.",
      breakdown: [
        { symbol: "\\mathrm{MSA}", meaning: "Multi-head self-attention — the exact mechanism in the Attention Lab, now run over patches instead of words." },
        { symbol: "\\mathrm{LN}", meaning: "Layer normalization, applied BEFORE each sub-block (pre-norm) — a detail that stabilizes very deep stacks." },
        { symbol: "+ z_{\\ell-1}", meaning: "The residual connection — the same ResNet-style shortcut, without which 32-layer ViT-Huge would not train." },
      ],
    },
    {
      id: "patch-count",
      name: "How Many 'Words' in a Picture",
      formula: "N = \\frac{H \\cdot W}{P^2}",
      meaning:
        "The image's height and width, divided by the patch area, tells you exactly how long the 'sentence' is. Bigger images or smaller patches mean more patches — and since attention compares every patch to every other, cost grows with the SQUARE of this number.",
      analogy:
        "A large-print book has fewer, bigger 'chunks' per page than fine print — but here, chunk size (patch size) is a design choice, and the picture is the 'page'.",
      breakdown: [
        { symbol: "H, W", meaning: "Image height and width in pixels — 224×224 in the standard setup." },
        { symbol: "P", meaning: "Patch side length — 16 in the base model (hence '16×16 words'), 14 in ViT-Huge/14." },
        { symbol: "N = 196", meaning: "For 224×224 images at P=16: exactly 196 patches, plus the [class] token = 197 total positions." },
      ],
    },
    {
      id: "classifier",
      name: "Classification from the [class] Token",
      formula: "y = \\mathrm{MLP}\\big(\\mathrm{LN}(z_L^0)\\big)",
      meaning:
        "After all L encoder layers, only ONE of the 197 output vectors is used for the final answer: position 0, the [class] token — which by then has attended to every patch, repeatedly, and absorbed the whole image into one vector.",
      analogy:
        "A committee chair who sat through every discussion round and is the only one asked to summarize the meeting's conclusion.",
      breakdown: [
        { symbol: "z_L^0", meaning: "The [class] token's vector after the final (L-th) encoder layer." },
        { symbol: "\\mathrm{MLP}", meaning: "One hidden layer at pre-training time; a single linear layer at fine-tuning time." },
      ],
    },
  ],

  applications: [
    {
      icon: "eye",
      title: "Modern image classification",
      description:
        "ViT and its descendants (DeiT, Swin, ConvNeXt-inspired hybrids) are now standard vision backbones, often outperforming pure CNNs at scale.",
    },
    {
      icon: "search",
      title: "Multimodal AI — CLIP and beyond",
      description:
        "CLIP's image encoder is a ViT, trained so images and captions land in the same embedding space — the visual half of nearly every modern vision-language model.",
    },
    {
      icon: "message-square",
      title: "GPT-4V, Gemini and vision-capable assistants",
      description:
        "Because patches embed just like text tokens, ViT-style encoders let a single Transformer read an image and a question together — the basis of 'show it a picture and ask about it' AI.",
    },
    {
      icon: "code",
      title: "Detection and segmentation",
      description:
        "DETR and its successors, plus Swin-based segmentation models, replace hand-designed detection heads with attention over image patches.",
    },
    {
      icon: "dna",
      title: "Medical and scientific imaging",
      description:
        "ViT backbones read X-rays, pathology slides, and satellite imagery, often fine-tuned from the same large-scale pretrained weights this paper introduced.",
    },
    {
      icon: "languages",
      title: "Video understanding",
      description:
        "ViViT and video-Transformer variants extend patches into space-TIME cubes, applying the same 'chop it up, attend over the pieces' idea to moving images.",
    },
  ],

  codeExample: {
    language: "python",
    title: "A minimal Vision Transformer",
    explanation:
      "The whole idea in code: chop the image into patches, embed them like tokens, prepend a [class] token, add position embeddings, and hand the sequence to a standard Transformer encoder. Everything after patchify() is generic sequence modeling — no convolutions required.",
    code: `import torch
import torch.nn as nn


class ViT(nn.Module):
    """Dosovitskiy et al., 2020 — patches in, attention does the rest."""

    def __init__(self, img_size=224, patch_size=16, in_ch=3,
                 dim=768, depth=12, heads=12, mlp_dim=3072,
                 num_classes=1000):
        super().__init__()
        n_patches = (img_size // patch_size) ** 2   # 196 for 224/16

        # Patchify + linear projection in ONE conv call:
        # a stride-P, kernel-P convolution IS patch extraction + embedding.
        self.patch_embed = nn.Conv2d(in_ch, dim, kernel_size=patch_size,
                                      stride=patch_size)

        self.cls_token = nn.Parameter(torch.zeros(1, 1, dim))
        self.pos_embed = nn.Parameter(torch.zeros(1, n_patches + 1, dim))

        # Standard pre-norm Transformer encoder -- identical machinery
        # to a text Transformer, just fed patches instead of words.
        layer = nn.TransformerEncoderLayer(
            d_model=dim, nhead=heads, dim_feedforward=mlp_dim,
            activation="gelu", norm_first=True, batch_first=True,
        )
        self.encoder = nn.TransformerEncoder(layer, num_layers=depth)
        self.head = nn.Linear(dim, num_classes)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        B = x.shape[0]
        x = self.patch_embed(x)              # (B, dim, 14, 14)
        x = x.flatten(2).transpose(1, 2)     # (B, 196, dim) -- 196 "words"

        cls = self.cls_token.expand(B, -1, -1)
        x = torch.cat([cls, x], dim=1)       # (B, 197, dim)
        x = x + self.pos_embed                # learned position info

        x = self.encoder(x)                   # every patch attends to every patch
        return self.head(x[:, 0])             # classify from the [class] token


vit = ViT()
out = vit(torch.randn(1, 3, 224, 224))
print(out.shape)      # torch.Size([1, 1000])`,
  },

  chatSuggestions: [
    "Why does ViT need so much training data?",
    "How is an image turned into 'words'?",
    "What is the [class] token for?",
    "How is this different from a CNN?",
    "What did ViT lead to?",
  ],

  course: {
    title: "Vision Transformer: teaching attention to see",
    description:
      "A 4-lesson mini course: what convolution assumes, turning pictures into words, seeing globally from layer one, and the data-hungry trade-off.",
    lessons: [
      {
        id: "lesson-1",
        number: 1,
        title: "What convolution assumes",
        duration: "6 min",
        summary: "CNNs bake in a rule: nearby pixels matter more.",
        sections: [
          {
            heading: "A built-in assumption",
            body: "Every convolutional filter — from AlexNet's edge detectors to ResNet's deep stacks — makes one hard-coded assumption: nearby pixels are related, and that relationship looks the same everywhere in the image (translation equivariance). That assumption is usually true for photos, and it's why CNNs learned to see so well with relatively modest data.",
          },
          {
            heading: "The cost of an assumption",
            body: "A built-in assumption is also a limitation: a CNN can't easily learn a DIFFERENT rule even if the data suggests one, and connecting two far-apart pixels still requires stacking enough layers for the receptive field to grow that large. Play with the CNN Lab in this lesson and notice: one filter only ever looks at its small window.",
          },
          {
            heading: "The question this paper asks",
            body: "What if, instead of hard-coding 'nearby pixels matter', we let the model learn whatever spatial relationships the data actually shows it — using the same attention mechanism already proven on text? The cost: the model starts with no assumptions at all, and must learn structure entirely from examples.",
          },
        ],
        keyTakeaway:
          "CNNs hard-code locality and translation equivariance — a helpful shortcut, but a fixed one. ViT removes the shortcut entirely and learns spatial structure from data instead.",
        quiz: {
          question: "What built-in assumption do convolutional filters make?",
          options: [
            { text: "That images are always grayscale", correct: false, explanation: "Convolution works identically across color channels — color isn't the assumption." },
            { text: "That nearby pixels are related, and that pattern repeats the same way across the whole image", correct: true, explanation: "Exactly — locality and translation equivariance. A filter's assumption about 'nearby pixels' is hard-coded, not learned." },
            { text: "That objects are always centered in the photo", correct: false, explanation: "Convolution slides everywhere — it has no preference for the center." },
            { text: "That all images are the same resolution", correct: false, explanation: "CNNs handle varying input sizes reasonably; resolution isn't the core assumption at stake here." },
          ],
        },
      },
      {
        id: "lesson-2",
        number: 2,
        title: "A photo, chopped into words",
        duration: "7 min",
        summary: "196 puzzle pieces, one shared embedding table.",
        sections: [
          {
            heading: "The patchify trick",
            body: "Cut a 224×224 photo into a grid of 16×16 squares and you get 196 patches — call them 'words'. Flatten each into a number vector, and run every single one through the SAME learned projection matrix, exactly the way every word in a sentence shares one embedding table. There is no rule yet linking patch 5 to patch 6 — that has to come from somewhere else.",
          },
          {
            heading: "The [class] token and position embeddings",
            body: "Borrowing directly from BERT: a learnable [class] token is glued to the front of the sequence, destined to summarize the whole image. And since attention alone has no sense of order (shuffle the patches, get the same math), a learned position embedding is added to every token — the model's only hint about the 2D grid it came from.",
          },
          {
            heading: "See it in the architecture",
            body: "Trace the path in this lesson's architecture explorer: Input → Patchify → Linear Projection → [class] + Position → Encoder. By the time patches enter the Transformer, they are structurally identical to word embeddings — the model genuinely cannot tell whether it's reading a sentence or a photo.",
          },
        ],
        keyTakeaway:
          "Patchify + shared linear projection + [class] token + position embeddings turns any image into a token sequence a text Transformer would recognize.",
        quiz: {
          question: "Why does ViT need position embeddings if it already has patches in a grid?",
          options: [
            { text: "To make the patches higher resolution", correct: false, explanation: "Position embeddings carry no pixel information — only location." },
            { text: "Self-attention has no built-in sense of order — shuffling the patches would give identical attention math without them", correct: true, explanation: "Exactly the same reason a text Transformer needs position embeddings: attention treats input as an unordered set unless location is explicitly added." },
            { text: "To reduce the number of patches needed", correct: false, explanation: "Position embeddings don't change patch count — they're added to each patch embedding." },
            { text: "To convert patches back into pixels", correct: false, explanation: "That would be a decoder's job — ViT here only classifies, it doesn't reconstruct images." },
          ],
        },
      },
      {
        id: "lesson-3",
        number: 3,
        title: "Seeing the whole picture, immediately",
        duration: "7 min",
        summary: "Attention gives every patch a global view from layer one.",
        sections: [
          {
            heading: "One hop, any distance",
            body: "In a CNN, connecting the patch covering a bird's eye to the patch covering its tail requires enough stacked layers for the receptive field to grow that large. In ViT, self-attention lets any patch query any other patch directly — including the eye and the tail — in a single layer. Try it in the Attention Lab in this lesson: the same visualization you'd use for words now works over image patches.",
          },
          {
            heading: "What the attention-distance chart shows",
            body: "The paper measures, per attention head, how far each head tends to attend. The finding: some heads stay local even in early layers — behaving almost like a learned convolution — while OTHER heads attend globally right from layer one, something no CNN layer could do no matter how it's designed. The model chooses its own effective 'field of view' per head, rather than having it fixed by architecture.",
          },
          {
            heading: "Global vision, structurally",
            body: "This is the paper's real architectural claim: it's not that attention is smarter than convolution in the abstract — it's that attention removes a structural ceiling on how quickly information can travel across an image. What the model does with that freedom still has to be learned, which sets up the next lesson's trade-off.",
          },
        ],
        keyTakeaway:
          "Self-attention lets every patch attend to every other patch in one step; measured attention distances show some heads go fully global even in the earliest layers — something convolution cannot do by construction.",
        quiz: {
          question: "What did the paper's attention-distance analysis find?",
          options: [
            { text: "All heads attend only to their immediate neighbors, just like convolution", correct: false, explanation: "Some heads do behave locally — but critically, others don't, which is the whole point." },
            { text: "Some heads attend locally, but others attend across the entire image even in the very first layer", correct: true, explanation: "Correct — this mix, especially the early-layer global heads, is evidence attention offers something structurally new versus convolution's slowly-growing receptive field." },
            { text: "Attention distance always increases with network depth", correct: false, explanation: "The finding is more surprising than that — some heads are already global at layer one, not just at the end." },
            { text: "Attention distance doesn't matter for image classification", correct: false, explanation: "The paper presents it as central evidence for why removing convolution entirely is viable." },
          ],
        },
      },
      {
        id: "lesson-4",
        number: 4,
        title: "The data-hungry trade-off",
        duration: "6 min",
        summary: "Loses small, wins huge — and what came after.",
        sections: [
          {
            heading: "The honest result",
            body: "Trained on ImageNet-1k alone (1.3 million images) with no extra data, ViT trails ResNets of similar size by several points. The paper is direct about why: without convolution's built-in assumptions, ViT must learn locality and spatial structure from scratch — and 1.3 million images isn't enough to learn what a CNN gets for free.",
          },
          {
            heading: "The payoff at scale",
            body: "Pre-train the same architecture on JFT-300M — roughly 300 million images — and the picture flips: ViT-Huge/14 reaches 88.55% top-1 on ImageNet, 94.55% on CIFAR-100, and matches or beats the best CNNs of its time, while the paper reports substantially lower compute spent on pre-training. Given enough examples, the model learns better spatial structure than anyone had hard-coded.",
          },
          {
            heading: "What followed",
            body: "The field moved fast to close ViT's small-data gap: DeiT showed a data-efficient training recipe (distillation, no JFT needed); Swin brought back a form of locality via windowed attention for dense tasks like segmentation; hybrid CNN-ViT models fed convolutional features into the Transformer. Most consequentially, ViT-style encoders became the default 'eyes' of multimodal AI — CLIP, and GPT-4V/Gemini-class models — because patches embed naturally alongside text tokens in one shared Transformer.",
          },
        ],
        keyTakeaway:
          "ViT loses to CNNs on modest data and wins decisively at hundreds-of-millions-of-images scale — a trade that reshaped vision research and gave multimodal AI its visual backbone.",
        quiz: {
          question: "Why does ViT underperform CNNs when trained only on ImageNet-1k (1.3M images)?",
          options: [
            { text: "The Transformer architecture is fundamentally worse at vision", correct: false, explanation: "At larger scale it matches or beats CNNs — the architecture isn't the limitation." },
            { text: "It lacks CNNs' built-in locality and translation-equivariance assumptions, and must learn that structure from data — which 1.3M images isn't enough to do well", correct: true, explanation: "Exactly the paper's own explanation — missing inductive bias must be compensated for with data, and modest datasets aren't enough." },
            { text: "Patches are too small to contain useful information", correct: false, explanation: "Patch size is a design choice, not the source of the small-data gap." },
            { text: "It only works on grayscale images", correct: false, explanation: "ViT processes full RGB images exactly like a CNN would." },
          ],
        },
      },
    ],
  },
};
