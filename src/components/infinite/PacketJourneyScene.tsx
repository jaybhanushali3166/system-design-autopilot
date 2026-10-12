/**
 * PacketJourneyScene.tsx
 *
 * Masterclass on API Request Lifecycle & Networking Latency Physics:
 * - High-retention Teacher Visual Hook (stops the scroll in < 2 seconds)
 * - Minimalist light-black blueprint canvas (#070913 -> #0c1020)
 * - Single compelling question with immediate visual mystery
 * - Gradual, progressive element introduction with punchy teacher annotations
 * - Dotted trajectory lines with animated Thinking Orbs showing packet flow
 * - Live cumulative latency odometer (+60ms, +80ms, +80ms, +80ms -> 15ms)
 * - High-impact contrast between Cold Start Tax (300ms) vs Warm Connection Reuse (15ms)
 */

import React from "react";
import { interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { FONT_HEAD, FONT_BODY } from "../../utils/fonts";
import { ThinkingOrb } from "../fresh/ThinkingOrb";

export interface PacketJourneySceneProps {
  act: "question" | "dns" | "tcp" | "tls" | "http" | "takeaway";
}

const PALETTE = {
  bg: "#070913",
  grid: "rgba(56, 189, 248, 0.035)",
  cyan: "#00E5FF",
  blue: "#38BDF8",
  yellow: "#FBBF24",
  red: "#F43F5E",
  green: "#10B981",
  purple: "#C084FC",
  textPrimary: "#FFFFFF",
  textMuted: "#94A3B8",
};

// ── Shared Background with Grid & Top Badge ───────────────────
const BlueprintCanvas: React.FC<{ children: React.ReactNode; frame: number }> = ({
  children,
}) => {
  return (
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
      {/* Precision coordinate grid */}
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

      {/* Subtle ambient cyan glow */}
      <div
        style={{
          position: "absolute",
          top: -150,
          left: 140,
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0, 229, 255, 0.06) 0%, transparent 70%)",
          pointerEvents: "none",
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
};

// ── Dotted Flow Line with Animated Dot ─────────────────────────
const DottedFlowPath: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  frame: number;
  progress?: number;
  packetActive?: boolean;
  reverse?: boolean;
  packetSpeed?: number;
}> = ({
  x1,
  y1,
  x2,
  y2,
  color,
  frame,
  progress = 1,
  packetActive = true,
  reverse = false,
  packetSpeed = 0.02,
}) => {
  const t = (frame * packetSpeed) % 1;
  const currT = reverse ? 1 - t : t;
  const dotX = x1 + (x2 - x1) * currT;
  const dotY = y1 + (y2 - y1) * currT;

  const currentEndX = x1 + (x2 - x1) * progress;
  const currentEndY = y1 + (y2 - y1) * progress;

  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "visible",
        zIndex: 5,
      }}
    >
      <line
        x1={x1}
        y1={y1}
        x2={currentEndX}
        y2={currentEndY}
        stroke={color}
        strokeWidth={3.5}
        strokeOpacity={0.65}
        strokeDasharray="8 6"
        strokeLinecap="round"
      />
      {packetActive && progress > 0.8 && (
        <circle
          cx={dotX}
          cy={dotY}
          r={8}
          fill={color}
          style={{
            filter: `drop-shadow(0 0 12px ${color})`,
          }}
        />
      )}
    </svg>
  );
};

// ── Floating Live Latency Counter Widget ───────────────────────
const LatencyCounter: React.FC<{
  currentMs: number;
  label: string;
  breakdown: string;
}> = ({ currentMs, label, breakdown }) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 70,
        left: 60,
        right: 60,
        background: "rgba(11, 16, 32, 0.9)",
        border: "1.5px solid rgba(0, 229, 255, 0.3)",
        backdropFilter: "blur(18px)",
        borderRadius: 24,
        padding: "24px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 30,
        boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
      }}
    >
      <div>
        <div
          style={{
            color: PALETTE.cyan,
            fontFamily: FONT_HEAD,
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          {label}
        </div>
        <div
          style={{
            color: PALETTE.textPrimary,
            fontFamily: FONT_BODY,
            fontSize: 21,
            fontWeight: 600,
          }}
        >
          {breakdown}
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div
          style={{
            color: currentMs > 150 ? PALETTE.red : currentMs === 15 ? PALETTE.green : PALETTE.yellow,
            fontFamily: FONT_HEAD,
            fontSize: 52,
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: -1,
            textShadow: `0 0 25px ${currentMs > 150 ? PALETTE.red : currentMs === 15 ? PALETTE.green : PALETTE.yellow}70`,
          }}
        >
          {currentMs === 15 ? "15" : `+${currentMs}`}
          <span style={{ fontSize: 24, fontWeight: 700, color: PALETTE.textMuted }}> ms</span>
        </div>
      </div>
    </div>
  );
};

