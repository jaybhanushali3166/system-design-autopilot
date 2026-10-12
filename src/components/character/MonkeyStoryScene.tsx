import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { DevMonkey, MonkeyMood } from "./DevMonkey";
import { FONT_HEAD, FONT_BODY } from "../../utils/fonts";

export interface MonkeyStoryConfig {
  act: 1 | 2 | 3 | 4;
  title: string;
  subtitle: string;
  badge: string;
}

interface Props {
  config: MonkeyStoryConfig;
  videoWidth: number;
  videoHeight: number;
}

export const MonkeyStoryScene: React.FC<Props> = ({ config, videoWidth, videoHeight }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { act, title, subtitle, badge } = config;

  // Global entrance spring
  const enterScale = spring({ fps, frame, config: { damping: 12, stiffness: 180 }, from: 0.94, to: 1 });
  const enterOp = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Floating ambient bananas
  const bananaOffsets = [
    { x: 70, y: 260, rot: -15, speed: 0.04 },
    { x: 940, y: 320, rot: 25, speed: 0.035 },
    { x: 80, y: 1480, rot: 35, speed: 0.05 },
    { x: 930, y: 1540, rot: -28, speed: 0.045 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: 1080,
        height: 1920,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "80px 48px 180px",
        overflow: "hidden",
        background:
          act === 2
            ? `radial-gradient(circle at 50% 35%, #580B0B 0%, #200505 55%, #0B0202 100%)`
            : act === 4
            ? `radial-gradient(circle at 50% 30%, #064E3B 0%, #032A20 55%, #061712 100%)`
            : `radial-gradient(circle at 50% 30%, #1E1B4B 0%, #0F172A 60%, #070B14 100%)`,
        opacity: enterOp,
        transform: `scale(${enterScale})`,
      }}
    >
      {/* ── TOP CHANNEL TAG ── */}
      <div
        style={{
          position: "absolute",
          top: 36,
          right: 48,
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(255, 255, 255, 0.08)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: 100,
          padding: "6px 16px",
          color: "#FDE68A",
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: 1,
          fontFamily: FONT_HEAD,
          zIndex: 20,
        }}
      >
        <span>🍌</span> @beyond.localhost
      </div>

      {/* ── BACKGROUND AMBIENT PARTICLES ── */}
      {bananaOffsets.map((b, i) => {
        const floatY = Math.sin(frame * b.speed + i) * 18;
        const floatRot = b.rot + Math.cos(frame * b.speed) * 8;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: b.x,
              top: b.y + floatY,
              transform: `rotate(${floatRot}deg)`,
              fontSize: 52,
              opacity: act === 2 ? 0.2 : 0.35,
              filter: "blur(0.5px)",
              pointerEvents: "none",
            }}
          >
            🍌
          </div>
        );
      })}

      {/* ── TOP HEADER SECTION ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          textAlign: "center",
          zIndex: 5,
          marginTop: 20,
        }}
      >
        {/* Episode Pill */}
        <div
          style={{
            background:
              act === 2
                ? "rgba(239, 68, 68, 0.25)"
                : act === 4
                ? "rgba(16, 185, 129, 0.25)"
                : "rgba(245, 158, 11, 0.25)",
            border: `2px solid ${
              act === 2 ? "#EF4444" : act === 4 ? "#10B981" : "#F59E0B"
            }`,
            borderRadius: 100,
            padding: "9px 28px",
            color: act === 2 ? "#FCA5A5" : act === 4 ? "#6EE7B7" : "#FDE68A",
            fontSize: 17,
            fontWeight: 800,
            letterSpacing: 2,
            textTransform: "uppercase",
            fontFamily: FONT_HEAD,
            boxShadow: `0 4px 20px ${
              act === 2 ? "#EF444430" : act === 4 ? "#10B98130" : "#F59E0B30"
            }`,
          }}
        >
          {badge}
        </div>

        {/* Big Bold Story Headline */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            fontFamily: FONT_HEAD,
            color: "#FFFFFF",
            lineHeight: 1.15,
            textShadow: "0 4px 22px rgba(0,0,0,0.7)",
            maxWidth: 960,
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            fontFamily: FONT_BODY,
            fontWeight: 600,
            color: act === 2 ? "#FCA5A5" : act === 4 ? "#A7F3D0" : "#FDE68A",
            maxWidth: 900,
            lineHeight: 1.35,
          }}
        >
          {subtitle}
        </div>
      </div>

      {/* ── ACT SPECIFIC CONTENT STAGE ── */}
      <div
        style={{
          flex: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-evenly",
          position: "relative",
          zIndex: 4,
          margin: "45px 0 10px",
        }}
      >
        {act === 1 && <Act1Stage frame={frame} fps={fps} />}
        {act === 2 && <Act2Stage frame={frame} fps={fps} />}
        {act === 3 && <Act3Stage frame={frame} fps={fps} />}
        {act === 4 && <Act4Stage frame={frame} fps={fps} />}
      </div>

      {/* ── DYNAMIC SYNCED CAPTIONS BAR ── */}
      <StoryCaptions act={act} frame={frame} />
    </div>
  );
};

