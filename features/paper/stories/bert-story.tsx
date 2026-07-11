"use client";

import { motion } from "framer-motion";
import {
  SceneFrame,
  INK,
  DIM,
  FAINT,
  TEAL,
  AMBER,
  BLUE,
  type StoryScene,
} from "../visual-story";

const SENT = ["She", "played", "the", "____", "on", "stage", "last", "night"];
const sx = (i: number) => 68 + i * 50;

function SentenceRow({ mask = 3, covered = -1 }: { mask?: number; covered?: number }) {
  return (
    <g>
      {SENT.map((w, i) => (
        <g key={i} opacity={covered >= 0 && i > covered ? 0.15 : 1}>
          <rect
            x={sx(i) - 22}
            y={110}
            width={44}
            height={28}
            rx={7}
            fill={i === mask ? "rgba(240,184,102,0.14)" : "rgba(255,255,255,0.05)"}
            stroke={i === mask ? AMBER : FAINT}
            strokeWidth={i === mask ? 2 : 1}
          />
          <text x={sx(i)} y={129} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={i === mask ? AMBER : DIM}>
            {covered >= 0 && i > covered ? "▓▓" : w}
          </text>
        </g>
      ))}
    </g>
  );
}

/* Scene 1 — the game: fill in the blank */
function FillTheBlank({ active }: { active: boolean }) {
  return (
    <SceneFrame>
      <SentenceRow />
      {/* pencil hovering over the blank */}
      <motion.g animate={active ? { y: [0, -6, 0], rotate: [-8, 4, -8] } : {}} transition={{ duration: 2, repeat: Infinity }} style={{ transformOrigin: `${sx(3)}px 85px` }}>
        <path d={`M ${sx(3) - 4} 92 L ${sx(3) + 14} 62 L ${sx(3) + 20} 66 L ${sx(3) + 2} 96 Z`} fill="rgba(240,184,102,0.15)" stroke={AMBER} strokeWidth={1.5} />
        <path d={`M ${sx(3) - 4} 92 L ${sx(3) - 8} 102 L ${sx(3) + 2} 96 Z`} fill={AMBER} />
      </motion.g>
      <motion.text
        x={240}
        y={190}
        textAnchor="middle"
        fontSize={12}
        fill={DIM}
        animate={active ? { opacity: [0.5, 1, 0.5] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        what goes in the blank?
      </motion.text>
      <text x={240} y={215} textAnchor="middle" fontSize={10.5} fill={FAINT}>
        this simple game is how BERT learns language — billions of times over
      </text>
    </SceneFrame>
  );
}

/* Scene 2 — one-eyed reading: left only */
function OneEye({ active }: { active: boolean }) {
  const guesses = [
    { w: "game", p: "24%" },
    { w: "piano", p: "22%" },
    { w: "role", p: "20%" },
  ];
  return (
    <SceneFrame>
      <SentenceRow covered={3} />
      {/* sliding cover panel */}
      <motion.rect
        x={sx(4) - 26}
        y={104}
        width={sx(7) - sx(4) + 52}
        height={40}
        rx={8}
        fill="rgba(242,125,152,0.08)"
        stroke="rgba(242,125,152,0.5)"
        strokeDasharray="6 4"
        animate={active ? { opacity: [0.6, 1, 0.6] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <text x={(sx(4) + sx(7)) / 2} y={98} textAnchor="middle" fontSize={9.5} fill="rgba(242,125,152,0.8)">
        can&apos;t see this side!
      </text>
      {/* uncertain guesses */}
      {guesses.map((g, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={active ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.6 + i * 0.35 }}>
          <rect x={132 + i * 78} y={172} width={68} height={24} rx={12} fill="rgba(255,255,255,0.05)" stroke={FAINT} />
          <text x={166 + i * 78} y={188} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={DIM}>
            {g.w} {g.p}
          </text>
        </motion.g>
      ))}
      <motion.text x={240} y={222} textAnchor="middle" fontSize={11} fill={DIM} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 1.8 }}>
        reading only the left side, it&apos;s a coin toss — “played the ____” could be anything
      </motion.text>
      <text x={240} y={50} textAnchor="middle" fontSize={11} fill={FAINT}>
        GPT-style models read one way: left → right
      </text>
    </SceneFrame>
  );
}

/* Scene 3 — both eyes open: the clue was on the right */
function BothEyes({ active }: { active: boolean }) {
  return (
    <SceneFrame>
      <SentenceRow />
      {/* glow on the right-side clue */}
      <motion.rect
        x={sx(4) - 26}
        y={104}
        width={sx(5) - sx(4) + 52}
        height={40}
        rx={8}
        fill="rgba(79,209,197,0.1)"
        stroke={TEAL}
        strokeWidth={1.5}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: [0, 1, 0.6, 1] } : {}}
        transition={{ delay: 0.5, duration: 2, repeat: Infinity }}
      />
      <motion.text x={(sx(4) + sx(5)) / 2} y={98} textAnchor="middle" fontSize={9.5} fill={TEAL} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 0.8 }}>
        the giveaway!
      </motion.text>
      {/* arrows from both sides into the blank */}
      <motion.path d={`M ${sx(1)} 150 Q ${sx(2)} 172 ${sx(3) - 6} 150`} fill="none" stroke={BLUE} strokeWidth={2} markerEnd="url(#be1)" initial={{ pathLength: 0 }} animate={active ? { pathLength: 1 } : {}} transition={{ delay: 1.2, duration: 0.7, repeat: Infinity, repeatDelay: 2.6 }} />
      <motion.path d={`M ${sx(5)} 150 Q ${sx(4)} 172 ${sx(3) + 6} 150`} fill="none" stroke={TEAL} strokeWidth={2.5} markerEnd="url(#be2)" initial={{ pathLength: 0 }} animate={active ? { pathLength: 1 } : {}} transition={{ delay: 1.5, duration: 0.7, repeat: Infinity, repeatDelay: 2.6 }} />
      <defs>
        <marker id="be1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke={BLUE} strokeWidth="1.4" /></marker>
        <marker id="be2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke={TEAL} strokeWidth="1.4" /></marker>
      </defs>
      {/* confident answer */}
      <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={active ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 2.2, type: "spring", stiffness: 170 }}>
        <rect x={187} y={176} width={106} height={28} rx={14} fill="rgba(79,209,197,0.12)" stroke={TEAL} strokeWidth={2} />
        <text x={240} y={195} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily="monospace" fill={TEAL}>
          guitar — 78%
        </text>
      </motion.g>
      <text x={240} y={228} textAnchor="middle" fontSize={10.5} fill={FAINT}>
        “on stage” sits AFTER the blank — only a both-ways reader can use it
      </text>
      <text x={240} y={50} textAnchor="middle" fontSize={11} fill={FAINT}>
        BERT reads the whole sentence at once — both directions
      </text>
    </SceneFrame>
  );
}

