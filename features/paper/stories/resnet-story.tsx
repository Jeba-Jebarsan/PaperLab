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

function Tower({ x, blocks, color, wobble = false, active }: { x: number; blocks: number; color: string; wobble?: boolean; active: boolean }) {
  return (
    <motion.g
      animate={active && wobble ? { rotate: [-1.5, 1.5, -1.5] } : {}}
      transition={{ duration: 1.6, repeat: Infinity }}
      style={{ transformOrigin: `${x}px 210px` }}
    >
      {Array.from({ length: blocks }, (_, i) => (
        <motion.rect
          key={i}
          x={x - 26}
          y={200 - i * 13}
          width={52}
          height={11}
          rx={3}
          fill={`${color}18`}
          stroke={color}
          strokeWidth={1}
          initial={{ opacity: 0, y: -8 }}
          animate={active ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * 0.06 }}
        />
      ))}
    </motion.g>
  );
}

/* Scene 1 — the belief: deeper = smarter */
function DeeperIsBetter({ active }: { active: boolean }) {
  return (
    <SceneFrame>
      {[
        { x: 110, blocks: 3, label: "2012: 8 layers", score: "good" },
        { x: 240, blocks: 6, label: "2014: 19 layers", score: "better!" },
        { x: 370, blocks: 9, label: "next: more??", score: "surely best?" },
      ].map((t, i) => (
        <g key={i}>
          <Tower x={t.x} blocks={t.blocks} color={BLUE} active={active} />
          <text x={t.x} y={228} textAnchor="middle" fontSize={9.5} fill={DIM}>{t.label}</text>
          <motion.text
            x={t.x}
            y={200 - t.blocks * 13 - 10}
            textAnchor="middle"
            fontSize={10.5}
            fill={TEAL}
            initial={{ opacity: 0 }}
            animate={active ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 + i * 0.5 }}
          >
            {t.score}
          </motion.text>
        </g>
      ))}
      <motion.path
        d="M 130 90 Q 240 40 355 68"
        fill="none"
        stroke={TEAL}
        strokeWidth={2}
        strokeDasharray="5 5"
        markerEnd="url(#rs-a)"
        initial={{ pathLength: 0 }}
        animate={active ? { pathLength: 1 } : {}}
        transition={{ delay: 1.6, duration: 1 }}
      />
      <defs>
        <marker id="rs-a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke={TEAL} strokeWidth="1.4" /></marker>
      </defs>
    </SceneFrame>
  );
}

/* Scene 2 — the shock: 56 layers loses to 20 */
function TheShock({ active }: { active: boolean }) {
  return (
    <SceneFrame>
      <Tower x={140} blocks={5} color={TEAL} active={active} />
      <text x={140} y={228} textAnchor="middle" fontSize={10} fill={DIM}>20 layers</text>
      <motion.text x={140} y={118} textAnchor="middle" fontSize={12} fontWeight={700} fill={TEAL} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 1 }}>
        9% mistakes
      </motion.text>

      <Tower x={340} blocks={12} color={ROSE} wobble active={active} />
      <text x={340} y={228} textAnchor="middle" fontSize={10} fill={DIM}>56 layers</text>
      <motion.text x={340} y={28} textAnchor="middle" fontSize={12} fontWeight={700} fill={ROSE} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 1.6 }}>
        13% mistakes?!
      </motion.text>

      <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={active ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 2.2, type: "spring" }}>
        <circle cx={240} cy={120} r={17} fill="rgba(240,184,102,0.12)" stroke={AMBER} strokeWidth={1.5} />
        <text x={240} y={127} textAnchor="middle" fontSize={16} fill={AMBER}>!?</text>
      </motion.g>
      <motion.text x={240} y={165} textAnchor="middle" fontSize={10.5} fill={FAINT} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 2.6 }}>
        worse even on photos it PRACTICED on — not cheating, genuinely failing
      </motion.text>
    </SceneFrame>
  );
}

