"use client";

import * as React from "react";
import { GitBranch } from "lucide-react";
import {
  createDeepNet,
  trainDeep,
  predictDeep,
  accuracyDeep,
  type DeepNet,
} from "@/lib/sim/resnet-race";
import { makeDataset, type DataPoint, type DatasetId } from "@/lib/sim/neural-net";
import { SimulatorShell, type SimMode } from "../engine/simulator-shell";
import { Slider } from "@/components/ui/slider";
import { Segmented } from "@/components/ui/segmented";

const MAP = 170;
const RES = 20;
const DOMAIN = 1.15;
const WIDTH = 4;

const TEAL = "79,209,197";
const ROSE = "242,125,152";

function BeliefMap({
  net,
  data,
  title,
  color,
  loss,
  acc,
}: {
  net: DeepNet;
  data: DataPoint[];
  title: string;
  color: string;
  loss: number | null;
  acc: number | null;
}) {
  const cells: { px: number; py: number; p: number }[] = [];
  for (let r = 0; r < RES; r++) {
    for (let c = 0; c < RES; c++) {
      const x = (((c + 0.5) / RES) * MAP / MAP) * 2 * DOMAIN - DOMAIN;
      const y = (((r + 0.5) / RES) * MAP / MAP) * 2 * DOMAIN - DOMAIN;
      cells.push({ px: (c / RES) * MAP, py: (r / RES) * MAP, p: predictDeep(net, x, y) });
    }
  }
  const toPlot = (v: number) => ((v + DOMAIN) / (2 * DOMAIN)) * MAP;

  return (
    <div>
      <p className="mb-1.5 text-center text-[11px] font-semibold" style={{ color: `rgb(${color})` }}>
        {title}
      </p>
      <svg width={MAP} height={MAP} viewBox={`0 0 ${MAP} ${MAP}`} className="rounded-lg border border-line bg-void/70">
        {cells.map((cell, i) => (
          <rect
            key={i}
            x={cell.px}
            y={cell.py}
            width={MAP / RES + 0.5}
            height={MAP / RES + 0.5}
            fill={
              cell.p > 0.5
                ? `rgba(${TEAL},${(cell.p - 0.5) * 0.85})`
                : `rgba(${AMBER},${(0.5 - cell.p) * 0.85})`
            }
          />
        ))}
        {data.map((point, i) => (
          <circle
            key={i}
            cx={toPlot(point.x)}
            cy={toPlot(point.y)}
            r={2.6}
            fill={point.label === 1 ? `rgb(${TEAL})` : `rgb(${AMBER})`}
            stroke="#05050a"
            strokeWidth={0.8}
          />
        ))}
      </svg>
      <p className="mt-1.5 text-center font-mono text-[10px] text-ink-faint">
        loss <span style={{ color: `rgb(${color})` }}>{loss === null ? "—" : loss.toFixed(3)}</span>
        {" · "}acc{" "}
        <span style={{ color: `rgb(${color})` }}>
          {acc === null ? "—" : `${Math.round(acc * 100)}%`}
        </span>
      </p>
    </div>
  );
}

const AMBER = "240,184,102";

