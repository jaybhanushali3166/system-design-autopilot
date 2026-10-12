/**
 * HttpVersionsScene.tsx
 *
 * Clean, High-Retention, Readable Senior System Design Experience:
 * - Solves the "Information Overload" problem: ONLY ONE concept on screen at a time.
 * - Progressive staged reveals calibrated to voiceover timing.
 * - Large, high-contrast, immediately readable typography (no micro text).
 * - Focused visual animations:
 *    • Act 1: The Question Hook & Mystery (Chrome Network Tab Waterfall).
 *    • Act 2: HTTP/1.1 Socket Limit (3 Active Pipes vs Blocked Queue #7).
 *    • Act 3: HTTP/2 Multiplexing (Single Clean Pipeline with 3 Interleaving Packets).
 *    • Act 4: The TCP Flaw (1 Dropped Packet Red Halt effect).
 *    • Act 5: HTTP/3 QUIC (Independent UDP Streams bypassing packet loss).
 *    • Act 6: Senior Takeaway (The 3 Rules).
 */

import React from "react";
import { interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { FONT_HEAD, FONT_BODY } from "../../utils/fonts";

export interface HttpVersionsSceneProps {
  act: "hook" | "http1" | "http2" | "http3" | "quic" | "takeaway";
}

const PALETTE = {
  bg: "#070913",
  cyan: "#00E5FF",
  blue: "#38BDF8",
  yellow: "#FBBF24",
  red: "#F43F5E",
  green: "#10B981",
  purple: "#C084FC",
  textPrimary: "#FFFFFF",
  textMuted: "#94A3B8",
};

const BlueprintCanvas: React.FC<{ children: React.ReactNode; frame: number }> = ({
  children,
}) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      width: 1080,
      height: 1920,
      background: "radial-gradient(circle at 50% 30%, #0d1428 0%, #060810 100%)",
      overflow: "hidden",
    }}
  >
    {/* Micro-coordinate grid */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(56, 189, 248, 0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(56, 189, 248, 0.035) 1px, transparent 1px)
        `,
        backgroundSize: "72px 72px",
        backgroundPosition: "center center",
      }}
    />

    {/* Top watermark badge */}
    <div
      style={{
        position: "absolute",
        top: 64,
        right: 56,
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        borderRadius: 100,
        padding: "8px 22px",
        color: PALETTE.textMuted,
        fontFamily: FONT_HEAD,
        fontWeight: 700,
        fontSize: 16,
        zIndex: 40,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: PALETTE.cyan,
          display: "inline-block",
          boxShadow: `0 0 10px ${PALETTE.cyan}`,
        }}
      />
      @beyond.localhost
    </div>
    {children}
  </div>
);

// Sleek Signal Transmission Line
const CleanWire: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  frame: number;
  speed?: number;
  isStalled?: boolean;
}> = ({ x1, y1, x2, y2, color, frame, speed = 0.035, isStalled = false }) => {
  const t = isStalled ? 0.4 : (frame * speed) % 1;
  const dotX = x1 + (x2 - x1) * t;
  const dotY = y1 + (y2 - y1) * t;

  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "visible",
        zIndex: 10,
      }}
    >
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={3.5}
        strokeOpacity={isStalled ? 0.3 : 0.6}
        strokeDasharray="8 6"
        strokeLinecap="round"
      />
      <circle
        cx={dotX}
        cy={dotY}
        r={isStalled ? 10 : 8}
        fill={isStalled ? PALETTE.red : color}
        style={{
          filter: `drop-shadow(0 0 14px ${isStalled ? PALETTE.red : color})`,
        }}
      />
    </svg>
  );
};

export const HttpVersionsScene: React.FC<HttpVersionsSceneProps> = ({ act }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ─────────────────────────────────────────────────────────────
  // ACT 1: THE SOLO QUESTION HOOK (Immediate Visual Mystery)
  // ─────────────────────────────────────────────────────────────
  if (act === "hook") {
    const hookEntrance = spring({
      fps,
      frame,
      config: { damping: 12, stiffness: 140 },
      from: 0,
      to: 1,
    });

    // Gradual reveal of the visual box after question is recited
    const mysteryBoxEntrance = spring({
      fps,
      frame: Math.max(0, frame - 30),
      config: { damping: 14, stiffness: 120 },
      from: 0,
      to: 1,
    });

    const freezeBannerEntrance = spring({
      fps,
      frame: Math.max(0, frame - 70),
      config: { damping: 14, stiffness: 130 },
      from: 0,
      to: 1,
    });

    return (
      <BlueprintCanvas frame={frame}>
        {/* Top Minimal Badge */}
        <div style={{ position: "absolute", top: 160, left: 0, right: 0, textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(244, 63, 94, 0.12)",
              border: "1.5px solid rgba(244, 63, 94, 0.4)",
              borderRadius: 100,
              padding: "8px 28px",
              color: PALETTE.red,
              fontFamily: FONT_HEAD,
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: 3,
            }}
          >
            CHAPTER 02 · TRANSPORT BOTTLENECKS
          </div>
        </div>

        {/* The Big Bold Hook Question */}
        <div
          style={{
            position: "absolute",
            top: 250,
            left: 60,
            right: 60,
            textAlign: "center",
            transform: `scale(${hookEntrance})`,
            opacity: hookEntrance,
          }}
        >
          <h1
            style={{
              fontFamily: FONT_HEAD,
              fontSize: 58,
              fontWeight: 900,
              lineHeight: 1.15,
              color: PALETTE.textPrimary,
              margin: 0,
              letterSpacing: -1.5,
            }}
          >
            Why does one <br />
            <span style={{ color: PALETTE.red, textShadow: "0 0 35px rgba(244, 63, 94, 0.5)" }}>
              dropped packet
            </span>{" "}
            freeze <br />
            <span style={{ color: PALETTE.yellow }}>your entire webpage</span>?
          </h1>

          <div
            style={{
              fontFamily: FONT_BODY,
              fontSize: 30,
              fontWeight: 600,
              color: PALETTE.textMuted,
              marginTop: 20,
              lineHeight: 1.35,
            }}
          >
            The secret is called{" "}
            <span style={{ color: PALETTE.cyan, fontWeight: 800 }}>Head-of-Line Blocking</span>.
          </div>
        </div>

        {/* Visual Mystery Box: Simplified High-Contrast Inspection */}
        <div
          style={{
            position: "absolute",
            top: 760,
            left: 70,
            right: 70,
            background: "rgba(15, 23, 42, 0.95)",
            border: "2px solid rgba(255, 255, 255, 0.12)",
            borderRadius: 24,
            padding: "36px 32px",
            boxShadow: "0 25px 60px rgba(0,0,0,0.7)",
            transform: `scale(${mysteryBoxEntrance})`,
            opacity: mysteryBoxEntrance,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", color: PALETTE.textMuted, fontFamily: FONT_HEAD, fontSize: 16, fontWeight: 800, marginBottom: 24 }}>
            <span>NETWORK TIMELINE</span>
            <span style={{ color: PALETTE.red }}>STREAM STALL DETECTED</span>
          </div>

          {/* Clean Visual Stream Bars */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 700, color: PALETTE.textPrimary, marginBottom: 8 }}>
              <span>Stream #1 (hero.png)</span>
              <span style={{ color: PALETTE.red, fontWeight: 900 }}>PACKET LOST 🛑</span>
            </div>
            <div style={{ height: 28, background: "rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ width: "45%", height: "100%", background: PALETTE.red, borderRadius: 10, boxShadow: `0 0 20px ${PALETTE.red}60` }} />
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 700, color: PALETTE.textPrimary, marginBottom: 8 }}>
              <span>Stream #2 (styles.css)</span>
              <span style={{ color: PALETTE.yellow, fontWeight: 800 }}>FROZEN WAITING ❄️</span>
            </div>
            <div style={{ height: 28, background: "rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ width: "10%", height: "100%", background: PALETTE.yellow, borderRadius: 10 }} />
            </div>
          </div>
        </div>

        {/* Punchline Callout Card */}
        <div
          style={{
            position: "absolute",
            top: 1140,
            left: 70,
            right: 70,
            background: "rgba(244, 63, 94, 0.12)",
            border: "1.5px dashed rgba(244, 63, 94, 0.4)",
            borderRadius: 20,
            padding: "24px 28px",
            textAlign: "center",
            transform: `scale(${freezeBannerEntrance})`,
            opacity: freezeBannerEntrance,
          }}
        >
          <div style={{ color: PALETTE.red, fontFamily: FONT_HEAD, fontSize: 24, fontWeight: 900 }}>
            One single lost byte stalls the entire connection.
          </div>
          <div style={{ color: PALETTE.textMuted, fontFamily: FONT_BODY, fontSize: 18, marginTop: 6 }}>
            Here is how 3 generations of HTTP tried to solve it.
          </div>
        </div>
      </BlueprintCanvas>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // ACT 2: HTTP/1.1 — THE 6-SOCKET POOL LIMIT
  // ─────────────────────────────────────────────────────────────
  if (act === "http1") {
    const queueReveal = spring({
      fps,
      frame: Math.max(0, frame - 50),
      config: { damping: 14, stiffness: 120 },
      from: 0,
      to: 1,
    });

    return (
      <BlueprintCanvas frame={frame}>
        <div style={{ position: "absolute", top: 140, left: 60, right: 60 }}>
          <div style={{ color: PALETTE.red, fontFamily: FONT_HEAD, fontSize: 16, fontWeight: 800, letterSpacing: 2, marginBottom: 8 }}>
            GENERATION 1 · 1997
          </div>
          <h2 style={{ color: PALETTE.textPrimary, fontFamily: FONT_HEAD, fontSize: 48, fontWeight: 900, margin: 0 }}>
            HTTP/1.1: The 6-Socket Limit
          </h2>
        </div>

        {/* Main Clean Visual Card */}
        <div
          style={{
            position: "absolute",
            top: 270,
            left: 60,
            right: 60,
            background: "rgba(15, 23, 42, 0.95)",
            border: "2px solid rgba(244, 63, 94, 0.4)",
            borderRadius: 24,
            padding: "32px 30px",
            boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
          }}
        >
          <div style={{ color: PALETTE.textMuted, fontFamily: FONT_HEAD, fontSize: 15, fontWeight: 800, marginBottom: 20 }}>
            BROWSER SOCKET POOL (MAX 6 PARALLEL TCP CONNECTIONS)
          </div>

          {/* 3 Clear, Big Rows (Not 6 cramped rows!) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Pipe 1 */}
            <div style={{ padding: "18px 20px", borderRadius: 16, background: "rgba(244, 63, 94, 0.15)", border: `1.5px solid ${PALETTE.red}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: PALETTE.red, fontFamily: FONT_HEAD, fontSize: 18, fontWeight: 900 }}>
                  Socket 1: hero-image.png (5 MB)
                </div>
                <div style={{ color: PALETTE.textMuted, fontSize: 15, marginTop: 4 }}>
                  Slow download • Occupying entire socket
                </div>
              </div>
              <span style={{ color: PALETTE.red, fontSize: 16, fontWeight: 900 }}>BLOCKED 🛑</span>
            </div>

            {/* Pipe 2 */}
            <div style={{ padding: "18px 20px", borderRadius: 16, background: "rgba(16, 185, 129, 0.1)", border: `1.5px solid rgba(16, 185, 129, 0.4)`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: PALETTE.green, fontFamily: FONT_HEAD, fontSize: 18, fontWeight: 900 }}>
                  Socket 2: styles.css (40 KB)
                </div>
                <div style={{ color: PALETTE.textMuted, fontSize: 15, marginTop: 4 }}>
                  Finished downloading
                </div>
              </div>
              <span style={{ color: PALETTE.green, fontSize: 16, fontWeight: 900 }}>DONE ✓</span>
            </div>

            {/* Sockets 3-6 */}
            <div style={{ padding: "18px 20px", borderRadius: 16, background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: PALETTE.textPrimary, fontFamily: FONT_HEAD, fontSize: 18, fontWeight: 800 }}>
                  Sockets 3 to 6: Scripts & Fonts
                </div>
                <div style={{ color: PALETTE.textMuted, fontSize: 15, marginTop: 4 }}>
                  All 6 connection slots fully occupied
                </div>
              </div>
              <span style={{ color: PALETTE.yellow, fontSize: 16, fontWeight: 800 }}>BUSY</span>
            </div>
          </div>
        </div>

        {/* The Consequence Banner (Gradual Reveal) */}
        <div
          style={{
            position: "absolute",
            top: 760,
            left: 60,
            right: 60,
            background: "rgba(244, 63, 94, 0.12)",
            border: "2px dashed rgba(244, 63, 94, 0.6)",
            borderRadius: 24,
            padding: "28px 30px",
            transform: `scale(${queueReveal})`,
            opacity: queueReveal,
          }}
        >
          <div style={{ color: PALETTE.red, fontFamily: FONT_HEAD, fontSize: 24, fontWeight: 900 }}>
            🛑 REQUESTS #7, #8, #9 ARE FROZEN!
          </div>
          <div style={{ color: PALETTE.textPrimary, fontFamily: FONT_BODY, fontSize: 20, marginTop: 10, lineHeight: 1.45 }}>
            Browsers physically cannot open a 7th socket. If Socket #1 is stuck on a slow photo, all remaining requests must wait in line!
          </div>
        </div>

        {/* Takeaway Pill */}
        <div style={{ position: "absolute", bottom: 90, left: 60, right: 60, textAlign: "center" }}>
          <div style={{ display: "inline-block", background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 100, padding: "14px 28px", color: PALETTE.textMuted, fontSize: 18, fontFamily: FONT_BODY }}>
            This is called <strong style={{ color: "#FFFFFF" }}>Application-Layer Head-of-Line Blocking</strong>
          </div>
        </div>
      </BlueprintCanvas>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // ACT 3: HTTP/2 — MULTIPLEXING IN 1 PIPE (Clean & Readable)
  // ─────────────────────────────────────────────────────────────
  if (act === "http2") {
    const trapReveal = spring({
      fps,
      frame: Math.max(0, frame - 55),
      config: { damping: 14, stiffness: 120 },
      from: 0,
      to: 1,
    });

    return (
      <BlueprintCanvas frame={frame}>
        <div style={{ position: "absolute", top: 140, left: 60, right: 60 }}>
          <div style={{ color: PALETTE.yellow, fontFamily: FONT_HEAD, fontSize: 16, fontWeight: 800, letterSpacing: 2, marginBottom: 8 }}>
            GENERATION 2 · 2015
          </div>
          <h2 style={{ color: PALETTE.textPrimary, fontFamily: FONT_HEAD, fontSize: 48, fontWeight: 900, margin: 0 }}>
            HTTP/2: Stream Multiplexing
          </h2>
        </div>

        {/* Clean Concept Card */}
        <div
          style={{
            position: "absolute",
            top: 270,
            left: 60,
            right: 60,
            background: "rgba(15, 23, 42, 0.95)",
            border: "2px solid rgba(251, 191, 36, 0.4)",
            borderRadius: 24,
            padding: "32px 30px",
            boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
          }}
        >
          <div style={{ color: PALETTE.yellow, fontFamily: FONT_HEAD, fontSize: 15, fontWeight: 800, marginBottom: 14 }}>
            1 SINGLE TCP CONNECTION · INTERLEAVED BINARY FRAMES
          </div>

          <div style={{ color: PALETTE.textPrimary, fontFamily: FONT_BODY, fontSize: 21, lineHeight: 1.45, marginBottom: 26 }}>
            Requests no longer wait sequentially. They are sliced into <strong>frames</strong> that interleave over a single connection:
          </div>

          {/* 3 Clear Staggered Frames Traveling */}
          <div
            style={{
              height: 100,
              background: "rgba(0,0,0,0.6)",
              border: "1.5px solid rgba(251, 191, 36, 0.3)",
              borderRadius: 18,
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* CSS Frame */}
            <div
              style={{
                position: "absolute",
                left: `${(frame * 4) % 880}px`,
                background: PALETTE.cyan,
                color: "#000",
                padding: "10px 20px",
                borderRadius: 10,
                fontFamily: FONT_HEAD,
                fontWeight: 900,
                fontSize: 16,
                boxShadow: `0 0 20px ${PALETTE.cyan}60`,
              }}
            >
              Stream 1 (CSS)
            </div>

            {/* JS Frame */}
            <div
              style={{
                position: "absolute",
                left: `${(frame * 4 + 320) % 880}px`,
                background: PALETTE.purple,
                color: "#FFF",
                padding: "10px 20px",
                borderRadius: 10,
                fontFamily: FONT_HEAD,
                fontWeight: 900,
                fontSize: 16,
                boxShadow: `0 0 20px ${PALETTE.purple}60`,
              }}
            >
              Stream 2 (JS)
            </div>
          </div>
        </div>

        {/* The Teacher Trap Reveal (Gradual) */}
        <div
          style={{
            position: "absolute",
            top: 760,
            left: 60,
            right: 60,
            background: "rgba(244, 63, 94, 0.12)",
            border: "2px solid rgba(244, 63, 94, 0.5)",
            borderRadius: 24,
            padding: "28px 30px",
            transform: `scale(${trapReveal})`,
            opacity: trapReveal,
          }}
        >
          <div style={{ color: PALETTE.red, fontFamily: FONT_HEAD, fontSize: 24, fontWeight: 900 }}>
            ⚠️ THE HIDDEN TRAP: What about lossy Wi-Fi?
          </div>
          <div style={{ color: PALETTE.textPrimary, fontFamily: FONT_BODY, fontSize: 20, marginTop: 10, lineHeight: 1.45 }}>
            You solved Application Head-of-Line blocking, but you pushed the bottleneck down into <strong>Layer 4: TCP</strong>!
          </div>
        </div>
      </BlueprintCanvas>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // ACT 4: THE TCP TRAP (1 Dropped Packet Halts All)
  // ─────────────────────────────────────────────────────────────
  if (act === "http3") {
    return (
      <BlueprintCanvas frame={frame}>
        <div style={{ position: "absolute", top: 140, left: 60, right: 60 }}>
          <div style={{ color: PALETTE.red, fontFamily: FONT_HEAD, fontSize: 16, fontWeight: 800, letterSpacing: 2, marginBottom: 8 }}>
            THE UNDERLYING FLAW
          </div>
          <h2 style={{ color: PALETTE.textPrimary, fontFamily: FONT_HEAD, fontSize: 48, fontWeight: 900, margin: 0 }}>
            Transport-Layer HoL Blocking
          </h2>
        </div>

        {/* Clear Freeze Card */}
        <div
          style={{
            position: "absolute",
            top: 270,
            left: 60,
            right: 60,
            background: "rgba(15, 23, 42, 0.95)",
            border: "2px solid rgba(244, 63, 94, 0.6)",
            borderRadius: 24,
            padding: "32px 30px",
            boxShadow: "0 25px 60px rgba(244, 63, 94, 0.2)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <span style={{ color: PALETTE.red, fontFamily: FONT_HEAD, fontSize: 22, fontWeight: 900 }}>
              💥 1 PACKET DROPPED IN STREAM 2
            </span>
            <span style={{ fontSize: 32 }}>🛑</span>
          </div>

          <div style={{ color: PALETTE.textPrimary, fontFamily: FONT_BODY, fontSize: 20, lineHeight: 1.45, marginBottom: 24 }}>
            TCP guarantees strict in-order byte delivery. The operating system refuses to pass CSS or JSON data to your browser until that missing packet is retransmitted!
          </div>

          {/* Clean State Checklist */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 18px", background: "rgba(244, 63, 94, 0.12)", borderRadius: 12 }}>
              <span style={{ color: PALETTE.textPrimary, fontSize: 18, fontWeight: 700 }}>Stream 1 (CSS):</span>
              <span style={{ color: PALETTE.red, fontSize: 18, fontWeight: 900 }}>FROZEN ❄️</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 18px", background: "rgba(244, 63, 94, 0.12)", borderRadius: 12 }}>
              <span style={{ color: PALETTE.textPrimary, fontSize: 18, fontWeight: 700 }}>Stream 2 (Image):</span>
              <span style={{ color: PALETTE.yellow, fontSize: 18, fontWeight: 900 }}>RETRANSMITTING... 🔄</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 18px", background: "rgba(244, 63, 94, 0.12)", borderRadius: 12 }}>
              <span style={{ color: PALETTE.textPrimary, fontSize: 18, fontWeight: 700 }}>Stream 3 (JSON):</span>
              <span style={{ color: PALETTE.red, fontSize: 18, fontWeight: 900 }}>FROZEN ❄️</span>
            </div>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 100, left: 60, right: 60, textAlign: "center" }}>
          <div style={{ color: PALETTE.textMuted, fontSize: 19, fontFamily: FONT_BODY }}>
            2% cellular packet loss drops throughput by over <strong style={{ color: PALETTE.red }}>50%</strong>.
          </div>
        </div>
      </BlueprintCanvas>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // ACT 5: HTTP/3 QUIC (Independent UDP Streams)
  // ─────────────────────────────────────────────────────────────
  if (act === "quic") {
    return (
      <BlueprintCanvas frame={frame}>
        <div style={{ position: "absolute", top: 140, left: 60, right: 60 }}>
          <div style={{ color: PALETTE.green, fontFamily: FONT_HEAD, fontSize: 16, fontWeight: 800, letterSpacing: 2, marginBottom: 8 }}>
            GENERATION 3 · THE MODERN ERA
          </div>
          <h2 style={{ color: PALETTE.textPrimary, fontFamily: FONT_HEAD, fontSize: 48, fontWeight: 900, margin: 0 }}>
            HTTP/3: QUIC over UDP
          </h2>
        </div>

        {/* Clean QUIC Solution Card */}
        <div
          style={{
            position: "absolute",
            top: 270,
            left: 60,
            right: 60,
            background: "rgba(15, 23, 42, 0.95)",
            border: `2px solid ${PALETTE.green}`,
            borderRadius: 24,
            padding: "32px 30px",
            boxShadow: `0 25px 60px ${PALETTE.green}20`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <span style={{ color: PALETTE.green, fontFamily: FONT_HEAD, fontSize: 22, fontWeight: 900 }}>
              ⚡ TRUE STREAM INDEPENDENCE
            </span>
            <span style={{ fontSize: 30 }}>🚀</span>
          </div>

          <div style={{ color: PALETTE.textPrimary, fontFamily: FONT_BODY, fontSize: 20, lineHeight: 1.45, marginBottom: 24 }}>
            QUIC moves stream multiplexing down into <strong>UDP</strong>. Each stream operates independently:
          </div>

          {/* Stream 1 */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: PALETTE.cyan, fontWeight: 800, fontSize: 16, marginBottom: 6 }}>
              <span>STREAM 1 (CSS)</span>
              <span>100% FLOWING ✓</span>
            </div>
            <div style={{ height: 26, background: "rgba(0,0,0,0.5)", borderRadius: 8, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: `${(frame * 5) % 880}px`, width: 44, height: "100%", background: PALETTE.cyan, borderRadius: 6 }} />
            </div>
          </div>

          {/* Stream 2 (Dropped alone) */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: PALETTE.yellow, fontWeight: 800, fontSize: 16, marginBottom: 6 }}>
              <span>STREAM 2 (IMAGE)</span>
              <span>1 packet lost (retransmitting alone)</span>
            </div>
            <div style={{ height: 26, background: "rgba(0,0,0,0.5)", borderRadius: 8, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: "200px", width: 44, height: "100%", background: PALETTE.red, borderRadius: 6 }} />
            </div>
          </div>

          {/* Stream 3 */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", color: PALETTE.green, fontWeight: 800, fontSize: 16, marginBottom: 6 }}>
              <span>STREAM 3 (JSON)</span>
              <span>100% FLOWING ✓</span>
            </div>
            <div style={{ height: 26, background: "rgba(0,0,0,0.5)", borderRadius: 8, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: `${(frame * 6) % 880}px`, width: 44, height: "100%", background: PALETTE.green, borderRadius: 6 }} />
            </div>
          </div>
        </div>

        {/* Bonus Feature */}
        <div
          style={{
            position: "absolute",
            top: 860,
            left: 60,
            right: 60,
            background: "rgba(0, 229, 255, 0.08)",
            border: "1.5px solid rgba(0, 229, 255, 0.35)",
            borderRadius: 20,
            padding: "22px 26px",
          }}
        >
          <div style={{ color: PALETTE.cyan, fontFamily: FONT_HEAD, fontSize: 19, fontWeight: 900 }}>
            📶 CONNECTION MIGRATION
          </div>
          <div style={{ color: PALETTE.textPrimary, fontFamily: FONT_BODY, fontSize: 17, marginTop: 6 }}>
            Switching from Wi-Fi to 5G? QUIC uses 64-bit Connection IDs. Zero reconnection delay!
          </div>
        </div>
      </BlueprintCanvas>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // ACT 6: SENIOR TAKEAWAY & INTERVIEW CHECKLIST
  // ─────────────────────────────────────────────────────────────
  return (
    <BlueprintCanvas frame={frame}>
      <div style={{ position: "absolute", top: 160, left: 60, right: 60, textAlign: "center" }}>
        <div
          style={{
            display: "inline-block",
            background: "rgba(0, 229, 255, 0.1)",
            border: "1.5px solid rgba(0, 229, 255, 0.4)",
            borderRadius: 100,
            padding: "8px 26px",
            color: PALETTE.cyan,
            fontFamily: FONT_HEAD,
            fontWeight: 800,
            fontSize: 15,
            letterSpacing: 2,
            marginBottom: 16,
          }}
        >
          🎓 SENIOR SDE TAKEAWAY
        </div>
        <h2
          style={{
            color: PALETTE.textPrimary,
            fontFamily: FONT_HEAD,
            fontSize: 50,
            fontWeight: 900,
            margin: 0,
            letterSpacing: -1,
          }}
        >
          When To Recommend What
        </h2>
      </div>

      <div
        style={{
          position: "absolute",
          top: 360,
          left: 60,
          right: 60,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {[
          { gen: "HTTP/1.1", use: "Internal VPCs with persistent connection pools, simple bash scripts", color: PALETTE.red, icon: "🐢" },
          { gen: "HTTP/2", use: "Standard web assets & gRPC backends with reliable data centers", color: PALETTE.yellow, icon: "⚡" },
          { gen: "HTTP/3 (QUIC)", use: "Mobile apps, global CDNs, video streaming, lossy cellular networks", color: PALETTE.green, icon: "🚀" },
        ].map((item) => (
          <div
            key={item.gen}
            style={{
              background: "rgba(15, 23, 42, 0.95)",
              border: `1.5px solid ${item.color}60`,
              borderRadius: 22,
              padding: "26px 30px",
              boxShadow: `0 10px 30px rgba(0,0,0,0.5)`,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ color: item.color, fontFamily: FONT_HEAD, fontSize: 24, fontWeight: 900 }}>
                {item.gen}
              </div>
              <span style={{ fontSize: 32 }}>{item.icon}</span>
            </div>
            <div style={{ color: PALETTE.textPrimary, fontFamily: FONT_BODY, fontSize: 20, marginTop: 10, lineHeight: 1.4 }}>
              {item.use}
            </div>
          </div>
        ))}
      </div>
    </BlueprintCanvas>
  );
};
