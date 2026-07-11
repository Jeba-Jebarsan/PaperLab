import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPaper } from "@/lib/data/papers";
import { PaperHero } from "@/features/paper/paper-hero";
import { SectionNav } from "@/features/paper/section-nav";
import { SectionHeading } from "@/components/ui/section-heading";
import { ExplainLevels } from "@/features/paper/explain-levels";
import { PsiCards } from "@/features/paper/psi-cards";
import { AttentionSimulator } from "@/features/simulators/attention/attention-simulator";
import { YoloSimulator } from "@/features/simulators/yolo/yolo-simulator";
import { CnnSimulator } from "@/features/simulators/cnn/cnn-simulator";
import { ResnetRace } from "@/features/simulators/resnet/resnet-race";
import { MaskedWordLab } from "@/features/simulators/masked-word/masked-word-lab";
import { DigitVision } from "@/features/simulators/digit-vision/digit-vision";
import { GanLab } from "@/features/simulators/gan/gan-lab";
import { GradientDescentSimulator } from "@/features/simulators/gradient-descent/gradient-descent-simulator";
import { RlhfLab } from "@/features/simulators/rlhf/rlhf-lab";
import { LoraLab } from "@/features/simulators/lora/lora-lab";
import { ArchitectureExplorer } from "@/features/paper/architecture-explorer";
import { MathExplainer } from "@/features/paper/math-explainer";
import { LlmPlayground } from "@/features/simulators/llm-playground/llm-playground";
import { Applications } from "@/features/paper/applications";
import { CodeExampleBlock } from "@/features/paper/code-example";
import { PaperQuiz } from "@/features/paper/paper-quiz";
import { ChatPanel } from "@/features/paper/chat-panel";
import { VisualStory } from "@/features/paper/visual-story";
import { getStory } from "@/features/paper/stories";

/** Per-paper simulator sections. Generated papers (Phase 8) will map to labs by concept tags. */
const SIM_CONFIG: Record<
  string,
  {
    simLabel: string;
    simTitle: string;
    simDesc: string;
    sim: React.ReactNode;
    playLabel: string;
    playTitle: string;
    playDesc: string;
    playground: React.ReactNode;
  }
