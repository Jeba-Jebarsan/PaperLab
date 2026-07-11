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

function BirdArt({ x, y, s = 1, color = AMBER }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${s})`}>
      <path d="M -20 4 Q -8 -14 12 -6 Q 22 -10 26 -18 Q 22 -6 14 -2 Q 20 6 14 14" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <circle cx={13} cy={-6} r={2} fill={color} />
    </g>
  );
}

/* Scene 1 — the old way, one small window at a time */
function TheOldWay({ active }: { active: boolean }) {
  return (
    <SceneFrame>
      <rect x={90} y={60} width={150} height={130} rx={10} fill="rgba(240,184,102,0.04)" stroke={FAINT} />
      <BirdArt x={165} y={128} s={1.5} color="rgba(240,184,102,0.5)" />
      {active && (
        <motion.rect
          x={100}
          y={70}
          width={30}
          height={30}
          rx={4}
          fill="rgba(96,165,250,0.14)"
          stroke={BLUE}
          strokeWidth={2}
          animate={{
            x: [0, 55, 110, 0, 55, 110],
            y: [0, 0, 0, 40, 40, 40],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          style={{ filter: "drop-shadow(0 0 6px rgba(96,165,250,0.6))" }}
        />
      )}
      <text x={165} y={205} textAnchor="middle" fontSize={10} fill={DIM}>convolution: one small window</text>
      <motion.path
        d="M 118 85 Q 165 60 212 100"
        fill="none"
        stroke={ROSE}
        strokeWidth={1.5}
        strokeDasharray="4 4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={active ? { pathLength: 0, opacity: [0, 0.6, 0] } : {}}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      />
      <text x={310} y={125} textAnchor="middle" fontSize={10} fill={ROSE}>
        beak ↔ tail?
      </text>
      <text x={310} y={140} textAnchor="middle" fontSize={9} fill={FAINT}>
        needs MANY layers to connect
      </text>
      <text x={240} y={40} textAnchor="middle" fontSize={11} fill={FAINT}>
        every AI vision model since 2012 has seen photos this way
      </text>
    </SceneFrame>
  );
}

/* Scene 2 — cut the photo into "words" */
function CutIntoWords({ active }: { active: boolean }) {
  const cols = 4, rows = 3;
  return (
    <SceneFrame>
      <text x={135} y={55} textAnchor="middle" fontSize={10} fill={DIM}>one photo…</text>
      <rect x={90} y={65} width={120} height={90} rx={8} fill="rgba(240,184,102,0.04)" stroke={FAINT} />
      <BirdArt x={150} y={112} s={1} color="rgba(240,184,102,0.4)" />
      <motion.path d="M 222 108 L 260 108" stroke={DIM} strokeWidth={2} markerEnd="url(#vs1)" initial={{ pathLength: 0 }} animate={active ? { pathLength: 1 } : {}} transition={{ delay: 0.5, duration: 0.5 }} />
      <defs>
        <marker id="vs1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke={DIM} strokeWidth="1.4" /></marker>
      </defs>
      <text x={355} y={55} textAnchor="middle" fontSize={10} fill={TEAL}>…196 little “words”</text>
      {Array.from({ length: cols * rows }, (_, i) => {
        const c = i % cols, r = Math.floor(i / cols);
        return (
          <motion.rect
            key={i}
            x={278 + c * 22}
            y={70 + r * 26}
            width={19}
            height={23}
            rx={3}
            fill="rgba(79,209,197,0.1)"
            stroke={TEAL}
            strokeWidth={1}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={active ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.9 + i * 0.05 }}
          />
        );
      })}
      <motion.text
        x={240}
        y={205}
        textAnchor="middle"
        fontSize={11.5}
        fill={TEAL}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={{ delay: 2.2 }}
      >
        each 16×16 square = one “word” — just like a sentence
      </motion.text>
      <text x={240} y={225} textAnchor="middle" fontSize={9.5} fill={FAINT}>
        (224÷16 = 14, so 14×14 = 196 patches)
      </text>
    </SceneFrame>
  );
}

/* Scene 3 — feed the "words" to the same attention machine */
function SameMachine({ active }: { active: boolean }) {
  const cells = 8;
  const cx = (i: number) => 90 + i * 38;
  return (
    <SceneFrame>
      {Array.from({ length: cells }, (_, i) => (
        <rect key={i} x={cx(i) - 14} y={100} width={28} height={26} rx={5} fill="rgba(79,209,197,0.08)" stroke="rgba(79,209,197,0.5)" />
      ))}
      <text x={240} y={90} textAnchor="middle" fontSize={9.5} fill={DIM}>patch 1 … patch 196 (shortened here)</text>
      {/* long-range attention arcs, unlike CNN */}
      {[
        { a: 0, b: 7, h: -46 },
        { a: 1, b: 5, h: -30 },
        { a: 2, b: 6, h: -60 },
      ].map((arc, i) => (
        <motion.path
          key={i}
          d={`M ${cx(arc.a)} 98 Q ${(cx(arc.a) + cx(arc.b)) / 2} ${100 + arc.h} ${cx(arc.b)} 98`}
          fill="none"
          stroke={BLUE}
          strokeWidth={1.6}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={active ? { pathLength: 1, opacity: [0, 0.9, 0.4] } : {}}
          transition={{ duration: 1.2, delay: 0.4 + i * 0.3, repeat: Infinity, repeatType: "reverse", repeatDelay: 1 }}
        />
      ))}
      <motion.text
        x={240}
        y={45}
        textAnchor="middle"
        fontSize={11.5}
        fill={BLUE}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={{ delay: 1.6 }}
      >
        the FIRST patch can talk directly to the LAST — no waiting for layers
      </motion.text>
      <motion.text
        x={240}
        y={200}
        textAnchor="middle"
        fontSize={11}
        fill={DIM}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={{ delay: 2.2 }}
      >
        it&apos;s the exact same attention trick that reads sentences — now reading a picture
      </motion.text>
    </SceneFrame>
  );
}

/* Scene 4 — the honest catch: needs LOTS of photos */
function NeedsLotsOfPhotos({ active }: { active: boolean }) {
  return (
    <SceneFrame>
      <text x={140} y={55} textAnchor="middle" fontSize={10.5} fill={DIM}>small photo pile (1.3 million)</text>
      <rect x={90} y={65} width={100} height={70} rx={8} fill="rgba(242,125,152,0.06)" stroke={ROSE} />
      <text x={140} y={106} textAnchor="middle" fontSize={13} fill={ROSE}>😕</text>
      <motion.text x={140} y={155} textAnchor="middle" fontSize={11} fontWeight={700} fill={ROSE} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 0.4 }}>
        loses to CNNs
      </motion.text>

      <text x={355} y={55} textAnchor="middle" fontSize={10.5} fill={DIM}>huge photo pile (300 million)</text>
      <motion.g initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 1 }}>
        {Array.from({ length: 24 }, (_, i) => (
          <rect
            key={i}
            x={300 + (i % 6) * 11}
            y={64 + Math.floor(i / 6) * 11}
            width={9}
            height={9}
            rx={1.5}
            fill="rgba(79,209,197,0.15)"
            stroke="rgba(79,209,197,0.4)"
          />
        ))}
      </motion.g>
      <motion.text x={355} y={106} textAnchor="middle" fontSize={13} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 1.6 }}>
        😃
      </motion.text>
      <motion.text x={355} y={155} textAnchor="middle" fontSize={11} fontWeight={700} fill={TEAL} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 1.8 }}>
        beats CNNs!
      </motion.text>

      <motion.text
        x={240}
        y={195}
        textAnchor="middle"
        fontSize={11}
        fill={AMBER}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={{ delay: 2.4 }}
      >
        no built-in “nearby pixels matter” rule — it must LEARN that from data
      </motion.text>
      <text x={240} y={218} textAnchor="middle" fontSize={10} fill={FAINT}>
        the honest trade: attention needs more examples, but rewards you more for them
      </text>
    </SceneFrame>
  );
}

/* Scene 5 — the payoff: multimodal AI sees and reads at once */
function SeesAndReads({ active }: { active: boolean }) {
  return (
    <SceneFrame>
      <rect x={80} y={70} width={110} height={80} rx={10} fill="rgba(240,184,102,0.05)" stroke={AMBER} />
      <BirdArt x={135} y={112} s={1} />
      <motion.path d="M 195 108 L 225 108" stroke={DIM} strokeWidth={2} markerEnd="url(#vs2)" initial={{ pathLength: 0 }} animate={active ? { pathLength: 1 } : {}} transition={{ delay: 0.4, duration: 0.5 }} />
      <defs>
        <marker id="vs2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke={DIM} strokeWidth="1.4" /></marker>
      </defs>
      {/* one shared transformer box taking both patches + text */}
      <motion.g initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 0.8 }}>
        <rect x={232} y={62} width={100} height={96} rx={12} fill="rgba(96,165,250,0.08)" stroke={BLUE} strokeWidth={1.5} />
        <text x={282} y={90} textAnchor="middle" fontSize={9.5} fill={BLUE}>ONE Transformer</text>
        <text x={282} y={106} textAnchor="middle" fontSize={8.5} fill={DIM}>image patches</text>
        <text x={282} y={120} textAnchor="middle" fontSize={8.5} fill={DIM}>+ words, together</text>
      </motion.g>
      <motion.path d="M 338 108 L 366 108" stroke={DIM} strokeWidth={2} markerEnd="url(#vs2)" initial={{ pathLength: 0 }} animate={active ? { pathLength: 1 } : {}} transition={{ delay: 1.4, duration: 0.5 }} />
      <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={active ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 1.9, type: "spring" }}>
        <rect x={372} y={78} width={68} height={62} rx={12} fill="rgba(79,209,197,0.1)" stroke={TEAL} />
        <text x={406} y={102} textAnchor="middle" fontSize={9} fill={TEAL}>“that's a</text>
        <text x={406} y={115} textAnchor="middle" fontSize={9} fill={TEAL}>swallow!”</text>
      </motion.g>
      <motion.text
        x={240}
        y={185}
        textAnchor="middle"
        fontSize={11}
        fill={DIM}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={{ delay: 2.6 }}
      >
        CLIP, GPT-4V, Gemini — AI that looks at a picture and answers in words
      </motion.text>
      <text x={240} y={215} textAnchor="middle" fontSize={10} fill={FAINT}>
        possible because a photo and a sentence now speak the same language: attention
      </text>
      <text x={240} y={40} textAnchor="middle" fontSize={11} fill={FAINT}>
        turning pictures into “words” meant one brain could finally hold both
      </text>
    </SceneFrame>
  );
}

export const vitStory: StoryScene[] = [
  {
    id: "old-way",
    caption: "For 8 years, every vision AI saw the world through a tiny sliding window.",
    sub: "Convolution connects far-apart parts of a photo only slowly, layer after layer — like reading with a magnifying glass held very close.",
    Art: TheOldWay,
  },
  {
    id: "words",
    caption: "In 2020: what if we cut the photo into squares and called them 'words'?",
    sub: "16×16 pixels per square, 196 squares per photo — a picture turned into a sentence.",
    Art: CutIntoWords,
  },
  {
    id: "machine",
    caption: "Then feed those 'words' into the exact same attention machine that reads sentences.",
    sub: "Any patch can now talk directly to any other patch — the first patch and the last, in a single step. No CNN can do that in one layer.",
    Art: SameMachine,
  },
  {
    id: "catch",
    caption: "The honest catch: without convolution's built-in rules, it needs A LOT more photos to learn.",
    sub: "On 1.3 million photos it loses to CNNs. On 300 million, it wins — because now it has learned spatial structure itself, from data.",
    Art: NeedsLotsOfPhotos,
  },
  {
    id: "payoff",
    caption: "The payoff: pictures and sentences finally speak the same language.",
    sub: "That's the visual half of CLIP, GPT-4V, and Gemini — AI that can look at a photo and answer in words. Play with it in the Attention Lab below.",
    Art: SeesAndReads,
  },
];
