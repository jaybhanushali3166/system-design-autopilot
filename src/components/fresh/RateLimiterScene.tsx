/**
 * RateLimiterScene.tsx
 *
 * Implements an intuitive, clean, and interactive visual story of Rate Limiting
 * powered by GSAP core animation principles + Remotion.
 *
 * Concepts covered:
 * - Act 1 (Hook): 1,000,000 bots vs your API -> Why Rate Limiting is mandatory
 * - Act 2 (Problem): Thread starvation, database lockups & 504 Gateway Timeout meltdown
 * - Act 3 (Solution): The iconic Token Bucket mechanics (capacity, refill stream, 200 OK vs 429 Too Many Requests)
 * - Act 4 (Algorithms): Interactive comparison table of Token Bucket, Leaky Bucket, Fixed Window, Sliding Window
 * - Act 5 (RealWorld): Distributed Redis architecture with atomic Lua scripts (Stripe / Cloudflare style)
 */

import React, { useLayoutEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import gsap from "gsap";
import { FONT_HEAD, FONT_BODY } from "../../utils/fonts";
import { ThinkingOrb } from "./ThinkingOrb";

const PALETTE = {
  bg: "#08090E",
  primaryText: "#FFFFFF",
  subText: "#94A3B8",
  emerald: "#10B981",    // 200 OK / Passed
  red: "#EF4444",        // 429 Dropped / Danger
  cyan: "#06B6D4",       // Bucket / Refill rate
  amber: "#F59E0B",      // Tokens / In flight
  purple: "#8B5CF6",     // Redis / Memory
  surface: "rgba(255,255,255,0.04)",
  surfaceBorder: "rgba(255,255,255,0.08)",
  cardGlow: "0 12px 40px rgba(0,0,0,0.6)",
};

interface SceneProps {
  act: "hook" | "problem" | "solution" | "algorithms" | "realworld" | string;
}

const BaseFrame: React.FC<{
  children: React.ReactNode;
  tag: string;
  tagColor: string;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  frame: number;
}> = ({ children, tag, tagColor, title, subtitle, frame }) => {
  const enterOp = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: 1080,
        height: 1920,
        backgroundColor: PALETTE.bg,
        overflow: "hidden",
        opacity: enterOp,
      }}
    >
      {/* Background Architectural Blueprint Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Atmospheric Radial Glows */}
      <div
        style={{
          position: "absolute",
          top: -200,
          left: -160,
          width: 720,
          height: 720,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${tagColor}18 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -200,
          right: -160,
          width: 720,
          height: 720,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${tagColor}12 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Top Header Section */}
      <div style={{ position: "absolute", top: 80, left: 60, right: 60, display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 40 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(255,255,255,0.06)",
            border: `1.5px solid ${tagColor}80`,
            borderRadius: 100,
            padding: "8px 22px",
            color: tagColor,
            fontFamily: FONT_HEAD,
            fontWeight: 800,
            fontSize: 16,
            letterSpacing: 2,
            boxShadow: `0 0 20px ${tagColor}30`,
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: tagColor, boxShadow: `0 0 8px ${tagColor}` }} />
          {tag}
        </div>

        <div
          style={{
            background: PALETTE.surface,
            border: `1px solid ${PALETTE.surfaceBorder}`,
            borderRadius: 100,
            padding: "8px 20px",
            color: PALETTE.subText,
            fontFamily: FONT_HEAD,
            fontWeight: 700,
            fontSize: 15,
          }}
        >
          @beyond.localhost
        </div>
      </div>

      {/* Title & Subtitle */}
      <div style={{ position: "absolute", top: 160, left: 60, right: 60, textAlign: "center", zIndex: 30 }}>
        <h1
          style={{
            fontFamily: FONT_HEAD,
            fontWeight: 900,
            fontSize: 48,
            color: PALETTE.primaryText,
            letterSpacing: -0.5,
            lineHeight: 1.22,
            margin: 0,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontFamily: FONT_BODY,
            fontWeight: 500,
            fontSize: 22,
            color: PALETTE.subText,
            marginTop: 12,
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Scene Main Interactive Visual Canvas */}
      {children}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* ACT 1: HOOK — Attack of 1M requests & Rate Limiter Shield                 */
/* -------------------------------------------------------------------------- */
const Act1Hook: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Pulse animation for central shield
      gsap.to(".shield-pulse", {
        scale: 1.08,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const attackCount = Math.min(1000000, Math.round(interpolate(frame, [20, 240], [1000, 1000000], { extrapolateRight: "clamp" })));

  return (
    <BaseFrame
      tag="THE DEFENDER"
      tagColor={PALETTE.amber}
      title={<>1,000,000 Requests <span style={{ color: PALETTE.red }}>in 10 Seconds</span></>}
      subtitle="Without a Rate Limiter, your entire service crashes instantly."
      frame={frame}
    >
      <div ref={containerRef} style={{ position: "absolute", inset: 0 }}>
        {/* Animated Bot Storm Visualizer */}
        <div style={{ position: "absolute", top: 360, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 36 }}>
          {Array.from({ length: 6 }).map((_, i) => {
            const delayOffset = (i * 7) % 20;
            const yPos = ((frame + delayOffset * 10) * 8) % 180;
            return (
              <div
                key={i}
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 18,
                  background: "rgba(239,68,68,0.2)",
                  border: `2px solid ${PALETTE.red}`,
                  color: PALETTE.red,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  boxShadow: `0 0 20px ${PALETTE.red}60`,
                  transform: `translateY(${yPos}px)`,
                }}
              >
                👾
              </div>
            );
          })}
        </div>

        {/* Counter Badge */}
        <div
          style={{
            position: "absolute",
            top: 600,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(239,68,68,0.15)",
            border: `2px solid ${PALETTE.red}`,
            borderRadius: 24,
            padding: "16px 48px",
            textAlign: "center",
            boxShadow: `0 0 35px ${PALETTE.red}50`,
            zIndex: 20,
          }}
        >
          <div style={{ fontFamily: FONT_HEAD, fontWeight: 900, fontSize: 44, color: PALETTE.red }}>
            {attackCount.toLocaleString()} req/s
          </div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 16, color: PALETTE.subText, letterSpacing: 1.5, marginTop: 4 }}>
            HIGH CONCURRENCY FLOOD
          </div>
        </div>

        {/* Center Defense Orb / Shield */}
        <ThinkingOrb
          x={540}
          y={1020}
          size={360}
          color={PALETTE.emerald}
          label="Rate Limiter"
          sublabel="🛡️ Token Bucket Active"
          frame={frame}
          fps={fps}
          delay={0}
        />

        {/* Bottom Explainer Card */}
        <div
          style={{
            position: "absolute",
            bottom: 220,
            left: 80,
            right: 80,
            background: PALETTE.surface,
            border: `1.5px solid ${PALETTE.surfaceBorder}`,
            borderRadius: 24,
            padding: "26px 32px",
            textAlign: "center",
          }}
        >
          <div style={{ fontFamily: FONT_BODY, fontSize: 24, color: PALETTE.primaryText, lineHeight: 1.5 }}>
            It is the <span style={{ color: PALETTE.amber, fontWeight: 800 }}>first line of defense</span> in system design.
            <br />
            Controls who gets through, and who gets stopped.
          </div>
        </div>
      </div>
    </BaseFrame>
  );
};

