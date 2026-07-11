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

/* Scene 1 — it writes, but is it what we WANT? */
function WritesButMeh({ active }: { active: boolean }) {
  const outputs = [
    { y: 70, verdict: "😐 meh" },
    { y: 110, verdict: "😕 misses the point" },
    { y: 150, verdict: "🙂 okay…" },
  ];
  return (
    <SceneFrame>
      {/* the writer robot */}
      <rect x={80} y={95} width={80} height={60} rx={12} fill="rgba(96,165,250,0.08)" stroke={BLUE} strokeWidth={1.5} />
      <circle cx={110} cy={115} r={4} fill={BLUE} />
      <circle cx={130} cy={115} r={4} fill={BLUE} />
      <line x1={106} y1={135} x2={134} y2={135} stroke={BLUE} strokeWidth={2} />
      <text x={120} y={172} textAnchor="middle" fontSize={9.5} fill={DIM}>the AI writer</text>
      {/* pages flying out */}
      {outputs.map((o, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, x: -30 }}
          animate={active ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.4 + i * 0.5 }}
        >
          <rect x={215} y={o.y} width={110} height={30} rx={6} fill="rgba(255,255,255,0.04)" stroke={FAINT} />
          <line x1={224} y1={o.y + 10} x2={310} y2={o.y + 10} stroke={FAINT} strokeWidth={1.5} />
          <line x1={224} y1={o.y + 18} x2={296} y2={o.y + 18} stroke={FAINT} strokeWidth={1.5} />
          <motion.text x={382} y={o.y + 20} textAnchor="middle" fontSize={11} fill={DIM} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 0.9 + i * 0.5 }}>
            {o.verdict}
          </motion.text>
        </motion.g>
      ))}
      <text x={240} y={215} textAnchor="middle" fontSize={11} fill={FAINT}>
        fluent? yes. actually what people wanted? …not really. And “good” has no formula.
      </text>
    </SceneFrame>
  );
}

/* Scene 2 — humans pick A or B */
function PickAorB({ active }: { active: boolean }) {
  return (
    <SceneFrame>
      {/* two candidate cards */}
      <rect x={95} y={70} width={130} height={80} rx={10} fill="rgba(79,209,197,0.06)" stroke={TEAL} />
      <text x={160} y={90} textAnchor="middle" fontSize={11} fontWeight={700} fill={TEAL}>Summary A</text>
      {[0, 1, 2].map((l) => (
        <line key={l} x1={108} y1={102 + l * 12} x2={212 - l * 14} y2={102 + l * 12} stroke="rgba(79,209,197,0.4)" strokeWidth={1.5} />
      ))}
      <rect x={255} y={70} width={130} height={80} rx={10} fill="rgba(255,255,255,0.04)" stroke={FAINT} />
      <text x={320} y={90} textAnchor="middle" fontSize={11} fontWeight={700} fill={DIM}>Summary B</text>
      {[0, 1, 2].map((l) => (
        <line key={l} x1={268} y1={102 + l * 12} x2={372 - l * 10} y2={102 + l * 12} stroke={FAINT} strokeWidth={1.5} />
      ))}
      {/* the pointing hand */}
      <motion.g
        animate={active ? { x: [0, 0, -160, -160, 0], opacity: [0, 1, 1, 1, 1] } : {}}
        transition={{ duration: 3.6, times: [0, 0.15, 0.45, 0.8, 1], repeat: Infinity }}
      >
        <text x={320} y={178} textAnchor="middle" fontSize={22}>👆</text>
      </motion.g>
      {/* checkmark lands on A */}
      <motion.text
        x={160}
        y={66}
        textAnchor="middle"
        fontSize={15}
        fill={TEAL}
        animate={active ? { opacity: [0, 0, 1, 1, 0] } : {}}
        transition={{ duration: 3.6, times: [0, 0.45, 0.55, 0.8, 1], repeat: Infinity }}
      >
        ✓ better!
      </motion.text>
      <motion.text
        x={240}
        y={215}
        textAnchor="middle"
        fontSize={11.5}
        fontFamily="monospace"
        fill={AMBER}
        animate={active ? { opacity: [0.6, 1, 0.6] } : {}}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        × 64,000 human choices
      </motion.text>
      <text x={240} y={45} textAnchor="middle" fontSize={11} fill={FAINT}>
        don&apos;t ask for scores — ask “which is better?” (people agree on that)
      </text>
    </SceneFrame>
  );
}

