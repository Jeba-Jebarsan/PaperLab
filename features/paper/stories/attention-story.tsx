"use client";

import { motion } from "framer-motion";
import {
  SceneFrame,
  STORY_W,
  INK,
  DIM,
  FAINT,
  TEAL,
  AMBER,
  BLUE,
  ROSE,
  type StoryScene,
} from "../visual-story";

const WORDS = ["The", "cat", "sat", "on", "the", "mat"];
const wordX = (i: number) => 70 + i * 70;

/* Scene 1 — reading one word at a time */
function OldWay({ active }: { active: boolean }) {
  return (
    <SceneFrame>
      {WORDS.map((w, i) => (
        <g key={i}>
          <rect x={wordX(i) - 26} y={110} width={52} height={30} rx={8} fill="rgba(255,255,255,0.05)" stroke={FAINT} />
          <text x={wordX(i)} y={130} textAnchor="middle" fontSize={13} fontFamily="monospace" fill={DIM}>
            {w}
          </text>
        </g>
      ))}
      {/* the reading head hopping word to word */}
      {active && (
        <motion.rect
          x={wordX(0) - 28}
          y={106}
          width={56}
          height={38}
          rx={10}
          fill="none"
          stroke={BLUE}
          strokeWidth={2.5}
          animate={{ x: WORDS.map((_, i) => wordX(i) - wordX(0)) }}
          transition={{ duration: 4.5, times: WORDS.map((_, i) => i / (WORDS.length - 1)), repeat: Infinity, repeatDelay: 0.8 }}
          style={{ filter: "drop-shadow(0 0 8px rgba(96,165,250,0.7))" }}
        />
      )}
      <text x={STORY_W / 2} y={60} textAnchor="middle" fontSize={12} fill={DIM}>
        one… word… at… a… time…
      </text>
      <motion.text
        x={STORY_W / 2}
        y={190}
        textAnchor="middle"
        fontSize={11}
        fill={FAINT}
        animate={active ? { opacity: [0, 1, 0] } : {}}
        transition={{ duration: 4.5, repeat: Infinity, repeatDelay: 0.8 }}
      >
        (and everything already read starts to fade…)
      </motion.text>
    </SceneFrame>
  );
}

/* Scene 2 — the whisper game: the message degrades */
function WhisperGame({ active }: { active: boolean }) {
  const kids = [90, 170, 250, 330, 410];
  const messages = ["“The cat sat on the mat”", "“The cat sat on…”", "“The cat s…”", "“The c…?”", "“…???”"];
  return (
    <SceneFrame>
      {kids.map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={150} r={17} fill={i === kids.length - 1 ? "rgba(242,125,152,0.18)" : "rgba(255,255,255,0.06)"} stroke={i === kids.length - 1 ? ROSE : FAINT} />
          <circle cx={x - 6} cy={146} r={2} fill={DIM} />
          <circle cx={x + 6} cy={146} r={2} fill={DIM} />
          <path d={i === kids.length - 1 ? `M ${x - 6} 158 Q ${x} 153 ${x + 6} 158` : `M ${x - 6} 156 Q ${x} 161 ${x + 6} 156`} stroke={DIM} strokeWidth={1.5} fill="none" />
          {i < kids.length - 1 && (
            <motion.path
              d={`M ${x + 22} 150 L ${kids[i + 1] - 22} 150`}
              stroke={FAINT}
              strokeWidth={1.5}
              markerEnd="url(#arrow-w)"
              animate={active ? { opacity: [0.2, 1, 0.2] } : {}}
              transition={{ duration: 1.2, delay: i * 1.1, repeat: Infinity, repeatDelay: (kids.length - 1) * 1.1 - 1.2 }}
            />
          )}
        </g>
      ))}
      <defs>
        <marker id="arrow-w" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="none" stroke={DIM} strokeWidth="1.2" />
        </marker>
      </defs>
      {/* degrading message bubble above each kid, in sequence */}
      {active &&
        messages.map((m, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.6, delay: i * 1.1, repeat: Infinity, repeatDelay: messages.length * 1.1 - 1.6 }}
          >
            <rect x={kids[i] - 58} y={82} width={116} height={26} rx={13} fill="rgba(255,255,255,0.07)" stroke={i >= 3 ? ROSE : FAINT} />
            <text x={kids[i]} y={99} textAnchor="middle" fontSize={10.5} fontFamily="monospace" fill={i >= 3 ? ROSE : INK}>
              {m}
            </text>
          </motion.g>
        ))}
      <text x={STORY_W / 2} y={210} textAnchor="middle" fontSize={11} fill={FAINT}>
        by the end of a long sentence, the beginning is gone
      </text>
    </SceneFrame>
  );
}