// ── ACT 1: LOCALHOST & 2 USERS ───────────────────────────────────────────────
const Act1Stage: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const popOrder1 = spring({ fps, frame: frame - 30, config: { damping: 10, stiffness: 180 }, from: 0, to: 1 });
  const popOrder2 = spring({ fps, frame: frame - 80, config: { damping: 10, stiffness: 180 }, from: 0, to: 1 });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        height: "100%",
        width: "100%",
        padding: "10px 0",
      }}
    >
      {/* Floating Order Cards */}
      <div style={{ position: "relative", width: "100%", height: 120 }}>
        {frame > 30 && (
          <div
            style={{
              position: "absolute",
              left: 20,
              top: 5,
              transform: `scale(${popOrder1})`,
              background: "rgba(30, 41, 59, 0.95)",
              border: "2.5px solid #10B981",
              borderRadius: 22,
              padding: "16px 28px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              boxShadow: "0 10px 35px rgba(16,185,129,0.35)",
            }}
          >
            <span style={{ fontSize: 38 }}>👩‍👦</span>
            <div>
              <div style={{ color: "#6EE7B7", fontSize: 22, fontWeight: 800 }}>Mom (User #1)</div>
              <div style={{ color: "#CBD5E1", fontSize: 17 }}>"2 ripe bananas please!" ⭐⭐⭐⭐⭐</div>
            </div>
          </div>
        )}

        {frame > 80 && (
          <div
            style={{
              position: "absolute",
              right: 20,
              top: 15,
              transform: `scale(${popOrder2})`,
              background: "rgba(30, 41, 59, 0.95)",
              border: "2.5px solid #38BDF8",
              borderRadius: 22,
              padding: "16px 28px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              boxShadow: "0 10px 35px rgba(56,189,248,0.35)",
            }}
          >
            <span style={{ fontSize: 38 }}>🧔</span>
            <div>
              <div style={{ color: "#7DD3FC", fontSize: 22, fontWeight: 800 }}>Bob (User #2)</div>
              <div style={{ color: "#CBD5E1", fontSize: 17 }}>"1 banana + fast delivery!" 🍌</div>
            </div>
          </div>
        )}
      </div>

      {/* Center Character: Dev Monkey at Banana Stall */}
      <DevMonkey
        mood="chill"
        size={370}
        thoughtText={frame > 150 ? "I am basically Steve Jobs! 🚀" : "Works on my machine! 😎"}
        badgeText="Junior Dev Monkey (Solo Founder)"
        holdingItem="banana"
      />

      {/* Architecture Spec Card */}
      <div
        style={{
          width: "96%",
          maxWidth: 880,
          background: "rgba(15, 23, 42, 0.94)",
          border: "2.5px solid rgba(245, 158, 11, 0.6)",
          borderRadius: 26,
          padding: "24px 36px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          boxShadow: "0 12px 45px rgba(0,0,0,0.6)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 34 }}>💻</span>
          <div>
            <div style={{ color: "#94A3B8", fontSize: 15, fontWeight: 700 }}>INFRASTRUCTURE</div>
            <div style={{ color: "#F8FAFC", fontSize: 22, fontWeight: 800 }}>Monkey's MacBook Air</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 34 }}>🗄️</span>
          <div>
            <div style={{ color: "#94A3B8", fontSize: 15, fontWeight: 700 }}>DATABASE</div>
            <div style={{ color: "#F8FAFC", fontSize: 22, fontWeight: 800 }}>Text file on Desktop</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 34 }}>👥</span>
          <div>
            <div style={{ color: "#94A3B8", fontSize: 15, fontWeight: 700 }}>ACTIVE TRAFFIC</div>
            <div style={{ color: "#34D399", fontSize: 22, fontWeight: 800 }}>2 Requests / Day</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 34 }}>🔥</span>
          <div>
            <div style={{ color: "#94A3B8", fontSize: 15, fontWeight: 700 }}>SERVER CPU</div>
            <div style={{ color: "#38BDF8", fontSize: 22, fontWeight: 800 }}>1.2% (Chill mode)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── ACT 2: VIRAL TWEET & MELTDOWN ───────────────────────────────────────────