/* Scene 3 — train a robot judge */
function RobotJudge({ active }: { active: boolean }) {
  return (
    <SceneFrame>
      {/* human choices flowing into the judge */}
      {[0, 1, 2].map((i) => (
        <motion.g
          key={i}
          initial={{ x: 60, opacity: 0 }}
          animate={active ? { x: [60, 150], opacity: [0, 1, 0] } : {}}
          transition={{ duration: 1.6, delay: i * 0.6, repeat: Infinity, repeatDelay: 1 }}
        >
          <rect y={100 + i * 22} width={44} height={16} rx={8} fill="rgba(240,184,102,0.12)" stroke={AMBER} />
          <text x={22} y={111 + i * 22} textAnchor="middle" fontSize={8} fill={AMBER}>A &gt; B</text>
        </motion.g>
      ))}
      {/* the judge */}
      <rect x={205} y={85} width={90} height={70} rx={12} fill="rgba(240,184,102,0.08)" stroke={AMBER} strokeWidth={1.5} />
      <circle cx={238} cy={110} r={4} fill={AMBER} />
      <circle cx={262} cy={110} r={4} fill={AMBER} />
      <path d="M 236 130 Q 250 138 264 130" fill="none" stroke={AMBER} strokeWidth={2} />
      <text x={250} y={172} textAnchor="middle" fontSize={9.5} fill={DIM}>the robot judge</text>
      {/* it scores new summaries */}
      {[
        { y: 88, score: "+2.6", good: true },
        { y: 122, score: "+0.3", good: false },
      ].map((s, i) => (
        <motion.g key={i} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 1.2 + i * 0.5 }}>
          <rect x={330} y={s.y} width={62} height={24} rx={6} fill="rgba(255,255,255,0.04)" stroke={FAINT} />
          <line x1={338} y1={s.y + 9} x2={382} y2={s.y + 9} stroke={FAINT} strokeWidth={1.2} />
          <line x1={338} y1={s.y + 16} x2={372} y2={s.y + 16} stroke={FAINT} strokeWidth={1.2} />
          <motion.text
            x={422}
            y={s.y + 17}
            textAnchor="middle"
            fontSize={12}
            fontWeight={700}
            fontFamily="monospace"
            fill={s.good ? TEAL : DIM}
            animate={active ? { opacity: [0.5, 1, 0.5] } : {}}
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.4 }}
          >
            {s.score}
          </motion.text>
        </motion.g>
      ))}
      <text x={240} y={215} textAnchor="middle" fontSize={11} fill={FAINT}>
        it studies the human choices until it can predict them — a tireless copy of human taste
      </text>
    </SceneFrame>
  );
}

/* Scene 4 — practice on a leash */
function OnALeash({ active }: { active: boolean }) {
  return (
    <SceneFrame>
      {/* writer */}
      <rect x={95} y={95} width={80} height={60} rx={12} fill="rgba(96,165,250,0.08)" stroke={BLUE} strokeWidth={1.5} />
      <text x={135} y={130} textAnchor="middle" fontSize={10} fill={BLUE}>writer</text>
      {/* judge */}
      <rect x={305} y={95} width={80} height={60} rx={12} fill="rgba(240,184,102,0.08)" stroke={AMBER} strokeWidth={1.5} />
      <text x={345} y={130} textAnchor="middle" fontSize={10} fill={AMBER}>judge</text>
      {/* practice loop */}
      <motion.path d="M 180 105 Q 240 75 300 105" fill="none" stroke={BLUE} strokeWidth={2} markerEnd="url(#rl1)" initial={{ pathLength: 0 }} animate={active ? { pathLength: [0, 1] } : {}} transition={{ duration: 1, repeat: Infinity, repeatDelay: 1.1 }} />
      <motion.path d="M 300 145 Q 240 175 180 145" fill="none" stroke={AMBER} strokeWidth={2} markerEnd="url(#rl2)" initial={{ pathLength: 0 }} animate={active ? { pathLength: [0, 1] } : {}} transition={{ duration: 1, delay: 1.05, repeat: Infinity, repeatDelay: 1.1 }} />
      <defs>
        <marker id="rl1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke={BLUE} strokeWidth="1.4" /></marker>
        <marker id="rl2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke={AMBER} strokeWidth="1.4" /></marker>
      </defs>
      <text x={240} y={70} textAnchor="middle" fontSize={9} fill={DIM}>“here&apos;s my summary”</text>
      <text x={240} y={186} textAnchor="middle" fontSize={9} fill={DIM}>“score: +2.1 — a bit better!”</text>
      {/* the leash */}
      <motion.path
        d="M 135 158 Q 120 195 92 205"
        fill="none"
        stroke={TEAL}
        strokeWidth={2.5}
        strokeDasharray="1 0"
        animate={active ? { d: ["M 135 158 Q 120 195 92 205", "M 135 158 Q 128 192 92 205", "M 135 158 Q 120 195 92 205"] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <rect x={72} y={200} width={40} height={16} rx={4} fill="rgba(79,209,197,0.1)" stroke={TEAL} />
      <text x={92} y={211} textAnchor="middle" fontSize={7.5} fill={TEAL}>stay normal!</text>
      <motion.text x={240} y={222} textAnchor="middle" fontSize={11} fill={FAINT} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 1.4 }}>
        a million practice rounds — but the leash stops it drifting into weird text
      </motion.text>
      <text x={240} y={40} textAnchor="middle" fontSize={11} fill={FAINT}>
        no humans needed anymore — the judge grades every attempt instantly
      </text>
    </SceneFrame>
  );
}