/* -------------------------------------------------------------------------- */
/* ACT 2: PROBLEM — Server Thread Starvation & 504 Meltdown                   */
/* -------------------------------------------------------------------------- */
const Act2Problem: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shakeX = Math.sin(frame * 0.9) * 4;
  const loadPercentage = Math.min(100, Math.round(interpolate(frame, [30, 220], [20, 100], { extrapolateRight: "clamp" })));

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".error-badge", {
        scale: 1.08,
        duration: 0.4,
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <BaseFrame
      tag="THE MELTDOWN"
      tagColor={PALETTE.red}
      title={<>Without Rate Limiting: <span style={{ color: PALETTE.red }}>Total Denial</span></>}
      subtitle="Worker threads starve. Database queries pile up. 504 Gateway Timeout."
      frame={frame}
    >
      <div ref={containerRef} style={{ position: "absolute", top: 380, left: 80, right: 80 }}>
        {/* Meltdown Progress Bar */}
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            border: `1.5px solid ${PALETTE.surfaceBorder}`,
            borderRadius: 20,
            padding: "24px 28px",
            marginBottom: 36,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 18, color: PALETTE.subText }}>
              SERVER CPU & THREAD LOAD
            </span>
            <span style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 20, color: PALETTE.red }}>
              {loadPercentage}% OVERLOAD
            </span>
          </div>
          <div style={{ width: "100%", height: 18, background: "rgba(255,255,255,0.1)", borderRadius: 10, overflow: "hidden" }}>
            <div
              style={{
                width: `${loadPercentage}%`,
                height: "100%",
                background: `linear-gradient(90deg, #F59E0B, #EF4444)`,
                boxShadow: `0 0 15px #EF4444`,
                transition: "width 0.1s linear",
              }}
            />
          </div>
        </div>

        {/* Server & DB Nodes in Cascade Failure */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28, transform: `translateX(${shakeX}px)` }}>
          {/* Web Server Node */}
          <div
            style={{
              background: "rgba(239,68,68,0.12)",
              border: `2px solid ${PALETTE.red}`,
              borderRadius: 24,
              padding: "24px 30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: `0 0 30px ${PALETTE.red}40`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ fontSize: 44 }}>🖥️</div>
              <div>
                <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 26, color: PALETTE.primaryText }}>
                  App Server (Node.js / Go)
                </div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 16, color: PALETTE.red, marginTop: 4 }}>
                  Threads locked · Queue buffer full (50,000 reqs pending)
                </div>
              </div>
            </div>
            <div
              className="error-badge"
              style={{
                background: PALETTE.red,
                color: "#FFFFFF",
                fontFamily: FONT_HEAD,
                fontWeight: 900,
                fontSize: 16,
                padding: "8px 16px",
                borderRadius: 12,
              }}
            >
              504 TIMEOUT
            </div>
          </div>

          {/* Database Node */}
          <div
            style={{
              background: "rgba(239,68,68,0.08)",
              border: `1.5px solid ${PALETTE.red}80`,
              borderRadius: 24,
              padding: "24px 30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ fontSize: 44 }}>🗄️</div>
              <div>
                <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 26, color: PALETTE.primaryText }}>
                  Primary Database (Postgres)
                </div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 16, color: PALETTE.subText, marginTop: 4 }}>
                  Connection pool exhausted (Max 100/100 reached)
                </div>
              </div>
            </div>
            <div style={{ color: PALETTE.red, fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 22 }}>
              💥 CRASH
            </div>
          </div>
        </div>

        {/* Bottom Insight Quote */}
        <div
          style={{
            marginTop: 48,
            background: PALETTE.surface,
            border: `1.5px solid ${PALETTE.surfaceBorder}`,
            borderRadius: 24,
            padding: "26px 30px",
            textAlign: "center",
          }}
        >
          <div style={{ fontFamily: FONT_BODY, fontSize: 23, color: PALETTE.subText, lineHeight: 1.6 }}>
            "A single rogue user or buggy retry loop shouldn't take down everyone else."
            <br />
            <span style={{ color: PALETTE.primaryText, fontWeight: 700 }}>
              You need algorithmic throttling at the gate.
            </span>
          </div>
        </div>
      </div>
    </BaseFrame>
  );
};

