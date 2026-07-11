"use client";

import { motion } from "framer-motion";
import {
  SceneFrame,
  DIM,
  FAINT,
  TEAL,
  AMBER,
  BLUE,
  ROSE,
  type StoryScene,
} from "../visual-story";

/* Scene 1 — one AI per job */
function OneAiPerJob({ active }: { active: boolean }) {
  const jobs = ["translate", "summarize", "answer", "classify"];
  return (
    <SceneFrame>
      {jobs.map((j, i) => (
        <motion.g key={j} initial={{ opacity: 0, y: 12 }} animate={active ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.3 }}>
          <rect x={62 + i * 95} y={95} width={72} height={56} rx={10} fill="rgba(96,165,250,0.06)" stroke={BLUE} />
          <circle cx={98 + i * 95} cy={113} r={7} fill="none" stroke={BLUE} strokeWidth={1.5} />
          <rect x={90 + i * 95} y={122} width={16} height={14} rx={3} fill="none" stroke={BLUE} strokeWidth={1.5} />
          <text x={98 + i * 95} y={166} textAnchor="middle" fontSize={9.5} fill={DIM}>{j}</text>
          {/* its own school */}
          <motion.g animate={active ? { opacity: [0.4, 1, 0.4] } : {}} transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}>
            <path d={`M ${86 + i * 95} 78 L ${98 + i * 95} 68 L ${110 + i * 95} 78 Z`} fill="none" stroke={AMBER} strokeWidth={1.4} />
            <text x={98 + i * 95} y={60} textAnchor="middle" fontSize={8} fill={AMBER}>own school</text>
          </motion.g>
        </motion.g>
      ))}
      <motion.text x={240} y={205} textAnchor="middle" fontSize={11} fill={FAINT} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 1.6 }}>
        every new job: collect thousands of examples, train a whole new model. Exhausting.
      </motion.text>
    </SceneFrame>
  );
}

/* Scene 2 — make one model gigantic */
function GoGigantic({ active }: { active: boolean }) {
  return (
    <SceneFrame>
      <circle cx={120} cy={130} r={6} fill={BLUE} />
      <text x={120} y={160} textAnchor="middle" fontSize={9.5} fill={DIM}>GPT-2 (2019)</text>
      <text x={120} y={174} textAnchor="middle" fontSize={8.5} fill={FAINT}>1.5 billion knobs</text>
      <motion.circle
        cx={310}
        cy={126}
        fill="rgba(79,209,197,0.08)"
        stroke={TEAL}
        strokeWidth={2}
        initial={{ r: 6 }}
        animate={active ? { r: 68 } : {}}
        transition={{ delay: 0.5, duration: 1.6, ease: "easeOut" }}
      />
      <motion.text x={310} y={122} textAnchor="middle" fontSize={13} fontWeight={700} fill={TEAL} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 1.8 }}>
        GPT-3
      </motion.text>
      <motion.text x={310} y={140} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={TEAL} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 2.1 }}>
        175,000,000,000 knobs
      </motion.text>
      <motion.text x={310} y={216} textAnchor="middle" fontSize={9.5} fill={DIM} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 2.4 }}>
        fed ~300 billion words of internet, books, Wikipedia
      </motion.text>
      <motion.path d="M 135 130 L 230 130" stroke={DIM} strokeWidth={2} markerEnd="url(#g3a)" initial={{ pathLength: 0 }} animate={active ? { pathLength: 1 } : {}} transition={{ delay: 0.3, duration: 0.5 }} />
      <defs>
        <marker id="g3a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke={DIM} strokeWidth="1.4" /></marker>
      </defs>
      <text x={240} y={45} textAnchor="middle" fontSize={11} fill={FAINT}>
        the bet: don&apos;t build a cleverer machine — build a 100× BIGGER one
      </text>
    </SceneFrame>
  );
}

/* Scene 3 — teach it in the prompt */
function TeachInPrompt({ active }: { active: boolean }) {
  const lines = [
    { t: "Translate English to French:", c: DIM },
    { t: "sea otter => loutre de mer", c: DIM },
    { t: "peppermint => menthe poivrée", c: DIM },
    { t: "cheese => ", c: AMBER },
  ];
  return (
    <SceneFrame>
      <rect x={110} y={52} width={260} height={130} rx={12} fill="rgba(255,255,255,0.04)" stroke={FAINT} />
      <text x={126} y={72} fontSize={9} fill={FAINT}>your prompt (this is the ONLY teaching)</text>
      {lines.map((l, i) => (
        <motion.text
          key={i}
          x={126}
          y={94 + i * 20}
          fontSize={10.5}
          fontFamily="monospace"
          fill={l.c}
          initial={{ opacity: 0 }}
          animate={active ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 + i * 0.55 }}
        >
          {l.t}
        </motion.text>
      ))}
      {/* the model completes it */}
      <motion.text
        x={196}
        y={154}
        fontSize={10.5}
        fontFamily="monospace"
        fontWeight={700}
        fill={TEAL}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: [0, 1] } : {}}
        transition={{ delay: 2.9 }}
      >
        fromage ✓
      </motion.text>
      <motion.g initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 3.3 }}>
        <rect x={140} y={196} width={200} height={26} rx={13} fill="rgba(79,209,197,0.08)" stroke={TEAL} />
        <text x={240} y={213} textAnchor="middle" fontSize={10} fill={TEAL}>
          it learned the task FROM two examples
        </text>
      </motion.g>
      <motion.text x={240} y={42} textAnchor="middle" fontSize={11} fill={FAINT} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}>
        no retraining. no new model. just… show it what you want
      </motion.text>
    </SceneFrame>
  );
}