/* Scene 3 — everyone listens to everyone, at once */
function AllAtOnce({ active }: { active: boolean }) {
  return (
    <SceneFrame>
      {WORDS.map((w, i) => (
        <g key={i}>
          <rect x={wordX(i) - 26} y={110} width={52} height={30} rx={8} fill="rgba(79,209,197,0.08)" stroke="rgba(79,209,197,0.4)" />
          <text x={wordX(i)} y={130} textAnchor="middle" fontSize={13} fontFamily="monospace" fill={INK}>
            {w}
          </text>
        </g>
      ))}
      {/* every pair connected, pulsing together */}
      {WORDS.map((_, i) =>
        WORDS.map((_, j) => {
          if (j <= i) return null;
          const midY = 110 - Math.abs(i - j) * 14 - 8;
          return (
            <motion.path
              key={`${i}-${j}`}
              d={`M ${wordX(i)} 108 Q ${(wordX(i) + wordX(j)) / 2} ${midY} ${wordX(j)} 108`}
              fill="none"
              stroke={TEAL}
              strokeWidth={1.3}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={active ? { pathLength: 1, opacity: [0, 0.7, 0.35] } : {}}
              transition={{ duration: 1.4, delay: (i + j) * 0.12, repeat: Infinity, repeatType: "reverse", repeatDelay: 1.2 }}
            />
          );
        })
      )}
      <motion.text
        x={STORY_W / 2}
        y={200}
        textAnchor="middle"
        fontSize={12}
        fill={TEAL}
        animate={active ? { opacity: [0.4, 1, 0.4] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        all connections happen at the same instant — nothing is forgotten
      </motion.text>
    </SceneFrame>
  );
}

/* Scene 4 — a word asks a question; the best answer glows */
function QuestionAnswer({ active }: { active: boolean }) {
  const words = ["The", "animal", "was", "tired", "…", "it"];
  const wx = (i: number) => 65 + i * 72;
  const itX = wx(5);
  const targets = [
    { i: 1, w: 0.87, label: "87%" },
    { i: 3, w: 0.09, label: "9%" },
    { i: 0, w: 0.04, label: "4%" },
  ];
  return (
    <SceneFrame>
      {words.map((w, i) => (
        <g key={i}>
          <rect
            x={wx(i) - 28}
            y={130}
            width={56}
            height={30}
            rx={8}
            fill={i === 5 ? "rgba(96,165,250,0.15)" : i === 1 ? "rgba(79,209,197,0.12)" : "rgba(255,255,255,0.05)"}
            stroke={i === 5 ? BLUE : i === 1 ? TEAL : FAINT}
            strokeWidth={i === 5 || i === 1 ? 2 : 1}
          />
          <text x={wx(i)} y={150} textAnchor="middle" fontSize={13} fontFamily="monospace" fill={i === 5 ? BLUE : i === 1 ? TEAL : DIM}>
            {w}
          </text>
        </g>
      ))}
      {/* the question bubble */}
      <motion.g animate={active ? { y: [0, -4, 0] } : {}} transition={{ duration: 2, repeat: Infinity }}>
        <rect x={itX - 52} y={82} width={104} height={26} rx={13} fill="rgba(96,165,250,0.12)" stroke={BLUE} />
        <text x={itX} y={99} textAnchor="middle" fontSize={11} fill={BLUE}>
          “who am I?”
        </text>
      </motion.g>
      {/* answer connections with weights */}
      {targets.map((t, k) => (
        <g key={k}>
          <motion.path
            d={`M ${itX} 162 Q ${(itX + wx(t.i)) / 2} ${205 + k * 8} ${wx(t.i)} 162`}
            fill="none"
            stroke={t.i === 1 ? TEAL : FAINT}
            strokeWidth={Math.max(1, t.w * 8)}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={active ? { pathLength: 1, opacity: [0, 1] } : {}}
            transition={{ duration: 0.9, delay: 0.4 + k * 0.35, repeat: Infinity, repeatDelay: 3.4 }}
          />
          <motion.text
            x={(itX + wx(t.i)) / 2}
            y={216 + k * 8}
            textAnchor="middle"
            fontSize={10}
            fontFamily="monospace"
            fill={t.i === 1 ? TEAL : FAINT}
            initial={{ opacity: 0 }}
            animate={active ? { opacity: [0, 1, 1, 0] } : {}}
            transition={{ duration: 3.6, delay: 0.7 + k * 0.35, repeat: Infinity, repeatDelay: 0.7 }}
          >
            {t.label}
          </motion.text>
        </g>
      ))}
      <text x={STORY_W / 2} y={45} textAnchor="middle" fontSize={11} fill={FAINT}>
        “it” compares its question with every word&apos;s name-tag — “animal” matches best
      </text>
    </SceneFrame>
  );
}

/* Scene 5 — stack layers, get ChatGPT */
function BecomesGpt({ active }: { active: boolean }) {
  const layers = [0, 1, 2, 3, 4];
  return (
    <SceneFrame>
      {layers.map((l) => (
        <motion.g
          key={l}
          initial={{ opacity: 0, y: 18 }}
          animate={active ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.35 * l, duration: 0.5 }}
        >
          <rect x={150} y={196 - l * 32} width={120} height={26} rx={7} fill={`rgba(96,165,250,${0.08 + l * 0.04})`} stroke="rgba(96,165,250,0.45)" />
          <text x={210} y={213 - l * 32} textAnchor="middle" fontSize={9.5} fontFamily="monospace" fill={DIM}>
            attention layer {l + 1}
          </text>
        </motion.g>
      ))}
      <motion.text
        x={210}
        y={40}
        textAnchor="middle"
        fontSize={11}
        fill={FAINT}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={{ delay: 2 }}
      >
        … stack ~100 of these …
      </motion.text>
      {/* chat bubble reply */}
      <motion.g
        initial={{ opacity: 0, scale: 0.7 }}
        animate={active ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 2.4, type: "spring", stiffness: 180 }}
      >
        <rect x={310} y={95} width={130} height={64} rx={14} fill="rgba(79,209,197,0.1)" stroke={TEAL} />
        <path d="M 318 152 L 306 168 L 330 156 Z" fill="rgba(79,209,197,0.1)" stroke={TEAL} />
        <text x={375} y={120} textAnchor="middle" fontSize={11} fill={TEAL}>
          “Hello! How can
        </text>
        <text x={375} y={136} textAnchor="middle" fontSize={11} fill={TEAL}>
          I help today?”
        </text>
      </motion.g>
      <motion.text
        x={375}
        y={185}
        textAnchor="middle"
        fontSize={10.5}
        fill={AMBER}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: [0, 1] } : {}}
        transition={{ delay: 3 }}
      >
        ChatGPT · Claude · Gemini
      </motion.text>
      <motion.path
        d="M 275 170 Q 300 140 315 130"
        fill="none"
        stroke={FAINT}
        strokeWidth={1.5}
        strokeDasharray="4 4"
        initial={{ pathLength: 0 }}
        animate={active ? { pathLength: 1 } : {}}
        transition={{ delay: 2.2, duration: 0.6 }}
      />
    </SceneFrame>
  );
}

export const attentionStory: StoryScene[] = [
  {
    id: "old-way",
    caption: "Before 2017, computers read like this: one word at a time.",
    sub: "Slow — and each new word pushed the old ones further out of memory.",
    Art: OldWay,
  },
  {
    id: "whisper",
    caption: "Long sentences turned into a broken whisper game.",
    sub: "By word 50, the message from word 1 was garbled or gone. Computers kept forgetting the start of the sentence.",
    Art: WhisperGame,
  },
  {
    id: "all-at-once",
    caption: "The big idea: let EVERY word look at EVERY word — all at once.",
    sub: "No more passing messages down a line. That is “attention”, and this paper said it's ALL you need.",
    Art: AllAtOnce,
  },
  {
    id: "question",
    caption: "Each word asks a question, and the best-matching words answer loudest.",
    sub: "“it” asks “who am I?” — “animal” matches at 87%. The math (Q·K softmax) is just this matching game, scored.",
    Art: QuestionAnswer,
  },
  {
    id: "gpt",
    caption: "Stack that trick in layers — and you get ChatGPT.",
    sub: "GPT, Claude and Gemini are towers of this one 2017 idea. Now scroll down and play with it yourself.",
    Art: BecomesGpt,
  },
];