const Act2Stage: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // Twitter Card drops down
  const tweetY = spring({ fps, frame, config: { damping: 11, stiffness: 200 }, from: -180, to: 0 });

  // CPU Gauge needle
  const cpuVal = Math.min(999, Math.round(interpolate(frame, [0, 80, 200], [15, 100, 999], { extrapolateRight: "clamp" })));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        height: "100%",
        width: "100%",
        padding: "10px 0",
      }}
    >
      {/* Viral Tweet Card */}
      <div
        style={{
          transform: `translateY(${tweetY}px)`,
          width: "96%",
          maxWidth: 880,
          background: "rgba(15, 23, 42, 0.95)",
          border: "3px solid #EF4444",
          borderRadius: 26,
          padding: "22px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          boxShadow: "0 14px 45px rgba(239, 68, 68, 0.45)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 44 }}>🦍</span>
            <div>
              <div style={{ color: "#FFFFFF", fontSize: 24, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
                King Gorilla <span style={{ color: "#38BDF8", fontSize: 18 }}>☑️</span>
              </div>
              <div style={{ color: "#94A3B8", fontSize: 16 }}>@gorillaking · 2:01 AM</div>
            </div>
          </div>
          <div style={{ background: "#EF4444", color: "#FFF", borderRadius: 8, padding: "6px 16px", fontSize: 15, fontWeight: 800 }}>
            VIRAL TWEET 🔥
          </div>
        </div>
        <div style={{ color: "#F8FAFC", fontSize: 26, fontWeight: 700, lineHeight: 1.35 }}>
          "BananaNow is the greatest app on earth. Everyone order bananas RIGHT NOW!" 🍌🚀
        </div>
        <div style={{ display: "flex", gap: 32, color: "#94A3B8", fontSize: 17, fontWeight: 600 }}>
          <span>💬 48.2K</span>
          <span>🔁 185.9K</span>
          <span style={{ color: "#F43F5E" }}>❤️ 920.4K</span>
        </div>
      </div>

      {/* Center Panicked Dev Monkey */}
      <div style={{ position: "relative" }}>
        <DevMonkey
          mood="panic"
          size={380}
          thoughtText="WHY IS THE LAPTOP ON FIRE?! 😱"
          badgeText="🚨 100,000 CONCURRENT USERS"
          holdingItem="laptop"
        />

        {/* Flying Smoke & Fire Emojis */}
        <div style={{ position: "absolute", top: -30, left: -20, fontSize: 44 }}>💨</div>
        <div style={{ position: "absolute", top: -40, right: -20, fontSize: 48 }}>🔥</div>
      </div>

      {/* Meltdown Gauge Meter */}
      <div
        style={{
          width: "96%",
          maxWidth: 880,
          background: "rgba(69, 10, 10, 0.94)",
          border: "2.5px solid #EF4444",
          borderRadius: 24,
          padding: "22px 34px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 10px 35px rgba(239, 68, 68, 0.45)",
        }}
      >
        <div>
          <div style={{ color: "#FCA5A5", fontSize: 16, fontWeight: 800, letterSpacing: 1.5 }}>SERVER STATUS</div>
          <div style={{ color: "#EF4444", fontSize: 32, fontWeight: 900, fontFamily: FONT_HEAD }}>
            504 GATEWAY TIMEOUT
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#FCA5A5", fontSize: 16, fontWeight: 800 }}>CPU LOAD</div>
          <div style={{ color: "#F87171", fontSize: 40, fontWeight: 900, fontFamily: FONT_HEAD }}>
            {cpuVal}% 💥
          </div>
        </div>
      </div>
    </div>
  );
};

