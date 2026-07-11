"use client";

import * as React from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeProps,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { AnimatePresence, motion } from "framer-motion";
import { MousePointerClick, Lightbulb, Microscope, Quote, Play, Square } from "lucide-react";
import type { ArchNode, ArchEdge, ArchNodeKind } from "@/lib/data/types";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

const KIND_STYLES: Record<ArchNodeKind, { border: string; bg: string; dot: string }> = {
  io: { border: "border-line-strong", bg: "bg-raised", dot: "bg-ink-faint" },
  process: { border: "border-accent/40", bg: "bg-accent/[0.07]", dot: "bg-accent" },
  core: { border: "border-primary/50", bg: "bg-primary/[0.1]", dot: "bg-primary-bright" },
  support: { border: "border-line", bg: "bg-white/[0.03]", dot: "bg-amber" },
};

type FlowNodeData = { arch: ArchNode; selected: boolean };

function ArchFlowNode({ data }: NodeProps<Node<FlowNodeData>>) {
  const style = KIND_STYLES[data.arch.kind];
  return (
    <div
      className={cn(
        "w-56 rounded-xl border px-4 py-3 backdrop-blur transition-all cursor-pointer",
        style.border,
        style.bg,
        data.selected &&
          "shadow-[0_0_28px_-6px_rgba(59,130,246,0.8)] scale-[1.03] border-primary"
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-white/20 !border-0 !w-2 !h-2" />
      <div className="flex items-center gap-2">
        <span className={cn("size-1.5 rounded-full", style.dot)} />
        <p className="text-[13px] font-semibold text-ink">{data.arch.label}</p>
      </div>
      <p className="mt-0.5 pl-3.5 font-mono text-[10px] text-ink-faint">
        {data.arch.sublabel}
      </p>
      <Handle type="source" position={Position.Bottom} className="!bg-white/20 !border-0 !w-2 !h-2" />
    </div>
  );
}

const nodeTypes: NodeTypes = { arch: ArchFlowNode };

export function ArchitectureExplorer({
  nodes: archNodes,
  edges: archEdges,
}: {
  nodes: ArchNode[];
  edges: ArchEdge[];
}) {
  const [selectedId, setSelectedId] = React.useState<string>(
    archNodes.find((n) => n.kind === "core")?.id ?? archNodes[0].id
  );
  const [journey, setJourney] = React.useState(false);
  const selected = archNodes.find((n) => n.id === selectedId)!;
  const selectedIndex = archNodes.indexOf(selected);

  // "Follow the data" mode: auto-walk the pipeline top to bottom
  React.useEffect(() => {
    if (!journey) return;
    const id = setInterval(() => {
      setSelectedId((prev) => {
        const i = archNodes.findIndex((n) => n.id === prev);
        if (i >= archNodes.length - 1) {
          setJourney(false);
          return prev;
        }
        return archNodes[i + 1].id;
      });
    }, 3400);
    return () => clearInterval(id);
  }, [journey, archNodes]);

  function startJourney() {
    setSelectedId(archNodes[0].id);
    setJourney(true);
  }

  const flowNodes: Node<FlowNodeData>[] = React.useMemo(
    () =>
      archNodes.map((arch, i) => ({
        id: arch.id,
        type: "arch",
        position: { x: 0, y: i * 104 },
        data: { arch, selected: arch.id === selectedId },
        draggable: false,
      })),
    [archNodes, selectedId]
  );

  const flowEdges: Edge[] = React.useMemo(
    () =>
      archEdges.map((e) => ({
        id: `${e.source}-${e.target}`,
        source: e.source,
        target: e.target,
        animated: true,
      })),
    [archEdges]
  );

  return (
    <GlassCard className="overflow-hidden">
      <div className="grid lg:grid-cols-[minmax(0,380px)_1fr]">
        {/* Diagram */}
        <div className="h-[460px] border-b border-line bg-void/50 lg:h-[560px] lg:border-b-0 lg:border-r">
          <ReactFlow
            nodes={flowNodes}
            edges={flowEdges}
            nodeTypes={nodeTypes}
            onNodeClick={(_, node) => setSelectedId(node.id)}
            fitView
            fitViewOptions={{ padding: 0.15 }}
            zoomOnScroll={false}
            preventScrolling={false}
            proOptions={{ hideAttribution: true }}
            colorMode="dark"
          >
            <Background color="rgba(255,255,255,0.06)" gap={24} />
            <Controls showInteractive={false} />
          </ReactFlow>
        </div>

        {/* Detail panel */}
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
              <MousePointerClick className="size-3.5" />
              Click any block to inspect it
            </p>
            <button
              onClick={() => (journey ? setJourney(false) : startJourney())}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer",
                journey
                  ? "border-accent/50 bg-accent/10 text-accent"
                  : "border-line text-ink-dim hover:border-primary/40 hover:text-ink"
              )}
            >
              {journey ? <Square className="size-3" /> : <Play className="size-3" />}
              {journey ? "Stop the tour" : "Follow the data"}
            </button>
          </div>

          {/* journey progress */}
          {journey && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-[10px] text-ink-faint">
                <span>
                  Stop {selectedIndex + 1} of {archNodes.length}
                </span>
                <span className="text-accent">auto-touring the pipeline…</span>
              </div>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/8">
                <motion.div
                  animate={{ width: `${((selectedIndex + 1) / archNodes.length) * 100}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 22 }}
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.22 }}
              className="mt-4"
            >
              <h4 className="text-xl font-semibold">{selected.label}</h4>
              <p className="mt-0.5 font-mono text-xs text-primary-bright">
                {selected.sublabel}
              </p>

              <p className="mt-4 text-[15px] leading-relaxed text-ink-dim">
                {selected.description}
              </p>

              <div className="mt-5 space-y-3">
                <div className="rounded-xl border border-accent/20 bg-accent/[0.05] p-4">
                  <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                    <Quote className="size-3.5" />
                    Example
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-dim">
                    {selected.example}
                  </p>
                </div>
                <div className="rounded-xl border border-amber/20 bg-amber/[0.04] p-4">
                  <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-amber">
                    <Microscope className="size-3.5" />
                    Go deeper
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-dim">
                    {selected.detail}
                  </p>
                </div>
              </div>

              <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-ink-faint">
                <Lightbulb className="mt-0.5 size-3.5 shrink-0" />
                Tip: follow the animated edges top-to-bottom — that is the exact
                journey a sentence takes through the model.
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </GlassCard>
  );
}