/* Scene 4 — the skill grows with size */
function GrowsWithSize({ active }: { active: boolean }) {
  const models = [
    { x: 120, r: 10, bar: 22, label: "small" },
    { x: 240, r: 20, bar: 48, label: "medium" },
    { x: 360, r: 34, bar: 92, label: "GPT-3" },
  ];
  return (
    <SceneFrame>
      {models.map((m, i) => (
        <g key={i}>
          <motion.circle cx={m.x} cy={95} r={m.r} fill="rgba(96,165,250,0.08)" stroke={BLUE} strokeWidth={1.5} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: i * 0.3 }} />
          <text x={m.x} y={99} textAnchor="middle" fontSize={8.5} fill={DIM}>{m.label}</text>
          <rect x={m.x - 14} y={210 - 0} width={28} height={0} />
          <rect x={m.x - 14} y={150} width={28} height={62} rx={5} fill="rgba(255,255,255,0.05)" />
          <motion.rect
            x={m.x - 14}
            width={28}
            rx={5}
            fill={i === 2 ? TEAL : "rgba(79,209,197,0.5)"}
            initial={{ y: 212, height: 0 }}
            animate={active ? { y: 212 - m.bar * 0.62, height: m.bar * 0.62 } : {}}
            transition={{ delay: 0.8 + i * 0.4, duration: 0.8, ease: "easeOut" }}
          />
          <motion.text x={m.x} y={228} textAnchor="middle" fontSize={9} fill={FAINT} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 1 + i * 0.4 }}>
            learns from examples?
          </motion.text>
        </g>
      ))}
      <motion.text
        x={240}
        y={45}
        textAnchor="middle"
        fontSize={11}
        fill={AMBER}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={{ delay: 2.4 }}
      >
        the surprise: this prompt-learning skill only really appears at giant size
      </motion.text>
    </SceneFrame>
  );
}

/* Scene 5 — that's why you can talk to AI */
function JustTalk({ active }: { active: boolean }) {
  return (
    <SceneFrame>
      <rect x={120} y={55} width={240} height={140} rx={14} fill="rgba(255,255,255,0.03)" stroke={FAINT} />
      {/* user message */}
      <motion.g initial={{ opacity: 0, x: 16 }} animate={active ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.4 }}>
        <rect x={205} y={70} width={140} height={26} rx={13} fill="rgba(96,165,250,0.14)" stroke={BLUE} />
        <text x={275} y={87} textAnchor="middle" fontSize={10} fill={BLUE}>“write me a tiny poem”</text>
      </motion.g>
      {/* assistant reply typing */}
      <motion.g initial={{ opacity: 0, x: -16 }} animate={active ? { opacity: 1, x: 0 } : {}} transition={{ delay: 1.2 }}>
        <rect x={134} y={108} width={168} height={64} rx={13} fill="rgba(79,209,197,0.08)" stroke={TEAL} />
        {["Roses are red,", "networks are deep —", "I learned from your prompt", "no retraining, no sleep."].map((l, i) => (
          <motion.text key={i} x={146} y={124 + i * 13} fontSize={8.5} fontFamily="monospace" fill={TEAL} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 1.5 + i * 0.5 }}>
            {l}
          </motion.text>
        ))}
      </motion.g>
      <motion.text x={240} y={218} textAnchor="middle" fontSize={11} fill={DIM} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 3.6 }}>
        ChatGPT · Claude · Gemini — all children of this 2020 discovery
      </motion.text>
      <text x={240} y={40} textAnchor="middle" fontSize={11} fill={FAINT}>
        instructions ARE prompts — “programming” became “asking”
      </text>
    </SceneFrame>
  );
}

export const gpt3Story: StoryScene[] = [
  {
    id: "per-job",
    caption: "Before GPT-3, every single job needed its own specially-trained AI.",
    sub: "A translator model, a summarizer model, a question model… each with its own school and its own thousands of examples.",
    Art: OneAiPerJob,
  },
  {
    id: "gigantic",
    caption: "GPT-3's bet: build ONE model — a hundred times bigger than anything before.",
    sub: "175 billion adjustable knobs, fed 300 billion words. Not a cleverer design — the same Transformer, scaled hard.",
    Art: GoGigantic,
  },
  {
    id: "prompt",
    caption: "The magic: you teach it INSIDE your message — just show a couple of examples.",
    sub: "Two translation examples in the prompt, and it translates the third line. Zero retraining. The prompt IS the programming.",
    Art: TeachInPrompt,
  },
  {
    id: "scale",
    caption: "And that skill GROWS with size — small models can't do it, the giant can.",
    sub: "The paper trained 8 sizes to prove it: learning-from-examples emerges as models get bigger. Scale isn't just more — it's different.",
    Art: GrowsWithSize,
  },
  {
    id: "talk",
    caption: "That's why you can simply TALK to AI today.",
    sub: "Instructions are just prompts. Add some polish (that's the RLHF paper!) and you get ChatGPT and Claude. Try the token playground below.",
    Art: JustTalk,
  },
];