/* Scene 3 — the whisper-through-rooms problem */
function MessageDegrades({ active }: { active: boolean }) {
  const rooms = [80, 160, 240, 320, 400];
  return (
    <SceneFrame>
      {rooms.map((x, i) => (
        <g key={i}>
          <rect x={x - 28} y={100} width={56} height={56} rx={9} fill="rgba(96,165,250,0.06)" stroke="rgba(96,165,250,0.45)" />
          <text x={x} y={90} textAnchor="middle" fontSize={9} fill={FAINT}>layer {i * 12 + 1}</text>
        </g>
      ))}
      {/* the picture passing through, degrading */}
      {active &&
        rooms.map((x, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.4, delay: i * 1.0, repeat: Infinity, repeatDelay: rooms.length * 1.0 - 1.4 }}
          >
            <rect x={x - 16} y={112} width={32} height={32} rx={4} fill="rgba(240,184,102,0.1)" stroke={AMBER} strokeOpacity={1 - i * 0.2} />
            {/* smiley degrading */}
            <circle cx={x - 6} cy={124} r={2} fill={AMBER} opacity={1 - i * 0.22} />
            <circle cx={x + 6} cy={124} r={2} fill={AMBER} opacity={1 - i * 0.25} />
            <path d={`M ${x - 7} 134 Q ${x} ${138 - i} ${x + 7} 134`} stroke={AMBER} strokeWidth={1.5} fill="none" opacity={1 - i * 0.22} />
          </motion.g>
        ))}
      <text x={240} y={195} textAnchor="middle" fontSize={11} fill={FAINT}>
        each layer re-draws the WHOLE picture — tiny errors pile up, the signal fades
      </text>
      <text x={240} y={215} textAnchor="middle" fontSize={10.5} fill={DIM}>
        (and the lesson traveling backwards fades even faster)
      </text>
    </SceneFrame>
  );
}

/* Scene 4 — the skip connection */
function TheShortcut({ active }: { active: boolean }) {
  return (
    <SceneFrame>
      {/* main path through the layer */}
      <rect x={195} y={105} width={90} height={50} rx={10} fill="rgba(96,165,250,0.08)" stroke={BLUE} strokeWidth={1.5} />
      <text x={240} y={126} textAnchor="middle" fontSize={10.5} fill={BLUE}>the layer</text>
      <text x={240} y={142} textAnchor="middle" fontSize={9} fill={DIM}>adds a small edit</text>

      <motion.path d="M 70 130 L 190 130" stroke={DIM} strokeWidth={2.5} markerEnd="url(#rs-b)" initial={{ pathLength: 0 }} animate={active ? { pathLength: 1 } : {}} transition={{ duration: 0.6 }} />
      <motion.path d="M 290 130 L 345 130" stroke={DIM} strokeWidth={2.5} initial={{ pathLength: 0 }} animate={active ? { pathLength: 1 } : {}} transition={{ delay: 0.7, duration: 0.4 }} />

      {/* THE skip connection */}
      <motion.path
        d="M 100 130 Q 240 30 380 130"
        fill="none"
        stroke={TEAL}
        strokeWidth={3}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={active ? { pathLength: 1 } : {}}
        transition={{ delay: 1.1, duration: 1 }}
        style={{ filter: "drop-shadow(0 0 8px rgba(79,209,197,0.5))" }}
      />
      <motion.text x={240} y={55} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={TEAL} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 1.9 }}>
        the shortcut: the original skips ahead, untouched
      </motion.text>

      {/* plus junction */}
      <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={active ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 2.2, type: "spring" }}>
        <circle cx={362} cy={130} r={14} fill="rgba(79,209,197,0.12)" stroke={TEAL} strokeWidth={2} />
        <text x={362} y={136} textAnchor="middle" fontSize={16} fontWeight={700} fill={TEAL}>+</text>
      </motion.g>
      <motion.path d="M 378 130 L 420 130" stroke={TEAL} strokeWidth={2.5} markerEnd="url(#rs-c)" initial={{ pathLength: 0 }} animate={active ? { pathLength: 1 } : {}} transition={{ delay: 2.6, duration: 0.4 }} />
      <defs>
        <marker id="rs-b" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke={DIM} strokeWidth="1.4" /></marker>
        <marker id="rs-c" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke={TEAL} strokeWidth="1.4" /></marker>
      </defs>

      <motion.text x={240} y={200} textAnchor="middle" fontSize={11} fill={DIM} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 3 }}>
        result = original + edit.  A lazy layer can just add nothing — depth can&apos;t hurt anymore!
      </motion.text>
      <motion.text x={240} y={222} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={FAINT} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 3.3 }}>
        y = F(x) + x   ← the entire paper, one line
      </motion.text>
    </SceneFrame>
  );
}