export function ResnetRace() {
  const [mode, setMode] = React.useState<SimMode>("beginner");
  const [depth, setDepth] = React.useState(12);
  const [datasetId, setDatasetId] = React.useState<DatasetId>("spiral");
  const [lr, setLr] = React.useState(0.2);
  const [playing, setPlaying] = React.useState(false);
  const [epoch, setEpoch] = React.useState(0);
  const [, setTick] = React.useState(0);

  const data = React.useMemo(() => makeDataset(datasetId), [datasetId]);
  const plainRef = React.useRef<DeepNet>(createDeepNet(depth, WIDTH, false));
  const resRef = React.useRef<DeepNet>(createDeepNet(depth, WIDTH, true));
  const plainHist = React.useRef<number[]>([]);
  const resHist = React.useRef<number[]>([]);
  const gradsRef = React.useRef<{ plain: number[]; res: number[] } | null>(null);
  const [losses, setLosses] = React.useState<{ plain: number | null; res: number | null }>({
    plain: null,
    res: null,
  });

  const reset = React.useCallback(() => {
    plainRef.current = createDeepNet(depth, WIDTH, false);
    resRef.current = createDeepNet(depth, WIDTH, true);
    plainHist.current = [];
    resHist.current = [];
    gradsRef.current = null;
    setEpoch(0);
    setLosses({ plain: null, res: null });
    setPlaying(false);
    setTick((t) => t + 1);
  }, [depth]);

  React.useEffect(() => {
    reset();
  }, [depth, datasetId, reset]);

  const runEpochs = React.useCallback(
    (count: number) => {
      const p = trainDeep(plainRef.current, data, lr, count);
      const r = trainDeep(resRef.current, data, lr, count);
      plainHist.current.push(p.loss);
      resHist.current.push(r.loss);
      if (plainHist.current.length > 300) {
        plainHist.current.shift();
        resHist.current.shift();
      }
      gradsRef.current = { plain: p.layerGradNorms, res: r.layerGradNorms };
      setLosses({ plain: p.loss, res: r.loss });
      setEpoch((e) => e + count);
      setTick((t) => t + 1);
    },
    [data, lr]
  );

  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => runEpochs(40), 110);
    return () => clearInterval(id);
  }, [playing, runEpochs]);

  React.useEffect(() => {
    if (playing && ((losses.res !== null && losses.res < 0.015 && epoch > 800) || epoch > 14000))
      setPlaying(false);
  }, [playing, losses.res, epoch]);

  const plainAcc = losses.plain !== null ? accuracyDeep(plainRef.current, data) : null;
  const resAcc = losses.res !== null ? accuracyDeep(resRef.current, data) : null;

  const signalRatio =
    gradsRef.current && gradsRef.current.plain[0] > 0
      ? gradsRef.current.res[0] / gradsRef.current.plain[0]
      : null;

  const explanation =
    epoch === 0
      ? `Two identical ${depth}-layer networks, same data, same starting luck. The ONLY difference: the teal one adds its input back to every layer's output — y = F(x) + x, the paper's one-line idea. Press play and watch them race.`
      : losses.res !== null && losses.res < 0.05 && (losses.plain ?? 1) > 0.4
        ? `The verdict after ${epoch} epochs: the plain ${depth}-layer network is stuck at ${Math.round((plainAcc ?? 0) * 100)}% (barely better than guessing) while the ResNet reached ${Math.round((resAcc ?? 0) * 100)}%. Same depth, same data — this is the degradation problem from the paper's Figure 1, reproduced live.`
        : `Epoch ${epoch}: plain loss ${losses.plain?.toFixed(3)} vs ResNet ${losses.res?.toFixed(3)}. The gradient bars below show why — the skip connections deliver ${signalRatio && signalRatio > 3 ? `about ${Math.round(signalRatio)}× more` : "far more"} learning signal to the earliest layers.`;

  const controls = (
    <div className="space-y-5">
      <div>
        <p className="mb-1.5 text-xs font-medium text-ink-dim">Depth (hidden layers)</p>
        <Segmented
          size="sm"
          options={[8, 12, 16].map((d) => ({ label: String(d), value: d }))}
          value={depth}
          onChange={(v) => setDepth(v as number)}
          className="w-full justify-between"
        />
        <p className="mt-1.5 text-[11px] leading-snug text-ink-faint">
          Deeper should mean better — that's exactly what broke before ResNet.
        </p>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-medium text-ink-dim">Dataset</p>
        <Segmented
          size="sm"
          options={[
            { label: "Circle", value: "circle" },
            { label: "Spiral", value: "spiral" },
          ]}
          value={datasetId}
          onChange={(v) => setDatasetId(v as DatasetId)}
        />
      </div>

      <Slider
        label="Learning rate"
        value={lr}
        min={0.05}
        max={0.8}
        step={0.05}
        onChange={setLr}
        format={(v) => v.toFixed(2)}
        hint="Both networks always get the same rate — a fair race."
      />
    </div>
  );

  return (
    <SimulatorShell
      icon={GitBranch}
      title="ResNet Lab: the skip-connection race"
      subtitle="Two real deep networks train live — one plain, one residual"
      mode={mode}
      onModeChange={setMode}
      analogy="Passing a message through 12 rooms of people. Plain network: each room must re-tell everything from scratch. ResNet: each room gets the original note and just adds a correction to it."
      explanation={explanation}
      transport={{
        playing,
        onPlayPause: () => setPlaying((p) => !p),
        onStep: () => runEpochs(40),
        onReset: reset,
      }}
      controls={controls}
    >
      {/* the two racers */}
      <div className="flex flex-wrap items-start justify-center gap-6">
        <BeliefMap
          net={plainRef.current}
          data={data}
          title={`Plain · ${depth} layers`}
          color={ROSE}
          loss={losses.plain}
          acc={plainAcc}
        />
        <BeliefMap
          net={resRef.current}
          data={data}
          title={`ResNet · ${depth} layers + skips`}
          color={TEAL}
          loss={losses.res}
          acc={resAcc}
        />

        {/* loss race chart */}
        <div className="min-w-52 flex-1">
          <p className="mb-1.5 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
            The race — loss over time
          </p>
          <div className="rounded-lg border border-line bg-void/70 p-2">
            <svg viewBox="0 0 220 120" className="w-full">
              {[plainHist.current, resHist.current].map((hist, hi) => {
                if (hist.length < 2) return null;
                const max = Math.max(...plainHist.current, ...resHist.current, 0.75);
                return (
                  <polyline
                    key={hi}
                    fill="none"
                    stroke={hi === 0 ? `rgb(${ROSE})` : `rgb(${TEAL})`}
                    strokeWidth={1.8}
                    points={hist
                      .map((l, i) => {
                        const x = (i / (hist.length - 1)) * 212 + 4;
                        const y = 114 - (l / max) * 106;
                        return `${x.toFixed(1)},${y.toFixed(1)}`;
                      })
                      .join(" ")}
                  />
                );
              })}
              {plainHist.current.length < 2 && (
                <text x={110} y={62} fontSize={9} fill="rgba(255,255,255,0.3)" textAnchor="middle">
                  press play to start the race
                </text>
              )}
            </svg>
            <div className="flex justify-center gap-4 pb-1 text-[10px]">
              <span className="flex items-center gap-1.5 text-ink-faint">
                <span className="h-0.5 w-4 rounded" style={{ background: `rgb(${ROSE})` }} />
                plain
              </span>
              <span className="flex items-center gap-1.5 text-ink-faint">
                <span className="h-0.5 w-4 rounded" style={{ background: `rgb(${TEAL})` }} />
                ResNet
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* gradient highway bars */}
      {gradsRef.current && (
        <div className="mt-5">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
            Learning signal reaching each layer{" "}
            <span className="normal-case tracking-normal">(real gradient magnitudes, log scale)</span>
          </p>
          <div className="space-y-1 rounded-xl border border-line bg-void/70 p-3">
            {gradsRef.current.plain.map((gPlain, l) => {
              const gRes = gradsRef.current!.res[l];
              const bar = (g: number) =>
                `${Math.max(2, Math.min(100, ((Math.log10(Math.max(g, 1e-9)) + 9) / 9) * 100))}%`;
              return (
                <div key={l} className="flex items-center gap-2">
                  <span className="w-14 shrink-0 text-right font-mono text-[9px] text-ink-faint">
                    {l === 0 ? "layer 1" : l === gradsRef.current!.plain.length - 1 ? "output" : `layer ${l + 1}`}
                  </span>
                  <div className="flex-1 space-y-px">
                    <div className="h-1.5 rounded-full bg-white/[0.04]">
                      <div
                        className="h-full rounded-full transition-all duration-200"
                        style={{ width: bar(gPlain), background: `rgba(${ROSE},0.8)` }}
                        title={`plain: ${gPlain.toExponential(2)}`}
                      />
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.04]">
                      <div
                        className="h-full rounded-full transition-all duration-200"
                        style={{ width: bar(gRes), background: `rgba(${TEAL},0.8)` }}
                        title={`ResNet: ${gRes.toExponential(2)}`}
                      />
                    </div>
                  </div>
                  {mode === "advanced" && (
                    <span className="w-24 shrink-0 font-mono text-[9px] text-ink-faint">
                      {gPlain.toExponential(1)} / {gRes.toExponential(1)}
                    </span>
                  )}
                </div>
              );
            })}
            <p className="pt-1.5 text-[10px] text-ink-faint">
              Layer 1 is furthest from the answer. In the plain network its signal
              fades layer by layer; the skips give it a direct highway back.
            </p>
          </div>
        </div>
      )}

      <p className="mt-4 text-[11px] leading-relaxed text-ink-faint">
        100% real: both networks genuinely train in your browser with exact
        backpropagation (gradients verified against finite differences to
        ~1e-10). The residual network computes literally y = F(x) + x, the
        equation from the paper. Same initialization luck, same data, same
        learning rate — the skips are the only difference.
      </p>
    </SimulatorShell>
  );
}
