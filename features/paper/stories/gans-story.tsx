"use client";

import { motion } from "framer-motion";
import {
  SceneFrame,
  INK,
  DIM,
  FAINT,
  TEAL,
  AMBER,
  ROSE,
  type StoryScene,
} from "../visual-story";

/* small helpers */
function Easel({ x, y, stroke = FAINT }: { x: number; y: number; stroke?: string }) {
  return (
    <g>
      <rect x={x - 34} y={y - 44} width={68} height={54} rx={4} fill="rgba(255,255,255,0.04)" stroke={stroke} />
      <line x1={x - 20} y1={y + 10} x2={x - 30} y2={y + 34} stroke={stroke} />
      <line x1={x + 20} y1={y + 10} x2={x + 30} y2={y + 34} stroke={stroke} />
    </g>
  );
}

/* Scene 1 — the forger paints from scribbles */
function TheForger({ active }: { active: boolean }) {
  return (
    <SceneFrame>
      {/* noise cloud */}
      <text x={90} y={60} textAnchor="middle" fontSize={11} fill={FAINT}>random scribbles</text>
      {Array.from({ length: 16 }, (_, i) => (
        <motion.circle
          key={i}
          cx={60 + (i % 4) * 20}
          cy={85 + Math.floor(i / 4) * 20}
          r={3}
          fill={DIM}
          animate={active ? { opacity: [0.2, 0.9, 0.2], cy: [85 + Math.floor(i / 4) * 20, 80 + Math.floor(i / 4) * 20, 85 + Math.floor(i / 4) * 20] } : {}}
          transition={{ duration: 1.6, delay: i * 0.08, repeat: Infinity }}
        />
      ))}
      {/* arrow into the forger */}
      <motion.path d="M 155 125 L 200 125" stroke={DIM} strokeWidth={2} markerEnd="url(#ga)" initial={{ pathLength: 0 }} animate={active ? { pathLength: 1 } : {}} transition={{ duration: 0.6, delay: 0.4 }} />
      <defs>
        <marker id="ga" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="none" stroke={DIM} strokeWidth="1.4" />
        </marker>
      </defs>
      {/* forger box */}
      <rect x={205} y={95} width={90} height={60} rx={12} fill="rgba(79,209,197,0.08)" stroke={TEAL} strokeWidth={1.5} />
      <text x={250} y={120} textAnchor="middle" fontSize={12} fill={TEAL}>THE FORGER</text>
      <text x={250} y={138} textAnchor="middle" fontSize={9.5} fill={DIM}>(a neural network)</text>
      {/* painting appears */}
      <motion.path d="M 300 125 L 345 125" stroke={DIM} strokeWidth={2} markerEnd="url(#ga)" initial={{ pathLength: 0 }} animate={active ? { pathLength: 1 } : {}} transition={{ duration: 0.6, delay: 1 }} />
      <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={active ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 1.4, type: "spring", stiffness: 160 }}>
        <Easel x={400} y={130} stroke={TEAL} />
        <motion.path
          d="M 375 110 Q 390 90 405 108 Q 418 96 422 112"
          fill="none"
          stroke={TEAL}
          strokeWidth={2}
          initial={{ pathLength: 0 }}
          animate={active ? { pathLength: 1 } : {}}
          transition={{ delay: 1.8, duration: 1.4, repeat: Infinity, repeatDelay: 2.4 }}
        />
        <text x={400} y={126} textAnchor="middle" fontSize={8.5} fill={DIM}>a “painting”</text>
      </motion.g>
      <text x={240} y={215} textAnchor="middle" fontSize={11} fill={FAINT}>
        it has never seen a real painting — it just tries things
      </text>
    </SceneFrame>
  );
}

