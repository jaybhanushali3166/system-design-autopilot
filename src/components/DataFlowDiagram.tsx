import React from "react";
import { DiagramNode, DiagramEdge } from "../data/types";
import ServerNodeDefault, { ServerNode as ServerNodeNamed } from "./ServerNode";
import AnimatedArrowDefault, { AnimatedArrow as AnimatedArrowNamed } from "./AnimatedArrow";

const ActualServerNode = ServerNodeNamed || (ServerNodeDefault as any)?.default || ServerNodeDefault;
const ActualAnimatedArrow = AnimatedArrowNamed || (AnimatedArrowDefault as any)?.default || AnimatedArrowDefault;

interface Props {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  width: number; height: number;
  stressNodeId?: string;
  highlightNodeId?: string;
  stressStartFrame?: number;
}

export const DataFlowDiagram: React.FC<Props> = ({ nodes, edges, width, height, stressNodeId, highlightNodeId, stressStartFrame }) => (
  <div style={{ position: "relative", width, height }}>
    <svg style={{ position: "absolute", top: 0, left: 0, width, height, overflow: "visible" }}>
      {edges.map(edge => (
        <ActualAnimatedArrow key={`${edge.from}-${edge.to}`} edge={edge} nodes={nodes} W={width} H={height} />
      ))}
    </svg>
    {nodes.map(node => (
      <ActualServerNode
        key={node.id} node={node}
        stressed={node.id === stressNodeId}
        highlighted={node.id === highlightNodeId}
        stressStartFrame={stressStartFrame}
      />
    ))}
  </div>
);

export default DataFlowDiagram;