/* -------------------------------------------------------------------------- */
/* ACT 3: SOLUTION — The Token Bucket Mechanics (Intuitive Animation)         */
/* -------------------------------------------------------------------------- */
const Act3Solution: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Discrete simulation of the Token Bucket
  const refillCycle = 40;
  const currentTokens = Math.max(1, ((Math.floor(frame / refillCycle) * 2) % 5) + 1);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Floating animation for tokens in bucket
      gsap.to(".token-coin", {
        y: "-=8",
        duration: 0.9,
        yoyo: true,
        repeat: -1,
        stagger: 0.12,
        ease: "power1.inOut",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <BaseFrame
      tag="THE MASTER ALGORITHM"
      tagColor={PALETTE.cyan}
      title={<>The Iconic <span style={{ color: PALETTE.cyan }}>Token Bucket</span></>}
      subtitle="How Stripe, AWS, and Cloudflare make split-second rate decisions."
      frame={frame}
    >
      <div ref={containerRef} style={{ position: "absolute", top: 340, left: 60, right: 60 }}>
        {/* Token Refill Dispenser */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div
            style={{
              background: "rgba(6,182,212,0.14)",
              border: `1.5px solid ${PALETTE.cyan}`,
              borderRadius: 100,
              padding: "10px 24px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 22 }}>⚡</span>
            <span style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 18, color: PALETTE.cyan }}>
              Refill Stream: +3 Tokens / Second
            </span>
          </div>
        </div>

        {/* The Physical Token Bucket Diagram */}
        <div
          style={{
            margin: "0 auto",
            width: 520,
            height: 380,
            background: "linear-gradient(180deg, rgba(6,182,212,0.08) 0%, rgba(6,182,212,0.2) 100%)",
            borderLeft: `4px solid ${PALETTE.cyan}`,
            borderRight: `4px solid ${PALETTE.cyan}`,
            borderBottom: `6px solid ${PALETTE.cyan}`,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: 24,
            boxShadow: `0 20px 60px rgba(6,182,212,0.25)`,
          }}
        >
          {/* Capacity Label */}
          <div
            style={{
              position: "absolute",
              top: -18,
              background: PALETTE.bg,
              border: `1.5px solid ${PALETTE.cyan}`,
              borderRadius: 12,
              padding: "4px 16px",
              color: PALETTE.cyan,
              fontFamily: FONT_HEAD,
              fontWeight: 800,
              fontSize: 14,
            }}
          >
            CAPACITY: 5 TOKENS (BURST LIMIT)
          </div>

          {/* Tokens Inside Bucket */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", width: "90%", marginBottom: 20 }}>
            {Array.from({ length: currentTokens }).map((_, i) => (
              <div
                key={i}
                className="token-coin"
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, #FDE68A 0%, #F59E0B 100%)",
                  border: "2px solid #FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: FONT_HEAD,
                  fontWeight: 900,
                  fontSize: 24,
                  color: "#78350F",
                  boxShadow: "0 6px 18px rgba(245,158,11,0.6)",
                }}
              >
                🪙
              </div>
            ))}
          </div>

          <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 18, color: PALETTE.primaryText }}>
            {currentTokens} Tokens Available
          </div>
        </div>

        {/* Decision Flow: Passing vs 429 Dropping */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 20, marginTop: 44 }}>
          {/* Left: Token Available -> Pass */}
          <div
            style={{
              flex: 1,
              background: "rgba(16,185,129,0.1)",
              border: `1.5px solid ${PALETTE.emerald}`,
              borderRadius: 22,
              padding: "24px 20px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 36 }}>✅</div>
            <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 22, color: PALETTE.emerald, marginTop: 8 }}>
              Token Available
            </div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 16, color: PALETTE.subText, marginTop: 6 }}>
              Grabs 1 Token ➔ <strong>HTTP 200 OK</strong>
            </div>
          </div>

          {/* Right: Bucket Empty -> Drop */}
          <div
            style={{
              flex: 1,
              background: "rgba(239,68,68,0.1)",
              border: `1.5px solid ${PALETTE.red}`,
              borderRadius: 22,
              padding: "24px 20px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 36 }}>🛑</div>
            <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 22, color: PALETTE.red, marginTop: 8 }}>
              Bucket Empty
            </div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 16, color: PALETTE.subText, marginTop: 6 }}>
              Immediate Drop ➔ <strong>HTTP 429 Too Many</strong>
            </div>
          </div>
        </div>

        {/* Micro Rule */}
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <div style={{ fontFamily: FONT_BODY, fontSize: 22, color: PALETTE.primaryText }}>
            Allows short traffic bursts while guaranteeing average speed!
          </div>
        </div>
      </div>
    </BaseFrame>
  );
};

