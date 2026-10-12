/**
 * MonkeyCachingScene.tsx
 *
 * Full visual engine for the "BananaNow Caching" reel.
 * 5 acts, each with its own animated stage.
 *
 * Act "caching-1" → vault intro / hook
 * Act "caching-2" → cache miss hell / thundering herd
 * Act "caching-3" → 3 cache strategies (cache-aside, write-through, write-behind)
 * Act "caching-4" → eviction wars (LRU, LFU, TTL)
 * Act "caching-5" → zen architect / CDN + Redis vs Memcached
 */

import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { DevMonkey } from "./DevMonkey";
import { FONT_HEAD, FONT_BODY } from "../../utils/fonts";

export interface MonkeyCachingConfig {
  act: "caching-1" | "caching-2" | "caching-3" | "caching-4" | "caching-5";
  title: string;
  subtitle: string;
  badge: string;
}

interface Props {
  config: MonkeyCachingConfig;
  videoWidth: number;
  videoHeight: number;
}

// ── PALETTE ───────────────────────────────────────────────────────────────────
const P = {
  yellow:  "#F59E0B",
  yellowLight: "#FDE68A",
  yellowGlow: "#F59E0B40",
  green:   "#10B981",
  greenLight: "#6EE7B7",
  greenSoft: "#A7F3D0",
  red:     "#EF4444",
  redLight: "#FCA5A5",
  blue:    "#38BDF8",
  blueLight: "#7DD3FC",
  purple:  "#A855F7",
  purpleLight: "#D8B4FE",
  slate:   "#0F172A",
  slateMid: "#1E293B",
  slateText: "#94A3B8",
  white:   "#F8FAFC",
};

// ── BG per act ────────────────────────────────────────────────────────────────
const actBg: Record<string, string> = {
  "caching-1": `radial-gradient(circle at 50% 30%, #1E1B4B 0%, #0F172A 60%, #070B14 100%)`,
  "caching-2": `radial-gradient(circle at 50% 35%, #450A0A 0%, #1A0505 55%, #0A0000 100%)`,
  "caching-3": `radial-gradient(circle at 50% 30%, #0D2238 0%, #0A1628 55%, #060D18 100%)`,
  "caching-4": `radial-gradient(circle at 50% 30%, #2D1A4B 0%, #160D28 60%, #0A0614 100%)`,
  "caching-5": `radial-gradient(circle at 50% 30%, #064E3B 0%, #032A20 55%, #061712 100%)`,
};

const actAccent: Record<string, string> = {
  "caching-1": P.yellow,
  "caching-2": P.red,
  "caching-3": P.blue,
  "caching-4": P.purple,
  "caching-5": P.green,
};

const actPill: Record<string, string> = {
  "caching-1": "rgba(245,158,11,0.25)",
  "caching-2": "rgba(239,68,68,0.25)",
  "caching-3": "rgba(56,189,248,0.25)",
  "caching-4": "rgba(168,85,247,0.25)",
  "caching-5": "rgba(16,185,129,0.25)",
};

// ─────────────────────────────────────────────────────────────────────────────
export const MonkeyCachingScene: React.FC<Props> = ({ config }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { act, title, subtitle, badge } = config;

  const enterScale = spring({ fps, frame, config: { damping: 12, stiffness: 180 }, from: 0.93, to: 1 });
  const enterOp = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const accent = actAccent[act] ?? P.yellow;
  const pillBg = actPill[act] ?? "rgba(245,158,11,0.25)";

  // Floating ambient emojis — different per act
  const ambientEmoji = act === "caching-2" ? "💀" : act === "caching-4" ? "🗑️" : act === "caching-5" ? "🌍" : "🍌";
  const ambientOffset = [
    { x: 60,  y: 200, rot: -20, speed: 0.038 },
    { x: 950, y: 280, rot: 30,  speed: 0.032 },
    { x: 70,  y: 1500,rot: 42,  speed: 0.048 },
    { x: 920, y: 1560,rot: -32, speed: 0.042 },
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
        padding: "80px 48px 200px",
        overflow: "hidden",
        background: actBg[act] ?? actBg["caching-1"],
        opacity: enterOp,
        transform: `scale(${enterScale})`,
      }}
    >
      {/* ── CHANNEL TAG ── */}
      <div
        style={{
          position: "absolute",
          top: 36,
          right: 48,
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 100,
          padding: "6px 16px",
          color: P.yellowLight,
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: 1,
          fontFamily: FONT_HEAD,
          zIndex: 20,
        }}
      >
        <span>🍌</span> @beyond.localhost
      </div>

      {/* ── AMBIENT PARTICLES ── */}
      {ambientOffset.map((b, i) => {
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
              fontSize: 48,
              opacity: act === "caching-2" ? 0.15 : 0.30,
              filter: "blur(0.5px)",
              pointerEvents: "none",
            }}
          >
            {ambientEmoji}
          </div>
        );
      })}

      {/* ── HEADER ── */}
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
        {/* Episode pill */}
        <div
          style={{
            background: pillBg,
            border: `2px solid ${accent}`,
            borderRadius: 100,
            padding: "9px 28px",
            color: accent,
            fontSize: 17,
            fontWeight: 800,
            letterSpacing: 2,
            textTransform: "uppercase",
            fontFamily: FONT_HEAD,
            boxShadow: `0 4px 20px ${accent}30`,
          }}
        >
          {badge}
        </div>

        {/* Big title */}
        <div
          style={{
            fontSize: 50,
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
            color: accent,
            maxWidth: 900,
            lineHeight: 1.35,
          }}
        >
          {subtitle}
        </div>
      </div>

      {/* ── ACT STAGE ── */}
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
          margin: "40px 0 10px",
        }}
      >
        {act === "caching-1" && <Act1VaultStage frame={frame} fps={fps} />}
        {act === "caching-2" && <Act2MissHellStage frame={frame} fps={fps} />}
        {act === "caching-3" && <Act3StrategiesStage frame={frame} fps={fps} />}
        {act === "caching-4" && <Act4EvictionStage frame={frame} fps={fps} />}
        {act === "caching-5" && <Act5ZenStage frame={frame} fps={fps} />}
      </div>

      {/* ── CAPTION BAR ── */}
      <CachingCaptions act={act} frame={frame} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ACT 1: THE BANANA VAULT — What Is a Cache?
