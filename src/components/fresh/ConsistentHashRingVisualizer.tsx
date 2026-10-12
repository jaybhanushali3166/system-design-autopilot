/**
 * ConsistentHashRingVisualizer.tsx
 *
 * Professional Architectural 360° Consistent Hash Ring.
 * Designed for senior engineering audience:
 * - Ultra-clean technical aesthetics (minimalist dark UI, crisp SVG vector rings)
 * - Server nodes rendered as sleek server rack tags with live status & angle degrees
 * - Smooth, high-precision clockwise routing arc to visually demonstrate O(K/N) relocation
 * - No bouncy cartoon bubbles, no emojis, zero wobble
 */

import React from "react";
import { interpolate } from "remotion";
import { FONT_HEAD, FONT_BODY } from "../../utils/fonts";

interface Props {
  frame: number;
  fps: number;
  stage: "empty" | "servers" | "keys" | "add_server";
}

interface ServerNode {
  id: string;
  name: string;
  sub: string;
  angleDeg: number;
  color: string;
}

interface KeyItem {
  id: string;
  name: string;
  hashAngle: number;
  targetServer: string;
  routedAngle: number;
}

export const ConsistentHashRingVisualizer: React.FC<Props> = ({ frame, stage }) => {
  const cx = 540;
  const cy = 720;
  const radius = 280;

  // Active server pool
  const baseServers: ServerNode[] = [
    { id: "s1", name: "Node A", sub: "cache-01", angleDeg: 30, color: "#10B981" },
    { id: "s2", name: "Node B", sub: "cache-02", angleDeg: 150, color: "#3B82F6" },
    { id: "s3", name: "Node C", sub: "cache-03", angleDeg: 270, color: "#8B5CF6" },
  ];

  const newNode: ServerNode = {
    id: "s4",
    name: "Node D (New)",
    sub: "scale-out",
    angleDeg: 210,
    color: "#06B6D4",
  };

  const servers = stage === "add_server" ? [...baseServers, newNode] : baseServers;

  // Tracked cache keys with deterministic clockwise target angles
  // s1=30, s2=150, s3=270, s4=210
  // k1 (user:1082): angle 350 -> clockwise walks past 360 to 30 (Node A)
  // k2 (session:94): angle 90 -> clockwise walks to 150 (Node B)
  // k3 (video:7401): angle 180 -> if no Node D walks to 270 (Node C), with Node D walks to 210 (Node D)
  const keys: KeyItem[] = [
    { id: "k1", name: 'key("user:1082")', hashAngle: 350, targetServer: "Node A", routedAngle: 30 },
    { id: "k2", name: 'key("session:94")', hashAngle: 90, targetServer: "Node B", routedAngle: 150 },
    {
      id: "k3",
      name: 'key("video:7401")',
      hashAngle: 180,
      targetServer: stage === "add_server" ? "Node D" : "Node C",
      routedAngle: stage === "add_server" ? 210 : 270,
    },
  ];

  // Smooth entrance interpolation (linear/cubic ease, strictly no bounce)
  const ringProgress = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "relative",
        width: 1080,
        height: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: 1080,
          height: 1000,
          overflow: "visible",
        }}
      >
        <defs>
          {/* Subtle architectural radial backdrop */}
          <radialGradient id="ringSubtleBackdrop" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.06" />
            <stop offset="80%" stopColor="#06B6D4" stopOpacity="0.01" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx={cx} cy={cy} r={radius * 1.3} fill="url(#ringSubtleBackdrop)" />

        {/* 1. Underlying technical grid degree markers */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = cx + (radius - 12) * Math.cos(rad);
          const y1 = cy + (radius - 12) * Math.sin(rad);
          const x2 = cx + (radius + 12) * Math.cos(rad);
          const y2 = cy + (radius + 12) * Math.sin(rad);
          return (
            <line
              key={deg}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1.5"
            />
          );
        })}

        {/* 2. Base Ring Track */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="2"
        />

        {/* 3. Cyan Active Boundary */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#06B6D4"
          strokeWidth="2"
          strokeDasharray={`${2 * Math.PI * radius * ringProgress} ${2 * Math.PI * radius}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          opacity={0.8}
        />

        {/* 4. Directional Clockwise Arrows */}
        {[75, 195, 315].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const arrowX = cx + radius * Math.cos(rad);
          const arrowY = cy + radius * Math.sin(rad);
          return (
            <path
              key={deg}
              d={`M ${arrowX - 4} ${arrowY - 6} L ${arrowX + 4} ${arrowY} L ${arrowX - 4} ${arrowY + 6}`}
              fill="none"
              stroke="#06B6D4"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.7}
              transform={`rotate(${deg + 90} ${arrowX} ${arrowY})`}
            />
          );
        })}

        {/* 5. Clockwise Search Vectors between Keys and Target Servers */}
        {stage !== "empty" &&
          stage !== "servers" &&
          keys.map((k) => {
            // Draw a subtle dashed arc from k.hashAngle to k.routedAngle
            const startRad = (k.hashAngle * Math.PI) / 180;
            const endRad = (k.routedAngle * Math.PI) / 180;
            const kx = cx + (radius - 50) * Math.cos(startRad);
            const ky = cy + (radius - 50) * Math.sin(startRad);
            const sx = cx + (radius - 10) * Math.cos(endRad);
            const sy = cy + (radius - 10) * Math.sin(endRad);

            return (
              <line
                key={`line-${k.id}`}
                x1={kx}
                y1={ky}
                x2={sx}
                y2={sy}
                stroke="#F59E0B"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity={0.5}
              />
            );
          })}

        {/* Center Technical Specifications */}
        <text
          x={cx}
          y={cy - 22}
          fill="#FFFFFF"
          fontSize={22}
          fontFamily={FONT_HEAD}
          fontWeight={700}
          letterSpacing="0.05em"
          textAnchor="middle"
        >
          HASH SPACE [0, 2³² - 1]
        </text>
        <text
          x={cx}
          y={cy + 10}
          fill="#94A3B8"
          fontSize={15}
          fontFamily={FONT_BODY}
          fontWeight={500}
          textAnchor="middle"
        >
          Clockwise Trajectory ↻
        </text>
        <text
          x={cx}
          y={cy + 36}
          fill="#06B6D4"
          fontSize={13}
          fontFamily={FONT_BODY}
          fontWeight={600}
          letterSpacing="0.08em"
          textAnchor="middle"
        >
          MD5 / SHA-256 MAPPING
        </text>
      </svg>

      {/* ── PROFESSIONAL SERVER NODE BADGES ── */}
      {servers.map((srv, idx) => {
        const rad = (srv.angleDeg * Math.PI) / 180;
        const px = cx + radius * Math.cos(rad);
        const py = cy + radius * Math.sin(rad);

        // Clean linear fade-and-slide entrance
        const nodeOp = interpolate(frame - idx * 10, [0, 15], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={srv.id}
            style={{
              position: "absolute",
              left: px - 85,
              top: py - 36,
              width: 170,
              height: 72,
              opacity: nodeOp,
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 14px",
              background: "#0D1117",
              border: `1.5px solid ${srv.color}`,
              borderRadius: 12,
              boxShadow: `0 4px 20px rgba(0,0,0,0.6), 0 0 12px ${srv.color}20`,
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
            {/* Server LED Dot indicator */}
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: srv.color,
                boxShadow: `0 0 8px ${srv.color}`,
                flexShrink: 0,
              }}
            />

            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <div
                style={{
                  color: "#FFFFFF",
                  fontFamily: FONT_HEAD,
                  fontWeight: 700,
                  fontSize: 15,
                  letterSpacing: "-0.01em",
                }}
              >
                {srv.name}
              </div>
              <div
                style={{
                  color: "#64748B",
                  fontFamily: FONT_BODY,
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                {srv.sub} • {srv.angleDeg}°
              </div>
            </div>
          </div>
        );
      })}

      {/* ── PROFESSIONAL KEY BADGES ── */}
      {stage !== "empty" &&
        stage !== "servers" &&
        keys.map((k, idx) => {
          const rad = (k.hashAngle * Math.PI) / 180;
          const kx = cx + (radius - 80) * Math.cos(rad);
          const ky = cy + (radius - 80) * Math.sin(rad);

          const keyOp = interpolate(frame - idx * 12 - 20, [0, 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={k.id}
              style={{
                position: "absolute",
                left: kx - 70,
                top: ky - 24,
                opacity: keyOp,
                display: "flex",
                flexDirection: "column",
                padding: "6px 12px",
                background: "rgba(245,158,11,0.12)",
                border: "1px solid rgba(245,158,11,0.5)",
                borderRadius: 8,
                zIndex: 15,
                pointerEvents: "none",
                minWidth: 140,
              }}
            >
              <div
                style={{
                  color: "#FDE68A",
                  fontFamily: "monospace",
                  fontWeight: 600,
                  fontSize: 12,
                }}
              >
                {k.name}
              </div>
              <div
                style={{
                  color: "#94A3B8",
                  fontFamily: FONT_BODY,
                  fontWeight: 500,
                  fontSize: 11,
                  marginTop: 2,
                }}
              >
                routed → <span style={{ color: "#FFFFFF", fontWeight: 600 }}>{k.targetServer}</span>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ConsistentHashRingVisualizer;
