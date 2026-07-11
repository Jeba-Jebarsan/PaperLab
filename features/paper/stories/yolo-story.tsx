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

function StreetScene({ opacity = 1 }: { opacity?: number }) {
  return (
    <g opacity={opacity}>
      <rect x={90} y={60} width={300} height={130} rx={10} fill="rgba(255,255,255,0.03)" stroke={FAINT} />
      <line x1={90} y1={158} x2={390} y2={158} stroke={FAINT} />
      {/* car */}
      <rect x={255} y={128} width={70} height={22} rx={6} fill="none" stroke={DIM} strokeWidth={1.5} />
      <path d="M 268 128 L 276 116 L 306 116 L 314 128" fill="none" stroke={DIM} strokeWidth={1.5} />
      <circle cx={270} cy={152} r={6} fill="none" stroke={DIM} strokeWidth={1.5} />
      <circle cx={310} cy={152} r={6} fill="none" stroke={DIM} strokeWidth={1.5} />
      {/* person */}
      <circle cx={150} cy={112} r={7} fill="none" stroke={DIM} strokeWidth={1.5} />
      <line x1={150} y1={119} x2={150} y2={140} stroke={DIM} strokeWidth={1.5} />
      <line x1={150} y1={140} x2={143} y2={155} stroke={DIM} strokeWidth={1.5} />
      <line x1={150} y1={140} x2={157} y2={155} stroke={DIM} strokeWidth={1.5} />
      {/* dog */}
      <rect x={195} y={140} width={22} height={11} rx={5} fill="none" stroke={DIM} strokeWidth={1.5} />
      <circle cx={219} cy={139} r={4.5} fill="none" stroke={DIM} strokeWidth={1.5} />
    </g>
  );
}

/* Scene 1 — the old way: thousands of looks */
function ThousandLooks({ active }: { active: boolean }) {
  return (
    <SceneFrame>
      <StreetScene />
      {active && (
        <motion.rect
          width={46}
          height={40}
          rx={5}
          fill="rgba(242,125,152,0.1)"
          stroke={ROSE}
          strokeWidth={1.5}
          animate={{
            x: [95, 150, 205, 260, 315, 95, 150, 205, 260, 315, 95, 150],
            y: [65, 65, 65, 65, 65, 105, 105, 105, 105, 105, 145, 145],
          }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
        />
      )}
      {/* counter */}
      <motion.text
        x={240}
        y={222}
        textAnchor="middle"
        fontSize={12}
        fontFamily="monospace"
        fill={ROSE}
        animate={active ? { opacity: [1, 0.5, 1] } : {}}
        transition={{ duration: 1, repeat: Infinity }}
      >
        checking region 1,847 of ~2,000…
      </motion.text>
      <text x={240} y={40} textAnchor="middle" fontSize={11} fill={FAINT}>
        old detectors asked “anything here?” thousands of times per photo
      </text>
    </SceneFrame>
  );
}

/* Scene 2 — too slow for reality */
function TooSlow({ active }: { active: boolean }) {
  return (
    <SceneFrame>
      <line x1={60} y1={160} x2={420} y2={160} stroke={FAINT} />
      {/* car driving across */}
      {active && (
        <motion.g animate={{ x: [0, 280] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 1.4, ease: "linear" }}>
          <rect x={70} y={130} width={60} height={20} rx={6} fill="rgba(96,165,250,0.12)" stroke={BLUE} strokeWidth={1.5} />
          <path d="M 82 130 L 89 119 L 114 119 L 121 130" fill="none" stroke={BLUE} strokeWidth={1.5} />
          <circle cx={84} cy={152} r={5.5} fill="none" stroke={BLUE} strokeWidth={1.5} />
          <circle cx={118} cy={152} r={5.5} fill="none" stroke={BLUE} strokeWidth={1.5} />
        </motion.g>
      )}
      {/* late detection box appearing where the car WAS */}
      {active && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 1, 1, 0] }}
          transition={{ duration: 4.4, times: [0, 0.55, 0.65, 0.9, 1], repeat: Infinity }}
        >
          <rect x={66} y={114} width={72} height={44} rx={5} fill="none" stroke={ROSE} strokeWidth={2} strokeDasharray="6 4" />
          <text x={102} y={106} textAnchor="middle" fontSize={10} fill={ROSE}>“car HERE!” …too late</text>
        </motion.g>
      )}
      <motion.text
        x={240}
        y={205}
        textAnchor="middle"
        fontSize={11.5}
        fill={DIM}
        animate={active ? { opacity: [0.5, 1, 0.5] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        20 seconds per photo — the world doesn&apos;t wait that long
      </motion.text>
      <text x={240} y={50} textAnchor="middle" fontSize={11} fill={FAINT}>
        a self-driving car needs answers in MILLIseconds
      </text>
    </SceneFrame>
  );
}