/* Scene 2 — the detective judges */
function TheDetective({ active }: { active: boolean }) {
  return (
    <SceneFrame>
      <Easel x={110} y={120} stroke={AMBER} />
      <path d="M 88 100 Q 102 84 116 100 Q 126 90 132 102" fill="none" stroke={AMBER} strokeWidth={2} />
      <text x={110} y={155} textAnchor="middle" fontSize={9.5} fill={AMBER}>real painting</text>

      <Easel x={370} y={120} stroke={TEAL} />
      <path d="M 348 104 L 392 96 M 352 112 L 388 110" stroke={TEAL} strokeWidth={2} />
      <text x={370} y={155} textAnchor="middle" fontSize={9.5} fill={TEAL}>the forgery</text>

      {/* detective in the middle with magnifier sweeping */}
      <rect x={196} y={92} width={88} height={58} rx={12} fill="rgba(96,165,250,0.08)" stroke="rgba(96,165,250,0.7)" strokeWidth={1.5} />
      <text x={240} y={115} textAnchor="middle" fontSize={11} fill="#60a5fa">THE DETECTIVE</text>
      <text x={240} y={132} textAnchor="middle" fontSize={9.5} fill={DIM}>(another network)</text>
      {active && (
        <motion.g animate={{ x: [-95, 95, -95] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}>
          <circle cx={240} cy={60} r={13} fill="none" stroke={INK} strokeWidth={2} />
          <line x1={249} y1={69} x2={258} y2={78} stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
        </motion.g>
      )}
      {/* verdict stamps */}
      <motion.text x={110} y={196} textAnchor="middle" fontSize={13} fontWeight={700} fill={TEAL} initial={{ opacity: 0 }} animate={active ? { opacity: [0, 1, 1, 0] } : {}} transition={{ duration: 3.5, times: [0.2, 0.3, 0.45, 0.55], repeat: Infinity }}>
        ✓ REAL (92%)
      </motion.text>
      <motion.text x={370} y={196} textAnchor="middle" fontSize={13} fontWeight={700} fill={ROSE} initial={{ opacity: 0 }} animate={active ? { opacity: [0, 1, 1, 0] } : {}} transition={{ duration: 3.5, times: [0.7, 0.8, 0.95, 1], repeat: Infinity }}>
        ✗ FAKE (only 8%)
      </motion.text>
      <text x={240} y={228} textAnchor="middle" fontSize={11} fill={FAINT}>
        its only job: tell real from fake
      </text>
    </SceneFrame>
  );
}

/* Scene 3 — they train each other */
function TheDuel({ active }: { active: boolean }) {
  return (
    <SceneFrame>
      <rect x={60} y={95} width={100} height={60} rx={12} fill="rgba(79,209,197,0.08)" stroke={TEAL} strokeWidth={1.5} />
      <text x={110} y={122} textAnchor="middle" fontSize={11.5} fill={TEAL}>FORGER</text>
      <text x={110} y={138} textAnchor="middle" fontSize={9} fill={DIM}>“what gave it away?”</text>

      <rect x={320} y={95} width={100} height={60} rx={12} fill="rgba(96,165,250,0.08)" stroke="rgba(96,165,250,0.7)" strokeWidth={1.5} />
      <text x={370} y={122} textAnchor="middle" fontSize={11.5} fill="#60a5fa">DETECTIVE</text>
      <text x={370} y={138} textAnchor="middle" fontSize={9} fill={DIM}>“what did I miss?”</text>

      {/* circular arrows */}
      <motion.path d="M 170 105 Q 240 65 310 105" fill="none" stroke={TEAL} strokeWidth={2} markerEnd="url(#gd1)" initial={{ pathLength: 0 }} animate={active ? { pathLength: [0, 1] } : {}} transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1.3 }} />
      <motion.path d="M 310 148 Q 240 188 170 148" fill="none" stroke="#60a5fa" strokeWidth={2} markerEnd="url(#gd2)" initial={{ pathLength: 0 }} animate={active ? { pathLength: [0, 1] } : {}} transition={{ duration: 1.2, delay: 1.25, repeat: Infinity, repeatDelay: 1.3 }} />
      <defs>
        <marker id="gd1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke={TEAL} strokeWidth="1.4" /></marker>
        <marker id="gd2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke="#60a5fa" strokeWidth="1.4" /></marker>
      </defs>
      <text x={240} y={78} textAnchor="middle" fontSize={9.5} fill={TEAL}>better fakes</text>
      <text x={240} y={178} textAnchor="middle" fontSize={9.5} fill="#60a5fa">sharper judgments</text>

      {/* skill bars rising */}
      {[
        { x: 95, color: TEAL, label: "forging skill" },
        { x: 355, color: "#60a5fa", label: "detecting skill" },
      ].map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={200} width={80} height={8} rx={4} fill="rgba(255,255,255,0.06)" />
          <motion.rect
            x={b.x}
            y={200}
            height={8}
            rx={4}
            fill={b.color}
            initial={{ width: 8 }}
            animate={active ? { width: [8, 76] } : {}}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <text x={b.x + 40} y={224} textAnchor="middle" fontSize={9} fill={FAINT}>{b.label}</text>
        </g>
      ))}
    </SceneFrame>
  );
}

