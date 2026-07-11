import type { Paper } from "../types";

export const alexnetPaper: Paper = {
  id: "alexnet-2012",
  slug: "alexnet",
  arxivId: "", // published at NeurIPS 2012, predates the arXiv-first era
  title: "ImageNet Classification with Deep Convolutional Neural Networks (AlexNet)",
  authors: ["Alex Krizhevsky", "Ilya Sutskever", "Geoffrey E. Hinton"],
  year: 2012,
  venue: "NeurIPS 2012",
  citationCount: 170000,
  tags: ["Computer Vision", "CNN", "Deep Learning", "Foundational"],
  abstract:
    "We trained a large, deep convolutional neural network to classify the 1.2 million high-resolution images in the ImageNet LSVRC-2010 contest into the 1000 different classes. The neural network, which has 60 million parameters and 650,000 neurons, consists of five convolutional layers, some of which are followed by max-pooling layers, and three fully-connected layers with a final 1000-way softmax. To make training faster, we used non-saturating neurons and a very efficient GPU implementation of the convolution operation. We also entered a variant of this model in the ILSVRC-2012 competition and achieved a winning top-5 test error rate of 15.3%, compared to 26.2% achieved by the second-best entry.",
  oneLiner:
    "The Big Bang of modern AI: a GPU-trained convolutional network crushed the world's hardest image contest by 10 points — and convinced the world that deep learning works.",
  readingTime: "10 min interactive",
  difficulty: "Foundational",

  explainLevels: {
    beginner: [
      {
        heading: "The contest that changed everything",
        body: "ImageNet was the Olympics of computer vision: 1.2 million photos, 1,000 categories — from 'Siberian husky' to 'espresso'. In 2012, the best traditional methods got about a quarter of their guesses wrong. Then a neural network built by three researchers cut that error nearly in half: 15.3% versus 26.2% for second place. In competitions, you win by decimals. Winning by ten points meant something fundamental had changed.",
      },
      {
        heading: "How it sees",
        body: "AlexNet looks at pictures the way you built up reading: first tiny patterns, then combinations. Its early layers slide little pattern-detectors across the image — edges, colors, textures (exactly what the CNN Lab below shows). Middle layers combine those into eyes, wheels, fur. The final layers vote: 'husky: 43%, wolf: 31%…'. Nobody programmed any of those detectors — the network invented them all from examples.",
      },
      {
        heading: "The secret ingredient: video game chips",
        body: "The ideas were old — convolutional networks existed since the 1980s. What was new was the horsepower: two consumer gaming GPUs (the kind made for rendering video games) trained the network for about a week. Deep learning didn't win because someone had a new theory; it won because someone finally gave the old theory enough fuel. Everything since — including ChatGPT — runs on that same discovery.",
      },
    ],
    developer: [
      {
        heading: "The network",
        body: "Eight learned layers: five convolutional + three fully connected, ending in a 1000-way softmax — 60M parameters, 650K neurons. Conv1 uses large 11×11 filters at stride 4 on 224×224 crops; later convs use 5×5 and 3×3. Max-pooling is overlapping (3×3 windows, stride 2), which shaved ~0.4% top-1. Local response normalization after some layers added another ~1.2% top-1. The model was split across two GTX 580s (3GB each) with cross-GPU connections only at certain layers — literally because it didn't fit on one card.",
      },
      {
        heading: "The training tricks that stuck",
        body: "ReLU instead of tanh/sigmoid: no saturation, ~6× faster to reach 25% error on CIFAR-10 — arguably the paper's most durable contribution. Dropout (p=0.5) in the first two FC layers to fight overfitting in the 60M parameters ('roughly doubles iterations to converge' but prevents substantial overfitting). Heavy augmentation: random 224×224 crops + horizontal flips from 256×256 images (a 2048× data multiplier) plus PCA-based color jitter. Optimizer: SGD, batch 128, momentum 0.9, weight decay 5e-4.",
      },
      {
        heading: "The results",
        body: "ILSVRC-2010: top-1 37.5%, top-5 17.0% — versus 45.7%/25.7% for the best published prior. ILSVRC-2012 (the famous one): 15.3% top-5 with an ensemble, versus 26.2% for the runner-up — the largest margin in the contest's history. Training: 5–6 days on the two GPUs. The paper's ablation of depth is prophetic: remove any middle conv layer and top-1 drops ~2% — 'depth really is important'.",
      },
    ],
    researcher: [
      {
        heading: "Why 2012 and not 1998",
        body: "LeNet-5 established convolutional learning in the 90s; what blocked scale was compute, data, and optimization pathology. AlexNet's confluence: ImageNet supplied 1.2M labeled images (data), CUDA-era GPUs supplied ~1000× the FLOPs of 90s CPUs (compute), and ReLU broke the saturation regime that made deep nets untrainable with tanh/sigmoid units (optimization). None of the individual components was novel — the demonstration that they compose at scale was the contribution, and it was decisive.",
      },
      {
        heading: "Reading the paper's choices in hindsight",
        body: "Some choices became canon: ReLU, dropout, aggressive augmentation, SGD+momentum. Others were scaffolding later removed: local response normalization (dropped by VGG as ineffective), the two-GPU group-convolution split (an artifact of 3GB memory — though it resurfaced as grouped/depthwise convolutions in ResNeXt and MobileNets), and the large 11×11 stride-4 stem (replaced by stacked 3×3s in VGG). The first-layer filters famously self-organized into oriented Gabor-like edges and color blobs — qualitative evidence the network learns a sensible visual frontend.",
      },
      {
        heading: "Consequences",
        body: "The 2012 result triggered the field's phase change: within two years virtually every vision pipeline was deep (ZFNet, VGG, GoogLeNet), ILSVRC errors collapsed from 15.3% to below 5% by 2015 (ResNet), and the hardware-software ecosystem (CUDA, cuDNN, frameworks) organized around dense GPU training. The lineage from this paper runs directly through ResNet to ViT and to the GPU clusters training today's LLMs. It is among the most-cited works in all of science.",
      },
    ],
  },

  psi: {
    problem: {
      title: "Computer vision was hand-crafted and stuck",
      points: [
        "Recognition pipelines relied on human-designed features (SIFT, HOG) fed to shallow classifiers.",
        "Progress on ImageNet had slowed to fractions of a percent per year — ~26% top-5 error seemed like a wall.",
        "Neural networks were widely dismissed: too slow to train, prone to overfitting, stuck in saturating activations.",
      ],
      analogy:
        "Trying to describe every animal to a blind sorter with hand-written rules — the rules never end, and every new animal breaks them.",
    },
    solution: {
      title: "A deep CNN, trained end-to-end on GPUs",
      points: [
        "Five conv layers learn their own features — edges to textures to parts — straight from pixels.",
        "ReLU activations dodge saturation (6× faster training); dropout tames 60M parameters.",
        "Two gaming GPUs make a week of training enough for 1.2M images.",
      ],
      analogy:
        "Stop writing rules; show the sorter a million labeled photos and let it invent its own rules — with enough coffee (GPUs) to get through them.",
    },
    impact: {
      title: "Deep learning's Big Bang",
      points: [
        "Won ILSVRC-2012 by an unheard-of margin: 15.3% vs 26.2% top-5 error.",
        "Within ~2 years, essentially all of computer vision switched to deep CNNs.",
        "Set the GPU-training paradigm that scaled through ResNet and ViT to today's LLMs.",
      ],
      analogy:
        "The four-minute mile: once broken, everyone broke it — because now they knew it could be done.",
    },
  },

  architecture: {
    nodes: [
      {
        id: "input",
        label: "Input Image",
        sublabel: "224 × 224 × 3 crop",
        kind: "io",
        description:
          "A random 224×224 crop from a 256×256 ImageNet photo — cropping and flipping multiply the dataset 2048-fold for free.",
        example: "A photo of a husky, randomly cropped and maybe mirrored — each epoch sees it differently.",
        detail:
          "Plus PCA color augmentation: shifting RGB values along the dataset's principal color axes, making the network robust to lighting.",
      },
      {
        id: "conv1",
        label: "Conv 1 — Edge Hunters",
        sublabel: "96 filters, 11×11, stride 4",
        kind: "core",
        description:
          "Ninety-six large filters sweep the image (the exact operation in the CNN Lab below). After training, they self-organize into oriented edge detectors and color-blob detectors — nobody designed them.",
        example: "One filter fires along the husky's back edge; another responds to its blue-grey fur color.",
        detail:
          "The paper's Figure 3 — the learned filters — became iconic: Gabor-like edges on one GPU, color blobs on the other, emerging purely from gradient descent.",
      },
      {
        id: "relu",
        label: "ReLU",
        sublabel: "max(0, x) — the speed unlock",
        kind: "core",
        description:
          "Every layer's output passes through max(0, x). Unlike tanh/sigmoid, ReLU never saturates for positive values — gradients keep flowing, and training runs ~6× faster.",
        example: "On CIFAR-10, a ReLU network hit 25% error 6× sooner than an identical tanh network.",
        detail:
          "Arguably the paper's most permanent contribution — ReLU (and descendants) remain the default activation across deep learning.",
      },
      {
        id: "pool",
        label: "Overlapping Max-Pool",
        sublabel: "3×3 window, stride 2",
        kind: "process",
        description:
          "Keeps each neighborhood's strongest response and shrinks the map. Overlapping windows (3 > 2) gave a small but real accuracy gain and mildly resisted overfitting.",
        example: "'There's a strong vertical edge somewhere in this patch' — exact pixel no longer matters.",
        detail:
          "Local response normalization also follows some layers — a lateral-inhibition trick worth ~1.2% top-1 here, later dropped by the field.",
      },
      {
        id: "convstack",
        label: "Conv 2–5 — Part Builders",
        sublabel: "256 → 384 → 384 → 256 filters",
        kind: "core",
        description:
          "Four more convolutional layers compose edges into textures, textures into parts: eyes, wheels, feathers, fur. This hierarchy is the 'deep' in deep learning.",
        example: "By conv5, single units respond to dog faces or bird silhouettes — concepts, not pixels.",
        detail:
          "The stack was split across two GTX 580s (3GB each), with cross-GPU links only at conv3 and the FC layers — a memory workaround that accidentally foreshadowed grouped convolutions.",
      },
      {
        id: "fc",
        label: "FC 6–7 + Dropout",
        sublabel: "4096 → 4096, p = 0.5",
        kind: "core",
        description:
          "Two giant fully-connected layers combine all the part evidence. During training, dropout silences a random half of these neurons each step — so no neuron can rely on a specific partner, and the 60M parameters can't just memorize.",
        example: "Like studying with random teammates each day: everyone must actually learn the material.",
        detail:
          "Most of AlexNet's 60M parameters live here. Without dropout, the paper reports substantial overfitting; with it, convergence takes ~2× the iterations but generalizes.",
      },
      {
        id: "softmax",
        label: "1000-way Softmax",
        sublabel: "the verdict",
        kind: "process",
        description:
          "A final layer scores all 1,000 ImageNet classes and softmax turns scores into probabilities.",
        example: "husky 43% · malamute 22% · wolf 9% · …",
        detail:
          "Top-5 error — is the truth among the five best guesses? — was the contest metric: AlexNet 15.3%, runner-up 26.2%.",
      },
      {
        id: "output",
        label: "Prediction",
        sublabel: "1 of 1,000 classes",
        kind: "io",
        description:
          "The label — produced by feature detectors no human designed, trained in a week on two gaming GPUs, and accurate enough to end an era of hand-crafted vision.",
        example: "\"Siberian husky\" — and computer vision was never the same.",
        detail:
          "Ablation: removing any single middle conv layer costs ~2% top-1. Depth itself was doing the work — the insight ResNet would push to 152 layers three years later.",
      },
    ],
    edges: [
      { source: "input", target: "conv1" },
      { source: "conv1", target: "relu" },
      { source: "relu", target: "pool" },
      { source: "pool", target: "convstack" },
      { source: "convstack", target: "fc" },
      { source: "fc", target: "softmax" },
      { source: "softmax", target: "output" },
    ],
  },

  math: [
    {
      id: "relu",
      name: "ReLU — the Non-Saturating Neuron",
      formula: "f(x) = \\max(0, x)",
      meaning:
        "Pass positives through unchanged, zero out negatives. Because the slope is exactly 1 for any positive input, gradients never shrink through active units — unlike tanh/sigmoid, which flatten out and choke learning in deep stacks.",
      analogy:
        "Tanh neurons are dimmer switches that stick near the ends; ReLU is a simple on/off valve that never sticks — signals (and blame) flow straight through.",
      breakdown: [
        { symbol: "\\max(0, x)", meaning: "The entire function — cheap to compute, trivially differentiable where it matters." },
        { symbol: "f'(x) = 1", meaning: "For active units the gradient passes at full strength — the anti-vanishing property." },
        { symbol: "6\\times", meaning: "The paper's measured speedup to 25% CIFAR-10 error vs tanh — the result that sold ReLU to the world." },
      ],
    },
    {
      id: "convolution",
      name: "The Convolution",
      formula: "(I * K)(i, j) = \\sum_{m}\\sum_{n} I(i+m,\\, j+n)\\, K(m, n)",
      meaning:
        "Slide a small filter K over the image I; at each stop, multiply overlapping values and sum. One filter, reused everywhere — so a pattern learned in one corner is recognized in every corner, with a tiny number of parameters.",
      analogy:
        "One stencil checked against every window of the photo — exactly what you can watch, step by step, in the CNN Lab on this page.",
      breakdown: [
        { symbol: "K", meaning: "A learned filter — AlexNet's conv1 has 96 of them, 11×11×3 each." },
        { symbol: "\\text{weight sharing}", meaning: "The same K at every position: translation-aware vision with ~1000× fewer parameters than fully-connected layers." },
        { symbol: "\\text{stride } 4", meaning: "Conv1 hops 4 pixels at a time — an early, aggressive downsample that made 224×224 inputs tractable in 2012." },
      ],
    },
    {
      id: "dropout",
      name: "Dropout",
      formula: "\\tilde{h}_i = h_i \\cdot m_i, \\quad m_i \\sim \\text{Bernoulli}(0.5)",
      meaning:
        "During training, each neuron in the big FC layers is switched off with probability 0.5 — a fresh random mask every step. Neurons can't co-adapt into brittle conspiracies, so the network learns redundant, robust features. At test time all neurons run (outputs scaled).",
      analogy:
        "A sports team where a random half of the players sit out every practice — no play can depend on one star, so everyone becomes genuinely good.",
      breakdown: [
        { symbol: "m_i", meaning: "The random on/off mask, redrawn every training step." },
        { symbol: "p = 0.5", meaning: "Used in FC6 and FC7 — where 60M parameters were otherwise memorizing the training set." },
        { symbol: "\\times 0.5 \\text{ at test}", meaning: "Test-time scaling approximates averaging the ensemble of all masked sub-networks." },
      ],
    },
    {
      id: "softmax-ce",
      name: "Softmax + Cross-Entropy",
      formula: "P(c) = \\frac{e^{z_c}}{\\sum_{k=1}^{1000} e^{z_k}}, \\quad \\mathcal{L} = -\\log P(c^{*})",
      meaning:
        "Turn 1,000 raw class scores into probabilities, then penalize the network by how little probability it gave the true class. Confidently wrong = huge loss; confidently right = near zero.",
      analogy:
        "A bookmaker forced to publish odds on all 1,000 outcomes, then fined by how badly they priced the actual winner.",
      breakdown: [
        { symbol: "z_c", meaning: "Raw score (logit) for class c from the final layer." },
        { symbol: "c^{*}", meaning: "The true label among ImageNet's 1,000 classes." },
        { symbol: "-\\log P(c^{*})", meaning: "The loss whose gradient, flowing back through all 8 layers, trained every filter you can see in conv1." },
      ],
    },
  ],

  applications: [
    {
      icon: "eye",
      title: "All of modern computer vision",
      description:
        "Face unlock, photo search, medical imaging, satellite analysis — the CNN pipeline AlexNet validated became the substrate of every vision product of the 2010s.",
    },
    {
      icon: "code",
      title: "The GPU-AI economy",
      description:
        "AlexNet proved gaming GPUs were AI hardware. The CUDA/cuDNN/framework ecosystem — and NVIDIA's central role in AI — trace to this demonstration.",
    },
    {
      icon: "search",
      title: "Transfer learning",
      description:
        "AlexNet features, frozen and reused, turned out to beat hand-crafted features on almost any vision task — creating the pretrain-then-adapt pattern BERT later brought to language.",
    },
    {
      icon: "message-square",
      title: "The deep learning renaissance",
      description:
        "The 2012 result re-legitimized neural networks across speech, translation, and games — the funding, talent, and belief that produced the modern AI era started here.",
    },
    {
      icon: "dna",
      title: "Scientific imaging",
      description:
        "Cell counting, tumor detection, protein localization microscopy — CNN feature hierarchies became standard tools of quantitative biology and medicine.",
    },
    {
      icon: "languages",
      title: "Its own descendants",
      description:
        "ZFNet, VGG, GoogLeNet, ResNet, and eventually Vision Transformers — each ILSVRC generation refined AlexNet's recipe until the contest itself was solved.",
    },
  ],

  codeExample: {
    language: "python",
    title: "AlexNet in modern PyTorch",
    explanation:
      "The 2012 architecture, line by line — five convs, three FC layers, ReLU everywhere, dropout in the classifier. What took a custom two-GPU CUDA implementation then is ~30 declarative lines today.",
    code: `import torch
import torch.nn as nn


class AlexNet(nn.Module):
    """Krizhevsky, Sutskever & Hinton (NeurIPS 2012)."""

    def __init__(self, num_classes: int = 1000):
        super().__init__()
        self.features = nn.Sequential(
            # Conv1: 96 big filters hunting edges and color blobs
            nn.Conv2d(3, 96, kernel_size=11, stride=4, padding=2),
            nn.ReLU(inplace=True),                 # the 6x speed unlock
            nn.MaxPool2d(kernel_size=3, stride=2), # overlapping pooling
            # Conv2
            nn.Conv2d(96, 256, kernel_size=5, padding=2),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=3, stride=2),
            # Conv3-5: composing edges -> textures -> object parts
            nn.Conv2d(256, 384, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(384, 384, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(384, 256, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=3, stride=2),
        )
        self.classifier = nn.Sequential(
            nn.Dropout(p=0.5),                     # tame the 60M params
            nn.Linear(256 * 6 * 6, 4096),
            nn.ReLU(inplace=True),
            nn.Dropout(p=0.5),
            nn.Linear(4096, 4096),
            nn.ReLU(inplace=True),
            nn.Linear(4096, num_classes),          # 1000-way verdict
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.features(x)
        x = torch.flatten(x, 1)
        return self.classifier(x)


net = AlexNet()
out = net(torch.randn(1, 3, 224, 224))
print(out.shape)          # torch.Size([1, 1000])
print(sum(p.numel() for p in net.parameters()) / 1e6, "M params")  # ~61M`,
  },

  chatSuggestions: [
    "Why was winning by 10 points such a big deal?",
    "What did ReLU actually change?",
    "How does dropout prevent overfitting?",
    "Why were GPUs the secret ingredient?",
    "What did AlexNet's learned filters look like?",
  ],

  course: {
    title: "AlexNet: the week that started modern AI",
    description:
      "A 4-lesson mini course: the hand-crafted era, learned features, the training tricks that stuck, and the avalanche that followed.",
    lessons: [
      {
        id: "lesson-1",
        number: 1,
        title: "Before: vision by hand",
        duration: "6 min",
        summary: "A decade of writing rules for eyes.",
        sections: [
          {
            heading: "Features by committee",
            body: "Pre-2012 vision worked like this: experts designed feature extractors by hand — SIFT keypoints, HOG gradients, color histograms — then fed those features to shallow classifiers like SVMs. Every improvement was a new hand-crafted descriptor. On ImageNet's 1,000 classes, this machinery plateaued around 26% top-5 error, improving by whiskers each year.",
          },
          {
            heading: "The neural network winter",
            body: "Convolutional networks existed — LeCun's LeNet read bank checks in the 90s — but scaling them seemed hopeless: deep nets with tanh/sigmoid neurons trained agonizingly slowly (saturating gradients), overfit wildly, and CPUs of the era would have needed months per experiment. 'Neural nets don't scale' was respectable consensus.",
          },
          {
            heading: "The three missing pieces",
            body: "What changed by 2012: ImageNet provided 1.2 million labeled images (enough data to feed a big model), gaming GPUs provided the raw FLOPs, and a handful of tricks — ReLU, dropout — fixed the training pathologies. AlexNet is the paper that assembled all three and pulled the trigger.",
          },
        ],
        keyTakeaway:
          "Vision was hand-crafted features + shallow classifiers, plateaued at ~26% error. Deep CNNs existed but lacked data, compute, and training tricks — until 2012.",
        quiz: {
          question: "What was the dominant approach to image recognition before AlexNet?",
          options: [
            { text: "Hand-designed features (SIFT, HOG) fed to shallow classifiers", correct: true, explanation: "Exactly — humans engineered the features; machines only did the final sorting. AlexNet made the machine learn the features too." },
            { text: "Small neural networks on CPUs", correct: false, explanation: "Neural nets existed (LeNet) but were niche — hand-crafted features ruled the benchmarks." },
            { text: "Rule-based expert systems", correct: false, explanation: "Closer to 1980s AI — by the 2000s vision was statistical, just with hand-designed features." },
            { text: "Transformers", correct: false, explanation: "Transformers arrived in 2017 — five years after AlexNet." },
          ],
        },
      },
      {
        id: "lesson-2",
        number: 2,
        title: "Features that grow themselves",
        duration: "7 min",
        summary: "From sliding stencils to a hierarchy of concepts.",
        sections: [
          {
            heading: "The convolution, hands-on",
            body: "AlexNet's core operation is the one in this lesson's lab: a small filter slides across the image, scoring how much each patch matches its pattern. One filter, reused at every position — so 'diagonal edge' learned once works everywhere, with a tiny parameter budget. Conv1 has 96 such filters, each 11×11.",
          },
          {
            heading: "Nobody designs the filters",
            body: "The filters start as random noise. Gradient descent, chasing classification error, sculpts them — and the paper's most famous figure shows what emerged: oriented edge detectors and color blobs, spookily similar to what neuroscientists find in the visual cortex. The hand-crafted-features era ended the moment learned filters looked better than designed ones.",
          },
          {
            heading: "Stacking builds concepts",
            body: "Layer 1 finds edges. Layer 2 combines edges into textures and corners. Layers 3–5 combine those into parts — eyes, wheels, feathers. The paper's depth ablation makes it concrete: delete any middle conv layer and accuracy drops ~2%. The hierarchy is the intelligence.",
          },
        ],
        keyTakeaway:
          "Convolution = one learned stencil scanned everywhere. Stacked five deep, random-noise filters self-organize into an edge → texture → part hierarchy no human designed.",
        quiz: {
          question: "Where did AlexNet's edge-detecting filters come from?",
          options: [
            { text: "They were copied from neuroscience measurements", correct: false, explanation: "The resemblance to visual cortex emerged — nothing was copied in." },
            { text: "Engineers designed them like SIFT features", correct: false, explanation: "That's the old paradigm this paper ended." },
            { text: "They started as random noise and gradient descent sculpted them from data", correct: true, explanation: "Right — the famous first-layer filter visualization shows what pure end-to-end learning invented on its own." },
            { text: "They were mathematical constants (Gabor functions)", correct: false, explanation: "They LOOK Gabor-like, but they were learned, not prescribed — that's the point." },
          ],
        },
      },
      {
        id: "lesson-3",
        number: 3,
        title: "The tricks that made it trainable",
        duration: "7 min",
        summary: "ReLU, dropout, augmentation, GPUs.",
        sections: [
          {
            heading: "ReLU: don't saturate",
            body: "Tanh and sigmoid neurons flatten at their extremes — and flat means zero gradient, which means no learning. ReLU (max(0, x)) has slope exactly 1 for positive inputs: gradients pass at full strength. The paper's measurement: 6× faster to reach 25% CIFAR-10 error. Without this, a network of AlexNet's size was 'impossible to experiment with'.",
          },
          {
            heading: "Dropout: forced independence",
            body: "60M parameters versus 1.2M images is a memorization hazard. Dropout switches off a random half of the big FC layers' neurons at every training step — no conspiracy of neurons can memorize together, so features must be individually robust. Cost: ~2× training iterations. Benefit: the difference between a record and an overfit demo. Try it live in the Backpropagation Lab: it's the same principle your tiny network exploits.",
          },
          {
            heading: "Augmentation and iron",
            body: "Random 224×224 crops and mirror flips inflate 1.2M images into billions of effective variants; PCA color jitter adds lighting robustness. All of it runs on two GTX 580 gaming cards (3GB each — the model literally didn't fit on one), for 5–6 days of SGD with momentum 0.9. Total training cost in 2012: two video game GPUs and a week of patience.",
          },
        ],
        keyTakeaway:
          "ReLU keeps gradients alive (6× faster), dropout blocks memorization, augmentation multiplies data 2048×, and two gaming GPUs supply the FLOPs. Old ideas + right fuel = breakthrough.",
        quiz: {
          question: "Why did ReLU speed up training so dramatically compared to tanh?",
          options: [
            { text: "It uses less memory", correct: false, explanation: "Memory is similar — the difference is in the gradients." },
            { text: "Its gradient is 1 for positive inputs, so learning signals never shrink through active neurons", correct: true, explanation: "Exactly — tanh saturates (gradient → 0) at its extremes; ReLU doesn't, so deep stacks keep learning. The paper measured 6× faster convergence." },
            { text: "It skips the backward pass entirely", correct: false, explanation: "Backprop still runs — it just carries stronger gradients." },
            { text: "It reduces the number of parameters", correct: false, explanation: "Activations don't change parameter count at all." },
          ],
        },
      },
      {
        id: "lesson-4",
        number: 4,
        title: "The avalanche",
        duration: "6 min",
        summary: "15.3% vs 26.2%, and everything after.",
        sections: [
          {
            heading: "The margin heard round the world",
            body: "ILSVRC-2012 results: AlexNet 15.3% top-5 error; second place 26.2%. Benchmarks usually move by tenths of a point; this moved by eleven. It wasn't a better tweak — it was a different species of solution, and every vision researcher could verify it themselves.",
          },
          {
            heading: "The stampede",
            body: "2013: ZFNet (a tuned AlexNet) wins ILSVRC. 2014: VGG shows deeper-and-simpler works (19 layers); GoogLeNet gets efficient. 2015: ResNet's skip connections reach 152 layers and 3.57% — below the ~5% human benchmark on this task. Three years from 'neural nets don't scale' to superhuman on the contest that proved it.",
          },
          {
            heading: "The longer shadow",
            body: "AlexNet's deepest legacy isn't a technique — most of its specific choices were later replaced. It's the paradigm: learn features end-to-end, scale with GPUs, let data do the designing. That recipe traveled from vision to speech to language, and the same GPU-training economy it launched now trains the model you're talking to on this website.",
          },
        ],
        keyTakeaway:
          "An 11-point victory ended hand-crafted vision overnight; within 3 years CNNs passed human-level on ImageNet. The end-to-end + GPU paradigm became all of modern AI.",
        quiz: {
          question: "What was AlexNet's most lasting legacy?",
          options: [
            { text: "Local response normalization", correct: false, explanation: "LRN was quietly dropped by successors — one of the choices that didn't stick." },
            { text: "The 11×11 first-layer filters", correct: false, explanation: "VGG replaced big filters with stacked 3×3s two years later." },
            { text: "The paradigm: end-to-end learned features, trained at scale on GPUs", correct: true, explanation: "Exactly — the specific architecture was superseded within years, but the recipe (learn everything, scale with GPUs) became all of modern AI." },
            { text: "The two-GPU model split", correct: false, explanation: "That was a 3GB-memory workaround — though it did foreshadow grouped convolutions." },
          ],
        },
      },
    ],
  },
};
