/**
 * ConsistentHashingScene.tsx
 *
 * Professional, high-caliber system design reel on Consistent Hashing:
 * - Designed for senior engineering audience (no cartoon bubbles, no emojis, clean layout)
 * - Act 1 Hook: High-impact distributed architecture inquiry with clean comparison panels
 * - Act 2 Problem: Modulo hashing crash metrics & mathematical explanation card
 * - Act 3 Solution: Clean 360° virtual ring with clockwise routing vectors & 3D Three.js depth
 * - Act 4 RealWorld: O(K/N) minimal relocation metrics & production industry references
 */

import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { FONT_HEAD, FONT_BODY } from "../../utils/fonts";
import { ConsistentHashRingVisualizer } from "./ConsistentHashRingVisualizer";
import { ThreeConsistentHashRing } from "./ThreeConsistentHashRing";

const COLORS = {
  bg: "#0A0B10",
  fast: "#10B981",      // Emerald
  slow: "#EF4444",      // Red
  neutral: "#3B82F6",   // Blue
  highlight: "#F59E0B", // Gold / Amber
  cyan: "#06B6D4",      // Cyan
  textPrimary: "#FFFFFF",
  textSub: "#94A3B8",
  surface: "rgba(255,255,255,0.03)",
  surfaceBorder: "rgba(255,255,255,0.08)",
};

const SceneShell: React.FC<{
  children: React.ReactNode;
  accentColor: string;
  frame: number;
}> = ({ children, accentColor, frame }) => {
  const enterOp = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: 1080,
        height: 1920,
        background: COLORS.bg,
        overflow: "hidden",
        opacity: enterOp,
      }}
    >
      {/* Background blueprint technical grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Subtle corner radiance */}
      <div
        style={{
          position: "absolute",
          top: -200,
          left: -200,
          width: 650,
          height: 650,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}10 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Channel tag */}
      <div
        style={{
          position: "absolute",
          top: 60,
          right: 56,
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: COLORS.surface,
          border: `1px solid ${COLORS.surfaceBorder}`,
          borderRadius: 100,
          padding: "8px 22px",
          color: COLORS.textSub,
          fontFamily: FONT_HEAD,
          fontWeight: 700,
          fontSize: 16,
          zIndex: 30,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: accentColor,
            display: "inline-block",
            boxShadow: `0 0 8px ${accentColor}`,
          }}
        />
        @beyond.localhost
      </div>

      {children}
    </div>
  );
};