// Hook: "Why Netflix loads in 0.3s"
// Key concepts: cache = fast shelf between you and the slow vault
// ─────────────────────────────────────────────────────────────────────────────
const Act1VaultStage: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // Request animation: monkey walks to shelf, not vault
  const reqPop = spring({ fps, frame: frame - 20, config: { damping: 10, stiffness: 200 }, from: 0, to: 1 });
  const shelfPop = spring({ fps, frame: frame - 60, config: { damping: 10, stiffness: 160 }, from: 0, to: 1 });
  const arrowOp = interpolate(frame, [100, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const statPop = spring({ fps, frame: frame - 160, config: { damping: 12, stiffness: 140 }, from: 0, to: 1 });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", gap: 28 }}>

      {/* Request card */}
      {frame > 20 && (
        <div
          style={{
            transform: `scale(${reqPop})`,
            width: "92%",
            maxWidth: 860,
            background: "rgba(15,23,42,0.95)",
            border: `2.5px solid ${P.yellow}`,
            borderRadius: 24,
            padding: "20px 30px",
            display: "flex",
            alignItems: "center",
            gap: 18,
            boxShadow: `0 10px 35px ${P.yellowGlow}`,
          }}
        >
          <span style={{ fontSize: 44 }}>🐒</span>
          <div>
            <div style={{ color: P.yellowLight, fontSize: 22, fontWeight: 800, fontFamily: FONT_HEAD }}>
              Monkey requests: "Top banana price today?"
            </div>
            <div style={{ color: P.slateText, fontSize: 17, marginTop: 4 }}>
              Same question. 47,000 times per hour. Every hour.
            </div>
          </div>
        </div>
      )}

      {/* Main monkey */}
      <DevMonkey
        mood="thinking"
        size={320}
        thoughtText={frame > 130 ? "Wait… the shelf is RIGHT there! ⚡" : "Why walk to the vault every time? 🤔"}
        badgeText="Smart Caching Monkey"
      />

      {/* Two-box diagram: Cache shelf vs Database vault */}
      {frame > 60 && (
        <div
          style={{
            transform: `scale(${shelfPop})`,
            display: "flex",
            gap: 20,
            width: "92%",
            maxWidth: 880,
          }}
        >
          {/* Fast Cache */}
          <div
            style={{
              flex: 1,
              background: "rgba(245,158,11,0.2)",
              border: `2.5px solid ${P.yellow}`,
              borderRadius: 22,
              padding: "20px 16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 8,
              boxShadow: `0 10px 32px ${P.yellowGlow}`,
            }}
          >
            <span style={{ fontSize: 46 }}>⚡🍌</span>
            <div style={{ color: P.yellowLight, fontSize: 20, fontWeight: 800, fontFamily: FONT_HEAD }}>
              Cache Shelf
            </div>
            <div style={{ color: P.green, fontSize: 26, fontWeight: 900, fontFamily: FONT_HEAD }}>
              &lt; 1ms
            </div>
            <div style={{ color: "#FCD34D", fontSize: 15, fontWeight: 700 }}>
              RAM — right at the counter
            </div>
          </div>

          {/* Arrow */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: arrowOp,
              fontSize: 36,
            }}
          >
            ⟺
          </div>

          {/* Slow DB */}
          <div
            style={{
              flex: 1,
              background: "rgba(30,41,59,0.75)",
              border: `2.5px solid ${P.slateText}`,
              borderRadius: 22,
              padding: "20px 16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 46 }}>🗄️🔒</span>
            <div style={{ color: P.slateText, fontSize: 20, fontWeight: 800, fontFamily: FONT_HEAD }}>
              Database Vault
            </div>
            <div style={{ color: P.red, fontSize: 26, fontWeight: 900, fontFamily: FONT_HEAD }}>
              150–300ms
            </div>
            <div style={{ color: P.slateText, fontSize: 15 }}>
              Slow disk — deep underground
            </div>
          </div>
        </div>
      )}

      {/* Hit-rate stat */}
      {frame > 160 && (
        <div
          style={{
            transform: `scale(${statPop})`,
            width: "92%",
            maxWidth: 860,
            background: "rgba(15,23,42,0.97)",
            border: `2px solid rgba(245,158,11,0.6)`,
            borderRadius: 20,
            padding: "16px 28px",
            textAlign: "center",
            fontSize: 20,
            fontWeight: 700,
            color: P.white,
            fontFamily: FONT_HEAD,
          }}
        >
          🍌 A cache hit rate of <span style={{ color: P.green, fontSize: 26 }}>99%</span> means
          {" "}your database gets <span style={{ color: P.green }}>100× less traffic</span>.
          Netflix, Twitter, Instagram all depend on this.
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ACT 2: CACHE MISS HELL — Thundering Herd Problem
// Cold start, no cache, database storm
// ─────────────────────────────────────────────────────────────────────────────
const Act2MissHellStage: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const tweetY = spring({ fps, frame, config: { damping: 11, stiffness: 200 }, from: -160, to: 0 });
  const dbStress = interpolate(frame, [0, 60, 200], [0, 70, 100], { extrapolateRight: "clamp" });
  const herdPop = spring({ fps, frame: frame - 100, config: { damping: 10, stiffness: 160 }, from: 0, to: 1 });

  // Animated DB load bar color: green → orange → red
  const barColor = dbStress < 60 ? P.green : dbStress < 85 ? P.yellow : P.red;

  // Blinking alarm at peak stress
  const alarmOp = frame > 160 ? 0.6 + Math.sin(frame * 0.6) * 0.4 : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", gap: 24 }}>

      {/* Viral tweet card drops in */}
      <div
        style={{
          transform: `translateY(${tweetY}px)`,
          width: "92%",
          maxWidth: 860,
          background: "rgba(15,23,42,0.96)",
          border: `3px solid ${P.red}`,
          borderRadius: 24,
          padding: "20px 28px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          boxShadow: `0 12px 40px rgba(239,68,68,0.45)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 42 }}>🦍</span>
            <div>
              <div style={{ color: P.white, fontSize: 22, fontWeight: 800 }}>
                King Gorilla <span style={{ color: P.blue, fontSize: 17 }}>☑️</span>
              </div>
              <div style={{ color: P.slateText, fontSize: 15 }}>@gorillaking · 3:14 AM</div>
            </div>
          </div>
          <div style={{ background: P.red, color: "#FFF", borderRadius: 8, padding: "5px 14px", fontSize: 14, fontWeight: 800 }}>
            VIRAL 🔥
          </div>
        </div>
        <div style={{ color: P.white, fontSize: 24, fontWeight: 700, lineHeight: 1.35 }}>
          "BananaNow's banana price tracker is INSANE. Check it NOW!" 🍌💰
        </div>
        <div style={{ display: "flex", gap: 28, color: P.slateText, fontSize: 16, fontWeight: 600 }}>
          <span>💬 61.2K</span>
          <span>🔁 220.8K</span>
          <span style={{ color: "#F43F5E" }}>❤️ 1.1M</span>
        </div>
      </div>

      {/* Panicked monkey */}
      <div style={{ position: "relative" }}>
        <DevMonkey
          mood="panic"
          size={340}
          thoughtText="CACHE IS EMPTY. DB is on fire! 🔥"
          badgeText="🚨 THUNDERING HERD: 80,000 simultaneous misses"
          holdingItem="laptop"
        />
        <div style={{ position: "absolute", top: -30, left: -20, fontSize: 42, opacity: alarmOp }}>🚨</div>
        <div style={{ position: "absolute", top: -40, right: -15, fontSize: 46 }}>💥</div>
      </div>

      {/* DB load meter */}
      {frame > 100 && (
        <div
          style={{
            transform: `scale(${herdPop})`,
            width: "92%",
            maxWidth: 860,
            background: "rgba(69,10,10,0.92)",
            border: `2.5px solid ${P.red}`,
            borderRadius: 22,
            padding: "20px 30px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            boxShadow: `0 10px 32px rgba(239,68,68,0.4)`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ color: P.redLight, fontSize: 17, fontWeight: 800, letterSpacing: 1.5 }}>
              DATABASE LOAD
            </div>
            <div style={{ color: barColor, fontSize: 34, fontWeight: 900, fontFamily: FONT_HEAD }}>
              {Math.round(dbStress)}% 💥
            </div>
          </div>
          {/* Load bar */}
          <div style={{ background: "#2D0808", borderRadius: 100, height: 20, overflow: "hidden" }}>
            <div
              style={{
                width: `${dbStress}%`,
                height: "100%",
                background: barColor,
                borderRadius: 100,
                transition: "background 0.3s",
                boxShadow: `0 0 12px ${barColor}80`,
              }}
            />
          </div>
          <div style={{ color: P.redLight, fontSize: 18, fontWeight: 700, textAlign: "center" }}>
            Cache Empty = Every monkey hits the database. 80,000 identical queries. DB dies.
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ACT 3: THE 3 BANANA COUNTER STRATEGIES
// Phase 1 (0–700f): Cache-Aside (Lazy Loading)
// Phase 2 (700–1390f): Write-Through
// Phase 3 (1390–2160f): Write-Behind (Write-Back)
// ─────────────────────────────────────────────────────────────────────────────
const Act3StrategiesStage: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const phase = frame < 700 ? 1 : frame < 1390 ? 2 : 3;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", gap: 22 }}>

      {/* Navigation tabs */}
      <div style={{ display: "flex", width: "92%", maxWidth: 880, gap: 12, justifyContent: "center" }}>
        {[
          { n: 1, icon: "🔍", label: "Cache-Aside", sub: "Lazy Load" },
          { n: 2, icon: "✍️", label: "Write-Through", sub: "Sync Write" },
          { n: 3, icon: "⏳", label: "Write-Behind", sub: "Async Write" },
        ].map((t) => {
          const active = phase === t.n;
          return (
            <div
              key={t.n}
              style={{
                flex: 1,
                background: active ? "rgba(56,189,248,0.22)" : "rgba(30,41,59,0.6)",
                border: `2px solid ${active ? P.blue : "rgba(148,163,184,0.25)"}`,
                borderRadius: 18,
                padding: "12px 14px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                transform: active ? "scale(1.04)" : "scale(1)",
                boxShadow: active ? `0 8px 24px rgba(56,189,248,0.35)` : "none",
              }}
            >
              <span style={{ fontSize: 28 }}>{t.icon}</span>
              <div style={{ color: active ? P.blue : P.slateText, fontSize: 18, fontWeight: 800 }}>
                {t.label}
              </div>
              <div style={{ color: active ? P.blueLight : "#64748B", fontSize: 13, fontWeight: 700 }}>
                {t.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── PHASE 1: Cache-Aside (Lazy Loading) ── */}
      {phase === 1 && <Phase1CacheAside frame={frame} fps={fps} />}

      {/* ── PHASE 2: Write-Through ── */}
      {phase === 2 && <Phase2WriteThrough frame={frame - 700} fps={fps} />}

      {/* ── PHASE 3: Write-Behind ── */}
      {phase === 3 && <Phase3WriteBehind frame={frame - 1390} fps={fps} />}
    </div>
  );
};

const Phase1CacheAside: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // Animated step: MISS → fetch DB → STORE in cache → next req = HIT
  const step = frame < 150 ? 0 : frame < 300 ? 1 : frame < 450 ? 2 : 3;

  const steps = [
    { icon: "🐒", label: "1. Monkey asks cache for banana price", color: P.blue },
    { icon: "❌", label: "2. CACHE MISS — cache has nothing. Fetch from DB!", color: P.red },
    { icon: "📦", label: "3. Store result in cache with a TTL timer", color: P.yellow },
    { icon: "⚡", label: "4. Next monkey? Cache HIT — served instantly!", color: P.green },
  ];

  return (
    <>
      <DevMonkey
        mood="thinking"
        size={300}
        thoughtText={step < 2 ? "Cache miss… digging in vault 🔍" : "Cache hit! Zero vault digging! ⚡"}
        badgeText="Cache-Aside / Lazy Loading Pattern"
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "92%", maxWidth: 860 }}>
        {steps.map((s, i) => {
          const pop = spring({ fps, frame: frame - i * 150, config: { damping: 10, stiffness: 180 }, from: 0, to: 1 });
          if (frame < i * 150) return null;
          return (
            <div
              key={i}
              style={{
                transform: `scale(${pop})`,
                display: "flex",
                alignItems: "center",
                gap: 16,
                background: i <= step ? `rgba(${s.color === P.green ? "16,185,129" : s.color === P.red ? "239,68,68" : s.color === P.yellow ? "245,158,11" : "56,189,248"},0.15)` : "rgba(30,41,59,0.5)",
                border: `2px solid ${i <= step ? s.color : "rgba(100,116,139,0.3)"}`,
                borderRadius: 18,
                padding: "16px 22px",
              }}
            >
              <span style={{ fontSize: 32 }}>{s.icon}</span>
              <div style={{ color: i <= step ? s.color : P.slateText, fontSize: 19, fontWeight: 700, fontFamily: FONT_HEAD }}>
                {s.label}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ width: "92%", maxWidth: 860, background: "rgba(15,23,42,0.97)", border: `2px solid rgba(56,189,248,0.6)`, borderRadius: 18, padding: "14px 26px", color: P.white, fontSize: 19, fontWeight: 700, textAlign: "center" }}>
        ✅ <strong style={{ color: P.blue }}>Cache-Aside:</strong> App drives reads. Best for read-heavy workloads (90% of web apps).
      </div>
    </>
  );
};

const Phase2WriteThrough: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const writePop = spring({ fps, frame: frame - 20, config: { damping: 10, stiffness: 180 }, from: 0, to: 1 });
  const dbWritePop = spring({ fps, frame: frame - 100, config: { damping: 10, stiffness: 160 }, from: 0, to: 1 });
  const confirmPop = spring({ fps, frame: frame - 200, config: { damping: 12, stiffness: 140 }, from: 0, to: 1 });

  return (
    <>
      <DevMonkey
        mood="chill"
        size={300}
        thoughtText="Cache and DB always in sync! 🤝"
        badgeText="Write-Through — Consistency King"
        holdingItem="banana"
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 18, width: "92%", maxWidth: 860 }}>
        {frame > 20 && (
          <div style={{ transform: `scale(${writePop})`, display: "flex", alignItems: "center", gap: 18, background: "rgba(245,158,11,0.18)", border: `2.5px solid ${P.yellow}`, borderRadius: 20, padding: "18px 26px" }}>
            <span style={{ fontSize: 38 }}>✍️</span>
            <div>
              <div style={{ color: P.yellowLight, fontSize: 21, fontWeight: 800 }}>Write hits cache first</div>
              <div style={{ color: P.slateText, fontSize: 16 }}>Monkey updates "banana price: $0.89" in cache instantly</div>
            </div>
          </div>
        )}
        {frame > 100 && (
          <div style={{ transform: `scale(${dbWritePop})`, display: "flex", alignItems: "center", gap: 18, background: "rgba(56,189,248,0.15)", border: `2.5px solid ${P.blue}`, borderRadius: 20, padding: "18px 26px" }}>
            <span style={{ fontSize: 38 }}>🗄️</span>
            <div>
              <div style={{ color: P.blue, fontSize: 21, fontWeight: 800 }}>Then synchronously to DB</div>
              <div style={{ color: P.slateText, fontSize: 16 }}>Same transaction — cache & DB always match. Zero staleness.</div>
            </div>
          </div>
        )}
        {frame > 200 && (
          <div style={{ transform: `scale(${confirmPop})`, display: "flex", alignItems: "center", gap: 18, background: "rgba(16,185,129,0.15)", border: `2.5px solid ${P.green}`, borderRadius: 20, padding: "18px 26px" }}>
            <span style={{ fontSize: 38 }}>✅</span>
            <div>
              <div style={{ color: P.green, fontSize: 21, fontWeight: 800 }}>Next monkey reads = instant cache hit</div>
              <div style={{ color: P.slateText, fontSize: 16 }}>No stale data. Use for banking, inventory, cart systems.</div>
            </div>
          </div>
        )}
      </div>

      <div style={{ width: "92%", maxWidth: 860, background: "rgba(15,23,42,0.97)", border: `2px solid rgba(56,189,248,0.5)`, borderRadius: 18, padding: "14px 26px", color: P.white, fontSize: 19, fontWeight: 700, textAlign: "center" }}>
        ⚠️ Trade-off: Writes are slower (2 ops) but you <strong style={{ color: P.green }}>never serve stale data</strong>.
      </div>
    </>
  );
};

const Phase3WriteBehind: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const batchFrames = Math.floor(frame / 45) % 5; // Batching counter
  const bufferCount = Math.min(batchFrames + 1, 5);
  const flushOp = frame > 300 ? 0.6 + Math.sin(frame * 0.3) * 0.4 : 0;

  return (
    <>
      <DevMonkey
        mood="architect"
        size={300}
        thoughtText="Write fast now. Sync DB later. ⚡"
        badgeText="Write-Behind / Write-Back — Speed Demon"
      />

      <div style={{ width: "92%", maxWidth: 860, background: "rgba(168,85,247,0.15)", border: `2.5px solid ${P.purple}`, borderRadius: 22, padding: "22px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ color: P.purpleLight, fontSize: 20, fontWeight: 800, fontFamily: FONT_HEAD }}>
          📬 Write Buffer Queue
        </div>

        {/* Buffer items */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {Array.from({ length: bufferCount }).map((_, i) => (
            <div
              key={i}
              style={{
                background: "rgba(168,85,247,0.25)",
                border: `2px solid ${P.purple}`,
                borderRadius: 14,
                padding: "8px 16px",
                color: P.purpleLight,
                fontSize: 17,
                fontWeight: 800,
              }}
            >
              Write #{i + 1} 🍌
            </div>
          ))}
        </div>

        {/* Flush arrow */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: flushOp }}>
          <div style={{ flex: 1, height: 3, background: `linear-gradient(90deg, ${P.purple}, ${P.blue})`, borderRadius: 100 }} />
          <div style={{ color: P.blueLight, fontSize: 17, fontWeight: 800 }}>
            Batch flush to DB every 100ms →
          </div>
          <span style={{ fontSize: 32 }}>🗄️</span>
        </div>
      </div>

      <div style={{ width: "92%", maxWidth: 860, display: "flex", gap: 16 }}>
        <div style={{ flex: 1, background: "rgba(16,185,129,0.15)", border: `2px solid ${P.green}`, borderRadius: 18, padding: "14px 18px", textAlign: "center" }}>
          <div style={{ color: P.green, fontSize: 22, fontWeight: 900 }}>✅ BEST FOR</div>
          <div style={{ color: P.slateText, fontSize: 15, fontWeight: 700, marginTop: 4 }}>High-write workloads: analytics, logs, metrics, likes counter</div>
        </div>
        <div style={{ flex: 1, background: "rgba(239,68,68,0.12)", border: `2px solid ${P.red}`, borderRadius: 18, padding: "14px 18px", textAlign: "center" }}>
          <div style={{ color: P.red, fontSize: 22, fontWeight: 900 }}>⚠️ RISK</div>
          <div style={{ color: P.slateText, fontSize: 15, fontWeight: 700, marginTop: 4 }}>If cache crashes before flush — data loss. Not for financial txns!</div>
        </div>
      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ACT 4: EVICTION WARS — LRU vs LFU vs TTL
// RAM is limited. Who gets kicked out when the shelf is full?
// Phase 1 (0–480f): LRU
// Phase 2 (480–960f): LFU
// Phase 3 (960–1440f): TTL
// ─────────────────────────────────────────────────────────────────────────────
const Act4EvictionStage: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const phase = frame < 480 ? 1 : frame < 960 ? 2 : 3;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", gap: 22 }}>

      {/* Navigation */}
      <div style={{ display: "flex", width: "92%", maxWidth: 880, gap: 12 }}>
        {[
          { n: 1, icon: "🕐", label: "LRU", sub: "Least Recently Used" },
          { n: 2, icon: "📊", label: "LFU", sub: "Least Frequently Used" },
          { n: 3, icon: "⏱️", label: "TTL", sub: "Time-To-Live" },
        ].map((t) => {
          const active = phase === t.n;
          return (
            <div
              key={t.n}
              style={{
                flex: 1,
                background: active ? "rgba(168,85,247,0.22)" : "rgba(30,41,59,0.6)",
                border: `2px solid ${active ? P.purple : "rgba(148,163,184,0.25)"}`,
                borderRadius: 18,
                padding: "12px 10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                transform: active ? "scale(1.04)" : "scale(1)",
                boxShadow: active ? `0 8px 22px rgba(168,85,247,0.35)` : "none",
              }}
            >
              <span style={{ fontSize: 26 }}>{t.icon}</span>
              <div style={{ color: active ? P.purpleLight : P.slateText, fontSize: 18, fontWeight: 800 }}>
                {t.label}
              </div>
              <div style={{ color: active ? P.purple : "#64748B", fontSize: 12, fontWeight: 700 }}>
                {t.sub}
              </div>
            </div>
          );
        })}
      </div>

      {phase === 1 && <EvictionLRU frame={frame} fps={fps} />}
      {phase === 2 && <EvictionLFU frame={frame - 480} fps={fps} />}
      {phase === 3 && <EvictionTTL frame={frame - 960} fps={fps} />}
    </div>
  );
};

const EvictionLRU: React.FC<{ frame: number; fps: number }> = ({ frame }) => {
  // Shelf slots — most recent on right, eviction target on left
  const items = [
    { label: "Banana stock", age: "12 min ago", willEvict: true },
    { label: "Mango price", age: "8 min ago", willEvict: false },
    { label: "Apple rate", age: "2 min ago", willEvict: false },
    { label: "Grape count", age: "30s ago", willEvict: false },
  ];
  const evictFlash = frame > 300 ? 0.4 + Math.sin(frame * 0.8) * 0.6 : 0;

  return (
    <>
      <DevMonkey
        mood="thinking"
        size={280}
        thoughtText="Kick out what I used LONGEST ago 🕐"
        badgeText="LRU — Recency Rules"
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "92%", maxWidth: 860 }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: item.willEvict ? `rgba(239,68,68,${0.1 + evictFlash * 0.15})` : "rgba(30,41,59,0.8)",
              border: `2px solid ${item.willEvict ? P.red : "rgba(100,116,139,0.4)"}`,
              borderRadius: 16,
              padding: "14px 22px",
            }}
          >
            <div style={{ color: item.willEvict ? P.redLight : P.white, fontSize: 19, fontWeight: 700 }}>
              {item.willEvict && <span style={{ opacity: evictFlash }}>🗑️ </span>}
              {item.label}
            </div>
            <div style={{ color: item.willEvict ? P.red : P.slateText, fontSize: 16, fontWeight: 700 }}>
              {item.age}
            </div>
            {item.willEvict && (
              <div style={{ background: P.red, color: "#FFF", borderRadius: 8, padding: "4px 12px", fontSize: 13, fontWeight: 800 }}>
                EVICT
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ width: "92%", maxWidth: 860, background: "rgba(15,23,42,0.97)", border: `2px solid rgba(168,85,247,0.5)`, borderRadius: 18, padding: "14px 26px", color: P.white, fontSize: 18, fontWeight: 700, textAlign: "center" }}>
        🕐 <strong style={{ color: P.purpleLight }}>LRU:</strong> Used by Redis default. Great for most caches. Protects hot data automatically.
      </div>
    </>
  );
};

const EvictionLFU: React.FC<{ frame: number; fps: number }> = ({ frame }) => {
  const items = [
    { label: "Banana price", count: 1, willEvict: true },
    { label: "Mango bundle", count: 12, willEvict: false },
    { label: "Apple daily", count: 38, willEvict: false },
    { label: "Grape flash", count: 210, willEvict: false },
  ];
  const evictFlash = frame > 200 ? 0.4 + Math.sin(frame * 0.7) * 0.6 : 0;

  return (
    <>
      <DevMonkey
        mood="thinking"
        size={280}
        thoughtText="Kick out what nobody uses 📊"
        badgeText="LFU — Frequency Wins"
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "92%", maxWidth: 860 }}>
        {items.map((item, i) => {
          const barPct = Math.min(100, (item.count / 210) * 100);
          return (
            <div
              key={i}
              style={{
                background: item.willEvict ? `rgba(239,68,68,${0.1 + evictFlash * 0.12})` : "rgba(30,41,59,0.8)",
                border: `2px solid ${item.willEvict ? P.red : "rgba(100,116,139,0.4)"}`,
                borderRadius: 16,
                padding: "12px 22px",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ color: item.willEvict ? P.redLight : P.white, fontSize: 18, fontWeight: 700 }}>
                  {item.willEvict && <span style={{ opacity: evictFlash }}>🗑️ </span>}
                  {item.label}
                </div>
                <div style={{ color: item.willEvict ? P.red : P.green, fontSize: 18, fontWeight: 800 }}>
                  {item.count}× hits
                </div>
              </div>
              <div style={{ background: "#1E293B", borderRadius: 100, height: 8 }}>
                <div style={{ width: `${barPct}%`, height: "100%", background: item.willEvict ? P.red : P.green, borderRadius: 100 }} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ width: "92%", maxWidth: 860, background: "rgba(15,23,42,0.97)", border: `2px solid rgba(168,85,247,0.5)`, borderRadius: 18, padding: "14px 26px", color: P.white, fontSize: 18, fontWeight: 700, textAlign: "center" }}>
        📊 <strong style={{ color: P.purpleLight }}>LFU:</strong> Best for Spotify / YouTube recommendations — truly popular items survive.
      </div>
    </>
  );
};

const EvictionTTL: React.FC<{ frame: number; fps: number }> = ({ frame }) => {
  const items = [
    { label: "Live banana price", ttl: "30s", expired: frame > 200, icon: "💰" },
    { label: "Flash sale banner", ttl: "60s", expired: frame > 350, icon: "🏷️" },
    { label: "User profile data", ttl: "10min", expired: false, icon: "👤" },
  ];

  return (
    <>
      <DevMonkey
        mood="chill"
        size={280}
        thoughtText="Bananas expire. So does cache. ⏱️"
        badgeText="TTL — Time-To-Live Expiry"
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "92%", maxWidth: 860 }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              background: item.expired ? "rgba(239,68,68,0.12)" : "rgba(16,185,129,0.12)",
              border: `2px solid ${item.expired ? P.red : P.green}`,
              borderRadius: 18,
              padding: "16px 24px",
            }}
          >
            <span style={{ fontSize: 36 }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: item.expired ? P.redLight : P.white, fontSize: 19, fontWeight: 800 }}>
                {item.label}
              </div>
              <div style={{ color: item.expired ? P.red : P.slateText, fontSize: 15, fontWeight: 700 }}>
                TTL: {item.ttl} · {item.expired ? "💀 EXPIRED — removed from cache" : "✅ Still fresh"}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ width: "92%", maxWidth: 860, background: "rgba(15,23,42,0.97)", border: `2px solid rgba(168,85,247,0.5)`, borderRadius: 18, padding: "14px 26px", color: P.white, fontSize: 18, fontWeight: 700, textAlign: "center" }}>
        ⏱️ <strong style={{ color: P.purpleLight }}>TTL:</strong> Always set a TTL. Infinite cache = stale data forever. 30s for prices, 24h for user profiles.
      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ACT 5: ZEN CACHE ARCHITECT
// CDN edge caching, Redis vs Memcached, interview cheat-sheet
// ─────────────────────────────────────────────────────────────────────────────
const Act5ZenStage: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const pop1 = spring({ fps, frame: frame - 20,  config: { damping: 12, stiffness: 140 }, from: 0, to: 1 });
  const pop2 = spring({ fps, frame: frame - 140, config: { damping: 12, stiffness: 140 }, from: 0, to: 1 });
  const pop3 = spring({ fps, frame: frame - 260, config: { damping: 12, stiffness: 140 }, from: 0, to: 1 });
  const pop4 = spring({ fps, frame: frame - 380, config: { damping: 12, stiffness: 140 }, from: 0, to: 1 });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", gap: 20 }}>

      <DevMonkey
        mood="architect"
        size={310}
        thoughtText="L1→L2→L3→Origin. Tiers of speed! 🌍"
        badgeText="Senior Cache Architect — BananaNow Staff Eng"
        holdingItem="smoothie"
      />

      {/* Multi-layer cache tier */}
      {frame > 20 && (
        <div
          style={{
            transform: `scale(${pop1})`,
            width: "92%",
            maxWidth: 860,
            background: "rgba(6,78,59,0.8)",
            border: `2.5px solid ${P.green}`,
            borderRadius: 22,
            padding: "18px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            boxShadow: `0 10px 32px rgba(16,185,129,0.35)`,
          }}
        >
          {[
            { tier: "L1", label: "Browser Cache", latency: "0ms", emoji: "🖥️" },
            { tier: "L2", label: "CDN Edge", latency: "<5ms", emoji: "🌍" },
            { tier: "L3", label: "Redis Cluster", latency: "1ms", emoji: "⚡" },
            { tier: "DB", label: "Postgres", latency: "200ms", emoji: "🗄️" },
          ].map((t, i) => (
            <React.Fragment key={i}>
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: 30 }}>{t.emoji}</span>
                <div style={{ color: P.greenSoft, fontSize: 14, fontWeight: 800 }}>{t.tier}</div>
                <div style={{ color: P.white, fontSize: 13, fontWeight: 700 }}>{t.label}</div>
                <div style={{ color: t.tier === "DB" ? P.red : P.green, fontSize: 14, fontWeight: 900 }}>{t.latency}</div>
              </div>
              {i < 3 && (
                <div style={{ color: P.slateText, fontSize: 22 }}>→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Redis vs Memcached */}
      {frame > 140 && (
        <div
          style={{
            transform: `scale(${pop2})`,
            display: "flex",
            gap: 16,
            width: "92%",
            maxWidth: 860,
          }}
        >
          <div style={{ flex: 1, background: "rgba(239,68,68,0.15)", border: `2px solid ${P.red}`, borderRadius: 18, padding: "16px 18px", textAlign: "center" }}>
            <div style={{ fontSize: 32 }}>🐘</div>
            <div style={{ color: P.redLight, fontSize: 19, fontWeight: 800, fontFamily: FONT_HEAD }}>Memcached</div>
            <div style={{ color: P.slateText, fontSize: 14, fontWeight: 700, marginTop: 6 }}>
              Simple key-value. Multi-thread. Pure speed. No persistence.
            </div>
            <div style={{ color: P.slateText, fontSize: 13, marginTop: 6 }}>Use: simple session store</div>
          </div>
          <div style={{ flex: 1, background: "rgba(245,158,11,0.18)", border: `2.5px solid ${P.yellow}`, borderRadius: 18, padding: "16px 18px", textAlign: "center", boxShadow: `0 8px 24px ${P.yellowGlow}` }}>
            <div style={{ fontSize: 32 }}>🔴</div>
            <div style={{ color: P.yellowLight, fontSize: 19, fontWeight: 800, fontFamily: FONT_HEAD }}>Redis ⭐</div>
            <div style={{ color: P.slateText, fontSize: 14, fontWeight: 700, marginTop: 6 }}>
              Rich data types. Persistence. Pub/Sub. Lua scripts. Cluster.
            </div>
            <div style={{ color: P.green, fontSize: 13, marginTop: 6, fontWeight: 800 }}>
              Use: 95% of real-world caching
            </div>
          </div>
        </div>
      )}

      {/* Interview cheat-sheet */}
      {frame > 260 && (
        <div
          style={{
            transform: `scale(${pop3})`,
            width: "92%",
            maxWidth: 860,
            background: "rgba(15,23,42,0.97)",
            border: `2.5px solid ${P.yellow}`,
            borderRadius: 20,
            padding: "16px 26px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div style={{ color: P.yellowLight, fontSize: 16, fontWeight: 800, letterSpacing: 1.5 }}>
            🎯 INTERVIEW CHEAT-SHEET
          </div>
          {[
            "🔍 Read-heavy? → Cache-Aside (lazy load)",
            "✍️ Strong consistency? → Write-Through",
            "⚡ Write-heavy bursts? → Write-Behind",
            "⏱️ Always set TTL (30s–24h based on data freshness)",
            "📊 Hit rate &lt; 85%? Your cache strategy is broken",
          ].map((line, i) => (
            <div key={i} style={{ color: P.white, fontSize: 18, fontWeight: 700, lineHeight: 1.4 }}
              dangerouslySetInnerHTML={{ __html: line }}
            />
          ))}
        </div>
      )}

      {/* CTA outro */}
      {frame > 380 && (
        <div
          style={{
            transform: `scale(${pop4})`,
            width: "92%",
            maxWidth: 860,
            background: `linear-gradient(135deg, rgba(16,185,129,0.3) 0%, rgba(245,158,11,0.3) 100%)`,
            border: `2.5px solid ${P.green}`,
            borderRadius: 20,
            padding: "16px 26px",
            textAlign: "center",
            color: P.white,
            fontSize: 20,
            fontWeight: 800,
            fontFamily: FONT_HEAD,
          }}
        >
          🍌 Follow for more system design nuggets. Next: Consistent Hashing explained with bananas!
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CAPTION BAR — synced subtitles per act
// ─────────────────────────────────────────────────────────────────────────────
const cachingCaptionData: Record<string, Array<{ from: number; to: number; text: string }>> = {
  "caching-1": [
    { from: 0,   to: 200, text: "Netflix plays your show in 0.3 seconds. Spotify loads your playlist instantly. Why? Cache." },
    { from: 200, to: 450, text: "Without a cache, every monkey request digs into the slow database vault — 200ms+ every single time." },
    { from: 450, to: 700, text: "A cache is a fast shelf RIGHT at the counter. Grab the banana in under 1ms — no vault digging needed." },
    { from: 700, to: 840, text: "A 99% cache hit rate means your database gets 100× less traffic. That's the secret to infinite scale." },
  ],
  "caching-2": [
    { from: 0,   to: 200, text: "King Gorilla tweets about BananaNow's price tracker. Eighty thousand monkeys open it simultaneously." },
    { from: 200, to: 450, text: "But Monkey forgot to warm the cache. COLD START. Every single monkey hits the database at the same time." },
    { from: 450, to: 700, text: "This is the Thundering Herd Problem. 80,000 identical queries for the same banana price. DB chokes and dies." },
    { from: 700, to: 1020, text: "Solution? Pre-warm your cache before a launch. Or use a request coalescing layer. Never let the herd stampede." },
  ],
  "caching-3": [
    { from: 0,   to: 300, text: "Strategy 1: Cache-Aside, also called Lazy Loading. The app checks cache first. On a miss, fetch from DB and store it." },
    { from: 300, to: 700, text: "This is the default pattern. 90% of web apps use it. The cache only stores what monkeys actually ask for." },
    { from: 700, to: 1000, text: "Strategy 2: Write-Through. Every write goes to cache AND database in the same transaction. Zero stale data." },
    { from: 1000, to: 1390, text: "Slower writes, but perfect consistency. Use it for inventory, shopping carts, and anything financial." },
    { from: 1390, to: 1750, text: "Strategy 3: Write-Behind. Write to cache instantly, batch-flush to database asynchronously every 100ms." },
    { from: 1750, to: 2160, text: "Fastest writes possible. Perfect for likes, view counts, and analytics. Risk: cache crash = potential data loss." },
  ],
  "caching-4": [
    { from: 0,   to: 250, text: "RAM is finite. When the cache is full, something gets evicted. Which banana gets thrown off the shelf?" },
    { from: 250, to: 480, text: "LRU: Least Recently Used. The banana sitting untouched the longest gets kicked. Redis uses this by default." },
    { from: 480, to: 750, text: "LFU: Least Frequently Used. Count how many times each item was requested. The least popular one leaves." },
    { from: 750, to: 960, text: "LFU is smarter for recommendation engines — truly viral content survives. Spotify, YouTube love this." },
    { from: 960, to: 1200, text: "TTL: Time-To-Live. Every cached banana has an expiry sticker. Stale data auto-evicts after the timer fires." },
    { from: 1200, to: 1440, text: "Golden rule: always set a TTL. Live prices? 30 seconds. User profiles? 10 minutes. Static pages? 24 hours." },
  ],
  "caching-5": [
    { from: 0,   to: 250, text: "Senior architects think in layers: Browser cache → CDN edge → Redis cluster → Database. Each tier catches what slips through." },
    { from: 250, to: 500, text: "Memcached: blazing fast, multi-threaded, simple. No persistence. Good for basic session stores." },
    { from: 500, to: 700, text: "Redis: rich data structures, persistence, pub/sub, clustering, Lua scripts. The industry default for 95% of use cases." },
    { from: 700, to: 950, text: "In your interview: specify the pattern, the eviction policy, the TTL, and the tool. That's senior-level depth." },
    { from: 950, to: 1260, text: "Remember: a cache with no TTL is a memory leak. A cache with no eviction policy is a timebomb. Set both. Always." },
  ],
};

const CachingCaptions: React.FC<{ act: string; frame: number }> = ({ act, frame }) => {
  const lines = cachingCaptionData[act] ?? [];
  const current = lines.find((l) => frame >= l.from && frame < l.to) ?? lines[lines.length - 1];
  if (!current) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 50,
        width: "92%",
        maxWidth: 880,
        background: "rgba(15,23,42,0.97)",
        border: "2.5px solid rgba(255,255,255,0.22)",
        borderRadius: 24,
        padding: "18px 30px",
        textAlign: "center",
        boxShadow: "0 12px 35px rgba(0,0,0,0.7)",
        zIndex: 30,
      }}
    >
      <div
        style={{
          color: P.white,
          fontSize: 23,
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

export default MonkeyCachingScene;
