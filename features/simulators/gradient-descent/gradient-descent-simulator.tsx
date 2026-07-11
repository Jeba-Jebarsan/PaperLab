"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Mountain } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  simulateDescent,
  classifyOutcome,
  loss,
  OUTCOME_EXPLANATIONS,
  W_MIN,
  W_MAX,
} from "@/lib/sim/gradient-descent";
import { SimulatorShell, type SimMode } from "../engine/simulator-shell";
import { Slider } from "@/components/ui/slider";

const VB_W = 640;
const VB_H = 260;
const PAD = 18;

function project(w: number, l: number, lossMax: number, lossMin: number) {
  const x = PAD + ((w - W_MIN) / (W_MAX - W_MIN)) * (VB_W - 2 * PAD);
  const y = PAD + ((lossMax - l) / (lossMax - lossMin)) * (VB_H - 2 * PAD);
  return { x, y };
}

export function GradientDescentSimulator({ compact = false }: { compact?: boolean }) {
  const [mode, setMode] = React.useState<SimMode>("beginner");
  const [lr, setLr] = React.useState(0.08);
  const [momentum, setMomentum] = React.useState(0.0);
  const [startW, setStartW] = React.useState(-4.2);
  const [step, setStep] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);

  const path = React.useMemo(
    () => simulateDescent(startW, lr, momentum, 80),
    [startW, lr, momentum]
  );

  // restart animation when parameters change
  React.useEffect(() => {
    setStep(0);
  }, [lr, momentum, startW]);

  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setStep((s) => {
        if (s >= path.length - 1) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 110);
    return () => clearInterval(id);
  }, [playing, path.length]);

  // landscape geometry + valley locations
  const { curve, lossMin, lossMax, globalMin, localMin } = React.useMemo(() => {
    const samples: { w: number; l: number }[] = [];
    for (let w = W_MIN; w <= W_MAX; w += 0.08) samples.push({ w, l: loss(w) });
    const ls = samples.map((s) => s.l);
    const lossMin = Math.min(...ls) - 0.6;
    const lossMax = Math.max(...ls) + 0.6;
    const curve = samples
      .map((s, i) => {
        const { x, y } = project(s.w, s.l, lossMax, lossMin);
        return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ");
    const right = samples.filter((s) => s.w > 0);
    const left = samples.filter((s) => s.w < 0);
    const globalMin = right.reduce((a, b) => (b.l < a.l ? b : a));
    const localMin = left.reduce((a, b) => (b.l < a.l ? b : a));
    return { curve, lossMin, lossMax, globalMin, localMin };
  }, []);

  const current = path[Math.min(step, path.length - 1)];
  const ball = project(current.w, current.loss, lossMax, lossMin);
  const flagPos = project(globalMin.w, globalMin.l, lossMax, lossMin);
  const localPos = project(localMin.w, localMin.l, lossMax, lossMin);
  const finished = step >= path.length - 1;
  const outcome = finished ? classifyOutcome(path) : "running";
  const celebrating = finished && outcome === "converged-global";

  const explanation =
    !playing && step === 0
      ? "Press play to drop the ball! It always rolls downhill toward lower loss — that is how a neural network learns. Can you get it to the flag?"
      : OUTCOME_EXPLANATIONS[outcome];

  const chartData = path
    .slice(0, step + 1)
    .map((p, i) => ({ iteration: i, loss: Number(p.loss.toFixed(3)) }));

  const controls = (
    <div className="space-y-5">
      <Slider
        label="Learning rate"
        value={lr}
        min={0.01}
        max={1.1}
        step={0.01}
        onChange={setLr}
        format={(v) => v.toFixed(2)}
        hint="Step size. Too small: slow. Too big: the ball jumps wildly."
      />
      <Slider
        label="Momentum"
        value={momentum}
        min={0}
        max={0.95}
        step={0.05}
        onChange={setMomentum}
        format={(v) => v.toFixed(2)}
        hint="Lets the ball keep rolling — it can escape small dips."
      />
      <Slider
        label="Starting position"
        value={startW}
        min={-4.5}
        max={4.5}
        step={0.1}
        onChange={setStartW}
        format={(v) => v.toFixed(1)}
        hint="Where on the hill the ball begins."
      />
    </div>
  );

  return (
    <SimulatorShell
      icon={Mountain}
      title="Gradient Descent Lab"
      subtitle="How neural networks actually learn"
      mode={mode}
      onModeChange={setMode}
      analogy="A ball rolling down a foggy mountain: it can only feel the slope right under its feet, and the learning rate is the size of each hop."
      explanation={explanation}
      transport={{
        playing,
        onPlayPause: () => {
          if (finished) setStep(0);
          setPlaying((p) => !p);
        },
        onStep: () => setStep((s) => Math.min(s + 1, path.length - 1)),
        onReset: () => {
          setPlaying(false);
          setStep(0);
        },
      }}
      controls={controls}
    >
      <div className="rounded-xl border border-line bg-void/60 p-2">
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full">
          <defs>
            <linearGradient id="gd-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(59,130,246,0.28)" />
              <stop offset="100%" stopColor="rgba(59,130,246,0)" />
            </linearGradient>
          </defs>

          {/* loss surface */}
          <path
            d={`${curve} L ${VB_W - PAD} ${VB_H} L ${PAD} ${VB_H} Z`}
            fill="url(#gd-fill)"
            opacity={0.5}
          />
          <path d={curve} fill="none" stroke="rgba(59,130,246,0.7)" strokeWidth={2} />

          {/* goal flag at the global minimum */}
          <g transform={`translate(${flagPos.x}, ${flagPos.y})`}>
            <line x1="0" y1="0" x2="0" y2="-26" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
            <motion.path
              d="M 0 -26 L 16 -21 L 0 -16 Z"
              fill={celebrating ? "#4fd1c5" : "#f0b866"}
              animate={celebrating ? { scale: [1, 1.25, 1] } : { skewY: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: celebrating ? 0.7 : 2 }}
            />
            <text x="0" y="14" fontSize="10" fill="rgba(255,255,255,0.4)" textAnchor="middle">
              goal (global minimum)
            </text>
          </g>

          {/* local-minimum trap label */}
          <text
            x={localPos.x}
            y={localPos.y + 14}
            fontSize="10"
            fill="rgba(255,255,255,0.35)"
            textAnchor="middle"
          >
            trap! (local minimum)
          </text>

          {/* trail */}
          {path.slice(0, step + 1).map((p, i) => {
            const pos = project(p.w, p.loss, lossMax, lossMin);
            return (
              <circle
                key={i}
                cx={pos.x}
                cy={pos.y}
                r={2.2}
                fill="#4fd1c5"
                opacity={0.15 + (i / (step + 1)) * 0.5}
              />
            );
          })}

          {/* celebration ring when the ball reaches the goal */}
          {celebrating && (
            <motion.circle
              cx={ball.x}
              cy={ball.y - 7}
              fill="none"
              stroke="#4fd1c5"
              strokeWidth={2}
              initial={{ r: 8, opacity: 0.9 }}
              animate={{ r: 30, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.1, ease: "easeOut" }}
            />
          )}

          {/* ball */}
          <motion.circle
            animate={{ cx: ball.x, cy: ball.y - 7 }}
            transition={{ duration: 0.1, ease: "linear" }}
            r={7}
            fill="#f0b866"
            stroke="#05050a"
            strokeWidth={1.5}
            style={{ filter: "drop-shadow(0 0 8px rgba(240,184,102,0.7))" }}
          />
        </svg>

        <div className="flex items-center justify-between px-3 pb-2 font-mono text-[11px] text-ink-faint">
          <span>
            step <span className="text-ink-dim">{step}</span>/{path.length - 1}
          </span>
          <span>
            w = <span className="text-primary-bright">{current.w.toFixed(3)}</span>
          </span>
          <span>
            loss = <span className="text-amber">{current.loss.toFixed(3)}</span>
          </span>
        </div>
      </div>

      {!compact && mode === "advanced" && (
        <div className="mt-4 rounded-xl border border-line bg-void/60 p-3">
          <p className="mb-1 px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
            Loss over iterations
          </p>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 6, right: 8, bottom: 0, left: -18 }}>
                <XAxis
                  dataKey="iteration"
                  stroke="rgba(255,255,255,0.2)"
                  tick={{ fontSize: 10, fill: "rgba(255,255,255,0.35)" }}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.2)"
                  tick={{ fontSize: 10, fill: "rgba(255,255,255,0.35)" }}
                  domain={["auto", "auto"]}
                />
                <Tooltip
                  contentStyle={{
                    background: "#12121f",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "rgba(255,255,255,0.5)" }}
                />
                <Line
                  type="monotone"
                  dataKey="loss"
                  stroke="#4fd1c5"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </SimulatorShell>
  );
}
