"use client";

import * as React from "react";
import { BrainCircuit } from "lucide-react";
import {
  createNet,
  makeDataset,
  trainEpochs,
  forward,
  predict,
  accuracy,
  DATASETS,
  type DatasetId,
  type Activation,
  type Net,
  type DataPoint,
} from "@/lib/sim/neural-net";
import { SimulatorShell, type SimMode } from "../engine/simulator-shell";
import { Slider } from "@/components/ui/slider";
import { Segmented } from "@/components/ui/segmented";

const PLOT = 240; // px
const RES = 24; // boundary grid resolution
const DOMAIN = 1.15; // plot covers [-DOMAIN, DOMAIN]

const NET_W = 400;
const NET_H = 250;

const TEAL = "79,209,197";
const AMBER = "240,184,102";

function toPlot(v: number) {
  return ((v + DOMAIN) / (2 * DOMAIN)) * PLOT;
}
function fromPlot(px: number) {
  return (px / PLOT) * 2 * DOMAIN - DOMAIN;
}

export function NeuralNetSimulator() {
  const [mode, setMode] = React.useState<SimMode>("beginner");
  const [datasetId, setDatasetId] = React.useState<DatasetId>("xor");
  const [hidden, setHidden] = React.useState(4);
  const [activation, setActivation] = React.useState<Activation>("tanh");
  const [lr, setLr] = React.useState(0.6);
  const [playing, setPlaying] = React.useState(false);
  const [epoch, setEpoch] = React.useState(0);
  const [loss, setLoss] = React.useState<number | null>(null);
  const [probe, setProbe] = React.useState<{ x: number; y: number } | null>(null);
  const [, setTick] = React.useState(0); // re-render trigger for the mutable net

  const data = React.useMemo<DataPoint[]>(() => makeDataset(datasetId), [datasetId]);
  const netRef = React.useRef<Net>(createNet(hidden, activation));
  const historyRef = React.useRef<number[]>([]);

  const reset = React.useCallback(() => {
    netRef.current = createNet(hidden, activation);
    historyRef.current = [];
    setEpoch(0);
    setLoss(null);
    setPlaying(false);
    setTick((t) => t + 1);
  }, [hidden, activation]);

  // full reset when architecture or data changes
  React.useEffect(() => {
    reset();
  }, [datasetId, hidden, activation, reset]);

  const runEpochs = React.useCallback(
    (count: number) => {
      const result = trainEpochs(netRef.current, data, lr, count);
      historyRef.current.push(result.loss);
      if (historyRef.current.length > 400) historyRef.current.shift();
      setLoss(result.loss);
      setEpoch((e) => e + count);
      setTick((t) => t + 1);
    },
    [data, lr]
  );

  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => runEpochs(25), 100);
    return () => clearInterval(id);
  }, [playing, runEpochs]);

  // auto-pause once genuinely learned
  React.useEffect(() => {
    if (playing && loss !== null && loss < 0.02) setPlaying(false);
    if (playing && epoch > 16000) setPlaying(false);
  }, [playing, loss, epoch]);

  const net = netRef.current;
  const acc = loss !== null ? accuracy(net, data) : null;
  const weightCount = net.sizes
    .slice(0, -1)
    .reduce((sum, s, l) => sum + s * net.sizes[l + 1] + net.sizes[l + 1], 0);

  const probeResult = probe ? forward(net, [probe.x, probe.y]) : null;
  const probeOut = probeResult
    ? probeResult.activations[probeResult.activations.length - 1][0]
    : null;

  // ---- boundary grid (real predictions) ----
  const cells: { px: number; py: number; p: number }[] = [];
  for (let r = 0; r < RES; r++) {
    for (let c = 0; c < RES; c++) {
      const x = fromPlot(((c + 0.5) / RES) * PLOT);
      const y = fromPlot(((r + 0.5) / RES) * PLOT);
      cells.push({ px: (c / RES) * PLOT, py: (r / RES) * PLOT, p: predict(net, x, y) });
    }
  }

  // ---- network diagram geometry ----
  const layerX = net.sizes.map(
    (_, l) => 36 + (l * (NET_W - 72)) / (net.sizes.length - 1)
  );
  const neuronY = (l: number, i: number) => {
    const count = net.sizes[l];
    const gap = NET_H / (count + 1);
    return gap * (i + 1);
  };

  const explanation =
    epoch === 0
      ? `Untrained: the background is the network's current guess — random nonsense. Press play to train it with real backpropagation on the ${data.length} dots.`
      : loss !== null && loss < 0.05
        ? `Learned it! After ${epoch} epochs the background matches the dots (accuracy ${Math.round((acc ?? 0) * 100)}%). Click anywhere on the map to quiz the network.`
        : `Epoch ${epoch} — loss ${loss?.toFixed(3)}, accuracy ${Math.round((acc ?? 0) * 100)}%. Each frame: data flows forward, the error flows backward, and all ${weightCount} weights take one real step downhill.`;

  const controls = (
    <div className="space-y-5">
      <div>
        <p className="mb-1.5 text-xs font-medium text-ink-dim">Dataset</p>
        <Segmented
          size="sm"
          options={DATASETS.map((d) => ({ label: d.name.split(" ")[0], value: d.id }))}
          value={datasetId}
          onChange={(v) => setDatasetId(v as DatasetId)}
          className="w-full justify-between"
        />
        <p className="mt-1.5 text-[11px] leading-snug text-ink-faint">
          {DATASETS.find((d) => d.id === datasetId)!.hint}
        </p>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-medium text-ink-dim">Neurons per hidden layer</p>
        <Segmented
          size="sm"
          options={[3, 4, 6, 8].map((n) => ({ label: String(n), value: n }))}
          value={hidden}
          onChange={(v) => setHidden(v as number)}
          className="w-full justify-between"
        />
      </div>

      <div>
        <p className="mb-1.5 text-xs font-medium text-ink-dim">Activation</p>
        <Segmented
          size="sm"
          options={[
            { label: "tanh", value: "tanh" },
            { label: "ReLU", value: "relu" },
          ]}
          value={activation}
          onChange={(v) => setActivation(v as Activation)}
        />
      </div>

      <Slider
        label="Learning rate"
        value={lr}
        min={0.02}
        max={2}
        step={0.02}
        onChange={setLr}
        format={(v) => v.toFixed(2)}
        hint="Too high and the loss will bounce instead of falling."
      />

      <div className="space-y-1.5 border-t border-line pt-4 font-mono text-[11px]">
        <p className="flex justify-between text-ink-faint">
          <span>epoch</span>
          <span className="text-ink-dim">{epoch}</span>
        </p>
        <p className="flex justify-between text-ink-faint">
          <span>loss</span>
          <span className="text-amber">{loss === null ? "—" : loss.toFixed(4)}</span>
        </p>
        <p className="flex justify-between text-ink-faint">
          <span>accuracy</span>
          <span className="text-accent">
            {acc === null ? "—" : `${Math.round(acc * 100)}%`}
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <SimulatorShell
      icon={BrainCircuit}
      title="Backpropagation Lab"
      subtitle="A real neural network, training live in your browser"
      mode={mode}
      onModeChange={setMode}
      analogy="Teaching by correcting mistakes: the network guesses, sees how wrong it was, and passes the blame backward so every connection knows how to improve a little."
      explanation={explanation}
      transport={{
        playing,
        onPlayPause: () => setPlaying((p) => !p),
        onStep: () => runEpochs(1),
        onReset: reset,
      }}
      controls={controls}
    >
      <div className="flex flex-wrap items-start justify-center gap-6">
        {/* Decision boundary + data */}
        <div>
          <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
            What the network believes
          </p>
          <svg
            width={PLOT}
            height={PLOT}
            viewBox={`0 0 ${PLOT} ${PLOT}`}
            className="cursor-crosshair rounded-lg border border-line bg-void/70"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const scale = PLOT / rect.width;
              setProbe({
                x: fromPlot((e.clientX - rect.left) * scale),
                y: fromPlot((e.clientY - rect.top) * scale),
              });
            }}
          >
            {/* real prediction heat */}
            {cells.map((cell, i) => (
              <rect
                key={i}
                x={cell.px}
                y={cell.py}
                width={PLOT / RES + 0.5}
                height={PLOT / RES + 0.5}
                fill={
                  cell.p > 0.5
                    ? `rgba(${TEAL},${(cell.p - 0.5) * 0.85})`
                    : `rgba(${AMBER},${(0.5 - cell.p) * 0.85})`
                }
              />
            ))}
            {/* data points (ground truth) */}
            {data.map((point, i) => (
              <circle
                key={i}
                cx={toPlot(point.x)}
                cy={toPlot(point.y)}
                r={3.4}
                fill={point.label === 1 ? `rgb(${TEAL})` : `rgb(${AMBER})`}
                stroke="#05050a"
                strokeWidth={1}
              />
            ))}
            {/* probe crosshair */}
            {probe && (
              <g>
                <circle
                  cx={toPlot(probe.x)}
                  cy={toPlot(probe.y)}
                  r={7}
                  fill="none"
                  stroke="#ecedf2"
                  strokeWidth={1.5}
                />
                <circle cx={toPlot(probe.x)} cy={toPlot(probe.y)} r={1.5} fill="#ecedf2" />
              </g>
            )}
          </svg>
          <p className="mt-2 max-w-60 text-center text-[11px] leading-snug text-ink-faint">
            {probe && probeOut !== null ? (
              <>
                Network says:{" "}
                <span className={probeOut > 0.5 ? "text-accent" : "text-amber"}>
                  {Math.round((probeOut > 0.5 ? probeOut : 1 - probeOut) * 100)}%{" "}
                  {probeOut > 0.5 ? "teal" : "amber"}
                </span>{" "}
                at ({probe.x.toFixed(2)}, {probe.y.toFixed(2)})
              </>
            ) : (
              "Click anywhere on the map to quiz the network"
            )}
          </p>
        </div>

        {/* Network diagram — real weights and activations */}
        <div className="min-w-0">
          <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
            Inside the network
          </p>
          <svg
            viewBox={`0 0 ${NET_W} ${NET_H}`}
            className="w-full max-w-100 rounded-lg border border-line bg-void/70"
          >
            {/* connections: width & color = real weight value */}
            {net.weights.map((wl, l) =>
              wl.map((row, i) =>
                row.map((w, j) => (
                  <line
                    key={`${l}-${i}-${j}`}
                    x1={layerX[l]}
                    y1={neuronY(l, i)}
                    x2={layerX[l + 1]}
                    y2={neuronY(l + 1, j)}
                    stroke={w > 0 ? `rgba(${TEAL},0.9)` : "rgba(242,125,152,0.9)"}
                    strokeWidth={Math.min(5, Math.max(0.4, Math.abs(w) * 2.2))}
                    opacity={0.2 + Math.min(0.65, Math.abs(w) * 0.35)}
                  >
                    <title>
                      w = {w.toFixed(3)} ({l === 0 ? "input" : `hidden ${l}`} →{" "}
                      {l === net.weights.length - 1 ? "output" : `hidden ${l + 1}`})
                    </title>
                  </line>
                ))
              )
            )}
            {/* neurons: fill = real activation for the probe point */}
            {net.sizes.map((count, l) =>
              Array.from({ length: count }, (_, i) => {
                const a = probeResult ? probeResult.activations[l][i] : null;
                const fill =
                  a === null
                    ? "rgba(255,255,255,0.06)"
                    : a >= 0
                      ? `rgba(${TEAL},${Math.min(1, Math.abs(a)) * 0.8 + 0.06})`
                      : `rgba(242,125,152,${Math.min(1, Math.abs(a)) * 0.8 + 0.06})`;
                return (
                  <g key={`${l}-${i}`}>
                    <circle
                      cx={layerX[l]}
                      cy={neuronY(l, i)}
                      r={12}
                      fill={fill}
                      stroke="rgba(255,255,255,0.25)"
                      strokeWidth={1}
                    />
                    {mode === "advanced" && a !== null && (
                      <text
                        x={layerX[l]}
                        y={neuronY(l, i) + 3}
                        fontSize={7.5}
                        fontFamily="var(--font-mono, monospace)"
                        fill="#05050a"
                        textAnchor="middle"
                        fontWeight={700}
                      >
                        {a.toFixed(1)}
                      </text>
                    )}
                  </g>
                );
              })
            )}
            {/* layer labels */}
            {["input", "hidden 1", "hidden 2", "output"].map((label, l) => (
              <text
                key={label}
                x={layerX[l]}
                y={NET_H - 6}
                fontSize={8.5}
                fill="rgba(255,255,255,0.3)"
                textAnchor="middle"
              >
                {label}
              </text>
            ))}
          </svg>

          {/* real loss curve */}
          {mode === "advanced" && historyRef.current.length > 1 && (
            <div className="mt-3 rounded-lg border border-line bg-void/70 p-2">
              <p className="px-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
                Loss curve
              </p>
              <svg viewBox="0 0 200 44" className="w-full">
                <polyline
                  fill="none"
                  stroke={`rgb(${TEAL})`}
                  strokeWidth={1.5}
                  points={historyRef.current
                    .map((l, i) => {
                      const max = Math.max(...historyRef.current, 0.7);
                      const x = (i / (historyRef.current.length - 1)) * 196 + 2;
                      const y = 42 - (l / max) * 38;
                      return `${x.toFixed(1)},${y.toFixed(1)}`;
                    })
                    .join(" ")}
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-ink-faint">
        Everything in this lab is real: a genuine neural network ({net.sizes.join("–")}
        , {weightCount} parameters) runs and trains in your browser with true
        backpropagation. Line thickness = actual weight values; neuron colors =
        actual activations; the background map = the network&apos;s live predictions.
      </p>
    </SimulatorShell>
  );
}
