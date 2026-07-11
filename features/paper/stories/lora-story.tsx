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

/* Scene 1 — the wall of 175 billion knobs */
function WallOfKnobs({ active }: { active: boolean }) {
  return (
    <SceneFrame>
      {Array.from({ length: 60 }, (_, i) => {
        const x = 105 + (i % 12) * 24;
        const y = 62 + Math.floor(i / 12) * 24;
        return (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r={7}
            fill="rgba(96,165,250,0.06)"
            stroke="rgba(96,165,250,0.4)"
            initial={{ opacity: 0 }}
            animate={active ? { opacity: 1 } : {}}
            transition={{ delay: i * 0.015 }}
          />
        );
      })}
      {Array.from({ length: 60 }, (_, i) => {
        const x = 105 + (i % 12) * 24;
        const y = 62 + Math.floor(i / 12) * 24;
        return (
          <line key={i} x1={x} y1={y - 4} x2={x} y2={y} stroke="rgba(96,165,250,0.5)" strokeWidth={1.2} transform={`rotate(${(i * 47) % 360} ${x} ${y})`} />
        );
      })}
      <motion.text
        x={240}
        y={192}
        textAnchor="middle"
        fontSize={11.5}
        fontFamily="monospace"
        fill={BLUE}
        animate={active ? { opacity: [0.5, 1, 0.5] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        …× 175,000,000,000 knobs
      </motion.text>
      {/* tiny person with wrench */}
      <motion.g animate={active ? { rotate: [-6, 6, -6] } : {}} transition={{ duration: 1.2, repeat: Infinity }} style={{ transformOrigin: "420px 180px" }}>
        <circle cx={420} cy={168} r={7} fill="none" stroke={AMBER} strokeWidth={1.5} />
        <line x1={420} y1={175} x2={420} y2={192} stroke={AMBER} strokeWidth={1.5} />
        <line x1={420} y1={180} x2={409} y2={172} stroke={AMBER} strokeWidth={1.5} />
        <text x={420} y={214} textAnchor="middle" fontSize={9} fill={AMBER}>you 😅</text>
      </motion.g>
      <text x={240} y={40} textAnchor="middle" fontSize={11} fill={FAINT}>
        customizing GPT-3 the old way: re-tune EVERY knob, save a 350GB copy… per task
      </text>
    </SceneFrame>
  );
}

/* Scene 2 — the change is secretly simple */
function SecretlySimple({ active }: { active: boolean }) {
  return (
    <SceneFrame>
      {/* the full "change" grid */}
      <text x={135} y={58} textAnchor="middle" fontSize={9.5} fill={DIM}>the change fine-tuning made</text>
      {Array.from({ length: 64 }, (_, i) => {
        const r = Math.floor(i / 8);
        const c = i % 8;
        const v = Math.sin(r * 0.9) * Math.cos(c * 0.7);
        return (
          <rect
            key={i}
            x={95 + c * 11}
            y={68 + r * 11}
            width={10}
            height={10}
            rx={1.5}
            fill={v > 0 ? `rgba(79,209,197,${Math.abs(v) * 0.8})` : `rgba(242,125,152,${Math.abs(v) * 0.8})`}
          />
        );
      })}
      <motion.text x={240} y={115} textAnchor="middle" fontSize={16} fill={DIM} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 0.6 }}>
        =
      </motion.text>
      {/* three simple stripes stacking */}
      {[0, 1, 2].map((layer) => (
        <motion.g
          key={layer}
          initial={{ opacity: 0, x: 24 }}
          animate={active ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.9 + layer * 0.55 }}
        >
          <text x={330} y={64 + layer * 34} textAnchor="middle" fontSize={8.5} fill={FAINT}>
            simple layer {layer + 1}
          </text>
          {Array.from({ length: 8 }, (_, c) => (
            <rect
              key={c}
              x={286 + c * 11}
              y={68 + layer * 34}
              width={10}
              height={10}
              rx={1.5}
              fill={`rgba(79,209,197,${0.15 + Math.abs(Math.cos(c * 0.7)) * 0.6})`}
            />
          ))}
          <text x={385} y={77 + layer * 34} fontSize={10} fill={DIM}>+</text>
        </motion.g>
      ))}
      <motion.text
        x={240}
        y={205}
        textAnchor="middle"
        fontSize={11.5}
        fill={TEAL}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={{ delay: 2.6 }}
      >
        the huge change ≈ just 3 simple patterns stacked — it was low-rank all along
      </motion.text>
      <text x={240} y={40} textAnchor="middle" fontSize={11} fill={FAINT}>
        researchers looked closely at what fine-tuning actually changes…
      </text>
    </SceneFrame>
  );
}