/* Scene 3 — the grid: look once */
function TheGrid({ active }: { active: boolean }) {
  return (
    <SceneFrame>
      <StreetScene />
      {/* grid drops in */}
      {Array.from({ length: 6 }, (_, c) =>
        Array.from({ length: 4 }, (_, r) => (
          <motion.rect
            key={`${c}-${r}`}
            x={90 + c * 50}
            y={60 + r * 32.5}
            width={50}
            height={32.5}
            fill="none"
            stroke="rgba(79,209,197,0.45)"
            strokeWidth={1}
            initial={{ opacity: 0 }}
            animate={active ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 + (c + r) * 0.08 }}
          />
        ))
      )}
      {/* responsible cells pulse */}
      {[
        { x: 115, y: 108, label: "person!" },
        { x: 205, y: 141, label: "dog!" },
        { x: 290, y: 125, label: "car!" },
      ].map((cell, i) => (
        <motion.g key={i} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 1.5 + i * 0.4 }}>
          <motion.rect
            x={cell.x - 25}
            y={cell.y - 16}
            width={50}
            height={32.5}
            fill="rgba(79,209,197,0.18)"
            animate={active ? { opacity: [0.4, 1, 0.4] } : {}}
            transition={{ duration: 1.6, repeat: Infinity, delay: 1.5 + i * 0.4 }}
          />
          <text x={cell.x} y={cell.y + 4} textAnchor="middle" fontSize={9} fontWeight={700} fill={TEAL}>
            {cell.label}
          </text>
        </motion.g>
      ))}
      <text x={240} y={40} textAnchor="middle" fontSize={11} fill={FAINT}>
        YOLO&apos;s idea: lay a grid — each square reports whatever is centered on it
      </text>
      <motion.text x={240} y={222} textAnchor="middle" fontSize={11} fill={TEAL} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 2.8 }}>
        all 49 squares answer in ONE look
      </motion.text>
    </SceneFrame>
  );
}

/* Scene 4 — everyone shouts: 98 boxes */
function EveryoneShouts({ active }: { active: boolean }) {
  const boxes = [
    { x: 250, y: 112, w: 84, h: 46, c: "94%" },
    { x: 262, y: 120, w: 66, h: 34, c: "81%" },
    { x: 240, y: 106, w: 100, h: 56, c: "57%" },
    { x: 128, y: 100, w: 44, h: 60, c: "89%" },
    { x: 122, y: 96, w: 56, h: 66, c: "64%" },
    { x: 190, y: 132, w: 40, h: 24, c: "68%" },
    { x: 184, y: 128, w: 50, h: 30, c: "42%" },
    { x: 348, y: 80, w: 34, h: 26, c: "31%" },
  ];
  return (
    <SceneFrame>
      <StreetScene opacity={0.55} />
      {boxes.map((b, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={active ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.25 + i * 0.18, type: "spring", stiffness: 200 }}
        >
          <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={4} fill="none" stroke={i < 3 ? BLUE : i < 5 ? AMBER : i < 7 ? TEAL : ROSE} strokeWidth={1.5} opacity={0.8} />
          <text x={b.x + 4} y={b.y - 3} fontSize={8.5} fontFamily="monospace" fill={i < 3 ? BLUE : i < 5 ? AMBER : i < 7 ? TEAL : ROSE}>
            {b.c}
          </text>
        </motion.g>
      ))}
      <motion.text
        x={240}
        y={222}
        textAnchor="middle"
        fontSize={11.5}
        fill={DIM}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={{ delay: 2 }}
      >
        one glance = 98 shouted guesses… but the same car got shouted 3 times!
      </motion.text>
      <text x={240} y={40} textAnchor="middle" fontSize={11} fill={FAINT}>
        every square shouts a box + how sure it is
      </text>
    </SceneFrame>
  );
}

