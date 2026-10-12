/**
 * ProxyGatewayScene.tsx
 *
 * Upgraded Masterclass Scene with Interactive Microservices Mesh,
 * Edge Reverse Proxy Wire routing, API Gateway Request Aggregation Fan-Out,
 * and Live Animated Data Flows.
 */

import React from "react";
import { useCurrentFrame, spring, useVideoConfig } from "remotion";
import { FONT_HEAD, FONT_BODY } from "../../utils/fonts";
import { ThinkingOrb } from "../fresh/ThinkingOrb";

export interface ProxyGatewaySceneProps {
  act: "hook" | "reverse" | "gateway" | "aggregation" | "takeaway";
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

// Flow Wire with Travelling Packet
const EdgeWire: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  frame: number;
  speed?: number;
  label?: string;
}> = ({ x1, y1, x2, y2, color, frame, speed = 0.03, label }) => {
  const t = (frame * speed) % 1;
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
        strokeWidth={3}
        strokeOpacity={0.65}
        strokeDasharray="6 6"
        strokeLinecap="round"
      />
      <circle
        cx={dotX}
        cy={dotY}
        r={8}
        fill={color}
        style={{ filter: `drop-shadow(0 0 12px ${color})` }}
      />
      {label && (
        <text
          x={dotX}
          y={dotY - 14}
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize={12}
          fontWeight={800}
          fontFamily={FONT_HEAD}
        >
          {label}
        </text>
      )}
    </svg>
  );
};

