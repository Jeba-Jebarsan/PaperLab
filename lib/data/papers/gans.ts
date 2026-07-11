import type { Paper } from "../types";

export const gansPaper: Paper = {
  id: "1406.2661",
  slug: "generative-adversarial-networks",
  arxivId: "1406.2661",
  title: "Generative Adversarial Networks",
  authors: [
    "Ian J. Goodfellow",
    "Jean Pouget-Abadie",
    "Mehdi Mirza",
    "Bing Xu",
    "David Warde-Farley",
    "Sherjil Ozair",
    "Aaron Courville",
    "Yoshua Bengio",
  ],
  year: 2014,
  venue: "NeurIPS 2014",
  citationCount: 75000,
  tags: ["Generative Models", "Deep Learning", "Adversarial", "Foundational"],
  abstract:
    "We propose a new framework for estimating generative models via an adversarial process, in which we simultaneously train two models: a generative model G that captures the data distribution, and a discriminative model D that estimates the probability that a sample came from the training data rather than G. The training procedure for G is to maximize the probability of D making a mistake. This framework corresponds to a minimax two-player game. In the space of arbitrary functions G and D, a unique solution exists, with G recovering the training data distribution and D equal to 1/2 everywhere.",
  oneLiner:
    "This paper taught computers to CREATE by setting up a duel: a forger network learns to fake data, a detective network learns to catch fakes — and they train each other into mastery.",
  readingTime: "10 min interactive",
  difficulty: "Foundational",

  explainLevels: {
    beginner: [
      {
        heading: "The duel",
        body: "Imagine a counterfeiter and an art detective locked in a room. The counterfeiter paints fakes; the detective judges real or fake. Every caught fake teaches the counterfeiter what gave it away; every convincing fake forces the detective to look closer. Round after round, both get better — until the fakes are indistinguishable from the real thing. That's a GAN: two neural networks playing exactly this game.",
      },
      {
        heading: "Why this was a new kind of AI",
        body: "Until 2014, neural networks mostly judged things: is this a cat? is this spam? GANs flipped the direction — a network that produces things: faces, artwork, voices. And the trick is that nobody has to define what 'realistic' means. The detective network IS the definition, and it sharpens itself automatically as the forger improves.",
      },
      {
        heading: "The happy ending (in theory)",
        body: "The paper proves where the game ends if both players play perfectly: the forger's output becomes statistically identical to real data, and the detective is reduced to coin-flipping — 50/50 on everything. You can watch that exact ending in the lab below: the white detective curve flattening to 0.5 as the teal fakes swallow the real distribution.",
      },
    ],
    developer: [
      {
        heading: "The setup",
        body: "Generator G: a neural net mapping noise z ~ p(z) to samples G(z). Discriminator D: a neural net outputting the probability its input is real. They optimize the minimax objective V(D,G) = E[log D(x)] + E[log(1−D(G(z)))] — D maximizes it (classify well), G minimizes it (fool D). Training alternates: k steps of SGD on D, one on G, using ordinary backpropagation end to end — G's gradients flow through D.",
      },
      {
        heading: "The practical trick every implementation uses",
        body: "Early in training, D confidently rejects G's garbage, and log(1−D(G(z))) saturates — G gets almost no gradient exactly when it needs the most help. The paper's fix: instead of minimizing log(1−D(G(z))), have G maximize log D(G(z)). Same fixed point, much stronger early gradients. This 'non-saturating loss' is what the GAN Lab on this page actually trains with.",
      },
      {
        heading: "What the paper demonstrated",
        body: "MLP-based GANs trained on MNIST digits, the Toronto Face Database, and CIFAR-10 — with sample quality competitive with contemporary generative models and Parzen-window log-likelihood estimates to quantify it. The framework's selling points: no Markov chains, no approximate inference, just backprop. The paper is also upfront about the costs: G and D must stay balanced, and G can collapse to producing only a few modes — the failure you can trigger live in the lab.",
      },
    ],
    researcher: [
      {
        heading: "The theory",
        body: "For fixed G, the optimal discriminator is D*(x) = p_data(x) / (p_data(x) + p_g(x)). Substituting D* reduces the game to minimizing the Jensen–Shannon divergence between p_data and p_g (up to constants): C(G) = −log 4 + 2·JSD(p_data ‖ p_g). Hence the unique global optimum: p_g = p_data with value −log 4, where D is 1/2 everywhere. Proposition 2 shows convergence for the idealized case of updating p_g directly given an optimal D at each step — a guarantee that notably does NOT transfer to parameterized G and simultaneous SGD, foreshadowing a decade of GAN-stabilization research.",
      },
      {
        heading: "Positioning in 2014",
        body: "The contemporary generative landscape — RBMs/DBNs with MCMC-based partition-function estimates, VAEs with variational lower bounds (published contemporaneously) — paid for tractability with blurriness or mixing pathologies. Adversarial training sidesteps likelihood entirely: the objective is implicit, defined by a learned critic. The costs are documented in the paper itself: no explicit p_g(x), synchronization requirements between G and D, and 'the Helvetica scenario' — mode collapse.",
      },
      {
        heading: "Lineage",
        body: "The follow-on decade: DCGAN (2015) made image GANs stable enough to matter; WGAN reframed the divergence to fix gradients; StyleGAN produced photorealistic faces; conditional and cycle-consistent variants powered image translation. Adversarial objectives also escaped generation entirely (adversarial examples, domain adaptation, GAN-based data augmentation). Diffusion models eventually displaced GANs for flagship image synthesis, but the adversarial idea — a learned loss provided by an opponent — remains one of deep learning's most influential concepts.",
      },
    ],
  },

  psi: {
    problem: {
      title: "Neural networks could judge, not create",
      points: [
        "Generative models of 2014 (RBMs, DBNs) needed Markov chain sampling and intractable partition functions.",
        "Likelihood-based alternatives traded sharpness for tractability — samples came out blurry or noisy.",
        "Nobody could write down a loss function for 'looks real' — realism resists explicit definition.",
      ],
      analogy:
        "Teaching someone to paint by giving them a rulebook for beauty — the rulebook doesn't exist.",
    },
    solution: {
      title: "Make realism a learned opponent",
      points: [
        "Generator G maps random noise to samples; discriminator D learns to spot fakes.",
        "G trains on exactly one signal: D's verdicts — gradients flow through the detective into the forger.",
        "Theory: perfect play ends with G matching the data distribution and D forced to 50/50.",
      ],
      analogy:
        "Don't write the rulebook — hire a critic who studies the forgeries and gets stricter every round.",
    },
    impact: {
      title: "Generative AI's opening act",
      points: [
        "Founded the GAN family: DCGAN, WGAN, StyleGAN — the photorealistic-face era of the late 2010s.",
        "'Adversarial' became a core deep learning concept, from data augmentation to robustness.",
        "Proved neural networks could create — the cultural and technical prelude to today's image generators.",
      ],
      analogy:
        "The moment cameras learned to paint: judging machines became creating machines.",
    },
  },

  architecture: {
    nodes: [
      {
        id: "noise",
        label: "Random Noise z",
        sublabel: "z ~ p(z)",
        kind: "io",
        description:
          "The generator's only raw material: a vector of random numbers. Every different z will become a different sample — the noise is the 'idea' behind each creation.",
        example: "z = [0.3, −1.2, 0.7, …] → one specific fake; nudge z and the output morphs smoothly.",
        detail:
          "The prior p(z) is simple (uniform or Gaussian). All structure in the outputs is added by G — the noise just provides variety.",
      },
      {
        id: "generator",
        label: "Generator G",
        sublabel: "the forger",
        kind: "core",
        description:
          "A neural network that transforms noise into candidate data — an image, a sound, a point. It never sees real data directly; it only ever learns from the discriminator's reactions.",
        example: "In the lab below: G maps z ∈ [−1,1] to positions on a line, learning to place them where real data lives.",
        detail:
          "G defines an implicit distribution p_g — you can sample from it but not evaluate its density. That implicitness is both the framework's power and its analytical price.",
      },
      {
        id: "fake",
        label: "Fake Sample G(z)",
        sublabel: "the forgery",
        kind: "process",
        description: "The generator's output, headed for judgment.",
        example: "Early training: obvious junk. Late training: statistically indistinguishable from the real thing.",
        detail:
          "In the paper's experiments these were MNIST digits, faces (TFD), and CIFAR-10 images from MLP and deconv generators.",
      },
      {
        id: "real",
        label: "Real Sample x",
        sublabel: "x ~ p_data",
        kind: "io",
        description:
          "A genuine example from the training set, mixed 50/50 with fakes when training the discriminator.",
        example: "A real handwritten digit; in the lab, a draw from the amber target distribution.",
        detail: "Only D ever touches real data. G learns about reality entirely second-hand — through D's gradient.",
      },
      {
        id: "discriminator",
        label: "Discriminator D",
        sublabel: "the detective",
        kind: "core",
        description:
          "A classifier scoring each input with the probability it's real. It trains like any binary classifier — real → 1, fake → 0 — getting sharper as forgeries improve.",
        example: "The white curve in the lab: high where real data lives, low where current fakes cluster.",
        detail:
          "Theory: for a fixed G the optimal detective is D*(x) = p_data/(p_data + p_g) — it literally computes where fakes are over-represented.",
      },
      {
        id: "verdict",
        label: "Verdict + Losses",
        sublabel: "real or fake?",
        kind: "process",
        description:
          "D's verdicts become both players' training signals: D is graded on classifying correctly, G on making D wrong.",
        example: "D(fake) = 0.13 → detective happy, forger takes a big corrective gradient.",
        detail:
          "G uses the non-saturating loss (maximize log D(G(z))) so it still learns when its fakes are being confidently rejected.",
      },
      {
        id: "gradients",
        label: "Gradients Through the Detective",
        sublabel: "backprop, end to end",
        kind: "core",
        description:
          "The framework's engine: to improve, G backpropagates THROUGH D — the detective's own sensitivity tells the forger which direction makes fakes more convincing.",
        example: "'Your sample would have scored higher slightly to the left' — dD/dx, handed to G as a lesson.",
        detail:
          "This is why GANs need no Markov chains or inference machinery: one differentiable pipeline, trained with ordinary SGD. The lab implements this literally.",
      },
      {
        id: "equilibrium",
        label: "Equilibrium",
        sublabel: "p_g = p_data, D = ½",
        kind: "io",
        description:
          "The proven destination of perfect play: forgeries match reality exactly, and the best possible detective is reduced to guessing.",
        example: "In the lab: teal bars filling the amber outline, white curve flat at 0.5.",
        detail:
          "At the optimum the game value is −log 4, and the objective equals the Jensen–Shannon divergence between real and fake — driven to zero.",
      },
    ],
    edges: [
      { source: "noise", target: "generator" },
      { source: "generator", target: "fake" },
      { source: "fake", target: "discriminator" },
      { source: "real", target: "discriminator" },
      { source: "discriminator", target: "verdict" },
      { source: "verdict", target: "gradients" },
      { source: "gradients", target: "equilibrium" },
    ],
  },

  math: [
    {
      id: "minimax",
      name: "The Minimax Game",
      formula:
        "\\min_G \\max_D \\; \\mathbb{E}_{x}[\\log D(x)] + \\mathbb{E}_{z}[\\log(1 - D(G(z)))]",
      meaning:
        "One equation, two players, opposite goals. D pushes the value up by scoring real data high and fakes low; G pushes it down by making fakes that score high. All of GAN training is this tug-of-war.",
      analogy:
        "An arm-wrestling match where the table is the loss function: the detective pushes one way, the forger the other, and training is the struggle itself.",
      breakdown: [
        { symbol: "\\mathbb{E}_x[\\log D(x)]", meaning: "D's reward for recognizing real data — pushed toward log 1 = 0." },
        { symbol: "\\log(1 - D(G(z)))", meaning: "D's reward for catching fakes — the exact term G tries to sabotage." },
        { symbol: "\\min_G \\max_D", meaning: "Simultaneous, opposed optimization — the source of GANs' power AND their instability." },
      ],
    },
    {
      id: "optimal-d",
      name: "The Optimal Detective",
      formula: "D^{*}(x) = \\frac{p_{\\text{data}}(x)}{p_{\\text{data}}(x) + p_g(x)}",
      meaning:
        "For any fixed forger, the best possible detective outputs precisely the local ratio of real to real-plus-fake. Where only real data lives → 1. Where only fakes live → 0. Where they match → exactly ½.",
      analogy:
        "A perfectly calibrated customs officer: their suspicion at each checkpoint equals the actual fraction of smugglers passing through it.",
      breakdown: [
        { symbol: "p_{\\text{data}}(x)", meaning: "How often real data appears at point x." },
        { symbol: "p_g(x)", meaning: "How often the forger's samples land at x." },
        { symbol: "= \\tfrac{1}{2}", meaning: "When p_g = p_data everywhere — the detective's surrender, visible as the flat white line in the lab." },
      ],
    },
    {
      id: "jsd",
      name: "What G Is Really Minimizing",
      formula: "C(G) = -\\log 4 + 2 \\cdot \\mathrm{JSD}(p_{\\text{data}} \\,\\|\\, p_g)",
      meaning:
        "Plug the optimal detective into the game and the dust settles: the forger is minimizing the Jensen–Shannon divergence — a proper statistical distance — between fake and real distributions. Global minimum: p_g = p_data, value −log 4.",
      analogy:
        "The duel looks like psychology, but the scoreboard is geometry: every round secretly measures 'how far is the forged distribution from reality?' and pushes it closer.",
      breakdown: [
        { symbol: "\\mathrm{JSD}", meaning: "Jensen–Shannon divergence — symmetric, bounded, zero iff the distributions match exactly." },
        { symbol: "-\\log 4", meaning: "The game's value at equilibrium (≈ −1.386) — both players' losses stall near log 2 ≈ 0.69, which you can watch in the lab's loss readout." },
      ],
    },
    {
      id: "nonsaturating",
      name: "The Non-Saturating Trick",
      formula: "\\max_G \\; \\mathbb{E}_{z}[\\log D(G(z))] \\quad \\text{instead of} \\quad \\min_G \\; \\mathbb{E}_{z}[\\log(1 - D(G(z)))]",
      meaning:
        "Early on, D rejects G's clumsy fakes with confidence, and log(1−D) goes flat — the forger gets no gradient exactly when it's worst. Flipping to 'maximize log D(fake)' targets the same equilibrium but delivers strong gradients to a struggling G.",
      analogy:
        "A beginner ignored with 'nope' learns nothing; the same beginner told 'here's what almost worked' improves fast. Same judgment, useful feedback.",
      breakdown: [
        { symbol: "\\log(1 - D(G(z)))", meaning: "Saturates (gradient → 0) when D(G(z)) ≈ 0 — the early-training death zone." },
        { symbol: "\\log D(G(z))", meaning: "Steepest exactly when fakes are being rejected — feedback where it's needed. This is what the lab (and virtually every real GAN) trains with." },
      ],
    },
  ],

  applications: [
    {
      icon: "eye",
      title: "Photorealistic synthesis",
      description:
        "StyleGAN's invented faces defined 'this person does not exist'-era AI. GANs powered super-resolution, inpainting, and image editing throughout the late 2010s.",
    },
    {
      icon: "languages",
      title: "Image-to-image translation",
      description:
        "Pix2pix and CycleGAN turned sketches into photos, horses into zebras, day into night — adversarial losses made unpaired translation possible.",
    },
    {
      icon: "dna",
      title: "Science and medicine",
      description:
        "Synthetic medical images for privacy-safe training, molecule generation, cosmology simulations — adversarial generation as a data amplifier.",
    },
    {
      icon: "message-square",
      title: "The deepfake reckoning",
      description:
        "GAN-quality synthesis forced the world to confront synthetic media — detection research, provenance standards, and policy all trace to this capability.",
    },
    {
      icon: "code",
      title: "Adversarial thinking everywhere",
      description:
        "Learned critics as loss functions, adversarial data augmentation, domain adaptation, robustness testing — the paper's core idea outgrew generation entirely.",
    },
    {
      icon: "search",
      title: "The road to diffusion",
      description:
        "Modern image generators (diffusion models) displaced GANs at the frontier — but adversarial components still appear in fast decoders, and GANs remain standard where single-step generation matters.",
    },
  ],

  codeExample: {
    language: "python",
    title: "A GAN training step, exactly as in the lab",
    explanation:
      "The full adversarial loop: train the detective on real-vs-fake, then train the forger THROUGH the detective's gradients — with the paper's non-saturating trick. This is precisely what runs live in the GAN Lab above.",
    code: `import torch
import torch.nn.functional as F

# G: noise -> sample        D: sample -> P(real)
G = make_mlp(in_dim=1, hidden=12, out_dim=1)
D = make_mlp(in_dim=1, hidden=12, out_dim=1)   # + sigmoid on output
opt_G = torch.optim.SGD(G.parameters(), lr=0.05, momentum=0.5)
opt_D = torch.optim.SGD(D.parameters(), lr=0.08, momentum=0.5)


def train_round(real_batch):
    B = real_batch.shape[0]
    ones, zeros = torch.ones(B, 1), torch.zeros(B, 1)

    # ---- 1. Detective step: real -> 1, fake -> 0 ----
    z = torch.rand(B, 1) * 2 - 1
    fakes = G(z).detach()               # detach: don't teach G here
    d_loss = (
        F.binary_cross_entropy(torch.sigmoid(D(real_batch)), ones)
        + F.binary_cross_entropy(torch.sigmoid(D(fakes)), zeros)
    )
    opt_D.zero_grad(); d_loss.backward(); opt_D.step()

    # ---- 2. Forger step: make D say "real" ----
    z = torch.rand(B, 1) * 2 - 1
    verdict = torch.sigmoid(D(G(z)))    # NO detach: gradients flow
    #                                     through the detective into G!
    # Non-saturating loss: maximize log D(G(z))
    g_loss = F.binary_cross_entropy(verdict, ones)
    opt_G.zero_grad(); g_loss.backward(); opt_G.step()

    return d_loss.item(), g_loss.item()

# At equilibrium both losses hover near log 2 = 0.693 --
# the detective is coin-flipping. Watch it happen in the lab.`,
  },

  chatSuggestions: [
    "How does the generator learn without seeing real data?",
    "What is mode collapse?",
    "Why does training end with D at 0.5?",
    "What is the non-saturating trick?",
    "How did GANs lead to modern image generators?",
  ],

  course: {
    title: "GANs: the art of the duel",
    description:
      "A 4-lesson mini course: why creating is harder than judging, the adversarial game, the math of the equilibrium, and the failure modes that made GANs famous.",
    lessons: [
      {
        id: "lesson-1",
        number: 1,
        title: "Why creating is hard",
        duration: "6 min",
        summary: "You can't write a loss function for 'looks real'.",
        sections: [
          {
            heading: "Judging vs creating",
            body: "By 2014, networks classified images superbly — judging is a well-posed problem with an obvious loss (were you right?). Creating is different: what's the loss function for 'this generated face looks real'? Pixel-distance to some training image? That punishes perfectly valid NEW faces and rewards blurry averages. Realism refuses to be written down as a formula.",
          },
          {
            heading: "The 2014 generative toolbox",
            body: "Existing generative models paid heavy prices: Boltzmann machines needed Markov-chain sampling with intractable normalizing constants; variational autoencoders (contemporaneous) optimized a likelihood bound and tended toward blurry samples. Everyone was approximating an explicit probability — and the approximations showed.",
          },
          {
            heading: "The reframe",
            body: "Goodfellow's move: stop trying to define realism — LEARN it. Make the loss function itself a neural network (the discriminator) that continuously studies the generator's current fakes. The definition of 'looks real' sharpens automatically, exactly as fast as the forger improves. The duel below runs this idea live.",
          },
        ],
        keyTakeaway:
          "There's no formula for 'looks real' — so GANs make the loss a learned opponent. The discriminator is an adaptive, self-sharpening definition of realism.",
        quiz: {
          question: "Why not train a generator by minimizing pixel distance to training images?",
          options: [
            { text: "Pixel distance is too slow to compute", correct: false, explanation: "It's cheap — the problem is what it rewards, not its cost." },
            { text: "It punishes valid new samples and rewards blurry averages of the training set", correct: true, explanation: "Exactly — a brand-new realistic face is 'far' from every training image, while a blurry mean is 'close' to many. Realism isn't pixel proximity." },
            { text: "Images are too high-dimensional for distances", correct: false, explanation: "Distances compute fine in high dimensions — they just measure the wrong thing here." },
            { text: "It requires labeled data", correct: false, explanation: "Pixel distance needs no labels — its failure is conceptual." },
          ],
        },
      },
      {
        id: "lesson-2",
        number: 2,
        title: "The game",
        duration: "7 min",
        summary: "Forger, detective, and gradients through the enemy.",
        sections: [
          {
            heading: "The players",
            body: "Generator G: noise in, candidate data out. It never sees a single real example. Discriminator D: any sample in, probability-of-real out. D trains as an ordinary classifier on a 50/50 mix of real data and G's current fakes. So far, nothing exotic.",
          },
          {
            heading: "The exotic part",
            body: "G's training signal comes from backpropagating THROUGH D: the detective's own sensitivity (how its verdict would change if the fake shifted slightly) is handed to the forger as instruction. The forger learns about reality entirely second-hand — through the eyes of its enemy. In the lab, this is the moment generator gradients flow through the frozen detective.",
          },
          {
            heading: "One practical fix",
            body: "The naive generator loss, log(1−D(fake)), goes flat when D confidently rejects fakes — no gradient exactly when the forger is worst. The paper's non-saturating trick flips it: maximize log D(fake). Same destination, strong feedback from round one. Every serious GAN implementation since — including this page's lab — uses it.",
          },
        ],
        keyTakeaway:
          "D trains as a normal classifier; G trains on gradients flowing through D — with the non-saturating loss so early rejection still teaches. The forger learns reality via its enemy's eyes.",
        quiz: {
          question: "How does the generator learn, given it never sees real data?",
          options: [
            { text: "It memorizes samples the discriminator leaks", correct: false, explanation: "No data crosses over — only gradients do." },
            { text: "Gradients backpropagate through the discriminator into the generator, indicating how to make fakes score more 'real'", correct: true, explanation: "Exactly — dD/d(input) tells G which direction of change would raise the verdict. The detective unwittingly tutors the forger." },
            { text: "It's pre-trained on real data first", correct: false, explanation: "In the original framework G starts from scratch — noise to samples, guided only by D." },
            { text: "A human ranks its outputs", correct: false, explanation: "No humans in the loop — that's RLHF, a different paper on this site." },
          ],
        },
      },
      {
        id: "lesson-3",
        number: 3,
        title: "The equilibrium",
        duration: "7 min",
        summary: "Where perfect play provably ends.",
        sections: [
          {
            heading: "The perfect detective",
            body: "Freeze the forger and ask: what's the best possible detective? The paper derives it exactly: D*(x) = p_data(x) / (p_data(x) + p_g(x)) — suspicion equals the true local ratio of real to fake. Watch the lab's white curve: high where amber (real) outweighs teal (fake), low where fakes over-cluster. That curve is approximating this formula, live.",
          },
          {
            heading: "The hidden scoreboard",
            body: "Substitute D* back into the game and the psychology evaporates into geometry: the generator is minimizing the Jensen–Shannon divergence between its distribution and reality. The duel was secretly a distance-minimization all along — with global minimum exactly at p_g = p_data, game value −log 4.",
          },
          {
            heading: "The surrender",
            body: "At the optimum, the ratio is ½ everywhere: the best detective on earth can only coin-flip. In practice you'll see both losses hover near log 2 ≈ 0.693 and the D-curve flatten at 0.5 — the equilibrium's fingerprints, which the lab displays as they emerge. (The proof assumes idealized players; real SGD on real networks circles the equilibrium rather than settling — lesson 4.)",
          },
        ],
        keyTakeaway:
          "Optimal D computes the real/fake ratio; with it, G is minimizing JS divergence to the data. Perfect play ends at p_g = p_data with D = ½ everywhere — the detective's surrender.",
        quiz: {
          question: "At the game's global optimum, what does the discriminator output?",
          options: [
            { text: "1 on real data, 0 on fakes", correct: false, explanation: "That's the beginning of training, not the end — fakes are still obvious there." },
            { text: "Exactly ½ everywhere — it cannot do better than guessing", correct: true, explanation: "Correct — with p_g = p_data, the ratio p_data/(p_data+p_g) is ½ at every point. Indistinguishability is the win condition." },
            { text: "It crashes to 0 everywhere", correct: false, explanation: "0 everywhere would mean calling everything fake — trivially wrong on real data." },
            { text: "It depends on the architecture", correct: false, explanation: "The ½ result is architecture-free — it's a property of the optimal solution itself." },
          ],
        },
      },
      {
        id: "lesson-4",
        number: 4,
        title: "When the duel goes wrong",
        duration: "7 min",
        summary: "Mode collapse, balance, and the decade after.",
        sections: [
          {
            heading: "Mode collapse",
            body: "The theory assumes ideal players; SGD provides real ones. The most famous failure: the forger finds ONE output that reliably fools the current detective and produces only that — abandoning whole regions of reality. Try it yourself in the lab: two-hills target, detective learning rate low — the teal distribution collapses onto a single hill. The paper called this risk out on day one.",
          },
          {
            heading: "The balance problem",
            body: "GAN training is a dance that can trip either way. Detective too strong → forger's gradients vanish (the saturation problem). Detective too weak → the forger exploits its blind spots instead of learning reality. There's no loss curve that simply 'goes down' — equilibrium means both losses hovering near log 2, which is why the lab reports distribution overlap instead.",
          },
          {
            heading: "The decade of fixes — and the legacy",
            body: "DCGAN (2015) found architectures that behaved; WGAN changed the underlying divergence to keep gradients alive; spectral normalization, gradient penalties, and StyleGAN's design culminated in photorealistic faces by 2019. Diffusion models later took the image-generation crown, but the adversarial idea — realism as a learned critic — spread everywhere, and this paper remains one of the most cited in deep learning.",
          },
        ],
        keyTakeaway:
          "Real GANs wobble: mode collapse and G/D imbalance are the classic failures (reproducible in the lab). A decade of fixes led to photorealism — and 'learned critic' became a permanent idea.",
        quiz: {
          question: "What is mode collapse?",
          options: [
            { text: "The discriminator's output collapsing to 0.5", correct: false, explanation: "D at ½ is the healthy equilibrium — the opposite of failure." },
            { text: "The generator producing only one (or few) types of output, ignoring the rest of the data distribution", correct: true, explanation: "Exactly — G finds one reliable trick and abandons diversity. In the lab: all teal mass piling onto one of the two hills." },
            { text: "Gradients overflowing to infinity", correct: false, explanation: "That's divergence/instability — a different failure mode." },
            { text: "The networks becoming identical", correct: false, explanation: "G and D have different jobs and shapes — they never merge." },
          ],
        },
      },
    ],
  },
};