/* Scene 3 — freeze the giant, learn two skinny strips */
function TwoSkinnyStrips({ active }: { active: boolean }) {
  return (
    <SceneFrame>
      {/* frozen base */}
      <rect x={90} y={75} width={110} height={110} rx={12} fill="rgba(96,165,250,0.06)" stroke={BLUE} strokeWidth={1.5} />
      <text x={145} y={125} textAnchor="middle" fontSize={11} fill={BLUE}>the giant model</text>
      <motion.text x={145} y={145} textAnchor="middle" fontSize={16} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}>
        🧊
      </motion.text>
      <text x={145} y={200} textAnchor="middle" fontSize={9} fill={DIM}>frozen — never touched again</text>
      <motion.text x={240} y={133} textAnchor="middle" fontSize={18} fill={DIM} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 0.8 }}>
        +
      </motion.text>
      {/* B and A strips */}
      <motion.g initial={{ opacity: 0, y: 14 }} animate={active ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.1 }}>
        <rect x={280} y={80} width={16} height={72} rx={4} fill="rgba(79,209,197,0.16)" stroke={TEAL} strokeWidth={1.5} />
        <text x={288} y={168} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={TEAL}>B</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 14 }} animate={active ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.4 }}>
        <rect x={310} y={108} width={72} height={16} rx={4} fill="rgba(79,209,197,0.16)" stroke={TEAL} strokeWidth={1.5} />
        <text x={346} y={140} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={TEAL}>A</text>
      </motion.g>
      <motion.text
        x={331}
        y={190}
        textAnchor="middle"
        fontSize={10.5}
        fill={TEAL}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={{ delay: 1.9 }}
      >
        train ONLY these two skinny strips
      </motion.text>
      <motion.text x={240} y={222} textAnchor="middle" fontSize={10.5} fill={FAINT} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 2.3 }}>
        their product B×A IS the change — built small on purpose, because the change is small
      </motion.text>
      <text x={240} y={45} textAnchor="middle" fontSize={11} fill={FAINT}>
        LoRA&apos;s move: don&apos;t rewrite the encyclopedia — clip in a thin sheet of corrections
      </text>
    </SceneFrame>
  );
}

/* Scene 4 — the scale: 10,000× fewer */
function TheScale({ active }: { active: boolean }) {
  return (
    <SceneFrame>
      {/* balance beam */}
      <line x1={140} y1={160} x2={340} y2={160} stroke={DIM} strokeWidth={2.5} />
      <path d="M 240 160 L 240 190 M 220 190 L 260 190" stroke={DIM} strokeWidth={2.5} />
      <circle cx={240} cy={160} r={4} fill={DIM} />
      {/* heavy side: full fine-tune */}
      <motion.g initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 0.4 }}>
        {Array.from({ length: 6 }, (_, i) => (
          <rect key={i} x={118} y={132 - i * 13} width={64} height={11} rx={3} fill="rgba(242,125,152,0.12)" stroke={ROSE} />
        ))}
        <text x={150} y={205} textAnchor="middle" fontSize={9.5} fill={ROSE}>old way: 175B knobs</text>
        <text x={150} y={219} textAnchor="middle" fontSize={8.5} fill={FAINT}>needs a GPU farm</text>
      </motion.g>
      {/* light side: lora chip */}
      <motion.g initial={{ opacity: 0, y: -16 }} animate={active ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1 }}>
        <rect x={312} y={140} width={36} height={14} rx={4} fill="rgba(79,209,197,0.15)" stroke={TEAL} strokeWidth={1.5} />
        <text x={330} y={205} textAnchor="middle" fontSize={9.5} fill={TEAL}>LoRA: 10,000× fewer</text>
        <text x={330} y={219} textAnchor="middle" fontSize={8.5} fill={FAINT}>fits a gaming laptop</text>
      </motion.g>
      {/* equal quality banner */}
      <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={active ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 1.8, type: "spring" }}>
        <rect x={160} y={52} width={160} height={28} rx={14} fill="rgba(240,184,102,0.1)" stroke={AMBER} />
        <text x={240} y={71} textAnchor="middle" fontSize={11} fontWeight={700} fill={AMBER}>
          SAME quality ✓
        </text>
      </motion.g>
      <motion.text x={240} y={110} textAnchor="middle" fontSize={10} fill={DIM} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 2.2 }}>
        the paper tested it on GPT-3 itself: matching results, 3× less GPU memory
      </motion.text>
    </SceneFrame>
  );
}

