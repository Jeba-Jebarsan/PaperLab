import type { Paper } from "../types";

export const rlhfPaper: Paper = {
  id: "2009.01325",
  slug: "learning-to-summarize-rlhf",
  arxivId: "2009.01325",
  title: "Learning to Summarize from Human Feedback",
  authors: [
    "Nisan Stiennon",
    "Long Ouyang",
    "Jeff Wu",
    "Daniel M. Ziegler",
    "Ryan Lowe",
    "Chelsea Voss",
    "Alec Radford",
    "Dario Amodei",
    "Paul Christiano",
  ],
  year: 2020,
  venue: "NeurIPS 2020",
  citationCount: 5000,
  tags: ["RLHF", "Alignment", "NLP", "Foundational"],
  abstract:
    "As language models become more powerful, training and evaluation are increasingly bottlenecked by the data and metrics used for a particular task. Summarization models are often trained to predict human reference summaries and evaluated using ROUGE, but both of these metrics are rough proxies for what we really care about — summary quality. In this work, we show that it is possible to significantly improve summary quality by training a model to optimize for human preferences. We collect a large, high-quality dataset of human comparisons between summaries, train a model to predict the human-preferred summary, and use that model as a reward function to fine-tune a summarization policy using reinforcement learning.",
  oneLiner:
    "This paper replaced 'imitate the reference answer' with 'optimize what humans actually prefer' — the RLHF recipe that later turned raw GPT models into ChatGPT and Claude.",
  readingTime: "10 min interactive",
  difficulty: "Foundational",

  explainLevels: {
    beginner: [
      {
        heading: "The problem with copying",
        body: "How do you teach an AI to summarize well? The old way: show it thousands of human-written summaries and train it to copy them. But copying has a ceiling — the model can never be better than its examples, and 'similar words to the reference' isn't the same as 'actually a good summary'. What we really want is for humans to READ the outputs and say which ones are good. This paper builds exactly that.",
      },
      {
        heading: "Teach a judge, then train against the judge",
        body: "Paying humans to rate every single output during training would be impossibly slow. The trick: collect tens of thousands of human choices ('summary A is better than B'), then train a second AI — a reward model — to predict those choices. Now you have a tireless robot judge that approximates human taste, and the summarizer can practice against it millions of times.",
      },
      {
        heading: "The leash",
        body: "One danger: if the summarizer optimizes the robot judge too hard, it finds the judge's blind spots — outputs that score high but are actually garbage. It's like a student learning to game the grading rubric instead of learning the subject. The fix is a leash (a 'KL penalty') that punishes the model for drifting too far from normal writing. The lab on this page lets you loosen that leash and watch the cheating begin.",
      },
    ],
    developer: [
      {
        heading: "The three-stage pipeline",
        body: "Stage 1 — SFT: fine-tune a pretrained GPT-style model (1.3B and 6.7B parameters) on Reddit TL;DR posts with their human summaries. Stage 2 — Reward model: collect human pairwise comparisons between candidate summaries; train r_θ to score summaries so the preferred one wins, via loss = −log σ(r(x, y_w) − r(x, y_l)). Stage 3 — RL: optimize the policy against r_θ with PPO, maximizing reward minus β·KL(π ‖ π_SFT) per token.",
      },
      {
        heading: "Why the KL term is load-bearing",
        body: "The reward model is a proxy trained on finite data — optimize it without constraint and the policy exploits its errors (reward increases while true human-judged quality falls; the paper measures this directly). The KL penalty anchors the policy to the SFT distribution, trading raw reward for staying in-distribution. The lab on this page computes the exact closed-form optimum of this trade-off, π ∝ π_SFT·exp(r/β), so you can feel both failure modes.",
      },
      {
        heading: "Results",
        body: "On the TL;DR test set, the 6.7B human-feedback model's summaries were preferred to the original human-written reference summaries roughly 70% of the time; the 1.3B RLHF model outperformed a 10× larger supervised model. The models also transferred zero-shot to CNN/DailyMail news summarization, beating supervised baselines there without any news training — evidence they learned 'what humans want from a summary', not just Reddit style.",
      },
    ],
    researcher: [
      {
        heading: "The alignment framing",
        body: "The paper's core observation is a misalignment of objectives: maximum-likelihood training optimizes agreement with references (and ROUGE optimizes n-gram overlap), while the actual target is human-judged quality — and the gap between proxy and target grows as models get stronger. Learning the target from preference comparisons (rather than absolute ratings, which calibrate poorly across annotators) and optimizing it with an explicit distributional constraint is presented as the general recipe, with summarization as the testbed.",
      },
      {
        heading: "Methodological contributions",
        body: "Beyond the pipeline: high annotator-quality control (researcher–labeler agreement measured; substantial onboarding), a filtered TL;DR dataset (~123k posts) chosen over CNN/DM specifically because references there are weak, direct measurement of reward-model over-optimization (a Goodhart curve: proxy reward rises while human preference falls past an optimal KL), and reward-model scaling studies. The 'preferred ~70% over human references' result required controlling for length, which the paper analyzes explicitly since longer summaries are systematically preferred.",
      },
      {
        heading: "Lineage",
        body: "This is the direct methodological ancestor of InstructGPT (2022) — same three stages, same PPO+KL machinery, generalized from summarization to instruction following — and hence of ChatGPT and modern assistant training at large. It also seeded the research programs on reward hacking/Goodharting, RLHF alternatives (DPO reparameterizes exactly the π ∝ π_SFT·exp(r/β) optimum this page's lab visualizes), and scalable oversight.",
      },
    ],
  },

  psi: {
    problem: {
      title: "Models optimized proxies, not what we want",
      points: [
        "Supervised summarizers imitate reference summaries — capped at reference quality, blind to what makes summaries good.",
        "Automatic metrics like ROUGE reward word overlap, not faithfulness or usefulness.",
        "Asking humans to rate every training sample directly is hopelessly expensive.",
      ],
      analogy:
        "Grading essays by how many words they share with a model answer — fluent copying wins, insight goes unrewarded.",
    },
    solution: {
      title: "Learn human preference, then optimize it — on a leash",
      points: [
        "Collect human A-vs-B choices between summaries; train a reward model to predict the winner.",
        "Fine-tune the policy with RL (PPO) against the reward model's scores.",
        "Add a KL penalty to the supervised baseline so the policy can't wander into the judge's blind spots.",
      ],
      analogy:
        "Train a tireless robot critic from human taste tests, let the writer practice against it a million times — while keeping the writer on a leash so it can't just flatter the critic.",
    },
    impact: {
      title: "The recipe behind every modern assistant",
      points: [
        "6.7B RLHF summaries beat the human-written references ~70% of the time; 1.3B RLHF beat a 10× larger supervised model.",
        "Became InstructGPT's blueprint (2022) — and therefore ChatGPT's and the modern assistant era's.",
        "Named and measured reward over-optimization, seeding today's alignment research agenda.",
      ],
      analogy:
        "The missing translation layer between 'what AI can do' and 'what people actually want' — the reason talking to AI works.",
    },
  },

  architecture: {
    nodes: [
      {
        id: "pretrained",
        label: "Pretrained LM",
        sublabel: "GPT-style, 1.3B / 6.7B",
        kind: "io",
        description:
          "The raw material: a GPT-style model pretrained on internet text. It can write — it just has no idea what humans consider a GOOD summary.",
        example: "Given a Reddit post, it continues plausibly but rambles, copies, or misses the point.",
        detail: "Same decoder-only Transformer family as GPT-3 (see that paper on this site), at 1.3B and 6.7B scale.",
      },
      {
        id: "sft",
        label: "Stage 1: Supervised Fine-Tuning",
        sublabel: "imitate human TL;DRs",
        kind: "process",
        description:
          "Fine-tune on ~123k filtered Reddit posts with their human-written TL;DR summaries — teaching the format and a decent baseline. This SFT model is also the anchor the KL leash will attach to.",
        example: "Post in → plausible 30-word TL;DR out. Competent, but capped at imitation quality.",
        detail:
          "TL;DR was chosen over the usual CNN/DailyMail benchmark precisely because CNN/DM reference summaries are weak — imitating them is a low ceiling.",
      },
      {
        id: "comparisons",
        label: "Human Comparisons",
        sublabel: "“A or B?” × tens of thousands",
        kind: "core",
        description:
          "Labelers read a post and two candidate summaries and pick the better one. Comparisons — not scores — because 'better than' is far more consistent across people than '7/10'.",
        example: "Summary A captures the actual question asked; B is fluent but misses it → A.",
        detail:
          "The paper invested heavily in labeler quality: onboarding, feedback loops, and measured researcher–labeler agreement — arguing data quality mattered as much as quantity.",
      },
      {
        id: "reward-model",
        label: "Stage 2: Reward Model",
        sublabel: "r(post, summary) → score",
        kind: "core",
        description:
          "A copy of the LM with a scalar head, trained so the human-preferred summary scores higher: loss = −log σ(r(y_w) − r(y_l)). It distills thousands of human judgments into a tireless, queryable critic.",
        example: "Good summary → +2.6. Fluent-but-wrong → +0.2. Gibberish that superficially pattern-matches → occasionally +6.5 (a blind spot!).",
        detail:
          "The reward model is a proxy with exploitable errors — which is why the next stage needs a leash. The lab on this page is built around exactly this tension.",
      },
      {
        id: "ppo",
        label: "Stage 3: RL (PPO)",
        sublabel: "practice against the critic",
        kind: "core",
        description:
          "The policy generates summaries, the reward model scores them, and PPO nudges the policy toward higher scores — millions of practice rounds with no human in the loop.",
        example: "Generate → score 1.8 → adjust → generate → score 2.3 → adjust…",
        detail:
          "The value function is initialized from the reward model; generation-level rewards are attributed per-token for the policy gradient.",
      },
      {
        id: "kl",
        label: "The KL Leash",
        sublabel: "− β · KL(π ‖ π_SFT)",
        kind: "core",
        description:
          "Every token the policy writes pays a penalty proportional to how improbable the SFT baseline finds it. Chasing reward is allowed; leaving the distribution of sane text is taxed.",
        example: "In the lab: loosen β and watch a gibberish summary with an inflated reward score take over the policy — reward hacking, live.",
        detail:
          "The paper measures the Goodhart curve directly: past an optimal KL budget, proxy reward keeps rising while TRUE human preference falls. The closed-form optimum π ∝ π_SFT·exp(r/β) is what the lab computes.",
      },
      {
        id: "policy",
        label: "Aligned Policy",
        sublabel: "the RLHF summarizer",
        kind: "process",
        description:
          "The end product: a model optimized for predicted human preference, anchored to fluent text. Not a better imitator — a better summarizer.",
        example: "Its 6.7B summaries were preferred to the humans' own reference TL;DRs ~70% of the time.",
        detail:
          "It also transferred zero-shot: beating supervised baselines on CNN/DailyMail news despite training only on Reddit — it learned the concept, not the style.",
      },
      {
        id: "output",
        label: "The Legacy",
        sublabel: "InstructGPT → ChatGPT",
        kind: "io",
        description:
          "Swap 'summarize this post' for 'follow any instruction' and this exact pipeline becomes InstructGPT (2022) — and then ChatGPT. Every aligned assistant descends from this loop.",
        example: "SFT → reward model from comparisons → PPO with a KL leash: the modern assistant recipe, first proven here.",
        detail:
          "Later work (e.g., DPO) collapses stages 2–3 into one loss — derived from the same π ∝ π_SFT·exp(r/β) optimum shown in this page's lab.",
      },
    ],
    edges: [
      { source: "pretrained", target: "sft" },
      { source: "sft", target: "comparisons" },
      { source: "comparisons", target: "reward-model" },
      { source: "reward-model", target: "ppo" },
      { source: "ppo", target: "kl" },
      { source: "kl", target: "policy" },
      { source: "policy", target: "output" },
    ],
  },

  math: [
    {
      id: "rm-loss",
      name: "The Reward Model Loss",
      formula: "\\mathcal{L}(r_\\theta) = -\\mathbb{E}\\left[ \\log \\sigma\\big( r_\\theta(x, y_w) - r_\\theta(x, y_l) \\big) \\right]",
      meaning:
        "Train the judge from comparisons: for each human choice, push the winning summary's score above the loser's. Only the DIFFERENCE matters — humans said 'better than', not '7 out of 10', because relative judgments are what people give consistently.",
      analogy:
        "A wine critic trained purely on taste-offs: never asked for absolute ratings, only 'which of these two is better' — thousands of times, until their palate mirrors the tasters'.",
      breakdown: [
        { symbol: "y_w, y_l", meaning: "The winner and loser of one human comparison for post x." },
        { symbol: "\\sigma(\\cdot)", meaning: "Sigmoid of the score gap — the Bradley–Terry model of pairwise preference." },
        { symbol: "r_\\theta", meaning: "The LM-with-a-scalar-head being trained into a tireless human-taste proxy." },
      ],
    },
    {
      id: "rl-objective",
      name: "The RL Objective with a Leash",
      formula: "R(x, y) = r_\\theta(x, y) - \\beta \\, \\log \\frac{\\pi(y \\mid x)}{\\pi_{\\text{SFT}}(y \\mid x)}",
      meaning:
        "The policy's true reward: the judge's score MINUS a penalty for writing text the supervised baseline finds improbable. β sets the leash length — the central knob of all RLHF.",
      analogy:
        "A performance bonus (reward) minus a fine for every step taken away from the trail (KL). Wander far only if the bonus truly pays for it.",
      breakdown: [
        { symbol: "r_\\theta(x, y)", meaning: "The reward model's opinion — a fallible proxy for human preference." },
        { symbol: "\\log \\pi / \\pi_{\\text{SFT}}", meaning: "Per-token drift from the anchor policy — large when the model writes 'weird' text." },
        { symbol: "\\beta", meaning: "The leash: too tight wastes the feedback, too loose invites reward hacking. Drag it yourself in the lab." },
      ],
    },
    {
      id: "optimal-policy",
      name: "The Closed-Form Optimum",
      formula: "\\pi^{*}(y \\mid x) \\propto \\pi_{\\text{SFT}}(y \\mid x) \\, e^{\\, r_\\theta(x, y) / \\beta}",
      meaning:
        "KL-regularized RL has an exact solution: reweight the baseline's distribution by exponentiated reward. High-reward outputs get boosted; how much depends on β. This single formula is what the RLHF Lab on this page computes live — and what DPO later turned into a direct training loss.",
      analogy:
        "The baseline model proposes; the reward whispers 'more of this one, less of that one'; β decides how loudly the whisper counts.",
      breakdown: [
        { symbol: "\\pi_{\\text{SFT}}", meaning: "The anchor — everything stays relative to sane, fluent text." },
        { symbol: "e^{r/\\beta}", meaning: "Exponential tilting toward reward. As β→0 the highest-r output takes ALL the mass — including reward-model mistakes." },
        { symbol: "\\pi^{*}", meaning: "The best possible leashed policy — the exact distribution behind the lab's bars." },
      ],
    },
    {
      id: "goodhart",
      name: "Reward Over-Optimization (Goodhart's Law)",
      formula: "\\underbrace{r_\\theta \\uparrow}_{\\text{proxy}} \\;\\; \\text{while} \\;\\; \\underbrace{\\text{human preference} \\downarrow}_{\\text{target}}",
      meaning:
        "The paper's cautionary measurement: push optimization past the sweet spot and the proxy score keeps climbing while real human-judged quality falls. The judge's blind spots become the policy's habits.",
      analogy:
        "Goodhart's law, verbatim: when a measure becomes a target, it ceases to be a good measure. The rubric-gaming student, at scale.",
      breakdown: [
        { symbol: "r_\\theta \\uparrow", meaning: "The policy is genuinely winning — against the proxy." },
        { symbol: "\\text{preference} \\downarrow", meaning: "Humans, re-consulted, like the outputs LESS. The gap is exploited reward-model error." },
        { symbol: "\\beta^{*}", meaning: "The sweet spot in between — precisely the trade-off you can feel with the lab's slider." },
      ],
    },
  ],

  applications: [
    {
      icon: "message-square",
      title: "ChatGPT, Claude & every assistant",
      description:
        "InstructGPT applied this paper's exact three-stage pipeline to instruction following; ChatGPT productized it. Assistant training at every lab descends from this recipe.",
    },
    {
      icon: "search",
      title: "The alignment field",
      description:
        "Reward hacking, Goodharting, scalable oversight — this paper's measured over-optimization curves seeded core research agendas in AI alignment.",
    },
    {
      icon: "code",
      title: "DPO and successors",
      description:
        "Direct Preference Optimization derives its loss from the same closed-form optimum this paper's KL setup implies — collapsing the pipeline into one supervised step.",
    },
    {
      icon: "languages",
      title: "Preference data industry",
      description:
        "Human comparison collection — labeler pipelines, agreement metrics, quality control — became an industry because this paper showed data quality drives alignment quality.",
    },
    {
      icon: "eye",
      title: "Beyond text",
      description:
        "RLHF now aligns image generators to aesthetic preferences, code models to correctness-and-style, and robots to human comfort — anywhere 'good' is easier to judge than to specify.",
    },
    {
      icon: "dna",
      title: "Constitutional & AI feedback",
      description:
        "RLAIF and constitutional methods swap the human judge for an AI judge guided by principles — inheriting this paper's machinery while attacking its labeling bottleneck.",
    },
  ],

  codeExample: {
    language: "python",
    title: "The three stages of RLHF, in miniature",
    explanation:
      "The whole pipeline as runnable-shaped pseudocode: imitate, learn a judge from comparisons, then optimize against the judge — with the KL leash that keeps it honest. Swap 'summarize' for 'follow instructions' and this is how assistants are trained.",
    code: `import torch
import torch.nn.functional as F

# ---- Stage 1: Supervised fine-tuning (imitate human TL;DRs) ----
def sft_step(policy, post, human_summary):
    logits = policy(post, human_summary)
    return F.cross_entropy(logits, human_summary.tokens)  # plain imitation


# ---- Stage 2: Reward model from human comparisons ----
def reward_model_step(rm, post, winner, loser):
    # Bradley-Terry: the human-preferred summary must score higher
    gap = rm(post, winner) - rm(post, loser)
    return -F.logsigmoid(gap)          # loss = -log sigma(r_w - r_l)


# ---- Stage 3: RL against the judge, on a KL leash ----
def rlhf_reward(rm, policy, sft_policy, post, summary, beta=0.05):
    proxy = rm(post, summary)          # what the judge thinks

    # The leash: pay for every token the SFT baseline finds weird
    kl = (policy.logprob(summary, post)
          - sft_policy.logprob(summary, post))

    return proxy - beta * kl           # the objective PPO maximizes


# The closed-form optimum of stage 3 (what the lab visualizes):
#     pi*(y|x)  ~  pi_sft(y|x) * exp( r(x,y) / beta )
#
# beta -> 0:   highest-reward output takes everything -- including
#              reward-model MISTAKES. That's reward hacking.
# beta -> inf: policy never moves; human feedback wasted.
# The art of RLHF is the leash length in between.`,
  },

  chatSuggestions: [
    "Why comparisons instead of ratings?",
    "What is reward hacking?",
    "What does the KL penalty do?",
    "How good were the RLHF summaries?",
    "How did this lead to ChatGPT?",
  ],

  course: {
    title: "RLHF: teaching AI what we actually want",
    description:
      "A 4-lesson mini course: why imitation caps quality, learning a judge from preferences, optimizing on a leash, and the Goodhart trap.",
    lessons: [
      {
        id: "lesson-1",
        number: 1,
        title: "The imitation ceiling",
        duration: "6 min",
        summary: "Copying references optimizes the wrong thing.",
        sections: [
          {
            heading: "How summarizers were trained",
            body: "The standard recipe: collect posts with human-written summaries, train the model to reproduce those summaries word by word (maximum likelihood), and evaluate with ROUGE — a score counting word overlap with the reference. Reasonable-sounding, and the whole field ran on it.",
          },
          {
            heading: "Three quiet failures",
            body: "First, the ceiling: an imitator can at best tie its references — and reference summaries (the paper picked Reddit TL;DR partly because CNN/DailyMail's are notoriously weak) are often mediocre. Second, the metric: word overlap rewards phrasing, not faithfulness — a summary can ace ROUGE while missing the point. Third, and deepest: 'write like the reference' and 'be a good summary' are different objectives that only partially overlap.",
          },
          {
            heading: "The reframe",
            body: "What we actually want is simple to state: humans should prefer the model's output. This paper's move is to optimize THAT — directly. The catch is that human judgment is slow and expensive, and gradient descent needs millions of evaluations. Lesson 2 solves exactly this. (First, try the token playground in this course to recall what these models look like underneath.)",
          },
        ],
        keyTakeaway:
          "Supervised summarization optimizes imitation and ROUGE optimizes word overlap — both are proxies. The real target, human preference, needed its own training signal.",
        quiz: {
          question: "Why can't a supervised summarizer exceed its training references?",
          options: [
            { text: "It runs out of vocabulary", correct: false, explanation: "Vocabulary isn't the constraint — the objective is." },
            { text: "Its objective is to reproduce the references — imitation treats them as the ceiling, not a floor", correct: true, explanation: "Exactly — maximum likelihood pulls the model TOWARD the references. Anything better than them is, by the objective's lights, an error." },
            { text: "References are too short", correct: false, explanation: "Length isn't the issue — the direction of optimization is." },
            { text: "ROUGE penalizes creativity directly during training", correct: false, explanation: "ROUGE is an evaluation metric, not the training loss — though it shares the same proxy problem." },
          ],
        },
      },
      {
        id: "lesson-2",
        number: 2,
        title: "Bottling human taste",
        duration: "7 min",
        summary: "From A-vs-B clicks to a tireless judge.",
        sections: [
          {
            heading: "Why comparisons, not scores",
            body: "Ask ten people to rate a summary 1–10 and you get ten calibrations: one person's 6 is another's 8. Ask 'which of these two is better?' and people agree far more often. So the paper collects pairwise comparisons — a labeler reads the post, reads summaries A and B, clicks the better one. Tens of thousands of times, with serious quality control (labeler onboarding and measured agreement with the researchers' own judgments).",
          },
          {
            heading: "Distilling the judge",
            body: "The reward model is a language model with a scalar output head. Its training loss — −log σ(r(y_w) − r(y_l)) — simply pushes each comparison's winner above its loser. After training, it maps any (post, summary) to a score approximating 'how much a human would like this'. One-time human effort becomes an infinitely queryable critic.",
          },
          {
            heading: "A proxy, not an oracle",
            body: "The judge is imperfect by construction: finite data, systematic quirks (it shares humans' known bias toward longer summaries, which the paper controls for), and blind spots that score some garbage highly. That imperfection isn't a footnote — it's the reason the entire next lesson exists.",
          },
        ],
        keyTakeaway:
          "Pairwise comparisons (reliable) train a reward model via −log σ(r_w − r_l), turning bounded human effort into an unbounded training signal — an approximate judge with real blind spots.",
        quiz: {
          question: "Why did the paper collect comparisons ('A or B?') instead of numeric ratings?",
          options: [
            { text: "Comparisons are faster to click through", correct: false, explanation: "Speed helps, but the real reason is statistical quality." },
            { text: "People's relative judgments are far more consistent than their absolute scores", correct: true, explanation: "Exactly — everyone's '7/10' means something different, but 'A beats B' transfers across labelers. The Bradley–Terry loss then turns rankings into scores." },
            { text: "Ratings are impossible to train on", correct: false, explanation: "You can regress on ratings — they're just noisier and calibrate poorly across people." },
            { text: "The reward model can only output binary values", correct: false, explanation: "It outputs a continuous score — trained FROM binary choices." },
          ],
        },
      },
      {
        id: "lesson-3",
        number: 3,
        title: "Optimizing on a leash",
        duration: "8 min",
        summary: "PPO, the KL penalty, and the exact trade-off.",
        sections: [
          {
            heading: "Practice against the judge",
            body: "Stage 3: the policy writes summaries, the reward model grades them, and PPO (a policy-gradient RL algorithm) shifts the policy toward higher grades — millions of practice rounds, no human needed. But maximizing a flawed judge's score verbatim is a trap: the policy would drift toward the judge's blind spots, producing text that scores high and reads awful.",
          },
          {
            heading: "The KL leash",
            body: "The fix: the true objective is r(x,y) − β·KL(π ‖ π_SFT) — reward minus a fine for straying from the supervised baseline's distribution. Weird tokens are expensive; the model chases reward only where reward is worth the drift. And this objective has an exact solution: π* ∝ π_SFT · exp(r/β). The RLHF Lab in this course computes that very formula — drag β and watch the policy interpolate between 'timid clone' and 'reward hacker'.",
          },
          {
            heading: "Reading the lab",
            body: "At high β, the bars barely move from the baseline — feedback wasted. In the middle, genuinely better summaries take over — the sweet spot. At low β, the gibberish candidate with an inflated score seizes the distribution — the judge's blind spot becoming the policy's behavior. Three regimes, one slider, real math.",
          },
        ],
        keyTakeaway:
          "RLHF maximizes reward − β·KL(π ‖ π_SFT); its optimum is π ∝ π_SFT·exp(r/β). β is the whole game: leash too tight wastes feedback, too loose invites hacking.",
        quiz: {
          question: "What does the KL penalty term actually prevent?",
          options: [
            { text: "The model from becoming too large", correct: false, explanation: "KL constrains behavior (the output distribution), not model size." },
            { text: "The policy from drifting into text the baseline finds improbable — where the reward model's errors live", correct: true, explanation: "Exactly — the reward model is only trustworthy near the distribution it was trained on. The leash keeps optimization inside that trust region." },
            { text: "Overfitting to the summarization dataset", correct: false, explanation: "That's a supervised-learning concern; the KL term addresses proxy exploitation during RL." },
            { text: "The reward model from being updated", correct: false, explanation: "The reward model is frozen in stage 3 regardless — the leash is on the policy." },
          ],
        },
      },
      {
        id: "lesson-4",
        number: 4,
        title: "Results, Goodhart, and the road to ChatGPT",
        duration: "7 min",
        summary: "Beating the humans' own references — carefully.",
        sections: [
          {
            heading: "The headline results",
            body: "On Reddit TL;DR: the 6.7B RLHF model's summaries were preferred to the original human-written references about 70% of the time — the optimization target genuinely surpassed its imitation ceiling. The 1.3B RLHF model beat a supervised model 10× its size. And zero-shot transfer to CNN/DailyMail news beat supervised baselines trained ON news — the model had learned what a good summary IS, not what Reddit sounds like.",
          },
          {
            heading: "The Goodhart curve",
            body: "The paper's most important cautionary figure: optimize harder against the reward model (spend more KL budget) and proxy reward rises monotonically — while actual human preference rises, peaks, and then FALLS. When a measure becomes a target, it ceases to be a good measure, now with error bars. You reproduced this curve qualitatively every time you dragged the lab's slider too far.",
          },
          {
            heading: "From TL;DR to your chat window",
            body: "Generalize the pipeline — replace 'summarize this post' with 'respond to any instruction' — and you have InstructGPT (2022), built by an overlapping team, and then ChatGPT. Later refinements like DPO derive their loss from the very π ∝ π_SFT·exp(r/β) optimum you played with. When an assistant declines to game you and just answers well, you're seeing this paper's leash at work.",
          },
        ],
        keyTakeaway:
          "RLHF summaries beat human references ~70% of the time and transferred across domains — while the measured Goodhart curve warned exactly how the recipe fails. InstructGPT and ChatGPT applied it wholesale.",
        quiz: {
          question: "What does the paper's over-optimization experiment show?",
          options: [
            { text: "More RL training always improves summaries", correct: false, explanation: "That's precisely what it disproves." },
            { text: "Past a sweet spot, reward-model scores keep rising while real human preference falls", correct: true, explanation: "Correct — the Goodhart curve: the policy starts exploiting the judge's blind spots, winning the proxy and losing the target." },
            { text: "Human labelers become less accurate over time", correct: false, explanation: "Labeler quality was controlled and measured — the drift is in the policy, not the people." },
            { text: "The KL penalty makes training unstable", correct: false, explanation: "The KL term is the stabilizer — removing it is what unleashes the failure." },
          ],
        },
      },
    ],
  },
};