/* Scene 4 — free practice on billions of words */
function FreePractice({ active }: { active: boolean }) {
  const lines = Array.from({ length: 5 }, (_, i) => i);
  return (
    <SceneFrame>
      {/* books + wiki */}
      <motion.g initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}>
        <rect x={70} y={80} width={16} height={54} rx={2} fill="rgba(96,165,250,0.15)" stroke={BLUE} />
        <rect x={90} y={74} width={16} height={60} rx={2} fill="rgba(96,165,250,0.1)" stroke={BLUE} />
        <rect x={110} y={84} width={16} height={50} rx={2} fill="rgba(96,165,250,0.15)" stroke={BLUE} />
        <text x={98} y={155} textAnchor="middle" fontSize={9} fill={DIM}>every book</text>
        <circle cx={98} cy={190} r={14} fill="none" stroke={BLUE} />
        <text x={98} y={195} textAnchor="middle" fontSize={10} fill={BLUE}>W</text>
        <text x={98} y={220} textAnchor="middle" fontSize={9} fill={DIM}>all of Wikipedia</text>
      </motion.g>
      {/* text lines with masks popping in */}
      {lines.map((l) => (
        <g key={l}>
          <rect x={170} y={78 + l * 26} width={250} height={12} rx={6} fill="rgba(255,255,255,0.05)" />
          <motion.rect
            x={200 + ((l * 73) % 160)}
            y={78 + l * 26}
            width={34}
            height={12}
            rx={6}
            fill="rgba(240,184,102,0.35)"
            initial={{ opacity: 0 }}
            animate={active ? { opacity: [0, 1, 1, 0] } : {}}
            transition={{ duration: 2.2, delay: l * 0.4, repeat: Infinity, repeatDelay: 1.2 }}
          />
        </g>
      ))}
      <motion.text
        x={295}
        y={222}
        textAnchor="middle"
        fontSize={12.5}
        fontFamily="monospace"
        fontWeight={700}
        fill={AMBER}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={{ delay: 1.4 }}
      >
        3,300,000,000 words of practice
      </motion.text>
      <text x={240} y={48} textAnchor="middle" fontSize={11} fill={FAINT}>
        hide 15% of the words — the hidden words ARE the answer key. No teachers needed.
      </text>
    </SceneFrame>
  );
}