/* Scene 5 — cut the leash: cheating! */
function CutTheLeash({ active }: { active: boolean }) {
  return (
    <SceneFrame>
      {/* the hacked output */}
      <motion.g initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 0.3 }}>
        <rect x={90} y={70} width={170} height={54} rx={9} fill="rgba(242,125,152,0.07)" stroke={ROSE} strokeWidth={1.5} />
        <text x={175} y={92} textAnchor="middle" fontSize={9.5} fontFamily="monospace" fill={ROSE}>
          “GREAT SUMMARY 10/10
        </text>
        <text x={175} y={107} textAnchor="middle" fontSize={9.5} fontFamily="monospace" fill={ROSE}>
          reward reward reward”
        </text>
      </motion.g>
      {/* fooled judge gives huge score */}
      <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={active ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 1, type: "spring" }}>
        <circle cx={320} cy={97} r={22} fill="rgba(240,184,102,0.1)" stroke={AMBER} strokeWidth={1.5} />
        <text x={320} y={92} textAnchor="middle" fontSize={9} fill={AMBER}>judge:</text>
        <text x={320} y={106} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily="monospace" fill={AMBER}>+6.5?!</text>
      </motion.g>
      <motion.text x={390} y={101} textAnchor="middle" fontSize={16} initial={{ opacity: 0 }} animate={active ? { opacity: [0, 1, 0.4, 1] } : {}} transition={{ delay: 1.5, duration: 1.5 }}>
        🤦
      </motion.text>
      <motion.text x={240} y={145} textAnchor="middle" fontSize={11} fill={ROSE} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 1.9 }}>
        with no leash, the writer learns to CHEAT the judge — gibberish that scores high
      </motion.text>
      {/* the fix + legacy */}
      <motion.g initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 2.6 }}>
        <rect x={110} y={168} width={260} height={30} rx={15} fill="rgba(79,209,197,0.08)" stroke={TEAL} />
        <text x={240} y={188} textAnchor="middle" fontSize={10.5} fill={TEAL}>
          leash on + judge from human taste = summaries people preferred 70% of the time
        </text>
      </motion.g>
      <motion.text x={240} y={222} textAnchor="middle" fontSize={10.5} fill={DIM} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 3.1 }}>
        two years later, this exact recipe trained ChatGPT. Try the leash yourself in the lab below.
      </motion.text>
    </SceneFrame>
  );
}

export const rlhfStory: StoryScene[] = [
  {
    id: "meh",
    caption: "AI could write fluently — but nobody had told it what GOOD means.",
    sub: "Copying example summaries has a ceiling, and 'good' has no formula. What we really want: outputs humans prefer.",
    Art: WritesButMeh,
  },
  {
    id: "a-or-b",
    caption: "Step 1: show people two summaries and ask — which is better?",
    sub: "Not scores (everyone's 7/10 is different) — just A or B. Tens of thousands of times.",
    Art: PickAorB,
  },
  {
    id: "judge",
    caption: "Step 2: train a robot judge to predict those human choices.",
    sub: "Now human taste is bottled: a tireless critic that can grade a million summaries a day.",
    Art: RobotJudge,
  },
  {
    id: "leash",
    caption: "Step 3: the writer practices against the judge — on a leash.",
    sub: "Chase high scores, but pay a penalty for drifting into weird text. That leash is the famous 'KL penalty'.",
    Art: OnALeash,
  },
  {
    id: "cheat",
    caption: "Cut the leash and the writer CHEATS — gibberish the judge mistakenly loves.",
    sub: "That's 'reward hacking', measured in this paper. Leash on: summaries beat the humans' own 70% of the time — and this recipe became ChatGPT.",
    Art: CutTheLeash,
  },
];
