/**
 * RateLimiterFreshScene.tsx
 *
 * Fresh Progressive Reel Format:
 * - Light black background (#0C0D14) with subtle architectural precision dots
 * - Act 1 starts with ONLY ONE big, clear question (zero clutter, pure focus)
 * - Progressive introduction of components: User Clients -> Bottleneck Server -> Token Bucket Rate Limiter -> Redis Lua Cluster
 * - Continuous animated data flow using Thinking Orbs and flowing dotted packet streams
 * - Crystal clear for everyone from interns to senior principal engineers
 */

import React from "react";
import { interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { FONT_HEAD, FONT_BODY } from "../../utils/fonts";
import { ThinkingOrb } from "./ThinkingOrb";
import { FlowArrow } from "./FlowArrow";

export interface RateLimiterFreshSceneProps {
  act: "question" | "problem" | "solution" | "burst" | "takeaway";
}

const THEME = {
  bg: "#0B0C12",
  gridDot: "rgba(255, 255, 255, 0.07)",
  cyan: "#00F0FF",
  emerald: "#10B981",
  red: "#FF3366",
  amber: "#FFB800",
  purple: "#A855F7",
  textPrimary: "#FFFFFF",
  textMuted: "#8E95A5",
  cardBg: "rgba(255, 255, 255, 0.03)",
  cardBorder: "rgba(255, 255, 255, 0.08)",
};

const LightBlackCanvas: React.FC<{ children: React.ReactNode; frame: number }> = ({ children, frame }) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: 1080,
        height: 1920,
        backgroundColor: THEME.bg,
        overflow: "hidden",
      }}
    >
      {/* Precision architectural dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${THEME.gridDot} 1.5px, transparent 1.5px)`,
          backgroundSize: "36px 36px",
          opacity: 0.8,
        }}
      />

      {/* Subtle ambient lens glows */}
      <div
        style={{
          position: "absolute",
          top: -200,
          left: 140,
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0, 240, 255, 0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 100,
          right: -100,
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Top brand header */}
      <div
        style={{
          position: "absolute",
          top: 60,
          right: 50,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 22px",
          borderRadius: 99,
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          fontFamily: FONT_HEAD,
          fontSize: 16,
          fontWeight: 700,
          color: THEME.textMuted,
          zIndex: 50,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: THEME.cyan,
            boxShadow: `0 0 10px ${THEME.cyan}`,
          }}
        />
        @beyond.localhost
      </div>

      {children}
    </div>
  );
};

