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

/* a tiny dog head made of simple shapes, reused across scenes */
function DogHead({ x, y, s = 1, color = AMBER }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${s})`}>
      <circle r={18} fill="none" stroke={color} strokeWidth={2} />
      <path d="M -16 -10 L -22 -24 L -6 -16 Z" fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" />
      <path d="M 16 -10 L 22 -24 L 6 -16 Z" fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" />
      <circle cx={-6} cy={-3} r={2} fill={color} />
      <circle cx={6} cy={-3} r={2} fill={color} />
      <circle cx={0} cy={6} r={2.5} fill={color} />
    </g>
  );
}

/* Scene 1 — a photo is just numbers */
function JustNumbers({ active }: { active: boolean }) {
  const nums = ["0.2", "0.9", "0.1", "0.8", "0.4", "0.7", "0.3", "0.6", "0.9", "0.1", "0.5", "0.8"];
  return (
    <SceneFrame>
      <rect x={70} y={70} width={110} height={110} rx={10} fill="rgba(240,184,102,0.05)" stroke={AMBER} />
      <DogHead x={125} y={128} s={1.4} />
      <text x={125} y={205} textAnchor="middle" fontSize={10} fill={DIM}>what YOU see</text>

      <motion.path d="M 200 125 L 250 125" stroke={DIM} strokeWidth={2} markerEnd="url(#an1)" initial={{ pathLength: 0 }} animate={active ? { pathLength: 1 } : {}} transition={{ delay: 0.6, duration: 0.6 }} />
      <defs>
        <marker id="an1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke={DIM} strokeWidth="1.4" /></marker>
      </defs>

      <rect x={270} y={70} width={140} height={110} rx={10} fill="rgba(96,165,250,0.05)" stroke={BLUE} />
      {nums.map((n, i) => (
        <motion.text
          key={i}
          x={293 + (i % 4) * 32}
          y={95 + Math.floor(i / 4) * 32}
          textAnchor="middle"
          fontSize={11}
          fontFamily="monospace"
          fill={BLUE}
          initial={{ opacity: 0 }}
          animate={active ? { opacity: [0, 1] } : {}}
          transition={{ delay: 0.9 + i * 0.08 }}
        >
          {n}
        </motion.text>
      ))}
      <text x={340} y={205} textAnchor="middle" fontSize={10} fill={DIM}>what the COMPUTER sees</text>
      <text x={240} y={40} textAnchor="middle" fontSize={11} fill={FAINT}>
        a photo is only a grid of brightness numbers — millions of them
      </text>
    </SceneFrame>
  );
}

/* Scene 2 — a stencil slides and finds edges */
function StencilSlides({ active }: { active: boolean }) {
  return (
    <SceneFrame>
      <rect x={90} y={60} width={150} height={130} rx={10} fill="rgba(240,184,102,0.04)" stroke={FAINT} />
      <DogHead x={165} y={128} s={1.6} color="rgba(240,184,102,0.55)" />
      {/* sliding stencil */}
      {active && (
        <motion.rect
          x={100}
          y={70}
          width={34}
          height={34}
          rx={4}
          fill="rgba(79,209,197,0.12)"
          stroke={TEAL}
          strokeWidth={2}
          animate={{
            x: [0, 50, 100, 0, 50, 100, 0],
            y: [0, 0, 0, 45, 45, 45, 90],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          style={{ filter: "drop-shadow(0 0 6px rgba(79,209,197,0.6))" }}
        />
      )}
      <motion.path d="M 255 125 L 300 125" stroke={DIM} strokeWidth={2} markerEnd="url(#an2)" initial={{ pathLength: 0 }} animate={active ? { pathLength: 1 } : {}} transition={{ delay: 0.5, duration: 0.5 }} />
      <defs>
        <marker id="an2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke={DIM} strokeWidth="1.4" /></marker>
      </defs>
      {/* edge map appearing */}
      <rect x={310} y={60} width={110} height={130} rx={10} fill="rgba(79,209,197,0.04)" stroke="rgba(79,209,197,0.4)" />
      {[
        "M 340 90 L 365 78 L 390 90",
        "M 336 110 Q 365 96 394 110",
        "M 340 150 Q 365 168 390 150",
      ].map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="none"
          stroke={TEAL}
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={active ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ delay: 1 + i * 0.8, duration: 0.8, repeat: Infinity, repeatDelay: 4 }}
        />
      ))}
      <text x={365} y={205} textAnchor="middle" fontSize={10} fill={DIM}>the edges it found</text>
      <text x={165} y={205} textAnchor="middle" fontSize={10} fill={DIM}>a tiny stencil scans everywhere</text>
    </SceneFrame>
  );
}

/* Scene 3 — layers build up: edges → parts → DOG */
function LayersBuild({ active }: { active: boolean }) {
  return (
    <SceneFrame>
      {/* layer 1: edges */}
      <motion.g initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}>
        <rect x={55} y={95} width={95} height={70} rx={9} fill="rgba(96,165,250,0.06)" stroke="rgba(96,165,250,0.5)" />
        {["M 72 120 L 95 108", "M 105 112 L 128 124", "M 75 145 L 100 150", "M 108 148 L 130 138"].map((d, i) => (
          <path key={i} d={d} stroke={BLUE} strokeWidth={2} strokeLinecap="round" fill="none" />
        ))}
        <text x={102} y={182} textAnchor="middle" fontSize={9.5} fill={DIM}>layer 1: edges</text>
      </motion.g>
      <motion.path d="M 158 130 L 185 130" stroke={DIM} strokeWidth={2} markerEnd="url(#an3)" initial={{ pathLength: 0 }} animate={active ? { pathLength: 1 } : {}} transition={{ delay: 0.9, duration: 0.4 }} />
      {/* layer 3: parts */}
      <motion.g initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 1.2 }}>
        <rect x={192} y={95} width={95} height={70} rx={9} fill="rgba(79,209,197,0.06)" stroke="rgba(79,209,197,0.5)" />
        <path d="M 215 118 L 208 104 L 224 110 Z" fill="none" stroke={TEAL} strokeWidth={2} strokeLinejoin="round" />
        <circle cx={248} cy={116} r={4} fill="none" stroke={TEAL} strokeWidth={2} />
        <circle cx={264} cy={116} r={4} fill="none" stroke={TEAL} strokeWidth={2} />
        <circle cx={238} cy={145} r={4.5} fill={TEAL} />
        <text x={239} y={182} textAnchor="middle" fontSize={9.5} fill={DIM}>middle: ears, eyes, nose</text>
      </motion.g>
      <motion.path d="M 295 130 L 322 130" stroke={DIM} strokeWidth={2} markerEnd="url(#an3)" initial={{ pathLength: 0 }} animate={active ? { pathLength: 1 } : {}} transition={{ delay: 1.9, duration: 0.4 }} />
      <defs>
        <marker id="an3" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke={DIM} strokeWidth="1.4" /></marker>
      </defs>
      {/* final: DOG */}
      <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={active ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 2.2, type: "spring", stiffness: 160 }}>
        <rect x={330} y={95} width={95} height={70} rx={9} fill="rgba(240,184,102,0.07)" stroke={AMBER} />
        <DogHead x={362} y={130} s={0.9} />
        <motion.text
          x={402}
          y={135}
          textAnchor="middle"
          fontSize={13}
          fontWeight={700}
          fill={AMBER}
          animate={active ? { opacity: [0.5, 1, 0.5] } : {}}
          transition={{ duration: 1.6, repeat: Infinity, delay: 2.6 }}
        >
          DOG!
        </motion.text>
        <text x={377} y={182} textAnchor="middle" fontSize={9.5} fill={DIM}>last layers: the answer</text>
      </motion.g>
      <text x={240} y={50} textAnchor="middle" fontSize={11} fill={FAINT}>
        each layer combines the last one&apos;s findings into something bigger
      </text>
    </SceneFrame>
  );
}

/* Scene 4 — it learned from 1.2 million photos */
function MillionPhotos({ active }: { active: boolean }) {
  const cards = Array.from({ length: 7 }, (_, i) => i);
  return (
    <SceneFrame>
      {cards.map((i) => (
        <motion.g
          key={i}
          initial={{ x: -80, y: 120, opacity: 0, rotate: -12 }}
          animate={active ? { x: 150 + i * 6, y: 100 - i * 3, opacity: 1, rotate: -8 + i * 2.5 } : {}}
          transition={{ delay: 0.25 * i, duration: 0.6, ease: "easeOut" }}
        >
          <rect width={72} height={54} rx={6} fill="rgba(255,255,255,0.05)" stroke={i === cards.length - 1 ? AMBER : FAINT} />
          {i === cards.length - 1 && <DogHead x={36} y={30} s={0.7} />}
        </motion.g>
      ))}
      {/* counter */}
      <motion.text x={240} y={200} textAnchor="middle" fontSize={20} fontFamily="monospace" fontWeight={700} fill={TEAL} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 1 }}>
        1,200,000 photos
      </motion.text>
      <motion.text x={240} y={222} textAnchor="middle" fontSize={10.5} fill={DIM} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 1.6 }}>
        1,000 categories · learned in ~6 days on two gaming GPUs
      </motion.text>
      <motion.text x={240} y={52} textAnchor="middle" fontSize={11} fill={FAINT} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 2 }}>
        nobody wrote rules for “dog” — it invented its own detectors from examples
      </motion.text>
    </SceneFrame>
  );
}

/* Scene 5 — the 2012 scoreboard */
function Scoreboard({ active }: { active: boolean }) {
  const bars = [
    { label: "2nd place (old methods)", v: 26.2, color: ROSE, w: 262 },
    { label: "AlexNet (this paper)", v: 15.3, color: TEAL, w: 153 },
  ];
  return (
    <SceneFrame>
      <text x={240} y={50} textAnchor="middle" fontSize={12} fill={DIM}>
        ImageNet 2012 — mistakes made (lower is better)
      </text>
      {bars.map((b, i) => (
        <g key={i}>
          <text x={95} y={95 + i * 60} textAnchor="start" fontSize={10.5} fill={DIM}>{b.label}</text>
          <rect x={95} y={102 + i * 60} width={290} height={20} rx={10} fill="rgba(255,255,255,0.05)" />
          <motion.rect
            x={95}
            y={102 + i * 60}
            height={20}
            rx={10}
            fill={b.color}
            initial={{ width: 0 }}
            animate={active ? { width: b.w } : {}}
            transition={{ delay: 0.4 + i * 0.7, duration: 1.1, ease: "easeOut" }}
          />
          <motion.text
            x={95 + b.w + 12}
            y={117 + i * 60}
            fontSize={13}
            fontWeight={700}
            fontFamily="monospace"
            fill={b.color}
            initial={{ opacity: 0 }}
            animate={active ? { opacity: 1 } : {}}
            transition={{ delay: 1.3 + i * 0.7 }}
          >
            {b.v}%
          </motion.text>
        </g>
      ))}
      {/* celebration pulses */}
      {active &&
        [0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            cx={248 + i * 60}
            cy={162}
            fill="none"
            stroke={TEAL}
            strokeWidth={1.5}
            initial={{ r: 2, opacity: 0 }}
            animate={{ r: 22, opacity: [0, 0.7, 0] }}
            transition={{ delay: 2.4 + i * 0.3, duration: 1.2, repeat: Infinity, repeatDelay: 1.8 }}
          />
        ))}
      <motion.text
        x={240}
        y={225}
        textAnchor="middle"
        fontSize={11.5}
        fill={AMBER}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={{ delay: 2.6 }}
      >
        contests are won by decimals — this won by ELEVEN points. Modern AI starts here.
      </motion.text>
    </SceneFrame>
  );
}

export const alexnetStory: StoryScene[] = [
  {
    id: "numbers",
    caption: "To a computer, a photo is just a giant grid of numbers.",
    sub: "No dog, no colors, no shapes — only millions of brightness values. So how can it ever SEE?",
    Art: JustNumbers,
  },
  {
    id: "stencil",
    caption: "The trick: slide a tiny stencil everywhere, asking “does this patch match my pattern?”",
    sub: "That's a convolution. One stencil finds edges wherever they hide — try it yourself in the CNN Lab below.",
    Art: StencilSlides,
  },
  {
    id: "layers",
    caption: "Stack the trick in layers: edges become ears and eyes… and ears and eyes become DOG!",
    sub: "Five layers deep, each combining the last. That hierarchy is what 'deep learning' means.",
    Art: LayersBuild,
  },
  {
    id: "million",
    caption: "Nobody programmed any of it — it taught itself from 1.2 million photos.",
    sub: "The stencils start as random noise; learning from examples sculpts them into edge- and part-detectors.",
    Art: MillionPhotos,
  },
  {
    id: "scoreboard",
    caption: "In 2012 it crushed the world contest — and modern AI began.",
    sub: "15.3% mistakes vs 26.2% for second place. Within three years, everything in AI went deep.",
    Art: Scoreboard,
  },
];
