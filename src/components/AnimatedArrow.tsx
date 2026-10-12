import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { DiagramEdge, DiagramNode } from "../data/types";

interface Props {
  edge: DiagramEdge;
  nodes: DiagramNode[];
  W: number; H: number;
}

export const AnimatedArrow: React.FC<Props> = ({ edge, nodes, W, H }) => {
  const frame = useCurrentFrame();
  const from = nodes.find(n => n.id === edge.from);
  const to   = nodes.find(n => n.id === edge.to);
  if (!from || !to) return null;

  const x1 = (from.x / 100) * W;
  const y1 = (from.y / 100) * H;
  const x2 = (to.x / 100) * W;
  const y2 = (to.y / 100) * H;

  const drawAt      = edge.drawAt ?? 0;
  const packetDelay = edge.packetDelay ?? 25;
  const color       = edge.color ?? "#4ECDC4";

  // ── Line draw-on via stroke-dashoffset ───────────────────────────────────
  const lineLength  = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const drawDur     = 18; // frames to draw the line
  const drawProg    = interpolate(frame - drawAt, [0, drawDur], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const dashOffset  = lineLength * (1 - drawProg);

  // Arrow head visibility
  const arrowOpacity = interpolate(frame - drawAt, [drawDur - 4, drawDur + 4], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // ── Packet — only after line fully drawn ─────────────────────────────────
  const packetStart = drawAt + drawDur + packetDelay;
  const cycleLength = 65;
  const packetT = frame >= packetStart
    ? interpolate((frame - packetStart) % cycleLength, [0, 48], [0, 1], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
      })
    : -1;

  const packetX = x1 + (x2 - x1) * packetT;
  const packetY = y1 + (y2 - y1) * packetT;

  // Arrow head geometry
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const tipOffset = to.type === "loadbalancer" ? 42 : 32;
  const tipX = x2 - Math.cos(angle) * tipOffset;
  const tipY = y2 - Math.sin(angle) * tipOffset;
  const hs = 9;
  const lx = tipX - Math.cos(angle - Math.PI / 6) * hs;
  const ly = tipY - Math.sin(angle - Math.PI / 6) * hs;
  const rx = tipX - Math.cos(angle + Math.PI / 6) * hs;
  const ry = tipY - Math.sin(angle + Math.PI / 6) * hs;

  if (frame < drawAt) return null;

  return (
    <g>
      {/* Draw-on line */}
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color}
        strokeWidth={2}
        strokeOpacity={0.55}
        strokeLinecap="round"
        strokeDasharray={lineLength}
        strokeDashoffset={dashOffset}
      />

      {/* Arrow head */}
      <polygon
        points={`${tipX},${tipY} ${lx},${ly} ${rx},${ry}`}
        fill={color}
        opacity={arrowOpacity * 0.85}
      />

      {/* Data packet */}
      {packetT >= 0 && packetT <= 1 && (
        <>
          {/* Glow halo */}
          <circle cx={packetX} cy={packetY} r={11} fill={color} opacity={0.15} />
          {/* Core dot */}
          <circle cx={packetX} cy={packetY} r={5.5} fill={color} opacity={0.95} />
        </>
      )}
    </g>
  );
};

export default AnimatedArrow;