/* -------------------------------------------------------------------------- */
/* ACT 4: ALGORITHMS — The 4 Core Algorithms Matrix                           */
/* -------------------------------------------------------------------------- */
const Act4Algorithms: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const algorithms = [
    {
      name: "1. Token Bucket",
      tag: "Most Popular",
      burst: "✅ Yes",
      smooth: "Moderate",
      pros: "Simple, handles bursts gracefully",
      accent: PALETTE.cyan,
    },
    {
      name: "2. Leaky Bucket",
      tag: "Traffic Shaping",
      burst: "❌ No",
      smooth: "Constant Drip",
      pros: "Flattens spikes into smooth flow",
      accent: PALETTE.purple,
    },
    {
      name: "3. Fixed Window",
      tag: "Memory Efficient",
      burst: "⚠️ 2x Boundary",
      smooth: "Reset per min",
      pros: "Simple counters, but edge spikes",
      accent: PALETTE.amber,
    },
    {
      name: "4. Sliding Window Log",
      tag: "Pinpoint Accurate",
      burst: "✅ Strict",
      smooth: "Precise",
      pros: "100% accurate, high memory usage",
      accent: PALETTE.emerald,
    },
  ];

  return (
    <BaseFrame
      tag="ARCHITECT LEVEL"
      tagColor={PALETTE.purple}
      title={<>The 4 Algorithms <span style={{ color: PALETTE.purple }}>Compared</span></>}
      subtitle="Ace your interview by comparing trade-offs between burst, memory, and precision."
      frame={frame}
    >
      <div ref={containerRef} style={{ position: "absolute", top: 340, left: 70, right: 70, display: "flex", flexDirection: "column", gap: 20 }}>
        {algorithms.map((algo, idx) => {
          // Stagger card appearances based on frame count
          const cardDelay = idx * 10;
          const cardScale = spring({
            fps,
            frame: Math.max(0, frame - cardDelay),
            config: { damping: 14, stiffness: 180 },
          });
          const cardOpacity = interpolate(frame, [cardDelay, cardDelay + 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={idx}
              style={{
                transform: `scale(${cardScale})`,
                opacity: cardOpacity,
                background: PALETTE.surface,
                border: `1.5px solid ${algo.accent}60`,
                borderRadius: 22,
                padding: "22px 28px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: `0 8px 24px rgba(0,0,0,0.4)`,
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ fontFamily: FONT_HEAD, fontWeight: 900, fontSize: 24, color: PALETTE.primaryText }}>
                    {algo.name}
                  </div>
                  <span
                    style={{
                      background: `${algo.accent}25`,
                      border: `1px solid ${algo.accent}`,
                      borderRadius: 100,
                      padding: "4px 12px",
                      color: algo.accent,
                      fontFamily: FONT_HEAD,
                      fontSize: 12,
                      fontWeight: 800,
                    }}
                  >
                    {algo.tag}
                  </span>
                </div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 16, color: PALETTE.subText, marginTop: 6 }}>
                  {algo.pros}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 16, color: PALETTE.amber }}>
                  Burst: {algo.burst}
                </div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: PALETTE.subText, marginTop: 4 }}>
                  {algo.smooth}
                </div>
              </div>
            </div>
          );
        })}

        {/* Takeaway Box */}
        <div
          style={{
            marginTop: 20,
            background: "rgba(139,92,246,0.12)",
            border: `1.5px solid ${PALETTE.purple}`,
            borderRadius: 20,
            padding: "20px 24px",
            textAlign: "center",
          }}
        >
          <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 20, color: PALETTE.purple }}>
            💡 Senior Rule of Thumb
          </div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 18, color: PALETTE.primaryText, marginTop: 6 }}>
            Default to <strong>Token Bucket</strong> for APIs. Use <strong>Sliding Window Counter</strong> when memory is tight!
          </div>
        </div>
      </div>
    </BaseFrame>
  );
};

