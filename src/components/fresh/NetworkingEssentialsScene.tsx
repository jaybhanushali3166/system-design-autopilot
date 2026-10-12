/**
 * NetworkingEssentialsScene.tsx
 *
 * Visual Scene for "Networking Essentials" based on HelloInterview:
 * - Clean off-dark technical aesthetic
 * - Dev Monkey and Banana analogies
 * - Subtle, intentional movements synced to the narration moments:
 *    Act 1: Layers (L3 IP, L4 TCP/UDP, L7 Application) stack in sequentially
 *    Act 2: TCP (3-way handshake box + parcel) vs UDP (cannon fire + drop tolerated)
 *    Act 3: Layer 7 Protocol Matrix (REST, GraphQL, gRPC, WebSockets) highlighting as mentioned
 *    Act 4: Load Balancer routing traffic evenly across 3 servers + Edge CDN cache
 */

import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { DevMonkey, MonkeyMood } from "../character/DevMonkey";
import { FONT_HEAD, FONT_BODY } from "../../utils/fonts";

export interface NetworkingConfig {
  act: "layers" | "tcp_udp" | "protocols" | "scaling";
  badge: string;
  headlineNormal: string;
  headlineHighlight: string;
  subtitle: string;
}

interface Props {
  config: NetworkingConfig;
}

const C = {
  bg: "#0B0D14",
  surface: "rgba(255, 255, 255, 0.04)",
  surfaceBorder: "rgba(255, 255, 255, 0.08)",
  cardActive: "rgba(255, 255, 255, 0.08)",
  accentGold: "#F59E0B",
  accentEmerald: "#10B981",
  accentCyan: "#06B6D4",
  accentBlue: "#3B82F6",
  accentRed: "#EF4444",
  accentPurple: "#8B5CF6",
  textPrimary: "#FFFFFF",
  textMuted: "#94A3B8",
};