/* Scene 4 — the detective can only guess */
function CoinFlip({ active }: { active: boolean }) {
  return (
    <SceneFrame>
      {[150, 330].map((x, i) => (
        <g key={i}>
          <Easel x={x} y={115} stroke={AMBER} />
          <path d={`M ${x - 22} 95 Q ${x - 8} 79 ${x + 6} 95 Q ${x + 16} 85 ${x + 22} 97`} fill="none" stroke={AMBER} strokeWidth={2} />
        </g>
      ))}
      <text x={150} y={152} textAnchor="middle" fontSize={9.5} fill={DIM}>one is real…</text>
      <text x={330} y={152} textAnchor="middle" fontSize={9.5} fill={DIM}>…one is fake</text>
      {/* shrugging detective */}
      <motion.g animate={active ? { rotate: [-4, 4, -4] } : {}} transition={{ duration: 1.8, repeat: Infinity }} style={{ transformOrigin: "240px 190px" }}>
        <circle cx={240} cy={182} r={15} fill="rgba(96,165,250,0.1)" stroke="#60a5fa" />
        <text x={240} y={188} textAnchor="middle" fontSize={13} fill="#60a5fa">?</text>
      </motion.g>
      {[150, 330].map((x, i) => (
        <motion.text
          key={i}
          x={x}
          y={196}
          textAnchor="middle"
          fontSize={14}
          fontWeight={700}
          fill={INK}
          animate={active ? { opacity: [0.3, 1, 0.3] } : {}}
          transition={{ duration: 2, delay: i * 1, repeat: Infinity }}
        >
          50%
        </motion.text>
      ))}
      <text x={240} y={232} textAnchor="middle" fontSize={11} fill={FAINT}>
        when the best detective on earth is coin-flipping, the forger has truly learned reality
      </text>
    </SceneFrame>
  );
}

/* Scene 5 — AI that creates */
function AiCreates({ active }: { active: boolean }) {
  const tiles = Array.from({ length: 8 }, (_, i) => i);
  const arts = [
    "M -14 6 Q 0 -14 14 6 Z", // mountain
    "M 0 -12 A 12 12 0 1 1 -0.01 -12", // circle
    "M -12 8 L 0 -12 L 12 8 Z", // triangle
    "M -12 -6 Q 0 10 12 -6", // wave
  ];
  return (
    <SceneFrame>
      {tiles.map((i) => {
        const x = 105 + (i % 4) * 90;
        const y = 80 + Math.floor(i / 4) * 78;
        return (
          <motion.g
            key={i}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={active ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3 + i * 0.28, type: "spring", stiffness: 150 }}
          >
            <rect x={x - 32} y={y - 26} width={64} height={52} rx={8} fill={`rgba(${i % 2 ? "79,209,197" : "240,184,102"},0.08)`} stroke={i % 2 ? "rgba(79,209,197,0.5)" : "rgba(240,184,102,0.5)"} />
            <g transform={`translate(${x}, ${y})`}>
              <path d={arts[i % arts.length]} fill="none" stroke={i % 2 ? TEAL : AMBER} strokeWidth={2} strokeLinecap="round" />
            </g>
          </motion.g>
        );
      })}
      <motion.text
        x={240}
        y={215}
        textAnchor="middle"
        fontSize={11.5}
        fill={DIM}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={{ delay: 2.6 }}
      >
        invented faces, art, and worlds — none of it ever existed
      </motion.text>
    </SceneFrame>
  );
}

export const gansStory: StoryScene[] = [
  {
    id: "forger",
    caption: "Meet the Forger: it paints pictures out of random scribbles.",
    sub: "It's a neural network that has never seen real art. Its first tries are garbage — and that's fine.",
    Art: TheForger,
  },
  {
    id: "detective",
    caption: "Meet the Detective: it judges every picture — REAL or FAKE?",
    sub: "Another network, with one job: don't get fooled.",
    Art: TheDetective,
  },
  {
    id: "duel",
    caption: "Here's the genius: every caught fake TEACHES the forger. Every clever fake SHARPENS the detective.",
    sub: "They train each other, round after round. No human ever explains what 'realistic' means.",
    Art: TheDuel,
  },
  {
    id: "coinflip",
    caption: "The game ends when the detective can only guess: 50/50.",
    sub: "The paper proves this mathematically: perfect play ends with fakes identical to reality. Watch it happen in the live lab below.",
    Art: CoinFlip,
  },
  {
    id: "creates",
    caption: "And that's how AI learned to CREATE.",
    sub: "Invented faces, artwork, and images — this 2014 duel started the whole generative-AI era.",
    Art: AiCreates,
  },
];