export const ConsistentHashingScene: React.FC<{ act: string }> = ({ act }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ─────────────────────────────────────────────────────────────
  // ACT 1: HOOK (Professional Architecture Question)
  // ─────────────────────────────────────────────────────────────
  if (act === "hook") {
    const card1Op = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: "clamp" });
    const card2Op = interpolate(frame, [35, 50], [0, 1], { extrapolateRight: "clamp" });

    return (
      <SceneShell accentColor={COLORS.highlight} frame={frame}>
        {/* Category Pill */}
        <div style={{ position: "absolute", top: 280, left: 0, right: 0, textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(245,158,11,0.1)",
              border: "1.5px solid rgba(245,158,11,0.4)",
              borderRadius: 100,
              padding: "8px 24px",
              color: COLORS.highlight,
              fontFamily: FONT_HEAD,
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: 2,
            }}
          >
            DISTRIBUTED SYSTEMS INTERVIEW
          </div>
        </div>

        {/* Question Title */}
        <div style={{ position: "absolute", top: 360, left: 0, right: 0, textAlign: "center", padding: "0 60px" }}>
          <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 48, color: COLORS.textPrimary, lineHeight: 1.25 }}>
            What happens when you add <span style={{ color: COLORS.highlight }}>+1 server</span> to a cluster?
          </div>
        </div>

        {/* Structured Technical Comparison Panels */}
        <div
          style={{
            position: "absolute",
            top: 580,
            left: 70,
            right: 70,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Junior Perception Panel */}
          <div
            style={{
              opacity: card1Op,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 18,
              padding: "26px 30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ color: "#94A3B8", fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600, letterSpacing: 1 }}>
                JUNIOR ASSUMPTION
              </div>
              <div style={{ color: "#E2E8F0", fontFamily: FONT_HEAD, fontSize: 24, fontWeight: 700, marginTop: 4 }}>
                Traffic smoothly redistributes evenly
              </div>
            </div>
            <div style={{ color: "#64748B", fontFamily: FONT_HEAD, fontSize: 28, fontWeight: 800 }}>
              50%
            </div>
          </div>

          {/* Senior Reality Panel */}
          <div
            style={{
              opacity: card2Op,
              background: "rgba(239,68,68,0.06)",
              border: "1.5px solid rgba(239,68,68,0.4)",
              borderRadius: 18,
              padding: "26px 30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 8px 30px rgba(239,68,68,0.15)",
            }}
          >
            <div>
              <div style={{ color: COLORS.slow, fontFamily: FONT_BODY, fontSize: 14, fontWeight: 700, letterSpacing: 1 }}>
                PRODUCTION REALITY
              </div>
              <div style={{ color: "#FFFFFF", fontFamily: FONT_HEAD, fontSize: 24, fontWeight: 800, marginTop: 4 }}>
                Catastrophic Cache Avalanche
              </div>
              <div style={{ color: "#FCA5A5", fontFamily: FONT_BODY, fontSize: 15, marginTop: 4 }}>
                DB queries spike 10x • Latency degrades • Cascade failure
              </div>
            </div>
            <div
              style={{
                background: "rgba(239,68,68,0.2)",
                color: "#EF4444",
                padding: "8px 16px",
                borderRadius: 8,
                fontFamily: FONT_HEAD,
                fontWeight: 900,
                fontSize: 16,
              }}
            >
              CRITICAL
            </div>
          </div>
        </div>

        {/* Bottom Subtitle Caption */}
        <div style={{ position: "absolute", bottom: 180, left: 0, right: 0, textAlign: "center", padding: "0 80px" }}>
          <div style={{ fontFamily: FONT_BODY, fontWeight: 500, fontSize: 24, color: COLORS.textSub, lineHeight: 1.6 }}>
            The secret separator in senior backend interviews:
            <br />
            <span style={{ color: COLORS.textPrimary, fontWeight: 700 }}>Consistent Hashing and Virtual Nodes</span>.
          </div>
        </div>
      </SceneShell>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // ACT 2: THE PROBLEM (Naive Modulo Hash)
  // ─────────────────────────────────────────────────────────────
  if (act === "problem") {
    const avalancheProgress = interpolate(frame, [90, 240], [0, 85], { extrapolateRight: "clamp" });

    return (
      <SceneShell accentColor={COLORS.slow} frame={frame}>
        <div style={{ position: "absolute", top: 280, left: 0, right: 0, textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(239,68,68,0.1)",
              border: "1.5px solid rgba(239,68,68,0.4)",
              borderRadius: 100,
              padding: "8px 24px",
              color: COLORS.slow,
              fontFamily: FONT_HEAD,
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: 2,
            }}
          >
            NAIVE MODULO BOTTLENECK
          </div>
        </div>

        <div style={{ position: "absolute", top: 360, left: 0, right: 0, textAlign: "center", padding: "0 60px" }}>
          <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 46, color: COLORS.textPrimary }}>
            Naive Hash: <span style={{ color: COLORS.slow }}>server = hash(key) % N</span>
          </div>
        </div>

        {/* Architectural Math Breakdown */}
        <div
          style={{
            position: "absolute",
            top: 520,
            left: 70,
            right: 70,
            background: "rgba(255,255,255,0.02)",
            border: "1.5px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            padding: "36px 32px",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ color: COLORS.textSub, fontSize: 13, fontFamily: FONT_BODY, letterSpacing: 1 }}>
                CLUSTER POOL (N = 3)
              </div>
              <div style={{ color: "#38BDF8", fontSize: 24, fontFamily: "monospace", fontWeight: 700, marginTop: 6 }}>
                hash(key) % 3
              </div>
            </div>
            <div style={{ fontSize: 24, color: COLORS.textSub }}>➔</div>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ color: COLORS.slow, fontSize: 13, fontFamily: FONT_BODY, letterSpacing: 1 }}>
                SCALE-OUT (N = 4)
              </div>
              <div style={{ color: COLORS.slow, fontSize: 24, fontFamily: "monospace", fontWeight: 700, marginTop: 6 }}>
                hash(key) % 4
              </div>
            </div>
          </div>

          {/* Metric Bar */}
          <div
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1.5px solid rgba(239,68,68,0.3)",
              borderRadius: 14,
              padding: "20px 24px",
              textAlign: "center",
            }}
          >
            <div style={{ color: COLORS.slow, fontFamily: FONT_HEAD, fontWeight: 900, fontSize: 32 }}>
              ~{Math.round(avalancheProgress)}% Key Remapping
            </div>
            <div style={{ color: COLORS.textSub, fontFamily: FONT_BODY, fontSize: 15, marginTop: 4 }}>
              Nearly every single key maps to an incorrect server instance
            </div>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 180, left: 0, right: 0, textAlign: "center", padding: "0 70px" }}>
          <div style={{ fontFamily: FONT_BODY, fontWeight: 500, fontSize: 24, color: COLORS.textSub, lineHeight: 1.6 }}>
            The persistent database gets inundated with <span style={{ color: COLORS.slow, fontWeight: 700 }}>100% cache misses</span>.
            <br />
            An instant distributed system cascade failure.
          </div>
        </div>
      </SceneShell>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // ACT 3: THE SOLUTION (360° Consistent Hash Ring)
  // ─────────────────────────────────────────────────────────────
  if (act === "solution") {
    return (
      <SceneShell accentColor={COLORS.cyan} frame={frame}>
        <div style={{ position: "absolute", top: 250, left: 0, right: 0, textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(6,182,212,0.1)",
              border: "1.5px solid rgba(6,182,212,0.4)",
              borderRadius: 100,
              padding: "8px 24px",
              color: COLORS.cyan,
              fontFamily: FONT_HEAD,
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: 2,
            }}
          >
            THE ARCHITECTURAL BLUEPRINT
          </div>
        </div>

        <div style={{ position: "absolute", top: 320, left: 0, right: 0, textAlign: "center", padding: "0 60px" }}>
          <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 44, color: COLORS.textPrimary }}>
            Consistent Hashing: <span style={{ color: COLORS.cyan }}>Virtual 360° Ring</span>
          </div>
        </div>

        {/* 3D Torus WebGL + Precise 2D Technical Layer */}
        <div style={{ position: "absolute", top: 410, left: 0, right: 0 }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.85 }}>
            <ThreeConsistentHashRing frame={frame} fps={fps} stage="keys" />
          </div>
          <ConsistentHashRingVisualizer frame={frame} fps={fps} stage="keys" />
        </div>

        <div style={{ position: "absolute", bottom: 140, left: 0, right: 0, textAlign: "center", padding: "0 70px" }}>
          <div style={{ fontFamily: FONT_BODY, fontWeight: 500, fontSize: 23, color: COLORS.textSub, lineHeight: 1.6 }}>
            Both servers and keys map into the <span style={{ color: COLORS.cyan, fontWeight: 700 }}>same circular space</span>.
            <br />
            Walk clockwise ↻: each key routes to the nearest server node.
          </div>
        </div>
      </SceneShell>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // ACT 4: REAL WORLD & SCALE (Node D + Minimal Key Relocation)
  // ─────────────────────────────────────────────────────────────
  return (
    <SceneShell accentColor={COLORS.fast} frame={frame}>
      <div style={{ position: "absolute", top: 250, left: 0, right: 0, textAlign: "center" }}>
        <div
          style={{
            display: "inline-block",
            background: "rgba(16,185,129,0.1)",
            border: "1.5px solid rgba(16,185,129,0.4)",
            borderRadius: 100,
            padding: "8px 24px",
            color: COLORS.fast,
            fontFamily: FONT_HEAD,
            fontWeight: 800,
            fontSize: 15,
            letterSpacing: 2,
          }}
        >
          ZERO-OUTAGE SCALE-OUT
        </div>
      </div>

      <div style={{ position: "absolute", top: 320, left: 0, right: 0, textAlign: "center", padding: "0 60px" }}>
        <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 44, color: COLORS.textPrimary }}>
          Adding Node D <span style={{ color: COLORS.fast }}>moves only K / N keys</span>.
        </div>
      </div>

      {/* 3D Torus WebGL + Precise 2D Technical Layer */}
      <div style={{ position: "absolute", top: 410, left: 0, right: 0 }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.85 }}>
          <ThreeConsistentHashRing frame={frame} fps={fps} stage="add_server" />
        </div>
        <ConsistentHashRingVisualizer frame={frame} fps={fps} stage="add_server" />
      </div>

      <div style={{ position: "absolute", bottom: 140, left: 0, right: 0, textAlign: "center", padding: "0 70px" }}>
        <div style={{ fontFamily: FONT_BODY, fontWeight: 500, fontSize: 23, color: COLORS.textSub, lineHeight: 1.6 }}>
          Powers <span style={{ color: COLORS.textPrimary, fontWeight: 800 }}>DynamoDB, Apache Cassandra & Discord</span>.
          <br />
          Virtual Nodes mathematically eliminate non-uniform hotspot load.
        </div>
      </div>
    </SceneShell>
  );
};

export default ConsistentHashingScene;