export const PacketJourneyScene: React.FC<PacketJourneySceneProps> = ({ act }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ─────────────────────────────────────────────────────────────
  // ACT 1: HIGH-RETENTION TEACHER HOOK (Stops scroll in < 2 sec)
  // ─────────────────────────────────────────────────────────────
  if (act === "question") {
    // Immediate entrance spring: pops within first 10 frames
    const hookEntrance = spring({
      fps,
      frame,
      config: { damping: 12, stiffness: 140 },
      from: 0,
      to: 1,
    });

    // Stopwatch counter animation (0ms -> 300ms in cold bar)
    const coldBarWidth = interpolate(frame, [15, 60], [0, 480], { extrapolateRight: "clamp" });
    const warmBarWidth = interpolate(frame, [45, 90], [0, 24], { extrapolateRight: "clamp" });
    const pulseFast = 0.5 + Math.sin(frame * 0.15) * 0.5;

    return (
      <BlueprintCanvas frame={frame}>
        {/* Category Pill with Red Alert Badge */}
        <div style={{ position: "absolute", top: 160, left: 0, right: 0, textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(244, 63, 94, 0.12)",
              border: "1.5px solid rgba(244, 63, 94, 0.5)",
              borderRadius: 100,
              padding: "8px 28px",
              color: PALETTE.red,
              fontFamily: FONT_HEAD,
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: 3,
            }}
          >
            🚨 THE DEVTOOLS NETWORK MYSTERY
          </div>
        </div>

        {/* Big Bold Teacher Hook Headline */}
        <div
          style={{
            position: "absolute",
            top: 250,
            left: 50,
            right: 50,
            textAlign: "center",
            transform: `scale(${hookEntrance})`,
            opacity: hookEntrance,
          }}
        >
          <h1
            style={{
              fontFamily: FONT_HEAD,
              fontSize: 62,
              fontWeight: 900,
              lineHeight: 1.15,
              color: PALETTE.textPrimary,
              margin: 0,
              letterSpacing: -1.5,
            }}
          >
            Why is your <br />
            <span
              style={{
                color: PALETTE.yellow,
                textShadow: "0 0 35px rgba(251, 191, 36, 0.4)",
              }}
            >
              first API call
            </span>{" "}
            take <br />
            <span
              style={{
                color: PALETTE.red,
                textShadow: "0 0 40px rgba(244, 63, 94, 0.6)",
              }}
            >
              300 milliseconds
            </span>...
          </h1>

          <div
            style={{
              fontFamily: FONT_BODY,
              fontSize: 32,
              fontWeight: 600,
              color: PALETTE.textMuted,
              marginTop: 22,
              lineHeight: 1.35,
            }}
          >
            ...but the exact next one takes only{" "}
            <span style={{ color: PALETTE.green, fontWeight: 800 }}>15ms</span>?
          </div>
        </div>

        {/* Visual Mystery Box: DevTools Waterfall with High Contrast */}
        <div
          style={{
            position: "absolute",
            top: 710,
            left: 60,
            right: 60,
            background: "rgba(15, 23, 42, 0.8)",
            border: "2px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 24,
            padding: "36px 32px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          }}
        >
          <div
            style={{
              fontFamily: FONT_HEAD,
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: 2,
              color: PALETTE.textMuted,
              marginBottom: 24,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>CHROME NETWORK TAB</span>
            <span style={{ color: PALETTE.cyan }}>GET /v1/checkout</span>
          </div>

          {/* Call 1: Cold Start (Red Bar) */}
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: FONT_BODY,
                fontSize: 22,
                color: PALETTE.textPrimary,
                marginBottom: 10,
                fontWeight: 600,
              }}
            >
              <span>Call #1 (Cold Connection)</span>
              <span style={{ color: PALETTE.red, fontWeight: 900 }}>300 ms 🐢</span>
            </div>
            <div
              style={{
                height: 44,
                background: "rgba(255,255,255,0.06)",
                borderRadius: 14,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${coldBarWidth}px`,
                  background: `linear-gradient(90deg, ${PALETTE.yellow} 0%, ${PALETTE.red} 100%)`,
                  borderRadius: 14,
                  boxShadow: `0 0 25px ${PALETTE.red}70`,
                }}
              />
            </div>
          </div>

          {/* Call 2: Warm Connection (Green Bar) */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: FONT_BODY,
                fontSize: 22,
                color: PALETTE.textPrimary,
                marginBottom: 10,
                fontWeight: 600,
              }}
            >
              <span>Call #2 (Warm Connection)</span>
              <span style={{ color: PALETTE.green, fontWeight: 900 }}>15 ms ⚡ (20x Faster!)</span>
            </div>
            <div
              style={{
                height: 44,
                background: "rgba(255,255,255,0.06)",
                borderRadius: 14,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${warmBarWidth}px`,
                  background: PALETTE.green,
                  borderRadius: 14,
                  boxShadow: `0 0 25px ${PALETTE.green}90`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Teacher Question Callout Card */}
        <div
          style={{
            position: "absolute",
            top: 1110,
            left: 70,
            right: 70,
            background: "rgba(251, 191, 36, 0.08)",
            border: "1.5px dashed rgba(251, 191, 36, 0.4)",
            borderRadius: 20,
            padding: "24px 28px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              color: PALETTE.yellow,
              fontFamily: FONT_HEAD,
              fontSize: 28,
              fontWeight: 800,
              lineHeight: 1.3,
            }}
          >
            Where did 285 milliseconds vanish?
          </div>
          <div
            style={{
              color: PALETTE.textMuted,
              fontFamily: FONT_BODY,
              fontSize: 20,
              marginTop: 6,
            }}
          >
            You just paid the internet's invisible <strong>Trust Tax</strong>.
          </div>
        </div>

        {/* Floating Thinking Orb */}
        <ThinkingOrb
          x={540}
          y={1420}
          size={180}
          color={PALETTE.cyan}
          label="The Trust Tax"
          sublabel="3 Handshakes"
          frame={frame}
          fps={fps}
        />
      </BlueprintCanvas>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // ACT 2: ELEMENT 1 INTRODUCED — DNS RESOLUTION
  // ─────────────────────────────────────────────────────────────
  if (act === "dns") {
    const clientX = 220;
    const clientY = 660;
    const dnsX = 860;
    const dnsY = 660;

    const dnsProgress = interpolate(frame, [10, 40], [0, 1], { extrapolateRight: "clamp" });
    const ipFound = frame > 55;

    return (
      <BlueprintCanvas frame={frame}>
        {/* Top Header */}
        <div style={{ position: "absolute", top: 140, left: 60, right: 60 }}>
          <div
            style={{
              color: PALETTE.cyan,
              fontFamily: FONT_HEAD,
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: 2,
              marginBottom: 8,
            }}
          >
            STEP 01 · FINDING THE PHYSICAL ADDRESS
          </div>
          <h2
            style={{
              color: PALETTE.textPrimary,
              fontFamily: FONT_HEAD,
              fontSize: 48,
              fontWeight: 800,
              margin: 0,
            }}
          >
            Recursive DNS Lookup
          </h2>
        </div>

        {/* Teacher Callout Badge */}
        <div
          style={{
            position: "absolute",
            top: 250,
            left: 60,
            right: 60,
            background: "rgba(244, 63, 94, 0.12)",
            border: "1.5px solid rgba(244, 63, 94, 0.4)",
            borderRadius: 16,
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span style={{ fontSize: 32 }}>🛑</span>
          <div style={{ color: PALETTE.textPrimary, fontFamily: FONT_BODY, fontSize: 19, fontWeight: 500 }}>
            <strong style={{ color: PALETTE.red }}>HALT!</strong> Your phone has no idea where{" "}
            <code>stripe.com</code> lives. It must ask a DNS resolver first!
          </div>
        </div>

        {/* Dotted Flow Line from Client to DNS */}
        <DottedFlowPath
          x1={clientX}
          y1={clientY}
          x2={dnsX}
          y2={dnsY}
          color={PALETTE.yellow}
          frame={frame}
          progress={dnsProgress}
          packetActive={true}
          packetSpeed={0.03}
        />

        {/* Element: Client Node */}
        <div
          style={{
            position: "absolute",
            left: clientX - 110,
            top: clientY - 80,
            width: 220,
            background: "rgba(15, 23, 42, 0.95)",
            border: `2px solid ${PALETTE.blue}`,
            borderRadius: 20,
            padding: "20px 16px",
            textAlign: "center",
            boxShadow: `0 0 35px ${PALETTE.blue}30`,
            zIndex: 10,
          }}
        >
          <div style={{ fontSize: 44, marginBottom: 8 }}>📱</div>
          <div style={{ color: PALETTE.textPrimary, fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 20 }}>
            Client App
          </div>
          <div style={{ color: PALETTE.textMuted, fontFamily: FONT_BODY, fontSize: 14, marginTop: 4 }}>
            api.stripe.com
          </div>
        </div>

        {/* Element: DNS Resolver Node */}
        <div
          style={{
            position: "absolute",
            left: dnsX - 110,
            top: dnsY - 80,
            width: 220,
            background: "rgba(15, 23, 42, 0.95)",
            border: `2px solid ${PALETTE.yellow}`,
            borderRadius: 20,
            padding: "20px 16px",
            textAlign: "center",
            boxShadow: `0 0 35px ${PALETTE.yellow}30`,
            zIndex: 10,
          }}
        >
          <div style={{ fontSize: 44, marginBottom: 8 }}>🌐</div>
          <div style={{ color: PALETTE.textPrimary, fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 20 }}>
            DNS Resolver
          </div>
          <div style={{ color: PALETTE.yellow, fontFamily: FONT_BODY, fontSize: 14, marginTop: 4 }}>
            1.1.1.1 / 8.8.8.8
          </div>
        </div>

        {/* Middle Packet Flight Card */}
        <div
          style={{
            position: "absolute",
            top: 860,
            left: 100,
            right: 100,
            background: "rgba(11, 16, 32, 0.95)",
            border: "1.5px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 20,
            padding: "24px 28px",
            textAlign: "center",
          }}
        >
          <div style={{ color: PALETTE.textMuted, fontFamily: FONT_HEAD, fontSize: 15, fontWeight: 700 }}>
            {ipFound ? "RESOLVED DESTINATION IP" : "QUERYING ROOT & TLD NAMESERVERS..."}
          </div>
          <div
            style={{
              color: ipFound ? PALETTE.green : PALETTE.yellow,
              fontFamily: FONT_HEAD,
              fontSize: 34,
              fontWeight: 800,
              marginTop: 8,
              letterSpacing: 1,
            }}
          >
            {ipFound ? "54.240.168.1" : "WHERE IS api.stripe.com?"}
          </div>
        </div>

        {/* Teacher Observation Callout */}
        <div
          style={{
            position: "absolute",
            top: 1040,
            left: 90,
            right: 90,
            textAlign: "center",
            color: PALETTE.yellow,
            fontFamily: FONT_HEAD,
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          💥 Boom! 60ms burned before sending a single byte of JSON.
        </div>

        {/* Thinking Orb: DNS Cache Miss */}
        <ThinkingOrb
          x={540}
          y={1240}
          size={160}
          color={PALETTE.yellow}
          label="DNS Lookup"
          sublabel="1 Full RTT"
          frame={frame}
          fps={fps}
        />

        {/* Live Latency Counter */}
        <LatencyCounter currentMs={60} label="Handshake Latency Tax" breakdown="Step 1: DNS Resolution Round-Trip" />
      </BlueprintCanvas>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // ACT 3: ELEMENT 2 INTRODUCED — TCP 3-WAY HANDSHAKE
  // ─────────────────────────────────────────────────────────────
  if (act === "tcp") {
    const clientX = 200;
    const serverX = 880;
    const wireY = 660;

    const synActive = frame < 70;
    const synAckActive = frame >= 70 && frame < 140;
    const ackActive = frame >= 140;

    return (
      <BlueprintCanvas frame={frame}>
        {/* Top Header */}
        <div style={{ position: "absolute", top: 140, left: 60, right: 60 }}>
          <div
            style={{
              color: PALETTE.blue,
              fontFamily: FONT_HEAD,
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: 2,
              marginBottom: 8,
            }}
          >
            STEP 02 · ESTABLISHING RELIABLE WIRE
          </div>
          <h2
            style={{
              color: PALETTE.textPrimary,
              fontFamily: FONT_HEAD,
              fontSize: 48,
              fontWeight: 800,
              margin: 0,
            }}
          >
            TCP 3-Way Handshake
          </h2>
        </div>

        {/* Teacher Callout */}
        <div
          style={{
            position: "absolute",
            top: 250,
            left: 60,
            right: 60,
            background: "rgba(56, 189, 248, 0.12)",
            border: "1.5px solid rgba(56, 189, 248, 0.4)",
            borderRadius: 16,
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span style={{ fontSize: 32 }}>❓</span>
          <div style={{ color: PALETTE.textPrimary, fontFamily: FONT_BODY, fontSize: 19, fontWeight: 500 }}>
            Can we send our JSON request now? <strong style={{ color: PALETTE.red }}>NOPE!</strong> TCP requires a
            handshake across literal glass fiber cables first.
          </div>
        </div>

        {/* Dotted Wire between Client and Origin */}
        <DottedFlowPath
          x1={clientX}
          y1={wireY}
          x2={serverX}
          y2={wireY}
          color={PALETTE.blue}
          frame={frame}
          progress={1}
          packetActive={true}
          reverse={synAckActive}
          packetSpeed={0.035}
        />

        {/* Client Node */}
        <div
          style={{
            position: "absolute",
            left: clientX - 100,
            top: wireY - 80,
            width: 200,
            background: "rgba(15, 23, 42, 0.95)",
            border: `2px solid ${PALETTE.blue}`,
            borderRadius: 20,
            padding: "20px 16px",
            textAlign: "center",
            boxShadow: `0 0 30px ${PALETTE.blue}30`,
            zIndex: 10,
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 6 }}>📱</div>
          <div style={{ color: PALETTE.textPrimary, fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 18 }}>
            Client
          </div>
          <div style={{ color: PALETTE.textMuted, fontFamily: FONT_BODY, fontSize: 13 }}>California</div>
        </div>

        {/* Origin Server Node */}
        <div
          style={{
            position: "absolute",
            left: serverX - 100,
            top: wireY - 80,
            width: 200,
            background: "rgba(15, 23, 42, 0.95)",
            border: `2px solid ${PALETTE.red}`,
            borderRadius: 20,
            padding: "20px 16px",
            textAlign: "center",
            boxShadow: `0 0 30px ${PALETTE.red}30`,
            zIndex: 10,
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 6 }}>🖥️</div>
          <div style={{ color: PALETTE.textPrimary, fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 18 }}>
            Origin Server
          </div>
          <div style={{ color: PALETTE.red, fontFamily: FONT_BODY, fontSize: 13 }}>Virginia (3,000 miles)</div>
        </div>

        {/* Handshake Phase Status Cards */}
        <div
          style={{
            position: "absolute",
            top: 840,
            left: 70,
            right: 70,
            display: "flex",
            gap: 16,
          }}
        >
          {/* Card 1: SYN */}
          <div
            style={{
              flex: 1,
              background: synActive ? "rgba(56, 189, 248, 0.18)" : "rgba(15, 23, 42, 0.6)",
              border: `1.5px solid ${synActive ? PALETTE.cyan : "rgba(255,255,255,0.08)"}`,
              borderRadius: 18,
              padding: "18px 12px",
              textAlign: "center",
            }}
          >
            <div style={{ color: PALETTE.cyan, fontFamily: FONT_HEAD, fontSize: 14, fontWeight: 800 }}>1. SYN ➔</div>
            <div style={{ color: PALETTE.textPrimary, fontFamily: FONT_BODY, fontSize: 16, marginTop: 4 }}>
              Seq=0
            </div>
          </div>

          {/* Card 2: SYN-ACK */}
          <div
            style={{
              flex: 1,
              background: synAckActive ? "rgba(251, 191, 36, 0.18)" : "rgba(15, 23, 42, 0.6)",
              border: `1.5px solid ${synAckActive ? PALETTE.yellow : "rgba(255,255,255,0.08)"}`,
              borderRadius: 18,
              padding: "18px 12px",
              textAlign: "center",
            }}
          >
            <div style={{ color: PALETTE.yellow, fontFamily: FONT_HEAD, fontSize: 14, fontWeight: 800 }}>2. 🡄 SYN-ACK</div>
            <div style={{ color: PALETTE.textPrimary, fontFamily: FONT_BODY, fontSize: 16, marginTop: 4 }}>
              Ack=1
            </div>
          </div>

          {/* Card 3: ACK */}
          <div
            style={{
              flex: 1,
              background: ackActive ? "rgba(16, 185, 129, 0.18)" : "rgba(15, 23, 42, 0.6)",
              border: `1.5px solid ${ackActive ? PALETTE.green : "rgba(255,255,255,0.08)"}`,
              borderRadius: 18,
              padding: "18px 12px",
              textAlign: "center",
            }}
          >
            <div style={{ color: PALETTE.green, fontFamily: FONT_HEAD, fontSize: 14, fontWeight: 800 }}>3. ACK ➔</div>
            <div style={{ color: PALETTE.textPrimary, fontFamily: FONT_BODY, fontSize: 16, marginTop: 4 }}>
              ESTABLISHED
            </div>
          </div>
        </div>

        {/* Physical Fiber Metric */}
        <div
          style={{
            position: "absolute",
            top: 1030,
            left: 90,
            right: 90,
            background: "rgba(0,0,0,0.5)",
            border: "1px dashed rgba(255,255,255,0.15)",
            borderRadius: 16,
            padding: "16px 20px",
            textAlign: "center",
            color: PALETTE.textMuted,
            fontFamily: FONT_BODY,
            fontSize: 18,
          }}
        >
          Speed of light in glass fiber: <strong style={{ color: PALETTE.textPrimary }}>200,000 km/s</strong> <br />
          6,000 miles traversed round trip = <strong style={{ color: PALETTE.yellow }}>+80 milliseconds</strong>
        </div>

        {/* Thinking Orb: TCP Connection Established */}
        <ThinkingOrb
          x={540}
          y={1260}
          size={160}
          color={PALETTE.blue}
          label="TCP Stream"
          sublabel="1 Full RTT"
          frame={frame}
          fps={fps}
        />

        {/* Live Latency Counter */}
        <LatencyCounter currentMs={140} label="Handshake Latency Tax" breakdown="DNS (60ms) + TCP Handshake (80ms)" />
      </BlueprintCanvas>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // ACT 4: ELEMENT 3 INTRODUCED — TLS 1.3 CRYPTOGRAPHY
  // ─────────────────────────────────────────────────────────────
  if (act === "tls") {
    const clientX = 200;
    const serverX = 880;
    const wireY = 660;

    return (
      <BlueprintCanvas frame={frame}>
        {/* Top Header */}
        <div style={{ position: "absolute", top: 140, left: 60, right: 60 }}>
          <div
            style={{
              color: PALETTE.purple,
              fontFamily: FONT_HEAD,
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: 2,
              marginBottom: 8,
            }}
          >
            STEP 03 · CRYPTOGRAPHIC SECURITY
          </div>
          <h2
            style={{
              color: PALETTE.textPrimary,
              fontFamily: FONT_HEAD,
              fontSize: 48,
              fontWeight: 800,
              margin: 0,
            }}
          >
            TLS 1.3 Key Exchange
          </h2>
        </div>

        {/* Teacher Callout */}
        <div
          style={{
            position: "absolute",
            top: 250,
            left: 60,
            right: 60,
            background: "rgba(192, 132, 252, 0.12)",
            border: "1.5px solid rgba(192, 132, 252, 0.4)",
            borderRadius: 16,
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span style={{ fontSize: 32 }}>🔒</span>
          <div style={{ color: PALETTE.textPrimary, fontFamily: FONT_BODY, fontSize: 19, fontWeight: 500 }}>
            Plaintext auth tokens over public Wi-Fi? <strong style={{ color: PALETTE.red }}>NEVER!</strong> TLS 1.3
            locks down symmetric session keys.
          </div>
        </div>

        {/* Encrypted Tunnel replacing standard wire */}
        <div
          style={{
            position: "absolute",
            left: clientX + 80,
            top: wireY - 26,
            width: serverX - clientX - 160,
            height: 52,
            background: "rgba(192, 132, 252, 0.15)",
            border: `2px solid ${PALETTE.purple}`,
            borderRadius: 26,
            boxShadow: `0 0 40px ${PALETTE.purple}50`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 6,
          }}
        >
          <span
            style={{
              color: PALETTE.purple,
              fontFamily: FONT_HEAD,
              fontWeight: 800,
              fontSize: 17,
              letterSpacing: 2,
            }}
          >
            🔒 ENCRYPTED CIPHER TUNNEL
          </span>
        </div>

        {/* Client & Server Nodes */}
        <div
          style={{
            position: "absolute",
            left: clientX - 100,
            top: wireY - 80,
            width: 200,
            background: "rgba(15, 23, 42, 0.95)",
            border: `2px solid ${PALETTE.purple}`,
            borderRadius: 20,
            padding: "20px 16px",
            textAlign: "center",
            zIndex: 10,
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 6 }}>📱</div>
          <div style={{ color: PALETTE.textPrimary, fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 18 }}>
            Client
          </div>
          <div style={{ color: PALETTE.purple, fontFamily: FONT_BODY, fontSize: 13 }}>Diffie-Hellman Key</div>
        </div>

        <div
          style={{
            position: "absolute",
            left: serverX - 100,
            top: wireY - 80,
            width: 200,
            background: "rgba(15, 23, 42, 0.95)",
            border: `2px solid ${PALETTE.purple}`,
            borderRadius: 20,
            padding: "20px 16px",
            textAlign: "center",
            zIndex: 10,
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 6 }}>🖥️</div>
          <div style={{ color: PALETTE.textPrimary, fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 18 }}>
            Server
          </div>
          <div style={{ color: PALETTE.purple, fontFamily: FONT_BODY, fontSize: 13 }}>Verified Certificate</div>
        </div>

        {/* TLS 1.3 vs 1.2 Comparison Box */}
        <div
          style={{
            position: "absolute",
            top: 830,
            left: 80,
            right: 80,
            background: "rgba(11, 16, 32, 0.9)",
            border: "1.5px solid rgba(192, 132, 252, 0.3)",
            borderRadius: 20,
            padding: "24px 28px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ color: PALETTE.textMuted, fontFamily: FONT_HEAD, fontSize: 16 }}>Legacy TLS 1.2</span>
            <span style={{ color: PALETTE.red, fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 18 }}>
              2 RTTs (+160ms)
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: PALETTE.textPrimary, fontFamily: FONT_HEAD, fontSize: 18, fontWeight: 700 }}>
              Modern TLS 1.3
            </span>
            <span style={{ color: PALETTE.green, fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 20 }}>
              1 RTT (+80ms) ⚡
            </span>
          </div>
        </div>

        {/* Thinking Orb: Cryptographic Lock */}
        <ThinkingOrb
          x={540}
          y={1220}
          size={160}
          color={PALETTE.purple}
          label="TLS 1.3"
          sublabel="Diffie-Hellman"
          frame={frame}
          fps={fps}
        />

        {/* Live Latency Counter */}
        <LatencyCounter currentMs={220} label="Handshake Latency Tax" breakdown="DNS (60ms) + TCP (80ms) + TLS (80ms)" />
      </BlueprintCanvas>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // ACT 5: THE HTTP REQUEST + THE 15MS SECRET REVEAL
  // ─────────────────────────────────────────────────────────────
  if (act === "http") {
    const isWarmReveal = frame > 80;

    return (
      <BlueprintCanvas frame={frame}>
        {/* Top Header */}
        <div style={{ position: "absolute", top: 140, left: 60, right: 60 }}>
          <div
            style={{
              color: isWarmReveal ? PALETTE.green : PALETTE.cyan,
              fontFamily: FONT_HEAD,
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: 2,
              marginBottom: 8,
            }}
          >
            {isWarmReveal ? "THE SENIOR ARCHITECT FIX" : "STEP 04 · ACTUAL PAYLOAD"}
          </div>
          <h2
            style={{
              color: PALETTE.textPrimary,
              fontFamily: FONT_HEAD,
              fontSize: 48,
              fontWeight: 800,
              margin: 0,
            }}
          >
            {isWarmReveal ? "Connection Pooling & Keep-Alive" : "First Byte Sent"}
          </h2>
        </div>

        {/* Split Comparison Cards */}
        <div
          style={{
            position: "absolute",
            top: 270,
            left: 60,
            right: 60,
            display: "flex",
            flexDirection: "column",
            gap: 22,
          }}
        >
          {/* Cold Card */}
          <div
            style={{
              background: "rgba(15, 23, 42, 0.8)",
              border: `1.5px solid ${PALETTE.red}`,
              borderRadius: 24,
              padding: "24px 28px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: PALETTE.red, fontFamily: FONT_HEAD, fontSize: 16, fontWeight: 800 }}>
                  REQUEST #1 (COLD START)
                </div>
                <div style={{ color: PALETTE.textMuted, fontFamily: FONT_BODY, fontSize: 16, marginTop: 4 }}>
                  DNS (60ms) + TCP (80ms) + TLS (80ms) + HTTP (80ms)
                </div>
              </div>
              <div style={{ color: PALETTE.red, fontFamily: FONT_HEAD, fontSize: 44, fontWeight: 900 }}>
                300 ms
              </div>
            </div>
          </div>

          {/* Warm Card */}
          <div
            style={{
              background: "rgba(15, 23, 42, 0.9)",
              border: `2.5px solid ${PALETTE.green}`,
              borderRadius: 24,
              padding: "26px 28px",
              boxShadow: `0 0 40px ${PALETTE.green}35`,
              transform: isWarmReveal ? "scale(1.02)" : "scale(1)",
              transition: "transform 0.3s ease",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: PALETTE.green, fontFamily: FONT_HEAD, fontSize: 18, fontWeight: 800 }}>
                  REQUEST #2 (WARM CONNECTION)
                </div>
                <div style={{ color: PALETTE.textPrimary, fontFamily: FONT_BODY, fontSize: 17, marginTop: 4 }}>
                  ✓ Cached DNS · ✓ Socket Reused · ✓ TLS Keys Resumed
                </div>
              </div>
              <div style={{ color: PALETTE.green, fontFamily: FONT_HEAD, fontSize: 52, fontWeight: 900 }}>
                15 ms
              </div>
            </div>
          </div>
        </div>

        {/* Architectural Explanations */}
        <div
          style={{
            position: "absolute",
            top: 730,
            left: 60,
            right: 60,
            background: "rgba(11, 16, 32, 0.95)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 20,
            padding: "26px 30px",
          }}
        >
          <div
            style={{
              color: PALETTE.cyan,
              fontFamily: FONT_HEAD,
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: 2,
              marginBottom: 16,
            }}
          >
            HOW SENIOR ARCHITECTS SHAVE 285ms:
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: PALETTE.green, fontSize: 20 }}>●</span>
              <span style={{ color: PALETTE.textPrimary, fontFamily: FONT_BODY, fontSize: 19 }}>
                <strong>HTTP Keep-Alive:</strong> Keeps the TCP socket open for subsequent calls
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: PALETTE.green, fontSize: 20 }}>●</span>
              <span style={{ color: PALETTE.textPrimary, fontFamily: FONT_BODY, fontSize: 19 }}>
                <strong>Connection Pooling:</strong> Threads borrow pre-warmed sockets (HikariCP / OkHttp)
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: PALETTE.green, fontSize: 20 }}>●</span>
              <span style={{ color: PALETTE.textPrimary, fontFamily: FONT_BODY, fontSize: 19 }}>
                <strong>TLS Session Tickets:</strong> Bypasses cryptographic negotiation entirely
              </span>
            </div>
          </div>
        </div>

        {/* Thinking Orb: Connection Pooling */}
        <ThinkingOrb
          x={540}
          y={1220}
          size={160}
          color={PALETTE.green}
          label="Pooled"
          sublabel="Zero Handshakes"
          frame={frame}
          fps={fps}
        />

        {/* Live Latency Counter */}
        <LatencyCounter
          currentMs={15}
          label="Warm Latency"
          breakdown="All 3 Handshakes Bypassed → Pure Data Transfer"
        />
      </BlueprintCanvas>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // ACT 6: SENIOR INTERVIEW TAKEAWAY
  // ─────────────────────────────────────────────────────────────
  return (
    <BlueprintCanvas frame={frame}>
      {/* Category Pill */}
      <div style={{ position: "absolute", top: 160, left: 0, right: 0, textAlign: "center" }}>
        <div
          style={{
            display: "inline-block",
            background: "rgba(0, 229, 255, 0.08)",
            border: "1.5px solid rgba(0, 229, 255, 0.35)",
            borderRadius: 100,
            padding: "8px 28px",
            color: PALETTE.cyan,
            fontFamily: FONT_HEAD,
            fontWeight: 800,
            fontSize: 15,
            letterSpacing: 3,
          }}
        >
          SENIOR SDE CHEAT SHEET
        </div>
      </div>

      <div style={{ position: "absolute", top: 250, left: 60, right: 60, textAlign: "center" }}>
        <h2
          style={{
            color: PALETTE.textPrimary,
            fontFamily: FONT_HEAD,
            fontSize: 52,
            fontWeight: 900,
            margin: 0,
            lineHeight: 1.15,
          }}
        >
          3 Rules for <br />
          <span style={{ color: PALETTE.cyan }}>Zero-Handshake Latency</span>
        </h2>
      </div>

      {/* 3 Pillar Cards */}
      <div
        style={{
          position: "absolute",
          top: 450,
          left: 60,
          right: 60,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Rule 1 */}
        <div
          style={{
            background: "rgba(15, 23, 42, 0.85)",
            border: "1.5px solid rgba(56, 189, 248, 0.3)",
            borderRadius: 20,
            padding: "24px 28px",
          }}
        >
          <div style={{ color: PALETTE.blue, fontFamily: FONT_HEAD, fontSize: 16, fontWeight: 800 }}>
            01 · CONNECTION POOLING
          </div>
          <div
            style={{
              color: PALETTE.textPrimary,
              fontFamily: FONT_BODY,
              fontSize: 20,
              marginTop: 6,
              fontWeight: 500,
            }}
          >
            Never close sockets between microservices. Maintain warm TCP pools to eliminate 80ms RTT handshakes.
          </div>
        </div>

        {/* Rule 2 */}
        <div
          style={{
            background: "rgba(15, 23, 42, 0.85)",
            border: "1.5px solid rgba(192, 132, 252, 0.3)",
            borderRadius: 20,
            padding: "24px 28px",
          }}
        >
          <div style={{ color: PALETTE.purple, fontFamily: FONT_HEAD, fontSize: 16, fontWeight: 800 }}>
            02 · ENFORCE TLS 1.3
          </div>
          <div
            style={{
              color: PALETTE.textPrimary,
              fontFamily: FONT_BODY,
              fontSize: 20,
              marginTop: 6,
              fontWeight: 500,
            }}
          >
            Deprecate TLS 1.2 everywhere. TLS 1.3 cuts handshake time by 50% and supports 0-RTT early data.
          </div>
        </div>

        {/* Rule 3 */}
        <div
          style={{
            background: "rgba(15, 23, 42, 0.85)",
            border: "1.5px solid rgba(16, 185, 129, 0.3)",
            borderRadius: 20,
            padding: "24px 28px",
          }}
        >
          <div style={{ color: PALETTE.green, fontFamily: FONT_HEAD, fontSize: 16, fontWeight: 800 }}>
            03 · TERMINATE AT EDGE CDN
          </div>
          <div
            style={{
              color: PALETTE.textPrimary,
              fontFamily: FONT_BODY,
              fontSize: 20,
              marginTop: 6,
              fontWeight: 500,
            }}
          >
            Terminate TCP and TLS at nearby PoPs (5ms RTT). Route back to origin over pre-warmed persistent backbones.
          </div>
        </div>
      </div>

      {/* Thinking Orb: Follow Callout */}
      <ThinkingOrb
        x={540}
        y={1280}
        size={170}
        color={PALETTE.cyan}
        label="Save Reel"
        sublabel="@beyond.localhost"
        frame={frame}
        fps={fps}
      />
    </BlueprintCanvas>
  );
};

export default PacketJourneyScene;