export const NetworkingEssentialsScene: React.FC<Props> = ({ config }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { act, badge, headlineNormal, headlineHighlight, subtitle } = config;

  // Scene Entrance
  const enterOp = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const enterScale = spring({
    fps,
    frame,
    config: { damping: 14, stiffness: 160 },
    from: 0.96,
    to: 1,
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: 1080,
        height: 1920,
        backgroundColor: C.bg,
        opacity: enterOp,
        transform: `scale(${enterScale})`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Background blueprint grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          pointerEvents: "none",
        }}
      />

      {/* Atmospheric ambient glows */}
      <div
        style={{
          position: "absolute",
          top: -120,
          left: -120,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -150,
          right: -150,
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* ── TOP HEADER (Badge + Titles) ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          paddingTop: 140,
          paddingLeft: 60,
          paddingRight: 60,
          marginBottom: 40,
        }}
      >
        {/* Pill Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(255, 255, 255, 0.06)",
            border: `1.5px solid ${C.accentGold}88`,
            borderRadius: 100,
            padding: "10px 28px",
            color: C.accentGold,
            fontFamily: FONT_HEAD,
            fontWeight: 800,
            fontSize: 18,
            letterSpacing: 2,
            boxShadow: `0 0 24px ${C.accentGold}25`,
            marginBottom: 24,
          }}
        >
          <span style={{ fontSize: 20 }}>🍌</span>
          {badge.toUpperCase()}
        </div>

        {/* Main Headline */}
        <h1
          style={{
            fontFamily: FONT_HEAD,
            fontSize: 52,
            fontWeight: 800,
            lineHeight: 1.15,
            color: C.textPrimary,
            margin: "0 0 16px 0",
            maxWidth: 960,
          }}
        >
          {headlineNormal}{" "}
          <span
            style={{
              background: `linear-gradient(135deg, ${C.accentGold} 0%, #FBBF24 50%, ${C.accentCyan} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {headlineHighlight}
          </span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 24,
            fontWeight: 500,
            color: C.textMuted,
            margin: 0,
            maxWidth: 900,
            lineHeight: 1.45,
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* ── MAIN INTERACTIVE STAGE ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: 960,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 140,
        }}
      >
        {act === "layers" && <Act1Layers frame={frame} fps={fps} />}
        {act === "tcp_udp" && <Act2TcpUdp frame={frame} fps={fps} />}
        {act === "protocols" && <Act3Protocols frame={frame} fps={fps} />}
        {act === "scaling" && <Act4Scaling frame={frame} fps={fps} />}
      </div>

      {/* Watermark */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 16,
          color: "rgba(255, 255, 255, 0.4)",
          fontFamily: FONT_BODY,
          fontWeight: 600,
          letterSpacing: 1.2,
          zIndex: 20,
        }}
      >
        <span style={{ color: C.accentGold }}>●</span> @beyond.localhost · HelloInterview Series
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
 * ACT 1: THREE CRITICAL LAYERS (L3 IP, L4 TCP/UDP, L7 APPLICATION)
 * Voiceover:
 * 0-7s: Meet Dev Monkey ordering bananas.
 * 7-13s: Layer 3 IP routes to the tree.
 * 13-18s: Layer 4 TCP packages & guarantees delivery.
 * 18-22s: Layer 7 Application decides what monkey ordered (REST/gRPC).
 * ────────────────────────────────────────────────────────────────────────────*/
const Act1Layers: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // Reveal timings synced with voiceover
  const l3Active = frame >= 180; // ~6.0s
  const l4Active = frame >= 360; // ~12.0s
  const l7Active = frame >= 510; // ~17.0s

  const l3Slide = spring({ fps, frame: Math.max(0, frame - 180), config: { damping: 15, stiffness: 150 }, from: 40, to: 0 });
  const l4Slide = spring({ fps, frame: Math.max(0, frame - 360), config: { damping: 15, stiffness: 150 }, from: 40, to: 0 });
  const l7Slide = spring({ fps, frame: Math.max(0, frame - 510), config: { damping: 15, stiffness: 150 }, from: 40, to: 0 });

  // Dev Monkey character mood
  const monkeyMood: MonkeyMood = l7Active ? "architect" : l4Active ? "thinking" : "chill";

  // Intentional subtle banana packet flow: packets move only between active layers
  const packetY = interpolate(frame % 90, [0, 90], [0, 360]);

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
      {/* Dev Monkey Dispatcher */}
      <div style={{ display: "flex", alignItems: "center", gap: 32, marginBottom: 8 }}>
        <DevMonkey mood={monkeyMood} size={180} holdingItem="banana" />
        <div
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: `1.5px solid ${C.surfaceBorder}`,
            borderRadius: 20,
            padding: "16px 28px",
            maxWidth: 420,
          }}
        >
          <div style={{ fontFamily: FONT_HEAD, fontSize: 16, fontWeight: 700, color: C.accentGold, marginBottom: 4 }}>
            CLIENT REQUEST DISPATCH
          </div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 19, color: C.textPrimary, lineHeight: 1.3 }}>
            {l7Active
              ? "🍌 L7: Order created -> GET /banana/ripe"
              : l4Active
              ? "📦 L4: Segmenting into TCP packets"
              : l3Active
              ? "🗺️ L3: Routing IP 10.0.4.12 -> Tree Vault"
              : "🐵 Hungry monkey wants fresh bananas!"}
          </div>
        </div>
      </div>

      {/* Layer Stack Cards */}
      <div style={{ width: "100%", maxWidth: 860, display: "flex", flexDirection: "column", gap: 18 }}>
        {/* Layer 7 Card */}
        <div
          style={{
            background: l7Active ? "rgba(139, 92, 246, 0.12)" : C.surface,
            border: `2px solid ${l7Active ? C.accentPurple : C.surfaceBorder}`,
            borderRadius: 22,
            padding: "24px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transform: `translateY(${l7Slide}px)`,
            opacity: l7Active ? 1 : 0.45,
            transition: "all 0.3s ease",
            boxShadow: l7Active ? "0 8px 32px rgba(139, 92, 246, 0.25)" : "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: 14,
                background: `${C.accentPurple}25`,
                border: `1.5px solid ${C.accentPurple}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 800,
                color: C.accentPurple,
                fontFamily: FONT_HEAD,
              }}
            >
              L7
            </div>
            <div>
              <div style={{ fontFamily: FONT_HEAD, fontSize: 24, fontWeight: 700, color: C.textPrimary }}>
                Application Layer (User Space)
              </div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 16, color: C.textMuted, marginTop: 4 }}>
                HTTP/HTTPS · REST · GraphQL · gRPC · WebSockets
              </div>
            </div>
          </div>
          <div
            style={{
              padding: "8px 18px",
              borderRadius: 12,
              background: l7Active ? C.accentPurple : "rgba(255,255,255,0.06)",
              color: "#FFF",
              fontFamily: FONT_HEAD,
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {l7Active ? "ACTIVE: ORDER SPECS" : "LAYER 7"}
          </div>
        </div>

        {/* Layer 4 Card */}
        <div
          style={{
            background: l4Active ? "rgba(6, 182, 212, 0.12)" : C.surface,
            border: `2px solid ${l4Active ? C.accentCyan : C.surfaceBorder}`,
            borderRadius: 22,
            padding: "24px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transform: `translateY(${l4Slide}px)`,
            opacity: l4Active ? 1 : 0.45,
            transition: "all 0.3s ease",
            boxShadow: l4Active ? "0 8px 32px rgba(6, 182, 212, 0.25)" : "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: 14,
                background: `${C.accentCyan}25`,
                border: `1.5px solid ${C.accentCyan}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 800,
                color: C.accentCyan,
                fontFamily: FONT_HEAD,
              }}
            >
              L4
            </div>
            <div>
              <div style={{ fontFamily: FONT_HEAD, fontSize: 24, fontWeight: 700, color: C.textPrimary }}>
                Transport Layer (Kernel Space)
              </div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 16, color: C.textMuted, marginTop: 4 }}>
                TCP (Ordered, Guaranteed, Retransmit) vs UDP (Fast, Loss-Tolerant)
              </div>
            </div>
          </div>
          <div
            style={{
              padding: "8px 18px",
              borderRadius: 12,
              background: l4Active ? C.accentCyan : "rgba(255,255,255,0.06)",
              color: l4Active ? "#0B0D14" : "#FFF",
              fontFamily: FONT_HEAD,
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {l4Active ? "PACKAGING & PORTS" : "LAYER 4"}
          </div>
        </div>

        {/* Layer 3 Card */}
        <div
          style={{
            background: l3Active ? "rgba(16, 185, 129, 0.12)" : C.surface,
            border: `2px solid ${l3Active ? C.accentEmerald : C.surfaceBorder}`,
            borderRadius: 22,
            padding: "24px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transform: `translateY(${l3Slide}px)`,
            opacity: l3Active ? 1 : 0.45,
            transition: "all 0.3s ease",
            boxShadow: l3Active ? "0 8px 32px rgba(16, 185, 129, 0.25)" : "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: 14,
                background: `${C.accentEmerald}25`,
                border: `1.5px solid ${C.accentEmerald}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 800,
                color: C.accentEmerald,
                fontFamily: FONT_HEAD,
              }}
            >
              L3
            </div>
            <div>
              <div style={{ fontFamily: FONT_HEAD, fontSize: 24, fontWeight: 700, color: C.textPrimary }}>
                Network Layer (Kernel Space)
              </div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 16, color: C.textMuted, marginTop: 4 }}>
                IP Protocol: Packet Addressing & Hop-by-Hop Jungle Routing
              </div>
            </div>
          </div>
          <div
            style={{
              padding: "8px 18px",
              borderRadius: 12,
              background: l3Active ? C.accentEmerald : "rgba(255,255,255,0.06)",
              color: l3Active ? "#0B0D14" : "#FFF",
              fontFamily: FONT_HEAD,
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {l3Active ? "IP ROUTING" : "LAYER 3"}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
 * ACT 2: TCP VS UDP (DUEL OF TRANSPORT)
 * Voiceover:
 * 0-8s: TCP is shipping in registered insured parcels (SYN, ACK, ordered).
 * 8-15s: Retransmits lost bananas.
 * 15-24s: UDP is high-speed banana cannon (fire and forget, streaming/gaming).
 * ────────────────────────────────────────────────────────────────────────────*/
const Act2TcpUdp: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // Focus switches from TCP to UDP mid-scene
  const isUdpFocus = frame >= 390; // ~13.0s

  // TCP Handshake animation (SYN -> SYN-ACK -> ACK)
  const handshakeStep = Math.min(2, Math.floor((frame % 150) / 50));
  const handshakeLabels = ["1. SYN 🍌", "2. SYN-ACK 🤝", "3. ACK (Connected) ✅"];

  // UDP Cannon banana flight
  const cannonOffset = (frame * 12) % 320;
  const isBananaDropped = (frame % 80) > 55;

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 30, alignItems: "center" }}>
      {/* Visual Comparison Split Cards */}
      <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* TCP PANEL */}
        <div
          style={{
            background: !isUdpFocus ? "rgba(59, 130, 246, 0.08)" : C.surface,
            border: `2px solid ${!isUdpFocus ? C.accentBlue : C.surfaceBorder}`,
            borderRadius: 24,
            padding: 30,
            display: "flex",
            flexDirection: "column",
            gap: 20,
            transition: "all 0.3s ease",
            boxShadow: !isUdpFocus ? "0 10px 40px rgba(59, 130, 246, 0.25)" : "none",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: FONT_HEAD, fontSize: 28, fontWeight: 800, color: C.accentBlue }}>
              TCP
            </div>
            <div
              style={{
                background: `${C.accentBlue}30`,
                color: C.accentBlue,
                padding: "6px 14px",
                borderRadius: 100,
                fontSize: 13,
                fontWeight: 700,
                fontFamily: FONT_HEAD,
              }}
            >
              INSURED PARCEL
            </div>
          </div>

          <div style={{ fontFamily: FONT_BODY, fontSize: 16, color: C.textMuted }}>
            Transmission Control Protocol
          </div>

          {/* Interactive TCP Handshake & Parcel Box */}
          <div
            style={{
              background: "rgba(0,0,0,0.35)",
              borderRadius: 18,
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: C.textMuted }}>
              <span>Handshake:</span>
              <span style={{ color: C.accentEmerald, fontWeight: 700 }}>
                {handshakeLabels[handshakeStep]}
              </span>
            </div>

            {/* Simulated Ordered Sequence Boxes */}
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              {["#1 🍌", "#2 🍌", "#3 🍌", "#4 🍌"].map((pkg, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    background: "rgba(59, 130, 246, 0.2)",
                    border: `1.5px solid ${C.accentBlue}`,
                    borderRadius: 10,
                    padding: "10px 0",
                    textAlign: "center",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#FFF",
                    fontFamily: FONT_HEAD,
                  }}
                >
                  {pkg}
                </div>
              ))}
            </div>
          </div>

          {/* Key Traits List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 16, fontFamily: FONT_BODY }}>
            <div style={{ color: C.accentEmerald }}>✓ Guaranteed Delivery (ACKs)</div>
            <div style={{ color: C.accentEmerald }}>✓ Strict In-Order Sequencing</div>
            <div style={{ color: C.accentEmerald }}>✓ Congestion & Flow Control</div>
            <div style={{ color: C.accentRed }}>✗ Higher Latency Overhead</div>
          </div>
        </div>

        {/* UDP PANEL */}
        <div
          style={{
            background: isUdpFocus ? "rgba(239, 68, 68, 0.08)" : C.surface,
            border: `2px solid ${isUdpFocus ? C.accentRed : C.surfaceBorder}`,
            borderRadius: 24,
            padding: 30,
            display: "flex",
            flexDirection: "column",
            gap: 20,
            transition: "all 0.3s ease",
            boxShadow: isUdpFocus ? "0 10px 40px rgba(239, 68, 68, 0.25)" : "none",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: FONT_HEAD, fontSize: 28, fontWeight: 800, color: C.accentRed }}>
              UDP
            </div>
            <div
              style={{
                background: `${C.accentRed}30`,
                color: C.accentRed,
                padding: "6px 14px",
                borderRadius: 100,
                fontSize: 13,
                fontWeight: 700,
                fontFamily: FONT_HEAD,
              }}
            >
              BANANA CANNON
            </div>
          </div>

          <div style={{ fontFamily: FONT_BODY, fontSize: 16, color: C.textMuted }}>
            User Datagram Protocol
          </div>

          {/* Interactive Fast Stream Visual */}
          <div
            style={{
              background: "rgba(0,0,0,0.35)",
              borderRadius: 18,
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              border: "1px solid rgba(255,255,255,0.06)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: C.textMuted }}>
              <span>Cannon Stream:</span>
              <span style={{ color: C.accentGold, fontWeight: 700 }}>
                {isBananaDropped ? "⚡ Drop 1 banana (Ignored!)" : "🚀 Blasting 0ms Handshake"}
              </span>
            </div>

            {/* Banana projectile track */}
            <div
              style={{
                height: 44,
                position: "relative",
                background: "rgba(255,255,255,0.05)",
                borderRadius: 10,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: `${(cannonOffset / 320) * 100}%`,
                  fontSize: 22,
                  transition: "none",
                }}
              >
                🍌
              </div>
            </div>
          </div>

          {/* Key Traits List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 16, fontFamily: FONT_BODY }}>
            <div style={{ color: C.accentEmerald }}>✓ Zero Handshake Lag (0-RTT)</div>
            <div style={{ color: C.accentEmerald }}>✓ Minimal Header (8 Bytes)</div>
            <div style={{ color: C.accentRed }}>✗ Unreliable: Packets Drop</div>
            <div style={{ color: C.accentGold }}>🎯 Best: Live Video, Gaming, VoIP</div>
          </div>
        </div>
      </div>

      {/* Summary Rule Banner */}
      <div
        style={{
          width: "100%",
          padding: "16px 24px",
          background: "rgba(255, 255, 255, 0.03)",
          border: `1px solid ${C.surfaceBorder}`,
          borderRadius: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontFamily: FONT_HEAD, fontSize: 17, color: C.textPrimary, fontWeight: 700 }}>
          💡 System Design Rule of Thumb:
        </span>
        <span style={{ fontFamily: FONT_BODY, fontSize: 16, color: C.accentGold }}>
          Default to TCP for APIs & data integrity; Pick UDP only when latency trumps loss!
        </span>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
 * ACT 3: APPLICATION LAYER PROTOCOLS (REST, GRAPHQL, GRPC, WEBSOCKETS)
 * Voiceover:
 * 0-7s: REST is simple CRUD: GET banana 1.
 * 7-14s: GraphQL asks for just the ripe tip & yellow peel.
 * 14-20s: gRPC packs binary Protobuf over HTTP/2 for internal services.
 * 20-26s: WebSockets keep a 2-way live banana telephone for chat/auctions.
 * ────────────────────────────────────────────────────────────────────────────*/
const Act3Protocols: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // Sync protocol card highlights to audio timing
  const isRest = frame < 210;            // 0 - 7s
  const isGraphQL = frame >= 210 && frame < 420; // 7 - 14s
  const isGrpc = frame >= 420 && frame < 600;    // 14 - 20s
  const isWebSockets = frame >= 600;             // 20 - 26s

  const protocols = [
    {
      id: "rest",
      name: "REST",
      desc: "Resource-based CRUD over HTTP. GET /banana/1 returns full payload.",
      analogy: "📦 Entire Standard Banana Box",
      active: isRest,
      color: C.accentCyan,
      tag: "DEFAULT FOR PUBLIC APIS",
    },
    {
      id: "graphql",
      name: "GraphQL",
      desc: "Client specifies precise schema. Eliminates over/under-fetching.",
      analogy: "🍌 Sliced Tip + Peel Only",
      active: isGraphQL,
      color: C.accentPurple,
      tag: "FLEXIBLE FRONTENDS",
    },
    {
      id: "grpc",
      name: "gRPC",
      desc: "Binary Protobuf over HTTP/2 with multiplexing and strict typing.",
      analogy: "⚡ Compressed High-Speed Tube",
      active: isGrpc,
      color: C.accentEmerald,
      tag: "INTERNAL MICROSERVICES",
    },
    {
      id: "ws",
      name: "WebSockets",
      desc: "Persistent full-duplex TCP channel. Server pushes without request.",
      analogy: "📞 2-Way Banana Walkie-Talkie",
      active: isWebSockets,
      color: C.accentGold,
      tag: "REAL-TIME & LIVE CHAT",
    },
  ];

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 4 Protocol Cards Grid */}
      <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {protocols.map((p) => {
          return (
            <div
              key={p.id}
              style={{
                background: p.active ? `${p.color}15` : C.surface,
                border: `2px solid ${p.active ? p.color : C.surfaceBorder}`,
                borderRadius: 20,
                padding: "24px 26px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                transform: p.active ? "scale(1.02)" : "scale(1)",
                transition: "all 0.25s ease",
                boxShadow: p.active ? `0 8px 32px ${p.color}30` : "none",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: FONT_HEAD, fontSize: 26, fontWeight: 800, color: p.color }}>
                  {p.name}
                </span>
                <span
                  style={{
                    background: `${p.color}25`,
                    color: p.color,
                    padding: "4px 10px",
                    borderRadius: 8,
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: FONT_HEAD,
                    letterSpacing: 0.5,
                  }}
                >
                  {p.tag}
                </span>
              </div>

              {/* Monkey Analogy Tag */}
              <div
                style={{
                  background: "rgba(0,0,0,0.3)",
                  padding: "8px 14px",
                  borderRadius: 12,
                  fontFamily: FONT_HEAD,
                  fontSize: 15,
                  fontWeight: 700,
                  color: C.textPrimary,
                }}
              >
                {p.analogy}
              </div>

              {/* Description */}
              <div style={{ fontFamily: FONT_BODY, fontSize: 16, color: C.textMuted, lineHeight: 1.4 }}>
                {p.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Real-time Indicator Bar */}
      <div
        style={{
          marginTop: 10,
          padding: "16px 24px",
          background: "rgba(255, 255, 255, 0.04)",
          border: `1px solid ${C.surfaceBorder}`,
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ color: C.textMuted, fontFamily: FONT_BODY, fontSize: 16 }}>
          Looking for One-Way Push instead of full 2-Way?
        </span>
        <span style={{ color: C.accentCyan, fontFamily: FONT_HEAD, fontSize: 15, fontWeight: 700 }}>
          Use Server-Sent Events (SSE) on HTTP!
        </span>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
 * ACT 4: LOAD BALANCING & CDNS (SCALING & SPEED OF LIGHT)
 * Voiceover:
 * 0-7s: 10,000 monkeys crash a single banana tree without load balancing.
 * 7-14s: Layer 7 load balancer routes intelligently with Round Robin or Least Connections.
 * 14-21s: Edge CDNs cache bananas in local monkey neighborhoods to beat physics.
 * ────────────────────────────────────────────────────────────────────────────*/
const Act4Scaling: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // Reveal Edge CDN near 14s mark
  const isCdnActive = frame >= 420;

  // Traffic routing indicator: cycles across 3 trees
  const targetTree = Math.floor((frame / 30) % 3);

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 36, alignItems: "center" }}>
      {/* Visual Topology: Client Monkeys -> Load Balancer -> Server Trees */}
      <div
        style={{
          width: "100%",
          background: C.surface,
          border: `1.5px solid ${C.surfaceBorder}`,
          borderRadius: 28,
          padding: 36,
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: FONT_HEAD, fontSize: 22, fontWeight: 700, color: C.accentGold }}>
            TRAFFIC ROUTING TOPOLOGY
          </div>
          <div style={{ fontFamily: FONT_HEAD, fontSize: 15, color: C.accentEmerald, fontWeight: 700 }}>
            ALGORITHM: ROUND ROBIN + HEALTH CHECKS
          </div>
        </div>

        {/* Dispatch Diagram */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
          {/* Client Monkeys */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              background: "rgba(255,255,255,0.04)",
              padding: "24px 24px",
              borderRadius: 22,
              border: `1px solid ${C.surfaceBorder}`,
            }}
          >
            <div style={{ fontSize: 44 }}>🐵 🐒 🍌</div>
            <div style={{ fontFamily: FONT_HEAD, fontSize: 16, fontWeight: 700, color: C.textPrimary }}>
              10,000 Monkeys
            </div>
            <div style={{ fontSize: 13, color: C.textMuted }}>Surge Request Traffic</div>
          </div>

          {/* Arrow */}
          <div style={{ fontSize: 32, color: C.accentGold }}>➔</div>

          {/* Gorilla Load Balancer */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              background: "rgba(245, 158, 11, 0.15)",
              border: `2px solid ${C.accentGold}`,
              padding: "26px 30px",
              borderRadius: 24,
              boxShadow: "0 0 35px rgba(245, 158, 11, 0.25)",
            }}
          >
            <div style={{ fontSize: 48 }}>🦍</div>
            <div style={{ fontFamily: FONT_HEAD, fontSize: 18, fontWeight: 800, color: C.accentGold }}>
              L7 Load Balancer
            </div>
            <div style={{ fontSize: 13, color: C.textPrimary }}>Reverse Proxy / Envoy</div>
          </div>

          {/* Arrow */}
          <div style={{ fontSize: 32, color: C.accentEmerald }}>➔</div>

          {/* Backend Banana Trees */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
            {["Banana Tree A", "Banana Tree B", "Banana Tree C"].map((tree, idx) => {
              const isSelected = targetTree === idx;
              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 20px",
                    borderRadius: 16,
                    background: isSelected ? "rgba(16, 185, 129, 0.2)" : "rgba(255,255,255,0.03)",
                    border: `1.5px solid ${isSelected ? C.accentEmerald : C.surfaceBorder}`,
                    transform: isSelected ? "translateX(6px)" : "translateX(0)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span style={{ fontSize: 17, fontFamily: FONT_HEAD, fontWeight: 700, color: C.textPrimary }}>
                    🌴 {tree}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontFamily: FONT_HEAD,
                      fontWeight: 700,
                      color: isSelected ? C.accentEmerald : C.textMuted,
                    }}
                  >
                    {isSelected ? "ACTIVE SERVING" : "HEALTHY (200 OK)"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Edge CDN Banner (Beating Speed of Light) */}
      <div
        style={{
          width: "100%",
          background: isCdnActive ? "rgba(6, 182, 212, 0.14)" : C.surface,
          border: `2px solid ${isCdnActive ? C.accentCyan : C.surfaceBorder}`,
          borderRadius: 24,
          padding: "28px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: isCdnActive ? "0 10px 40px rgba(6, 182, 212, 0.25)" : "none",
          transition: "all 0.3s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: `${C.accentCyan}25`,
              border: `1.5px solid ${C.accentCyan}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
            }}
          >
            🌍
          </div>
          <div>
            <div style={{ fontFamily: FONT_HEAD, fontSize: 24, fontWeight: 700, color: C.textPrimary }}>
              Content Delivery Network (CDN) & Edge Caches
            </div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 17, color: C.textMuted, marginTop: 6, maxWidth: 620, lineHeight: 1.4 }}>
              Speed of light limit in fiber optic cable is ~200,000 km/s (NY to London = ~56ms). CDNs bring bananas to the local edge!
            </div>
          </div>
        </div>
        <div
          style={{
            padding: "10px 20px",
            borderRadius: 12,
            background: isCdnActive ? C.accentCyan : "rgba(255,255,255,0.06)",
            color: isCdnActive ? "#0B0D14" : "#FFF",
            fontFamily: FONT_HEAD,
            fontSize: 15,
            fontWeight: 800,
          }}
        >
          {isCdnActive ? "< 5ms LOCAL" : "EDGE CACHE"}
        </div>
      </div>
    </div>
  );
};

export default NetworkingEssentialsScene;