/* Scene 5 — one brain, many jobs */
function ManyJobs({ active }: { active: boolean }) {
  const jobs = [
    { x: 110, y: 70, label: "answer questions" },
    { x: 370, y: 70, label: "rate reviews" },
    { x: 90, y: 175, label: "find names" },
    { x: 390, y: 175, label: "compare sentences" },
    { x: 240, y: 215, label: "Google Search (2019)" },
  ];
  return (
    <SceneFrame>
      {/* the brain */}
      <motion.g animate={active ? { scale: [1, 1.05, 1] } : {}} transition={{ duration: 2.4, repeat: Infinity }} style={{ transformOrigin: "240px 125px" }}>
        <circle cx={240} cy={125} r={36} fill="rgba(96,165,250,0.1)" stroke={BLUE} strokeWidth={2} />
        <path d="M 222 118 Q 232 106 242 118 Q 252 106 260 120 M 224 132 Q 240 144 256 132" fill="none" stroke={BLUE} strokeWidth={1.5} />
        <text x={240} y={172} textAnchor="middle" fontSize={10} fill={BLUE}>BERT — read everything once</text>
      </motion.g>
      {jobs.map((j, i) => (
        <motion.g key={i} initial={{ opacity: 0, scale: 0.7 }} animate={active ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.6 + i * 0.35, type: "spring", stiffness: 180 }}>
          <line
            x1={240 + (j.x - 240) * 0.28}
            y1={125 + (j.y - 125) * 0.4}
            x2={j.x}
            y2={j.y - (i === 4 ? 12 : 0)}
            stroke={FAINT}
            strokeWidth={1.2}
            strokeDasharray="3 3"
          />
          <rect x={j.x - 56} y={j.y - 12} width={112} height={22} rx={11} fill={i === 4 ? "rgba(79,209,197,0.12)" : "rgba(255,255,255,0.05)"} stroke={i === 4 ? TEAL : FAINT} />
          <text x={j.x} y={j.y + 3} textAnchor="middle" fontSize={9.5} fill={i === 4 ? TEAL : DIM}>
            {j.label}
          </text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 2.6 }}>
        <rect x={196} y={30} width={88} height={22} rx={11} fill="rgba(240,184,102,0.12)" stroke={AMBER} />
        <text x={240} y={45} textAnchor="middle" fontSize={10} fontWeight={700} fill={AMBER}>
          11 records broken
        </text>
      </motion.g>
    </SceneFrame>
  );
}

export const bertStory: StoryScene[] = [
  {
    id: "blank",
    caption: "BERT learns language the way you did: fill in the blank!",
    sub: "“She played the ____ on stage last night.” Easy for you. Now let's see why it was hard for computers.",
    Art: FillTheBlank,
  },
  {
    id: "one-eye",
    caption: "GPT-style models read with one eye — they only see the LEFT side of the blank.",
    sub: "“She played the ____” … could be a game, a piano, a role. Total coin toss.",
    Art: OneEye,
  },
  {
    id: "both-eyes",
    caption: "BERT reads with BOTH eyes — and the giveaway clue was after the blank all along!",
    sub: "“…on stage” makes it obvious: guitar. Reading both directions at once is BERT's whole superpower.",
    Art: BothEyes,
  },
  {
    id: "practice",
    caption: "It practiced on 3.3 BILLION words of free fill-in-the-blanks.",
    sub: "Hide 15% of the words in every book and all of Wikipedia — the hidden words are the answer key. No human labeling needed.",
    Art: FreePractice,
  },
  {
    id: "jobs",
    caption: "The result: one well-read brain that aced eleven different jobs.",
    sub: "Question answering, review rating, name finding… and by 2019 it was reading your Google searches. Play its game yourself in the lab below.",
    Art: ManyJobs,
  },
];