> = {
  "1706.03762": {
    simLabel: "Attention Lab",
    simTitle: "Don't read about attention — play with it",
    simDesc:
      "This is the paper's core idea, running live. Hover words, switch heads, and watch the model decide what matters.",
    sim: <AttentionSimulator />,
    playLabel: "Playground",
    playTitle: "From this paper to ChatGPT",
    playDesc:
      "Transformers became GPT by predicting the next token. Play with temperature and top-k to feel how generation really works.",
    playground: <LlmPlayground />,
  },
  "2010.11929": {
    simLabel: "Attention Lab",
    simTitle: "The same attention, now reading image patches",
    simDesc:
      "This is the exact mechanism inside ViT — self-attention connecting distant 'words'. Here they're sentence words; in ViT they're 16×16 image patches. The math doesn't change at all.",
    sim: <AttentionSimulator />,
    playLabel: "CNN Lab",
    playTitle: "The old way ViT replaced",
    playDesc:
      "Convolution's small sliding window — the approach every vision model used before ViT. Compare its local view to attention's global one above.",
    playground: <CnnSimulator />,
  },
  "1810.04805": {
    simLabel: "Masked Word Lab",
    simTitle: "Play BERT's training game yourself",
    simDesc:
      "Fill-in-the-blank with X-ray vision: move the mask, then toggle between left-only reading (GPT) and both-sides reading (BERT) — and watch the confidence jump.",
    sim: <MaskedWordLab />,
    playLabel: "Attention Lab",
    playTitle: "Bidirectional attention — BERT's native view",
    playDesc:
      "The Attention Lab's every-word-to-every-word view IS BERT's encoder. GPT sees this picture with all rightward connections cut.",
    playground: <AttentionSimulator />,
  },
  "alexnet-2012": {
    simLabel: "CNN Lab",
    simTitle: "The operation that won ImageNet",
    simDesc:
      "AlexNet is five layers of exactly this: a filter sliding across the image, building a feature map. Watch it happen, then imagine 96 filters, five layers deep.",
    sim: <CnnSimulator />,
    playLabel: "Train One",
    playTitle: "Train your own tiny AlexNet-descendant",
    playDesc:
      "The same recipe at pocket scale: a real network learns to read your handwriting, live — ReLU, softmax, gradient descent and all.",
    playground: <DigitVision />,
  },
  "1406.2661": {
    simLabel: "GAN Lab",
    simTitle: "The duel, live",
    simDesc:
      "A real forger and a real detective train against each other in your browser. Watch the equilibrium emerge — or push the sliders and cause genuine mode collapse.",
    sim: <GanLab />,
    playLabel: "Optimizer Lab",
    playTitle: "The engine under both players",
    playDesc:
      "Both networks in the duel learn by gradient descent — the same ball-rolling-downhill you can drive here. GAN training is two of these, chained in opposition.",
    playground: <GradientDescentSimulator />,
  },
  "2009.01325": {
    simLabel: "RLHF Lab",
    simTitle: "The reward-vs-leash tug-of-war",
    simDesc:
      "Drag the KL penalty and watch the policy shift between playing it safe, genuinely improving, and reward hacking — using the true closed-form optimum of KL-regularized RL.",
    sim: <RlhfLab />,
    playLabel: "Token Playground",
    playTitle: "The model being aligned",
    playDesc:
      "Underneath RLHF sits an ordinary next-token predictor. These sampling controls are the raw material that human feedback then shapes.",
    playground: <LlmPlayground />,
  },
  "2106.09685": {
    simLabel: "LoRA Lab",
    simTitle: "Watch a full update collapse into rank 3",
    simDesc:
      "A real SVD, sliced layer by layer: slide the rank and see how few directions of change rebuild a full fine-tuning update — the paper's entire bet, visible.",
    sim: <LoraLab />,
    playLabel: "Attention Lab",
    playTitle: "The matrices LoRA adapts",
    playDesc:
      "LoRA's skinny B·A updates target attention's query and value projections — the exact Q and V roles you can explore here.",
    playground: <AttentionSimulator />,
  },
  "2005.14165": {
    simLabel: "Token Playground",
    simTitle: "The loop that writes everything",
    simDesc:
      "GPT-3's output is one next-token raffle, repeated. These are the real sampling controls — temperature, top-k, top-p — that shaped every GPT completion ever generated.",
    sim: <LlmPlayground />,
    playLabel: "Attention Lab",
    playTitle: "The engine inside: attention, 96 layers deep",
    playDesc:
      "In-context learning happens when attention heads look back at the examples in your prompt. This is that mechanism — GPT-3 runs 96 heads of it, 96 layers deep.",
    playground: <AttentionSimulator />,
  },
  "1512.03385": {
    simLabel: "ResNet Lab",
    simTitle: "Watch the degradation problem — and its cure — live",
    simDesc:
      "Two real networks of identical depth train side by side in your browser. The only difference: one has skip connections. This is the paper's Figure 1, running in front of you.",
    sim: <ResnetRace />,
    playLabel: "CNN Lab",
    playTitle: "The convolution ResNet stacks 152 deep",
    playDesc:
      "Every residual block is built from this operation. Watch a real filter slide across an image — then imagine 152 layers of it, made trainable by one addition.",
    playground: <CnnSimulator />,
  },
  "1506.02640": {
    simLabel: "Detection Lab",
    simTitle: "Don't read about detection — tune it",
    simDesc:
      "This is YOLO's post-processing, live: drag the confidence and IoU sliders and watch detections appear, vanish, and merge.",
    sim: <YoloSimulator />,
    playLabel: "CNN Lab",
    playTitle: "How the backbone sees",
    playDesc:
      "YOLO's 24 convolutional layers are built from this exact operation. Watch a real filter slide across an image and produce a feature map.",
    playground: <CnnSimulator />,
  },
};

const sectionsFor = (paperId: string) => [
  ...(getStory(paperId) ? [{ id: "story", label: "The Story" }] : []),
  { id: "overview", label: "Overview" },
  { id: "innovation", label: "Key Innovation" },
  { id: "simulator", label: SIM_CONFIG[paperId]?.simLabel ?? "Simulator" },
  { id: "architecture", label: "Architecture" },
  { id: "math", label: "Math" },
  { id: "playground", label: SIM_CONFIG[paperId]?.playLabel ?? "Playground" },
  { id: "applications", label: "Applications" },
  { id: "code", label: "Code" },
  { id: "quiz", label: "Quiz" },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const paper = getPaper(id);
  return { title: paper?.title ?? "Paper not found" };
}