/* Scene 5 — 152 layers, champion, inside ChatGPT */
function DepthUnlocked({ active }: { active: boolean }) {
  return (
    <SceneFrame>
      {/* tall tower with skip arcs */}
      {Array.from({ length: 11 }, (_, i) => (
        <motion.g key={i} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: i * 0.12 }}>
          <rect x={104} y={204 - i * 16} width={62} height={13} rx={3} fill="rgba(79,209,197,0.1)" stroke="rgba(79,209,197,0.5)" />
          <path d={`M 100 ${210 - i * 16} Q 88 ${202 - i * 16} 100 ${194 - i * 16}`} fill="none" stroke={TEAL} strokeWidth={1.4} />
        </motion.g>
      ))}
      <motion.text x={135} y={228} textAnchor="middle" fontSize={10} fill={DIM} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 1.4 }}>
        152 layers — trains happily
      </motion.text>
      {/* trophy */}
      <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={active ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 1.8, type: "spring" }}>
        <path d="M 240 70 L 264 70 L 262 92 Q 252 104 242 92 Z" fill="rgba(240,184,102,0.15)" stroke={AMBER} strokeWidth={2} transform="translate(-12,0)" />
        <rect x={244} y={104} width={16} height={6} rx={2} fill={AMBER} />
        <rect x={238} y={110} width={28} height={5} rx={2} fill={AMBER} />
        <text x={252} y={135} textAnchor="middle" fontSize={10} fill={AMBER}>2015 world champion</text>
        <text x={252} y={150} textAnchor="middle" fontSize={9} fill={DIM}>(beat humans at ImageNet)</text>
      </motion.g>
      {/* arrow into a chat assistant */}
      <motion.path d="M 300 180 Q 330 180 352 168" fill="none" stroke={FAINT} strokeWidth={1.5} strokeDasharray="4 4" initial={{ pathLength: 0 }} animate={active ? { pathLength: 1 } : {}} transition={{ delay: 2.6, duration: 0.7 }} />
      <motion.g initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 3 }}>
        <rect x={352} y={120} width={100} height={62} rx={12} fill="rgba(96,165,250,0.08)" stroke={BLUE} />
        <text x={402} y={143} textAnchor="middle" fontSize={10} fill={BLUE}>every ChatGPT layer</text>
        <text x={402} y={158} textAnchor="middle" fontSize={10} fill={BLUE}>has this shortcut</text>
        <text x={402} y={172} textAnchor="middle" fontSize={8.5} fontFamily="monospace" fill={DIM}>(“Add &amp; Norm” = +x)</text>
      </motion.g>
      <motion.text x={240} y={40} textAnchor="middle" fontSize={11} fill={FAINT} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 0.8 }}>
        one little “+” made unlimited depth possible
      </motion.text>
    </SceneFrame>
  );
}

export const resnetStory: StoryScene[] = [
  {
    id: "belief",
    caption: "Everyone believed: more layers = a smarter network.",
    sub: "8 layers won in 2012, 19 layers won in 2014… so just keep stacking, right?",
    Art: DeeperIsBetter,
  },
  {
    id: "shock",
    caption: "But past ~20 layers, networks got WORSE. Even at their own practice photos!",
    sub: "A 56-layer network lost to a 20-layer one. It wasn't memorizing too much — it was failing to learn at all.",
    Art: TheShock,
  },
  {
    id: "degrade",
    caption: "The problem: every layer had to re-draw the ENTIRE picture.",
    sub: "Tiny errors piled up layer after layer — and the teaching signal faded to a whisper on its way back down.",
    Art: MessageDegrades,
  },
  {
    id: "shortcut",
    caption: "The fix is one line: give every layer a shortcut. Keep the original — just ADD your edit.",
    sub: "y = F(x) + x. A layer with nothing useful to say can add zero and stay invisible. Depth can never hurt again.",
    Art: TheShortcut,
  },
  {
    id: "unlocked",
    caption: "Result: 152 layers, world champion — and the same shortcut now lives inside ChatGPT.",
    sub: "Watch two real networks race with and without shortcuts in the lab below — the difference is dramatic.",
    Art: DepthUnlocked,
  },
];