/* -------------------------------------------------------------------------- */
/* ACT 5: REALWORLD — Distributed Redis & Atomic Lua Scripts                  */
/* -------------------------------------------------------------------------- */
const Act5RealWorld: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const redisPulse = 1 + Math.sin(frame * 0.1) * 0.03;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".network-arrow", {
        x: 10,
        repeat: -1,
        yoyo: true,
        duration: 0.6,
        ease: "power1.inOut",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <BaseFrame
      tag="PRODUCTION ARCHITECTURE"
      tagColor={PALETTE.emerald}
      title={<>Distributed Scale: <span style={{ color: PALETTE.purple }}>Redis + Lua</span></>}
      subtitle="How Stripe and Cloudflare protect billions of requests with 0 race conditions."
      frame={frame}
    >
      <div ref={containerRef} style={{ position: "absolute", top: 340, left: 70, right: 70 }}>
        {/* Architecture Topology */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
          {/* Multiple API Gateway Instances */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {["Gateway 01 (US-East)", "Gateway 02 (EU-West)", "Gateway 03 (AP-South)"].map((gw, idx) => (
              <div
                key={idx}
                style={{
                  background: PALETTE.surface,
                  border: `1px solid ${PALETTE.surfaceBorder}`,
                  borderRadius: 16,
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span style={{ fontSize: 20 }}>🌐</span>
                <span style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 16, color: PALETTE.primaryText }}>
                  {gw}
                </span>
              </div>
            ))}
          </div>

          <div className="network-arrow" style={{ fontSize: 36, color: PALETTE.emerald }}>➔</div>

          {/* Central Distributed Redis Cluster */}
          <div
            style={{
              width: 380,
              background: "rgba(139,92,246,0.12)",
              border: `2px solid ${PALETTE.purple}`,
              borderRadius: 26,
              padding: "28px 24px",
              textAlign: "center",
              boxShadow: `0 0 40px ${PALETTE.purple}40`,
              transform: `scale(${redisPulse})`,
            }}
          >
            <div style={{ fontSize: 50, marginBottom: 10 }}>⚡</div>
            <div style={{ fontFamily: FONT_HEAD, fontWeight: 900, fontSize: 26, color: PALETTE.primaryText }}>
              Redis Cluster
            </div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 15, color: PALETTE.purple, marginTop: 4, fontWeight: 700 }}>
              IN-MEMORY LUA SCRIPT ENGINE
            </div>
            <div
              style={{
                marginTop: 16,
                background: "rgba(0,0,0,0.4)",
                borderRadius: 12,
                padding: "10px 14px",
                fontFamily: "monospace",
                fontSize: 14,
                color: PALETTE.emerald,
              }}
            >
              redis.call('EVAL', lua_token_bucket)
            </div>
          </div>
        </div>

        {/* Why Lua Script? Feature Highlights */}
        <div
          style={{
            background: PALETTE.surface,
            border: `1.5px solid ${PALETTE.surfaceBorder}`,
            borderRadius: 24,
            padding: "26px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 28 }}>🔒</span>
            <div>
              <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 20, color: PALETTE.primaryText }}>
                Atomic Execution (Zero Race Conditions)
              </div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 16, color: PALETTE.subText }}>
                Checking tokens and decrementing happens in 1 single uninterrupted atomic step.
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 28 }}>⚡</span>
            <div>
              <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 20, color: PALETTE.primaryText }}>
                Sub-Millisecond Latency
              </div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 16, color: PALETTE.subText }}>
                Executed in RAM. Only 0.3ms overhead per incoming request.
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Outro Banner */}
        <div
          style={{
            marginTop: 32,
            background: "linear-gradient(90deg, rgba(16,185,129,0.15), rgba(6,182,212,0.15))",
            border: `1.5px solid ${PALETTE.emerald}`,
            borderRadius: 22,
            padding: "24px 28px",
            textAlign: "center",
          }}
        >
          <div style={{ fontFamily: FONT_HEAD, fontWeight: 900, fontSize: 24, color: PALETTE.emerald }}>
            Save this for your next System Design Interview! 🚀
          </div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 17, color: PALETTE.subText, marginTop: 6 }}>
            Follow for daily visual distributed systems breakdowns.
          </div>
        </div>
      </div>
    </BaseFrame>
  );
};

/* -------------------------------------------------------------------------- */
/* MAIN COMPONENT DISPATCHER                                                  */
/* -------------------------------------------------------------------------- */
export const RateLimiterScene: React.FC<SceneProps> = ({ act }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  switch (act) {
    case "hook":
      return <Act1Hook frame={frame} fps={fps} />;
    case "problem":
      return <Act2Problem frame={frame} fps={fps} />;
    case "solution":
      return <Act3Solution frame={frame} fps={fps} />;
    case "algorithms":
      return <Act4Algorithms frame={frame} fps={fps} />;
    case "realworld":
    default:
      return <Act5RealWorld frame={frame} fps={fps} />;
  }
};

export default RateLimiterScene;
