"use client";

import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

interface MapVisualizationProps {
  nodes: Node[];
  edges: Edge[];
}

export default function MapVisualization({
  nodes,
  edges,
}: MapVisualizationProps) {
  return (
    <div className="h-[70vh] w-full overflow-hidden rounded-md border border-slate-800 bg-slate-900">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable
        nodesConnectable={false}
        edgesFocusable={false}
        proOptions={{ hideAttribution: false }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#475569"
        />
        <Controls showInteractive={false} />
        <MiniMap
          pannable
          zoomable
          maskColor="rgba(15, 23, 42, 0.7)"
          nodeColor="#64748b"
        />
      </ReactFlow>
    </div>
  );
}