export const ProxyGatewayScene: React.FC<ProxyGatewaySceneProps> = ({ act }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ─────────────────────────────────────────────────────────────
  // ACT 1: HOOK (CLASSIC INTERVIEW TRAP)
  // ─────────────────────────────────────────────────────────────
  if (act === "hook") {
    const hookEntrance = spring({
      fps,
      frame,
      config: { damping: 12, stiffness: 140 },
      from: 0,
      to: 1,
    });

    const clientX = 180;
    const gatewayX = 540;
    const serviceX = 900;
    const wireY = 700;

    return (
      <BlueprintCanvas frame={frame}>
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
            CHAPTER 04 · EDGE ARCHITECTURE
          </div>
        </div>

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
              fontSize: 58,
              fontWeight: 900,
              lineHeight: 1.15,
              color: PALETTE.textPrimary,
              margin: 0,
              letterSpacing: -1.5,
            }}
          >
            "Just put NGINX in front." <br />
            <span style={{ color: PALETTE.red, textShadow: "0 0 35px rgba(244, 63, 94, 0.5)" }}>
              The #1 System Design Trap
            </span>{" "}
            that <br />
            <span style={{ color: PALETTE.yellow }}>fails senior candidates</span>.
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
            What is the real difference between a{" "}
            <span style={{ color: PALETTE.cyan, fontWeight: 800 }}>Reverse Proxy</span> and an{" "}
            <span style={{ color: PALETTE.green, fontWeight: 800 }}>API Gateway</span>?
          </div>
        </div>

        {/* Live Interactive Flow Line: Client -> Gateway -> Microservices */}
        <EdgeWire
          x1={clientX + 60}
          y1={wireY}
          x2={gatewayX - 60}
          y2={wireY}
          color={PALETTE.blue}
          frame={frame}
          speed={0.035}
          label="Single Client Request"
        />
        <EdgeWire
          x1={gatewayX + 60}
          y1={wireY}
          x2={serviceX - 60}
          y2={wireY}
          color={PALETTE.green}
          frame={frame}
          speed={0.035}
          label="Internal RPCs"
        />

        {/* 3 Interactive Architectural Stages */}
        <div
          style={{
            position: "absolute",
            left: clientX - 80,
            top: wireY - 60,
            width: 160,
            background: "rgba(15, 23, 42, 0.95)",
            border: `2px solid ${PALETTE.blue}`,
            borderRadius: 20,
            padding: "16px 12px",
            textAlign: "center",
            boxShadow: `0 0 25px ${PALETTE.blue}30`,
            zIndex: 20,
          }}
        >
          <div style={{ fontSize: 34 }}>📱</div>
          <div style={{ color: PALETTE.textPrimary, fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 15, marginTop: 4 }}>
            Client
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: gatewayX - 80,
            top: wireY - 60,
            width: 160,
            background: "rgba(15, 23, 42, 0.95)",
            border: `2px solid ${PALETTE.yellow}`,
            borderRadius: 20,
            padding: "16px 12px",
            textAlign: "center",
            boxShadow: `0 0 25px ${PALETTE.yellow}30`,
            zIndex: 20,
          }}
        >
          <div style={{ fontSize: 34 }}>🛡️</div>
          <div style={{ color: PALETTE.textPrimary, fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 15, marginTop: 4 }}>
            Edge Gateway
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: serviceX - 80,
            top: wireY - 60,
            width: 160,
            background: "rgba(15, 23, 42, 0.95)",
            border: `2px solid ${PALETTE.green}`,
            borderRadius: 20,
            padding: "16px 12px",
            textAlign: "center",
            boxShadow: `0 0 25px ${PALETTE.green}30`,
            zIndex: 20,
          }}
        >
          <div style={{ fontSize: 34 }}>🏢</div>
          <div style={{ color: PALETTE.textPrimary, fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 15, marginTop: 4 }}>
            Microservices
          </div>
        </div>

        {/* Archetype Comparison Card */}
        <div
          style={{
            position: "absolute",
            top: 880,
            left: 60,
            right: 60,
            display: "flex",
            gap: 16,
          }}
        >
          <div
            style={{
              flex: 1,
              background: "rgba(15, 23, 42, 0.9)",
              border: "1.5px solid rgba(0, 229, 255, 0.4)",
              borderRadius: 20,
              padding: "20px 22px",
            }}
          >
            <div style={{ color: PALETTE.cyan, fontFamily: FONT_HEAD, fontSize: 18, fontWeight: 900 }}>
              REVERSE PROXY
            </div>
            <div style={{ color: PALETTE.textPrimary, fontSize: 15, marginTop: 6, lineHeight: 1.4 }}>
              The Infrastructure Shield. SSL termination, raw TCP routing, and DDoS packet filtering.
            </div>
          </div>

          <div
            style={{
              flex: 1,
              background: "rgba(15, 23, 42, 0.9)",
              border: "1.5px solid rgba(16, 185, 129, 0.4)",
              borderRadius: 20,
              padding: "20px 22px",
            }}
          >
            <div style={{ color: PALETTE.green, fontFamily: FONT_HEAD, fontSize: 18, fontWeight: 900 }}>
              API GATEWAY
            </div>
            <div style={{ color: PALETTE.textPrimary, fontSize: 15, marginTop: 6, lineHeight: 1.4 }}>
              The Application Brain. JWT auth, payload translation, and request fan-out aggregation.
            </div>
          </div>
        </div>

        <ThinkingOrb
          x={540}
          y={1450}
          size={160}
          color={PALETTE.cyan}
          label="Edge Layer"
          sublabel="Proxy vs Gateway"
          frame={frame}
          fps={fps}
        />
      </BlueprintCanvas>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // ACT 2: REVERSE PROXY — THE INFRASTRUCTURE GATEKEEPER
  // ─────────────────────────────────────────────────────────────
  if (act === "reverse") {
    const clientX = 180;
    const proxyX = 900;
    const wireY = 520;

    return (
      <BlueprintCanvas frame={frame}>
        <div style={{ position: "absolute", top: 140, left: 60, right: 60 }}>
          <div style={{ color: PALETTE.cyan, fontFamily: FONT_HEAD, fontSize: 16, fontWeight: 800, letterSpacing: 2 }}>
            TIER 1 · NETWORK INFRASTRUCTURE
          </div>
          <h2 style={{ color: PALETTE.textPrimary, fontFamily: FONT_HEAD, fontSize: 46, fontWeight: 800, margin: "6px 0 0 0" }}>
            Reverse Proxy: The Shield
          </h2>
        </div>

        {/* Live TLS Termination Packet Wire */}
        <EdgeWire
          x1={clientX + 60}
          y1={wireY}
          x2={proxyX - 60}
          y2={wireY}
          color={PALETTE.cyan}
          frame={frame}
          speed={0.035}
          label="HTTPS Encrypted ➔"
        />

        {/* Public Client & NGINX Nodes */}
        <div
          style={{
            position: "absolute",
            left: clientX - 80,
            top: wireY - 60,
            width: 160,
            background: "rgba(15, 23, 42, 0.95)",
            border: `2px solid ${PALETTE.blue}`,
            borderRadius: 20,
            padding: "16px 12px",
            textAlign: "center",
            boxShadow: `0 0 25px ${PALETTE.blue}30`,
            zIndex: 20,
          }}
        >
          <div style={{ fontSize: 36 }}>📱</div>
          <div style={{ color: PALETTE.textPrimary, fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 16, marginTop: 4 }}>
            Public Internet
          </div>
          <div style={{ color: PALETTE.cyan, fontSize: 12, fontWeight: 700 }}>HTTPS Port 443</div>
        </div>

        <div
          style={{
            position: "absolute",
            left: proxyX - 80,
            top: wireY - 60,
            width: 160,
            background: "rgba(15, 23, 42, 0.95)",
            border: `2px solid ${PALETTE.cyan}`,
            borderRadius: 20,
            padding: "16px 12px",
            textAlign: "center",
            boxShadow: `0 0 25px ${PALETTE.cyan}30`,
            zIndex: 20,
          }}
        >
          <div style={{ fontSize: 36 }}>🛡️</div>
          <div style={{ color: PALETTE.textPrimary, fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 16, marginTop: 4 }}>
            NGINX / Envoy
          </div>
          <div style={{ color: PALETTE.green, fontSize: 12, fontWeight: 700 }}>SSL Terminated</div>
        </div>

        {/* Responsibilities Card */}
        <div
          style={{
            position: "absolute",
            top: 700,
            left: 60,
            right: 60,
            background: "rgba(15, 23, 42, 0.9)",
            border: "2px solid rgba(0, 229, 255, 0.4)",
            borderRadius: 24,
            padding: "28px 26px",
          }}
        >
          <div style={{ color: PALETTE.cyan, fontFamily: FONT_HEAD, fontSize: 20, fontWeight: 900, marginBottom: 14 }}>
            🔒 CORE REVERSE PROXY RESPONSIBILITIES
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", background: "rgba(0, 229, 255, 0.08)", borderRadius: 12 }}>
              <span style={{ fontSize: 22 }}>🔑</span>
              <div style={{ color: PALETTE.textPrimary, fontSize: 16, fontWeight: 600 }}>
                <strong>TLS / SSL Termination:</strong> Strips cryptography overhead before internal network.
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", background: "rgba(0, 229, 255, 0.08)", borderRadius: 12 }}>
              <span style={{ fontSize: 22 }}>🛡️</span>
              <div style={{ color: PALETTE.textPrimary, fontSize: 16, fontWeight: 600 }}>
                <strong>IP Masquerading:</strong> Hides private backend server IPs from the public internet.
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", background: "rgba(0, 229, 255, 0.08)", borderRadius: 12 }}>
              <span style={{ fontSize: 22 }}>⚡</span>
              <div style={{ color: PALETTE.textPrimary, fontSize: 16, fontWeight: 600 }}>
                <strong>High-Speed Caching:</strong> Serves static files and compressed GZIP/Brotli payloads.
              </div>
            </div>
          </div>
        </div>

        <ThinkingOrb
          x={540}
          y={1360}
          size={160}
          color={PALETTE.cyan}
          label="Reverse Proxy"
          sublabel="L4/L7 Infra Shield"
          frame={frame}
          fps={fps}
        />
      </BlueprintCanvas>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // ACT 3: API GATEWAY — THE APPLICATION BRAIN (AUTH & RATE LIMIT)
  // ─────────────────────────────────────────────────────────────
  if (act === "gateway") {
    const gatewayX = 540;
    const wireY = 520;

    return (
      <BlueprintCanvas frame={frame}>
        <div style={{ position: "absolute", top: 140, left: 60, right: 60 }}>
          <div style={{ color: PALETTE.green, fontFamily: FONT_HEAD, fontSize: 16, fontWeight: 800, letterSpacing: 2 }}>
            TIER 2 · APPLICATION INTELLIGENCE
          </div>
          <h2 style={{ color: PALETTE.textPrimary, fontFamily: FONT_HEAD, fontSize: 46, fontWeight: 800, margin: "6px 0 0 0" }}>
            API Gateway: The Brain
          </h2>
        </div>

        {/* Central Gateway Processing Animation */}
        <div
          style={{
            position: "absolute",
            top: 280,
            left: 60,
            right: 60,
            background: "rgba(15, 23, 42, 0.95)",
            border: `2px solid ${PALETTE.green}`,
            borderRadius: 24,
            padding: "26px 26px",
            boxShadow: `0 0 45px ${PALETTE.green}20`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ color: PALETTE.green, fontFamily: FONT_HEAD, fontSize: 22, fontWeight: 900 }}>
              🧠 APPLICATION-LEVEL INTELLIGENCE
            </div>
            <span style={{ fontSize: 28 }}>⚡</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ padding: "14px 18px", background: "rgba(16, 185, 129, 0.12)", borderRadius: 14, border: "1px solid rgba(16, 185, 129, 0.3)" }}>
              <div style={{ color: PALETTE.green, fontWeight: 800, fontSize: 17 }}>1. Authentication & JWT Validation</div>
              <div style={{ color: PALETTE.textPrimary, fontSize: 15, marginTop: 4 }}>
                Verifies cryptographic token signatures before requests ever reach your microservices!
              </div>
            </div>

            <div style={{ padding: "14px 18px", background: "rgba(16, 185, 129, 0.12)", borderRadius: 14, border: "1px solid rgba(16, 185, 129, 0.3)" }}>
              <div style={{ color: PALETTE.green, fontWeight: 800, fontSize: 17 }}>2. Granular Rate Limiting per User</div>
              <div style={{ color: PALETTE.textPrimary, fontSize: 15, marginTop: 4 }}>
                Enforces tier quotas (e.g. Free: 10 req/min, Pro: 1,000 req/min) via Redis Token Buckets.
              </div>
            </div>

            <div style={{ padding: "14px 18px", background: "rgba(16, 185, 129, 0.12)", borderRadius: 14, border: "1px solid rgba(16, 185, 129, 0.3)" }}>
              <div style={{ color: PALETTE.green, fontWeight: 800, fontSize: 17 }}>3. Protocol Translation</div>
              <div style={{ color: PALETTE.textPrimary, fontSize: 15, marginTop: 4 }}>
                Translates incoming public REST / JSON requests into blazing-fast internal gRPC binary streams.
              </div>
            </div>
          </div>
        </div>

        <ThinkingOrb
          x={540}
          y={1360}
          size={160}
          color={PALETTE.green}
          label="API Gateway"
          sublabel="Auth & Business Logic"
          frame={frame}
          fps={fps}
        />
      </BlueprintCanvas>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // ACT 4: REQUEST AGGREGATION & FAN-OUT (THE SUPERPOWER)
  // ─────────────────────────────────────────────────────────────
  if (act === "aggregation") {
    const gatewayX = 220;
    const gatewayY = 620;
    const services = [
      { name: "Users Service", y: 460, color: PALETTE.cyan },
      { name: "Orders Service", y: 620, color: PALETTE.yellow },
      { name: "Payments Service", y: 780, color: PALETTE.green },
    ];

    return (
      <BlueprintCanvas frame={frame}>
        <div style={{ position: "absolute", top: 140, left: 60, right: 60 }}>
          <div style={{ color: PALETTE.purple, fontFamily: FONT_HEAD, fontSize: 16, fontWeight: 800, letterSpacing: 2 }}>
            THE KILLER SUPERPOWER
          </div>
          <h2 style={{ color: PALETTE.textPrimary, fontFamily: FONT_HEAD, fontSize: 46, fontWeight: 800, margin: "6px 0 0 0" }}>
            Request Aggregation & Fan-Out
          </h2>
        </div>

        {/* 3 Radiating Fan-Out Wire Paths */}
        {services.map((svc) => (
          <EdgeWire
            key={svc.name}
            x1={gatewayX + 70}
            y1={gatewayY}
            x2={800}
            y2={svc.y}
            color={svc.color}
            frame={frame}
            speed={0.04}
          />
        ))}

        {/* Central Gateway Node */}
        <div
          style={{
            position: "absolute",
            left: gatewayX - 90,
            top: gatewayY - 70,
            width: 180,
            background: "rgba(15, 23, 42, 0.95)",
            border: `2.5px solid ${PALETTE.green}`,
            borderRadius: 24,
            padding: "20px 16px",
            textAlign: "center",
            boxShadow: `0 0 35px ${PALETTE.green}40`,
            zIndex: 20,
          }}
        >
          <div style={{ fontSize: 36 }}>⚡</div>
          <div style={{ color: PALETTE.textPrimary, fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 16, marginTop: 4 }}>
            API Gateway
          </div>
          <div style={{ color: PALETTE.green, fontSize: 12, fontWeight: 800, marginTop: 2 }}>
            GET /dashboard
          </div>
        </div>

        {/* 3 Backend Services */}
        {services.map((svc) => (
          <div
            key={svc.name}
            style={{
              position: "absolute",
              left: 800,
              top: svc.y - 36,
              width: 220,
              background: "rgba(15, 23, 42, 0.95)",
              border: `1.5px solid ${svc.color}`,
              borderRadius: 16,
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              zIndex: 20,
            }}
          >
            <span style={{ color: PALETTE.textPrimary, fontWeight: 800, fontSize: 15 }}>
              {svc.name}
            </span>
            <span style={{ color: svc.color, fontWeight: 900, fontSize: 14 }}>gRPC ✓</span>
          </div>
        ))}

        {/* Comparison Callout Banner */}
        <div
          style={{
            position: "absolute",
            top: 920,
            left: 60,
            right: 60,
            background: "rgba(192, 132, 252, 0.12)",
            border: "1.5px solid rgba(192, 132, 252, 0.4)",
            borderRadius: 20,
            padding: "20px 24px",
            textAlign: "center",
          }}
        >
          <div style={{ color: PALETTE.purple, fontFamily: FONT_HEAD, fontSize: 20, fontWeight: 900 }}>
            📉 3 Mobile Calls Reduced to 1 Single Round-Trip!
          </div>
          <div style={{ color: PALETTE.textPrimary, fontFamily: FONT_BODY, fontSize: 16, marginTop: 6 }}>
            The Gateway queries all 3 microservices concurrently in parallel over high-speed datacenter fiber and merges them into a single response.
          </div>
        </div>

        <ThinkingOrb
          x={540}
          y={1360}
          size={160}
          color={PALETTE.purple}
          label="Request Fan-Out"
          sublabel="1 Call Merges 3"
          frame={frame}
          fps={fps}
        />
      </BlueprintCanvas>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // ACT 5: PRODUCTION TWO-TIER PATTERN & SUMMARY
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
          🎓 PRODUCTION BEST PRACTICE
        </div>
        <h2
          style={{
            color: PALETTE.textPrimary,
            fontFamily: FONT_HEAD,
            fontSize: 48,
            fontWeight: 900,
            margin: 0,
            letterSpacing: -1,
          }}
        >
          The Two-Tier Architecture
        </h2>
      </div>

      <div
        style={{
          position: "absolute",
          top: 360,
          left: 60,
          right: 60,
          background: "rgba(15, 23, 42, 0.95)",
          border: "2px solid rgba(0, 229, 255, 0.4)",
          borderRadius: 24,
          padding: "28px 26px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
        }}
      >
        <div style={{ color: PALETTE.cyan, fontFamily: FONT_HEAD, fontSize: 20, fontWeight: 900, marginBottom: 14 }}>
          👑 HOW BIG TECH PAIRS THEM TOGETHER
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ padding: "16px 20px", background: "rgba(0, 229, 255, 0.1)", borderRadius: 14, border: "1px solid rgba(0, 229, 255, 0.3)" }}>
            <span style={{ color: PALETTE.cyan, fontWeight: 900, fontSize: 17 }}>Tier 1: Edge Reverse Proxy (NGINX / Cloudflare)</span>
            <div style={{ color: PALETTE.textPrimary, fontSize: 15, marginTop: 4 }}>
              Handles TLS termination, static asset CDN caching, and raw DDoS packet defense.
            </div>
          </div>

          <div style={{ textAlign: "center", color: PALETTE.yellow, fontWeight: 900, fontSize: 20 }}>
            ⬇ Passes Clean HTTP Traffic
          </div>

          <div style={{ padding: "16px 20px", background: "rgba(16, 185, 129, 0.1)", borderRadius: 14, border: "1px solid rgba(16, 185, 129, 0.3)" }}>
            <span style={{ color: PALETTE.green, fontWeight: 900, fontSize: 17 }}>Tier 2: API Gateway (Kong / Spring Cloud / Envoy)</span>
            <div style={{ color: PALETTE.textPrimary, fontSize: 15, marginTop: 4 }}>
              Handles JWT authentication, rate limiting, and request fan-out to 50 microservices.
            </div>
          </div>
        </div>
      </div>

      <ThinkingOrb
        x={540}
        y={1360}
        size={170}
        color={PALETTE.cyan}
        label="Follow for More"
        sublabel="@beyond.localhost"
        frame={frame}
        fps={fps}
      />
    </BlueprintCanvas>
  );
};