export default async function PaperPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const paper = getPaper(id);
  if (!paper) notFound();
  const simConfig = SIM_CONFIG[paper.id];
  const story = getStory(paper.id);

  return (
    <>
      <PaperHero paper={paper} />
      <SectionNav sections={sectionsFor(paper.id)} />

      <div className="mx-auto max-w-5xl space-y-24 px-5 pt-14 pb-10">
        {/* The visual story — the whole paper in pictures */}
        {story && (
          <section id="story" className="scroll-mt-32">
            <SectionHeading
              eyebrow="The story"
              title="The whole paper, in pictures"
              description="Five animated scenes — everything you need to understand this paper, no reading required. Then scroll on to play with the ideas yourself."
            />
            <div className="mt-8">
              <VisualStory scenes={story} title={`${paper.title.split(":")[0]} — the picture-book version`} />
            </div>
          </section>
        )}

        {/* Overview — three explanation depths */}
        <section id="overview" className="scroll-mt-32">
          <SectionHeading
            eyebrow="Paper overview"
            title="Pick your depth"
            description="The same ideas at three altitudes — start where you're comfortable, climb when you're curious."
          />
          <div className="mt-8">
            <ExplainLevels levels={paper.explainLevels} />
          </div>
        </section>

        {/* Key innovation */}
        <section id="innovation" className="scroll-mt-32">
          <SectionHeading
            eyebrow="Key innovation"
            title="Problem → Solution → Impact"
            description="Every great paper is a story: what was broken, the idea that fixed it, and what it unlocked."
          />
          <div className="mt-8">
            <PsiCards psi={paper.psi} />
          </div>
        </section>

        {/* Interactive simulator */}
        {simConfig && (
          <section id="simulator" className="scroll-mt-32">
            <SectionHeading
              eyebrow="Interactive simulator"
              title={simConfig.simTitle}
              description={simConfig.simDesc}
            />
            <div className="mt-8">{simConfig.sim}</div>
          </section>
        )}

        {/* Architecture */}
        <section id="architecture" className="scroll-mt-32">
          <SectionHeading
            eyebrow="Architecture explorer"
            title="The full machine, block by block"
            description="Follow a sentence through the model. Every block is clickable — purpose, example, and the deeper detail."
          />
          <div className="mt-8">
            <ArchitectureExplorer
              nodes={paper.architecture.nodes}
              edges={paper.architecture.edges}
            />
          </div>
        </section>

        {/* Math */}
        <section id="math" className="scroll-mt-32">
          <SectionHeading
            eyebrow="Math, demystified"
            title="Every equation earns its keep"
            description="Formula → plain meaning → real-world analogy. Hover the symbols to decode them one by one."
          />
          <div className="mt-8">
            <MathExplainer blocks={paper.math} />
          </div>
        </section>

        {/* Playground */}
        {simConfig && (
          <section id="playground" className="scroll-mt-32">
            <SectionHeading
              eyebrow="Interactive playground"
              title={simConfig.playTitle}
              description={simConfig.playDesc}
            />
            <div className="mt-8">{simConfig.playground}</div>
          </section>
        )}

        {/* Applications */}
        <section id="applications" className="scroll-mt-32">
          <SectionHeading
            eyebrow="Real-world impact"
            title="Where this research lives today"
            description="Eight pages from 2017 that you now interact with every single day."
          />
          <div className="mt-8">
            <Applications items={paper.applications} />
          </div>
        </section>

        {/* Code */}
        <section id="code" className="scroll-mt-32">
          <SectionHeading
            eyebrow="Code example"
            title="The core idea in ~40 lines of code"
            description="Reading real code is the final test of understanding. This is the paper's core mechanism, minimally."
          />
          <div className="mt-8">
            <CodeExampleBlock example={paper.codeExample} />
          </div>
        </section>

        {/* Quiz */}
        <section id="quiz" className="scroll-mt-32">
          <SectionHeading
            eyebrow="Check yourself"
            title="Did it stick?"
            description="Four questions, each targeting a concept people commonly get wrong. Mistakes come with explanations."
          />
          <div className="mt-8">
            <PaperQuiz paper={paper} />
          </div>
        </section>
      </div>

      <ChatPanel
        paperId={paper.id}
        paperTitle={paper.title}
        suggestions={paper.chatSuggestions}
      />
    </>
  );
}
