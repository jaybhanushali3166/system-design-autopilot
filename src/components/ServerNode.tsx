import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { DiagramNode, NodeType } from "../data/types";
import { FONT_BODY } from "../utils/fonts";

const COLORS: Record<NodeType, { border: string; glow: string }> = {
  client:       { border: "#4ECDC4", glow: "#4ECDC4" },
  server:       { border: "#45B7D1", glow: "#45B7D1" },
  database:     { border: "#96CEB4", glow: "#96CEB4" },
  cache:        { border: "#FFEAA7", glow: "#FFEAA7" },
  loadbalancer: { border: "#FF6B9D", glow: "#FF6B9D" },
  queue:        { border: "#C7ACFF", glow: "#C7ACFF" },
  cdn:          { border: "#FFA07A", glow: "#FFA07A" },
};

interface Props {
  node: DiagramNode;
  stressed?: boolean;
  highlighted?: boolean;
  stressStartFrame?: number;
}

export const ServerNode: React.FC<Props> = ({ node, stressed = false, highlighted = false, stressStartFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appearAt = node.appearAt ?? 0;
  const colors = COLORS[node.type];
  const isLB = node.type === "loadbalancer";

  // Spring pop-in
  const scale = spring({
    fps, frame: frame - appearAt,
    config: { damping: isLB ? 8 : 11, stiffness: isLB ? 240 : 210, mass: isLB ? 1.1 : 0.85 },
    from: 0, to: 1,
  });

  // Stress effects
  const stressProgress = stressed
    ? interpolate(frame, [stressStartFrame, stressStartFrame + 45], [0, 1], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
      })
    : 0;
  const shakeX = stressed && frame > stressStartFrame
    ? Math.sin(frame * 1.1) * 5 * stressProgress
    : 0;

  // Pulsing glow for LB
  const glowPulse = highlighted
    ? 12 + Math.sin(frame * 0.12) * 8
    : 6;

  const borderColor = stressed && stressProgress > 0.3 ? "#FF4757" : highlighted ? "#FF6B9D" : colors.border;
  const glowColor   = stressed && stressProgress > 0.3 ? "#FF4757" : highlighted ? "#FF6B9D" : colors.glow;

  if (frame < appearAt) return null;

  const w = isLB ? 162 : 108;
  const h = isLB ? 82  : 64;

  return (
    <div style={{
      position: "absolute",
      left: `${node.x}%`, top: `${node.y}%`,
      transform: `translate(-50%,-50%) scale(${scale}) translateX(${shakeX}px)`,
      display: "flex", flexDirection: "column", alignItems: "center",
    }}>
      <div style={{
        width: w, height: h,
        background: "linear-gradient(145deg, #0D0D1F 0%, #161628 100%)",
        border: `1.5px solid ${borderColor}`,
        borderRadius: 16,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
        boxShadow: `0 0 ${glowPulse}px ${glowColor}50, 0 0 ${glowPulse * 2.5}px ${glowColor}20, inset 0 1px 0 ${glowColor}20`,
        transition: "border-color 0.3s",
      }}>
        <span style={{ fontSize: isLB ? 26 : 20, lineHeight: 1 }}>{node.emoji}</span>
        <span style={{
          color: "#D8D8F0",
          fontSize: isLB ? 11.5 : 10,
          fontFamily: FONT_BODY,
          fontWeight: 600,
          letterSpacing: 0.3,
          textAlign: "center",
          lineHeight: 1.25,
        }}>
          {node.label}
        </span>
      </div>
    </div>
  );
};

export default ServerNode;