// ── ACT 3: THE 3 BANANA HACKS ───────────────────────────────────────────────
const Act3Stage: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // Phase 1: Traffic Cop (0 - 650 frames = ~21.6s)
  // Phase 2: Snack Counter / Redis Cache (650 - 1330 frames = ~22.6s)
  // Phase 3: Ticket Machine / Queue (1330 - 2013 frames = ~22.7s)
  const phase = frame < 650 ? 1 : frame < 1330 ? 2 : 3;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        height: "100%",
        width: "100%",
        padding: "10px 0",
      }}
    >
      {/* 3 Hacks Navigation Header */}
      <div
        style={{
          display: "flex",
          width: "96%",
          maxWidth: 900,
          gap: 14,
          justifyContent: "center",
        }}
      >
        {[
          { num: 1, title: "Traffic Cop", icon: "👮", sub: "Load Balancer" },
          { num: 2, title: "Snack Counter", icon: "🍌", sub: "Redis Cache" },
          { num: 3, title: "Ticket Machine", icon: "🎟️", sub: "Message Queue" },
        ].map((h) => {
          const isActive = phase === h.num;
          return (
            <div
              key={h.num}
              style={{
                flex: 1,
                background: isActive ? "rgba(245, 158, 11, 0.28)" : "rgba(30, 41, 59, 0.65)",
                border: `2.5px solid ${isActive ? "#F59E0B" : "rgba(148, 163, 184, 0.25)"}`,
                borderRadius: 20,
                padding: "14px 18px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                transform: isActive ? "scale(1.04)" : "scale(1)",
                boxShadow: isActive ? "0 8px 25px rgba(245, 158, 11, 0.4)" : "none",
              }}
            >
              <span style={{ fontSize: 30 }}>{h.icon}</span>
              <div style={{ color: isActive ? "#FDE68A" : "#94A3B8", fontSize: 19, fontWeight: 800 }}>
                {h.title}
              </div>
              <div style={{ color: isActive ? "#FBBF24" : "#64748B", fontSize: 14, fontWeight: 700 }}>
                {h.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── PHASE 1: TRAFFIC COP (LOAD BALANCER) ── */}
      {phase === 1 && (
        <>
          <DevMonkey
            mood="chill"
            size={340}
            thoughtText="Don't rush one door! Route traffic! 🚦"
            badgeText="Senior Traffic Cop Gorilla"
            hat="cop"
          />

          {/* 3 Kitchen Pods Visualization */}
          <div style={{ display: "flex", gap: 18, width: "96%", maxWidth: 900, justifyContent: "center" }}>
            {["Kitchen A", "Kitchen B", "Kitchen C"].map((k, idx) => {
              const highlight = (Math.floor(frame / 20) % 3) === idx;
              return (
                <div
                  key={k}
                  style={{
                    flex: 1,
                    background: highlight ? "rgba(16, 185, 129, 0.28)" : "rgba(15, 23, 42, 0.92)",
                    border: `2.5px solid ${highlight ? "#10B981" : "#334155"}`,
                    borderRadius: 22,
                    padding: "20px 14px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 10,
                    boxShadow: highlight ? "0 10px 30px rgba(16,185,129,0.35)" : "none",
                  }}
                >
                  <span style={{ fontSize: 38 }}>🍳</span>
                  <div style={{ color: highlight ? "#6EE7B7" : "#F8FAFC", fontSize: 22, fontWeight: 800 }}>
                    {k}
                  </div>
                  <div style={{ color: highlight ? "#A7F3D0" : "#94A3B8", fontSize: 15, fontWeight: 700 }}>
                    {highlight ? "Serving Order ⚡" : "Idle & Ready"}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              background: "rgba(15, 23, 42, 0.96)",
              border: "2.5px solid #10B981",
              borderRadius: 20,
              padding: "16px 32px",
              color: "#F1F5F9",
              fontSize: 20,
              fontWeight: 700,
              textAlign: "center",
              maxWidth: 880,
            }}
          >
            ⚖️ <strong style={{ color: "#34D399" }}>Load Balancer:</strong> Distributes 100k requests across 3 kitchens. Nobody gets crushed!
          </div>
        </>
      )}

      {/* ── PHASE 2: SNACK COUNTER (REDIS IN-MEMORY CACHE) ── */}
      {phase === 2 && (
        <>
          <DevMonkey
            mood="thinking"
            size={340}
            thoughtText="95% ask for same banana! Keep in RAM! ⚡"
            badgeText="In-Memory Caching Master"
            holdingItem="banana"
          />

          {/* Split Comparison: Database vs Cache */}
          <div style={{ display: "flex", gap: 18, width: "96%", maxWidth: 900, justifyContent: "center" }}>
            {/* Slow DB Vault */}
            <div
              style={{
                flex: 1,
                background: "rgba(30, 41, 59, 0.75)",
                border: "2.5px solid #64748B",
                borderRadius: 22,
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 44 }}>🗄️🔒</span>
              <div style={{ color: "#CBD5E1", fontSize: 20, fontWeight: 800 }}>Database Vault</div>
              <div style={{ color: "#F87171", fontSize: 26, fontWeight: 900, fontFamily: FONT_HEAD }}>
                200ms (Slow Disk) 🐢
              </div>
              <div style={{ color: "#94A3B8", fontSize: 15 }}>Slow disk reads for every customer</div>
            </div>

            {/* Fast Redis Snack Counter */}
            <div
              style={{
                flex: 1,
                background: "rgba(245, 158, 11, 0.25)",
                border: "3px solid #F59E0B",
                borderRadius: 22,
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 10,
                boxShadow: "0 10px 35px rgba(245, 158, 11, 0.4)",
              }}
            >
              <span style={{ fontSize: 44 }}>⚡🍌</span>
              <div style={{ color: "#FDE68A", fontSize: 20, fontWeight: 800 }}>Redis Snack Counter</div>
              <div style={{ color: "#34D399", fontSize: 26, fontWeight: 900, fontFamily: FONT_HEAD }}>
                1ms (Pure RAM) 🚀
              </div>
              <div style={{ color: "#FCD34D", fontSize: 15, fontWeight: 700 }}>95% of orders served instantly!</div>
            </div>
          </div>

          <div
            style={{
              background: "rgba(15, 23, 42, 0.96)",
              border: "2.5px solid #F59E0B",
              borderRadius: 20,
              padding: "16px 32px",
              color: "#F1F5F9",
              fontSize: 20,
              fontWeight: 700,
              textAlign: "center",
              maxWidth: 880,
            }}
          >
            ⚡ <strong style={{ color: "#FBBF24" }}>Cache-Aside Pattern:</strong> Store hot bananas right on the front counter in RAM. 200x faster!
          </div>
        </>
      )}

      {/* ── PHASE 3: TICKET MACHINE (MESSAGE QUEUE) ── */}
      {phase === 3 && (
        <>
          <DevMonkey
            mood="architect"
            size={340}
            thoughtText="Take a ticket! No dropped orders! 🎟️"
            badgeText="Asynchronous Queue Architect"
          />

          {/* Ticket Machine Simulation */}
          <div
            style={{
              width: "96%",
              maxWidth: 900,
              background: "rgba(15, 23, 42, 0.96)",
              border: "2.5px solid #38BDF8",
              borderRadius: 24,
              padding: "22px 30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 10px 35px rgba(56, 189, 248, 0.35)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 46 }}>🎰</span>
              <div>
                <div style={{ color: "#38BDF8", fontSize: 18, fontWeight: 800 }}>TICKET DISPENSER</div>
                <div style={{ color: "#F8FAFC", fontSize: 28, fontWeight: 900, fontFamily: FONT_HEAD }}>
                  Ticket #{(Math.floor(frame / 15) % 50) + 100}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              {["#101", "#102", "#103"].map((t) => (
                <div
                  key={t}
                  style={{
                    background: "#1E293B",
                    border: "2px dashed #38BDF8",
                    borderRadius: 14,
                    padding: "10px 18px",
                    color: "#7DD3FC",
                    fontSize: 20,
                    fontWeight: 900,
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: "rgba(15, 23, 42, 0.96)",
              border: "2.5px solid #38BDF8",
              borderRadius: 20,
              padding: "16px 32px",
              color: "#F1F5F9",
              fontSize: 20,
              fontWeight: 700,
              textAlign: "center",
              maxWidth: 880,
            }}
          >
            🎟️ <strong style={{ color: "#38BDF8" }}>Message Queues (Kafka / RabbitMQ):</strong> Buffer viral traffic spikes so kitchens process orders at steady speed.
          </div>
        </>
      )}
    </div>
  );
};

// ── ACT 4: THE ZEN TECH LEAD & RETIREMENT ON BEACH ────────────────────────────
const Act4Stage: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        height: "100%",
        width: "100%",
        padding: "10px 0",
      }}
    >
      {/* Dev Monkey Chilling in Sunglasses with Banana Smoothie */}
      <DevMonkey
        mood="architect"
        size={360}
        thoughtText="1M orders/day and I'm on the beach! 🏖️"
        badgeText="Senior Staff Architect Monkey"
        holdingItem="smoothie"
      />

      {/* Production Dashboard Glowing Green */}
      <div
        style={{
          width: "96%",
          maxWidth: 900,
          background: "rgba(6, 78, 59, 0.85)",
          border: "3px solid #10B981",
          borderRadius: 26,
          padding: "24px 34px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          boxShadow: "0 12px 45px rgba(16, 185, 129, 0.4)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 38 }}>🟢</span>
          <div>
            <div style={{ color: "#A7F3D0", fontSize: 15, fontWeight: 800 }}>SYSTEM HEALTH</div>
            <div style={{ color: "#FFFFFF", fontSize: 24, fontWeight: 900 }}>100% Uptime</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 38 }}>📦</span>
          <div>
            <div style={{ color: "#A7F3D0", fontSize: 15, fontWeight: 800 }}>DAILY BANANAS</div>
            <div style={{ color: "#FFFFFF", fontSize: 24, fontWeight: 900 }}>1,000,000+</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 38 }}>⚡</span>
          <div>
            <div style={{ color: "#A7F3D0", fontSize: 15, fontWeight: 800 }}>P99 LATENCY</div>
            <div style={{ color: "#34D399", fontSize: 24, fontWeight: 900 }}>2ms Average</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 38 }}>🛡️</span>
          <div>
            <div style={{ color: "#A7F3D0", fontSize: 15, fontWeight: 800 }}>DROPPED ORDERS</div>
            <div style={{ color: "#34D399", fontSize: 24, fontWeight: 900 }}>0 (Zero!)</div>
          </div>
        </div>
      </div>

      {/* 3 Golden Rules Summary */}
      <div
        style={{
          width: "96%",
          maxWidth: 900,
          background: "rgba(15, 23, 42, 0.96)",
          border: "2.5px solid #F59E0B",
          borderRadius: 22,
          padding: "20px 28px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ color: "#FDE68A", fontSize: 17, fontWeight: 800, letterSpacing: 1.5 }}>
          THE 3 SENIOR ARCHITECT RULES:
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, color: "#F8FAFC", fontSize: 18, fontWeight: 700 }}>
          <div>✅ 1. Scale Horizontally: Use a Traffic Cop (Load Balancer)</div>
          <div>✅ 2. In-Memory Caching: Keep common answers in RAM (Redis)</div>
          <div>✅ 3. Asynchronous Queuing: Hand out tickets for heavy spikes (Kafka)</div>
        </div>
      </div>
    </div>
  );
};

