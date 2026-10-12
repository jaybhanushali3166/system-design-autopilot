/**
 * ThinkingOrb.tsx
 *
 * A reusable animated "thinking orb" — a glowing pulsing circle
 * used to visually emphasize concepts. Renders a floating orb
 * with a label inside, a soft glow, and a breathing pulse animation.
 */

import React from "react";
import { spring, interpolate } from "remotion";
import { FONT_HEAD } from "../../utils/fonts";

export interface ThinkingOrbProps {
  x: number;
  y: number;
  size: number;
  color: string;
  label: string;
  delay?: number;
  floatSpeed?: number;
  frame: number;
  fps: number;
  opacity?: number;
  sublabel?: string;
}

export const ThinkingOrb: React.FC<ThinkingOrbProps> = ({
  x,
  y,
  size,
  color,
  label,
  delay = 0,
  floatSpeed = 0.03,
  frame,
  fps,
  opacity = 1,
  sublabel,
}) => {
  const localFrame = Math.max(0, frame - delay);

  // Entrance spring — orb pops in from 0 → 1 scale
  const enterScale = spring({
    fps,
    frame: localFrame,
    config: { damping: 12, stiffness: 160 },
    from: 0,
    to: 1,
  });

  // Fade in
  const enterOp = interpolate(localFrame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Breathing pulse — oscillates border + glow
  const pulse = 0.5 + Math.sin(frame * 0.07) * 0.5; // 0 → 1

  // Floating vertical movement
  const floatY = Math.sin(frame * floatSpeed + delay) * 10;
  const glowSize = size * 0.25 + pulse * size * 0.12;

  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2 + floatY,
        width: size,
        height: size,
        transform: `scale(${enterScale})`,
        opacity: enterOp * opacity,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      {/* Glow layer */}
      <div
        style={{
          position: "absolute",
          inset: -glowSize,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color}35 0%, ${color}00 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Orb body */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: `radial-gradient(circle at 38% 35%, ${color}30 0%, ${color}12 60%, rgba(10,15,30,0.8) 100%)`,
          border: `${2 + pulse * 1.5}px solid ${color}`,
          boxShadow: `0 0 ${18 + pulse * 14}px ${color}55, inset 0 0 ${15 + pulse * 10}px ${color}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          padding: 8,
          backdropFilter: "blur(6px)",
        }}
      >
        <span
          style={{
            color: "#FFFFFF",
            fontFamily: FONT_HEAD,
            fontWeight: 800,
            fontSize: Math.max(13, Math.round(size * 0.11)),
            letterSpacing: 0.5,
            textAlign: "center",
            lineHeight: 1.15,
            textShadow: "0 2px 8px rgba(0,0,0,0.8)",
          }}
        >
          {label}
        </span>
        {sublabel && (
          <span
            style={{
              color: color,
              fontFamily: FONT_HEAD,
              fontWeight: 700,
              fontSize: Math.max(10, Math.round(size * 0.08)),
              letterSpacing: 0.5,
              marginTop: 4,
              textAlign: "center",
              lineHeight: 1.1,
            }}
          >
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};

export default ThinkingOrb;