/* Scene 5 — keep the best shouts: clean & fast */
function CleanAndFast({ active }: { active: boolean }) {
  return (
    <SceneFrame>
      <StreetScene />
      {/* duplicates fading out */}
      {[
        { x: 262, y: 120, w: 66, h: 34 },
        { x: 240, y: 106, w: 100, h: 56 },
        { x: 122, y: 96, w: 56, h: 66 },
      ].map((b, i) => (
        <motion.rect
          key={i}
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          rx={4}
          fill="none"
          stroke={ROSE}
          strokeWidth={1.5}
          strokeDasharray="5 4"
          initial={{ opacity: 0.8 }}
          animate={active ? { opacity: [0.8, 0.8, 0] } : {}}
          transition={{ duration: 1.6, delay: 0.6 + i * 0.3 }}
        />
      ))}
      {/* winners stay */}
      {[
        { x: 250, y: 112, w: 84, h: 46, label: "car 94%", color: BLUE },
        { x: 128, y: 100, w: 44, h: 60, label: "person 89%", color: AMBER },
        { x: 190, y: 132, w: 40, h: 24, label: "dog 68%", color: TEAL },
      ].map((b, i) => (
        <motion.g key={i} initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 1.4 + i * 0.3 }}>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={4} fill={`${b.color}14`} stroke={b.color} strokeWidth={2} />
          <rect x={b.x} y={b.y - 13} width={b.label.length * 5.6 + 8} height={12} rx={3} fill={b.color} />
          <text x={b.x + 4} y={b.y - 3.5} fontSize={8.5} fontFamily="monospace" fill="#05050a" fontWeight={700}>
            {b.label}
          </text>
        </motion.g>
      ))}
      {/* speedometer */}
      <motion.g initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 2.6 }}>
        <text x={240} y={222} textAnchor="middle" fontSize={13} fontWeight={700} fontFamily="monospace" fill={TEAL}>
          45 photos per second
        </text>
        <motion.circle
          cx={148}
          cy={218}
          r={8}
          fill="none"
          stroke={TEAL}
          strokeWidth={1.5}
          animate={active ? { opacity: [0.3, 1, 0.3] } : {}}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
        <text x={148} y={222} textAnchor="middle" fontSize={8} fill={TEAL}>⚡</text>
      </motion.g>
      <text x={240} y={40} textAnchor="middle" fontSize={11} fill={FAINT}>
        keep each object&apos;s most confident box, delete overlapping copies (that&apos;s “NMS”)
      </text>
    </SceneFrame>
  );
}

export const yoloStory: StoryScene[] = [
  {
    id: "thousand",
    caption: "Old detectors found objects by checking one photo… two thousand times.",
    sub: "Cut out a region, ask 'anything here?', repeat, repeat, repeat…",
    Art: ThousandLooks,
  },
  {
    id: "slow",
    caption: "Way too slow for the real world.",
    sub: "By the time the answer arrives, the car has already driven past. Live video needs answers in milliseconds.",
    Art: TooSlow,
  },
  {
    id: "grid",
    caption: "YOLO's idea: You Only Look Once. Lay a grid — every square reports what's centered on it.",
    sub: "49 squares, all answering at the same time, in a single glance at the whole photo.",
    Art: TheGrid,
  },
  {
    id: "shouts",
    caption: "One glance produces 98 shouted guesses — including duplicates of the same car.",
    sub: "Each square proposes boxes with a confidence score. Now we just need to clean up the shouting.",
    Art: EveryoneShouts,
  },
  {
    id: "clean",
    caption: "Keep the most confident shout per object, silence the copies — done, at 45 photos per second.",
    sub: "That cleanup is NMS — and you can drive it yourself with the sliders in the Detection Lab below.",
    Art: CleanAndFast,
  },
];