// ── DYNAMIC SYNCED STORY CAPTIONS ───────────────────────────────────────────
const StoryCaptions: React.FC<{ act: 1 | 2 | 3 | 4; frame: number }> = ({ act, frame }) => {
  // Caption sets per act with frame boundaries
  const act1Lines = [
    { from: 0, to: 150, text: "Meet Monkey. Monkey loves bananas. So Monkey built an app called BananaNow." },
    { from: 150, to: 350, text: "On day one, Monkey has two users: his mom, and his best friend Bob." },
    { from: 350, to: 650, text: "Monkey runs the entire app on his laptop in a tiny kitchen." },
    { from: 650, to: 979, text: "Monkey thinks: Scaling is easy! I am basically Steve Jobs! 🚀" },
  ];

  const act2Lines = [
    { from: 0, to: 200, text: "Until... 2 AM on a Tuesday. A celebrity gorilla tweets about BananaNow! 🦍" },
    { from: 200, to: 450, text: "BOOM! One hundred thousand monkeys open the app at the exact same second!" },
    { from: 450, to: 750, text: "Ten thousand orders fly in! CPU hits 100%! The laptop is literally smoking! 🔥" },
    { from: 750, to: 1104, text: "The database locks up, and the server melts into banana smoothie. PURE PANIC!" },
  ];

  const act3Lines = [
    { from: 0, to: 300, text: "Senior Gorilla walks in: Monkey, relax. Here are the 3 golden rules of scaling." },
    { from: 300, to: 650, text: "Rule 1: The Traffic Cop (Load Balancer). Distribute users across 3 identical kitchens!" },
    { from: 650, to: 1000, text: "Rule 2: The Snack Counter (Redis Cache). 95% ask for same banana. Keep it in RAM!" },
    { from: 1000, to: 1330, text: "Instant 1ms response instead of digging into the slow 200ms database vault!" },
    { from: 1330, to: 1650, text: "Rule 3: The Ticket Machine (Message Queues). Give every chimp a numbered ticket!" },
    { from: 1650, to: 2013, text: "Background workers process orders calmly at steady speed without dropping a banana!" },
  ];

  const act4Lines = [
    { from: 0, to: 250, text: "Now look at BananaNow! One million orders handled with complete ease." },
    { from: 250, to: 550, text: "The Traffic Cop balances, the Cache accelerates, and the Queue buffers every viral spike." },
    { from: 550, to: 850, text: "Monkey is chilling on the beach with a smoothie, watching the dashboard glow green. 🏖️" },
    { from: 850, to: 1192, text: "Don't buy a giant computer. Divide the work, cache the common, and queue the spikes! 🍌" },
  ];

  const lines = act === 1 ? act1Lines : act === 2 ? act2Lines : act === 3 ? act3Lines : act4Lines;
  const current = lines.find((l) => frame >= l.from && frame < l.to) || lines[lines.length - 1];

  return (
    <div
      style={{
        position: "absolute",
        bottom: 50,
        width: "92%",
        maxWidth: 880,
        background: "rgba(15, 23, 42, 0.97)",
        border: "2.5px solid rgba(255, 255, 255, 0.22)",
        borderRadius: 24,
        padding: "18px 30px",
        textAlign: "center",
        boxShadow: "0 12px 35px rgba(0,0,0,0.7)",
        zIndex: 30,
      }}
    >
      <div
        style={{
          color: "#F8FAFC",
          fontSize: 24,
          fontWeight: 800,
          fontFamily: FONT_HEAD,
          lineHeight: 1.35,
          letterSpacing: 0.3,
        }}
      >
        {current.text}
      </div>
    </div>
  );
};

export default MonkeyStoryScene;