/* Scene 5 — skills like cartridges */
function SkillCartridges({ active }: { active: boolean }) {
  const carts = [
    { label: "⚖️ legal", x: 330, y: 70 },
    { label: "🎨 art style", x: 390, y: 110 },
    { label: "💬 support", x: 330, y: 150 },
  ];
  return (
    <SceneFrame>
      {/* the base console */}
      <rect x={110} y={85} width={150} height={90} rx={14} fill="rgba(96,165,250,0.07)" stroke={BLUE} strokeWidth={1.5} />
      <text x={185} y={122} textAnchor="middle" fontSize={11} fill={BLUE}>ONE shared</text>
      <text x={185} y={138} textAnchor="middle" fontSize={11} fill={BLUE}>giant model</text>
      <rect x={252} y={112} width={16} height={36} rx={3} fill="rgba(255,255,255,0.06)" stroke={FAINT} />
      {/* cartridges sliding in */}
      {carts.map((cart, i) => (
        <motion.g
          key={i}
          initial={{ x: 40, opacity: 0 }}
          animate={
            active
              ? { x: [40, 0, 0, 40], opacity: [0, 1, 1, 0] }
              : {}
          }
          transition={{ duration: 3.2, delay: i * 3.2, times: [0, 0.25, 0.75, 1], repeat: Infinity, repeatDelay: (carts.length - 1) * 3.2 }}
        >
          <rect x={cart.x - 48} y={cart.y} width={82} height={26} rx={7} fill="rgba(79,209,197,0.12)" stroke={TEAL} strokeWidth={1.5} />
          <text x={cart.x - 7} y={cart.y + 17} textAnchor="middle" fontSize={9.5} fill={TEAL}>
            {cart.label}
          </text>
        </motion.g>
      ))}
      <text x={185} y={200} textAnchor="middle" fontSize={9.5} fill={DIM}>stored once (350GB)</text>
      <text x={355} y={200} textAnchor="middle" fontSize={9.5} fill={TEAL}>each skill: a few MB</text>
      <motion.text
        x={240}
        y={225}
        textAnchor="middle"
        fontSize={10.5}
        fill={FAINT}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={{ delay: 1.5 }}
      >
        swap skills like game cartridges — this is how custom AI actually ships today
      </motion.text>
      <text x={240} y={45} textAnchor="middle" fontSize={11} fill={FAINT}>
        and when merged in, it runs at exactly the original speed
      </text>
    </SceneFrame>
  );
}

export const loraStory: StoryScene[] = [
  {
    id: "wall",
    caption: "Customizing a giant AI used to mean re-tuning ALL 175 billion knobs.",
    sub: "And saving a complete 350GB copy for every single use case. Only the biggest labs could afford it.",
    Art: WallOfKnobs,
  },
  {
    id: "simple",
    caption: "The discovery: the CHANGE fine-tuning makes is secretly simple.",
    sub: "A huge-looking update is really just a few simple patterns stacked — 'low rank', in math speak. See it live in the lab below.",
    Art: SecretlySimple,
  },
  {
    id: "strips",
    caption: "So: freeze the giant, and learn just two skinny strips whose product IS the change.",
    sub: "That's LoRA — like clipping a thin correction sheet into an encyclopedia instead of rewriting it.",
    Art: TwoSkinnyStrips,
  },
  {
    id: "scale",
    caption: "Result: 10,000× fewer knobs to train — with the SAME quality.",
    sub: "Tested on GPT-3 itself. Fine-tuning went from a GPU-farm project to a gaming-laptop weekend.",
    Art: TheScale,
  },
  {
    id: "cartridges",
    caption: "Now AI skills snap in like game cartridges.",
    sub: "One shared giant brain, plus megabyte-sized skills — legal, art styles, support chat — swapped in and out. That's modern custom AI.",
    Art: SkillCartridges,
  },
];