export const RateLimiterFreshScene: React.FC<RateLimiterFreshSceneProps> = ({ act }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ─────────────────────────────────────────────────────────────
  // ACT 1: THE SINGLE QUESTION (Maximum focus & clarity)
  // ─────────────────────────────────────────────────────────────
  if (act === "question") {
    const qSpring = spring({
      fps,
      frame,
      config: { damping: 14, stiffness: 100 },
      from: 0.85,
      to: 1,
    });
    const qOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
    const pulseGlow = Math.sin(frame * 0.08) * 0.2 + 0.8;

    return (
      <LightBlackCanvas frame={frame}>
        {/* Category Pill */}
        <div
          style={{
            position: "absolute",
            top: 480,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: qOpacity,
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "10px 32px",
              borderRadius: 99,
              background: "rgba(0, 240, 255, 0.08)",
              border: `1.5px solid ${THEME.cyan}60`,
              color: THEME.cyan,
              fontFamily: FONT_HEAD,
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: 3,
            }}
          >
            SYSTEM DESIGN ESSENTIALS
          </div>
        </div>

        {/* The One Single Question */}
        <div
          style={{
            position: "absolute",
            top: 590,
            left: 80,
            right: 80,
            textAlign: "center",
            transform: `scale(${qSpring})`,
            opacity: qOpacity,
          }}
        >
          <h1
            style={{
              fontFamily: FONT_HEAD,
              fontSize: 66,
              fontWeight: 900,
              lineHeight: 1.25,
              color: THEME.textPrimary,
              margin: 0,
              letterSpacing: -1,
            }}
          >
            How does an API handle{" "}
            <span
              style={{
                color: THEME.cyan,
                textShadow: `0 0 ${35 * pulseGlow}px rgba(0, 240, 255, 0.8)`,
              }}
            >
              100,000 requests
            </span>{" "}
            every second without crashing?
          </h1>
        </div>

        {/* Central Thinking Orb pulsing curiosity */}
        <ThinkingOrb
          x={540}
          y={1180}
          size={180}
          color={THEME.cyan}
          label="100k req/s"
          sublabel="What stops the crash?"
          frame={frame}
          fps={fps}
          delay={10}
        />
      </LightBlackCanvas>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // ACT 2: THE PROBLEM (Single Server Meltdown)
  // ─────────────────────────────────────────────────────────────
  if (act === "problem") {
    const titleOp = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
    const attackLoad = Math.min(100000, Math.round(interpolate(frame, [20, 220], [1000, 100000])));

    return (
      <LightBlackCanvas frame={frame}>
        {/* Subtitle */}
        <div style={{ position: "absolute", top: 180, left: 60, right: 60, textAlign: "center", opacity: titleOp }}>
          <div style={{ color: THEME.red, fontFamily: FONT_HEAD, fontSize: 16, fontWeight: 800, letterSpacing: 3 }}>
            SCENE 01 · THE MELTDOWN
          </div>
          <h2 style={{ fontFamily: FONT_HEAD, fontSize: 46, fontWeight: 900, color: THEME.textPrimary, marginTop: 10 }}>
            Without Protection: <span style={{ color: THEME.red }}>Instant Cascade</span>
          </h2>
        </div>

        {/* Client / Bot Spammer Orb */}
        <ThinkingOrb
          x={230}
          y={660}
          size={140}
          color={THEME.red}
          label="Rogue Script"
          sublabel="100k req/s"
          frame={frame}
          fps={fps}
          delay={0}
        />

        {/* Rapid Dotted Attack Streams to Unprotected Server */}
        <FlowArrow
          x1={300}
          y1={660}
          x2={780}
          y2={660}
          color={THEME.red}
          label="Unbounded Flood"
          frame={frame}
          packetSpeed={0.025}
          delay={10}
        />

        {/* Single Server Under Stress */}
        <ThinkingOrb
          x={850}
          y={660}
          size={140}
          color={THEME.amber}
          label="Single API"
          sublabel="Threads: 100%"
          frame={frame}
          fps={fps}
          delay={15}
        />

        {/* Crash Metrics Card */}
        <div
          style={{
            position: "absolute",
            top: 960,
            left: 80,
            right: 80,
            background: "rgba(255, 51, 102, 0.06)",
            border: `1.5px solid ${THEME.red}50`,
            borderRadius: 24,
            padding: "36px 40px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ color: THEME.textMuted, fontSize: 18, fontFamily: FONT_BODY }}>Incoming Load</div>
              <div style={{ color: THEME.red, fontSize: 50, fontFamily: FONT_HEAD, fontWeight: 900, marginTop: 6 }}>
                {attackLoad.toLocaleString()} req/s
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: THEME.textMuted, fontSize: 18, fontFamily: FONT_BODY }}>System Status</div>
              <div style={{ color: THEME.red, fontSize: 32, fontFamily: FONT_HEAD, fontWeight: 900, marginTop: 12 }}>
                HTTP 504 TIMEOUT
              </div>
            </div>
          </div>
          <div style={{ marginTop: 24, height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: "100%", background: THEME.red }} />
          </div>
        </div>
      </LightBlackCanvas>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // ACT 3: THE SOLUTION (Introducing the Token Bucket)
  // ─────────────────────────────────────────────────────────────
  if (act === "solution") {
    const titleOp = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
    const tokensCount = Math.min(5, Math.floor(frame / 20) % 6);

    return (
      <LightBlackCanvas frame={frame}>
        <div style={{ position: "absolute", top: 180, left: 60, right: 60, textAlign: "center", opacity: titleOp }}>
          <div style={{ color: THEME.emerald, fontFamily: FONT_HEAD, fontSize: 16, fontWeight: 800, letterSpacing: 3 }}>
            SCENE 02 · THE SHIELD
          </div>
          <h2 style={{ fontFamily: FONT_HEAD, fontSize: 46, fontWeight: 900, color: THEME.textPrimary, marginTop: 10 }}>
            The <span style={{ color: THEME.cyan }}>Token Bucket</span> Algorithm
          </h2>
        </div>

        {/* 1. Client Node */}
        <ThinkingOrb
          x={180}
          y={680}
          size={120}
          color={THEME.amber}
          label="Clients"
          sublabel="Requests"
          frame={frame}
          fps={fps}
          delay={0}
        />

        {/* Flow to Bucket */}
        <FlowArrow
          x1={240}
          y1={680}
          x2={470}
          y2={680}
          color={THEME.amber}
          label="Requires Token"
          frame={frame}
          packetSpeed={0.015}
          delay={10}
        />

        {/* 2. Token Bucket Middle Shield */}
        <ThinkingOrb
          x={540}
          y={680}
          size={150}
          color={THEME.cyan}
          label="Rate Limiter"
          sublabel={`Tokens: ${tokensCount}/5`}
          frame={frame}
          fps={fps}
          delay={15}
        />

        {/* Refill Stream from Top */}
        <FlowArrow
          x1={540}
          y1={420}
          x2={540}
          y2={600}
          color={THEME.emerald}
          label="+Refill Stream"
          frame={frame}
          packetSpeed={0.02}
          delay={25}
        />

        {/* Flow to Protected Server */}
        <FlowArrow
          x1={615}
          y1={680}
          x2={840}
          y2={680}
          color={THEME.emerald}
          label="200 OK Pass"
          frame={frame}
          packetSpeed={0.015}
          delay={35}
        />

        {/* 3. Protected Backend Server */}
        <ThinkingOrb
          x={900}
          y={680}
          size={120}
          color={THEME.emerald}
          label="Backend API"
          sublabel="Healthy (35%)"
          frame={frame}
          fps={fps}
          delay={20}
        />

        {/* Mechanical Explanation Card */}
        <div
          style={{
            position: "absolute",
            top: 960,
            left: 80,
            right: 80,
            background: THEME.cardBg,
            border: `1.5px solid ${THEME.cardBorder}`,
            borderRadius: 24,
            padding: "36px 40px",
          }}
        >
          <div style={{ color: THEME.cyan, fontSize: 16, fontFamily: FONT_HEAD, fontWeight: 800, letterSpacing: 2 }}>
            HOW TOKENS WORK
          </div>
          <div style={{ color: THEME.textPrimary, fontSize: 26, fontFamily: FONT_HEAD, fontWeight: 700, marginTop: 12 }}>
            1. Tokens refill at a steady constant rate.
          </div>
          <div style={{ color: THEME.textMuted, fontSize: 22, fontFamily: FONT_BODY, marginTop: 10 }}>
            2. Each request must consume exactly 1 token to reach your server.
          </div>
        </div>
      </LightBlackCanvas>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // ACT 4: BURST VS HTTP 429 (What happens when empty)
  // ─────────────────────────────────────────────────────────────
  if (act === "burst") {
    const titleOp = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

    return (
      <LightBlackCanvas frame={frame}>
        <div style={{ position: "absolute", top: 180, left: 60, right: 60, textAlign: "center", opacity: titleOp }}>
          <div style={{ color: THEME.amber, fontFamily: FONT_HEAD, fontSize: 16, fontWeight: 800, letterSpacing: 3 }}>
            SCENE 03 · BURST & DROP
          </div>
          <h2 style={{ fontFamily: FONT_HEAD, fontSize: 46, fontWeight: 900, color: THEME.textPrimary, marginTop: 10 }}>
            Pass with Token vs. <span style={{ color: THEME.red }}>HTTP 429</span>
          </h2>
        </div>

        {/* Center Rate Limiter Node */}
        <ThinkingOrb
          x={540}
          y={600}
          size={160}
          color={THEME.cyan}
          label="Token Bucket"
          sublabel="Empty: 0 Tokens"
          frame={frame}
          fps={fps}
          delay={0}
        />

        {/* Allowed Stream going Down-Right */}
        <FlowArrow
          x1={600}
          y1={640}
          x2={800}
          y2={820}
          color={THEME.emerald}
          label="With Token"
          frame={frame}
          packetSpeed={0.018}
          delay={10}
        />

        {/* Dropped Stream going Down-Left */}
        <FlowArrow
          x1={480}
          y1={640}
          x2={280}
          y2={820}
          color={THEME.red}
          label="No Token"
          frame={frame}
          packetSpeed={0.022}
          delay={15}
        />

        {/* Green Accepted Node */}
        <ThinkingOrb
          x={840}
          y={860}
          size={140}
          color={THEME.emerald}
          label="200 OK"
          sublabel="Passed"
          frame={frame}
          fps={fps}
          delay={20}
        />

        {/* Red Rejected Node */}
        <ThinkingOrb
          x={240}
          y={860}
          size={140}
          color={THEME.red}
          label="HTTP 429"
          sublabel="Dropped in 1ms"
          frame={frame}
          fps={fps}
          delay={25}
        />

        {/* Dual Comparison Cards */}
        <div
          style={{
            position: "absolute",
            top: 1100,
            left: 70,
            right: 70,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
          }}
        >
          <div
            style={{
              background: "rgba(16, 185, 129, 0.08)",
              border: `1.5px solid ${THEME.emerald}50`,
              borderRadius: 20,
              padding: "24px 28px",
            }}
          >
            <div style={{ color: THEME.emerald, fontSize: 16, fontFamily: FONT_HEAD, fontWeight: 800 }}>
              TOKEN PRESENT
            </div>
            <div style={{ color: "#FFFFFF", fontSize: 22, fontFamily: FONT_HEAD, fontWeight: 700, marginTop: 8 }}>
              Forward to API
            </div>
            <div style={{ color: THEME.textMuted, fontSize: 16, fontFamily: FONT_BODY, marginTop: 4 }}>
              Zero latency penalty
            </div>
          </div>

          <div
            style={{
              background: "rgba(255, 51, 102, 0.08)",
              border: `1.5px solid ${THEME.red}50`,
              borderRadius: 20,
              padding: "24px 28px",
            }}
          >
            <div style={{ color: THEME.red, fontSize: 16, fontFamily: FONT_HEAD, fontWeight: 800 }}>
              TOKEN MISSING
            </div>
            <div style={{ color: "#FFFFFF", fontSize: 22, fontFamily: FONT_HEAD, fontWeight: 700, marginTop: 8 }}>
              Drop Instantly
            </div>
            <div style={{ color: THEME.textMuted, fontSize: 16, fontFamily: FONT_BODY, marginTop: 4 }}>
              Protects worker threads
            </div>
          </div>
        </div>
      </LightBlackCanvas>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // ACT 5: THE PRODUCTION SCALE TAKEAWAY (Redis Lua Scripts)
  // ─────────────────────────────────────────────────────────────
  const titleOp = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  return (
    <LightBlackCanvas frame={frame}>
      <div style={{ position: "absolute", top: 180, left: 60, right: 60, textAlign: "center", opacity: titleOp }}>
        <div style={{ color: THEME.purple, fontFamily: FONT_HEAD, fontSize: 16, fontWeight: 800, letterSpacing: 3 }}>
          SCENE 04 · SENIOR ARCHITECTURE
        </div>
        <h2 style={{ fontFamily: FONT_HEAD, fontSize: 46, fontWeight: 900, color: THEME.textPrimary, marginTop: 10 }}>
          Distributed Scale with <span style={{ color: THEME.purple }}>Redis Lua</span>
        </h2>
      </div>

      {/* Cluster of distributed API Gateways */}
      <ThinkingOrb
        x={200}
        y={640}
        size={110}
        color={THEME.cyan}
        label="Edge PoP 1"
        sublabel="US-East"
        frame={frame}
        fps={fps}
        delay={0}
      />
      <ThinkingOrb
        x={200}
        y={800}
        size={110}
        color={THEME.cyan}
        label="Edge PoP 2"
        sublabel="EU-Central"
        frame={frame}
        fps={fps}
        delay={5}
      />

      {/* Atomic Connection to Central Redis */}
      <FlowArrow
        x1={260}
        y1={640}
        x2={500}
        y2={720}
        color={THEME.purple}
        label="Atomic Lua"
        frame={frame}
        packetSpeed={0.02}
        delay={15}
      />
      <FlowArrow
        x1={260}
        y1={800}
        x2={500}
        y2={720}
        color={THEME.purple}
        label="Atomic Lua"
        frame={frame}
        packetSpeed={0.02}
        delay={20}
      />

      {/* Central Redis Distributed Cluster */}
      <ThinkingOrb
        x={580}
        y={720}
        size={180}
        color={THEME.purple}
        label="Redis Cluster"
        sublabel="< 1ms Atomic Lua"
        frame={frame}
        fps={fps}
        delay={10}
      />

      {/* Summary Card for Interviewers */}
      <div
        style={{
          position: "absolute",
          top: 1060,
          left: 80,
          right: 80,
          background: "rgba(168, 85, 247, 0.08)",
          border: `1.5px solid ${THEME.purple}50`,
          borderRadius: 24,
          padding: "36px 40px",
        }}
      >
        <div style={{ color: THEME.purple, fontSize: 16, fontFamily: FONT_HEAD, fontWeight: 800, letterSpacing: 2 }}>
          SENIOR TAKEAWAY
        </div>
        <div style={{ color: THEME.textPrimary, fontSize: 26, fontFamily: FONT_HEAD, fontWeight: 800, marginTop: 12 }}>
          Atomic Redis Lua avoids race conditions across thousands of distributed servers.
        </div>
        <div style={{ color: THEME.textMuted, fontSize: 20, fontFamily: FONT_BODY, marginTop: 10, lineHeight: 1.5 }}>
          Stripe, Cloudflare, and GitHub all use this exact pattern to protect billions of requests daily.
        </div>
      </div>
    </LightBlackCanvas>
  );
};

export default RateLimiterFreshScene;

