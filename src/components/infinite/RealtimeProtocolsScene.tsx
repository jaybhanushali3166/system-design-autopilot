/**
 * RealtimeProtocolsScene.tsx
 *
 * Upgraded Masterclass Scene with Interactive Live Vehicle Tracking,
 * Full-Duplex Bi-Directional Packet Flights, Polling Burst Overheads,
 * and Server Push Streams.
 */

import React from "react";
import { useCurrentFrame, spring, useVideoConfig } from "remotion";
import { FONT_HEAD, FONT_BODY } from "../../utils/fonts";
import { ThinkingOrb } from "../fresh/ThinkingOrb";

export interface RealtimeProtocolsSceneProps {
  act: "hook" | "polling" | "sse" | "websockets" | "takeaway";
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

// Animated Transmission Packet Capsule
const InteractivePacketWire: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  frame: number;
  speed?: number;
  label?: string;
  reverse?: boolean;
}> = ({ x1, y1, x2, y2, color, frame, speed = 0.03, label, reverse = false }) => {
  const t = (frame * speed) % 1;
  const currT = reverse ? 1 - t : t;
  const dotX = x1 + (x2 - x1) * currT;
  const dotY = y1 + (y2 - y1) * currT;

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
        strokeOpacity={0.6}
        strokeDasharray="6 6"
        strokeLinecap="round"
      />
      <circle
        cx={dotX}
        cy={dotY}
        r={9}
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

export const RealtimeProtocolsScene: React.FC<RealtimeProtocolsSceneProps> = ({ act }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ─────────────────────────────────────────────────────────────
  // ACT 1: HOOK (UBER LIVE CAR TRACKING)
  // ─────────────────────────────────────────────────────────────
  if (act === "hook") {
    const hookEntrance = spring({
      fps,
      frame,
      config: { damping: 12, stiffness: 140 },
      from: 0,
      to: 1,
    });

    const carX = 220 + ((frame * 2.5) % 640);

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
            CHAPTER 03 · REAL-TIME ARCHITECTURE
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
            How does Uber move <br />
            <span style={{ color: PALETTE.cyan, textShadow: "0 0 35px rgba(0, 229, 255, 0.5)" }}>
              your driver's car
            </span>{" "}
            across <br />
            <span style={{ color: PALETTE.yellow }}>the map in real-time</span>?
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
            Short Polling, Server-Sent Events, or WebSockets?
          </div>
        </div>

        {/* Live Uber Map Simulation Card */}
        <div
          style={{
            position: "absolute",
            top: 720,
            left: 60,
            right: 60,
            background: "rgba(15, 23, 42, 0.95)",
            border: "1.5px solid rgba(0, 229, 255, 0.4)",
            borderRadius: 24,
            padding: "26px 28px",
            boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ color: PALETTE.cyan, fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 16 }}>
              LIVE GPS TELEMETRY STREAM
            </span>
            <span style={{ color: PALETTE.green, fontSize: 13, fontWeight: 800 }}>● 60 FPS SYNC</span>
          </div>

          {/* Map Road with Moving Car */}
          <div
            style={{
              height: 100,
              background: "rgba(0,0,0,0.6)",
              border: "1.5px dashed rgba(56, 189, 248, 0.3)",
              borderRadius: 16,
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* Passenger Pin */}
            <div style={{ position: "absolute", left: 80, top: 28, fontSize: 32 }}>📍</div>
            <div style={{ position: "absolute", left: 125, top: 38, color: PALETTE.textMuted, fontSize: 13, fontWeight: 700 }}>Pickup Location</div>

            {/* Moving Car */}
            <div
              style={{
                position: "absolute",
                left: carX,
                top: 24,
                fontSize: 36,
                filter: "drop-shadow(0 0 15px rgba(0,229,255,0.7))",
              }}
            >
              🚗
            </div>

            {/* GPS Pulse Coordinates */}
            <div style={{ position: "absolute", right: 24, top: 40, color: PALETTE.cyan, fontFamily: FONT_HEAD, fontSize: 14, fontWeight: 800 }}>
              lat: 37.7749, lng: -122.4194
            </div>
          </div>

          <div style={{ color: PALETTE.textPrimary, fontFamily: FONT_BODY, fontSize: 17, marginTop: 18 }}>
            Send HTTP requests every 500ms? Your servers will explode under 10 million active rides.
          </div>
        </div>

        <ThinkingOrb
          x={540}
          y={1360}
          size={160}
          color={PALETTE.cyan}
          label="Real-Time"
          sublabel="Scale Dilemma"
          frame={frame}
          fps={fps}
        />
      </BlueprintCanvas>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // ACT 2: SHORT POLLING (800 BYTES HEADER WASTE & 304 NOT MODIFIED)
  // ─────────────────────────────────────────────────────────────
  if (act === "polling") {
    const clientX = 180;
    const serverX = 900;
    const wireY = 540;

    return (
      <BlueprintCanvas frame={frame}>
        <div style={{ position: "absolute", top: 140, left: 60, right: 60 }}>
          <div style={{ color: PALETTE.red, fontFamily: FONT_HEAD, fontSize: 16, fontWeight: 800, letterSpacing: 2 }}>
            OPTION 01 · THE BRUTE-FORCE WAY
          </div>
          <h2 style={{ color: PALETTE.textPrimary, fontFamily: FONT_HEAD, fontSize: 46, fontWeight: 800, margin: "6px 0 0 0" }}>
            Short Polling: "Are we there yet?"
          </h2>
        </div>

        {/* Live Rapid Fire Polling Wire */}
        <InteractivePacketWire
          x1={clientX + 60}
          y1={wireY}
          x2={serverX - 60}
          y2={wireY}
          color={PALETTE.red}
          frame={frame}
          speed={0.06}
          label="GET /driver/coords"
        />

        {/* Client & Server Nodes */}
        <div
          style={{
            position: "absolute",
            left: clientX - 80,
            top: wireY - 60,
            width: 160,
            background: "rgba(15, 23, 42, 0.95)",
            border: `2px solid ${PALETTE.red}`,
            borderRadius: 20,
            padding: "16px 12px",
            textAlign: "center",
            boxShadow: `0 0 25px ${PALETTE.red}30`,
            zIndex: 20,
          }}
        >
          <div style={{ fontSize: 36 }}>📱</div>
          <div style={{ color: PALETTE.textPrimary, fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 16, marginTop: 4 }}>
            Mobile App
          </div>
          <div style={{ color: PALETTE.red, fontSize: 12, fontWeight: 800 }}>Spamming HTTP</div>
        </div>

        <div
          style={{
            position: "absolute",
            left: serverX - 80,
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
          <div style={{ fontSize: 36 }}>🖥️</div>
          <div style={{ color: PALETTE.textPrimary, fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 16, marginTop: 4 }}>
            API Server
          </div>
          <div style={{ color: PALETTE.yellow, fontSize: 12, fontWeight: 800 }}>HTTP 304 Empty</div>
        </div>

        {/* Overhead Breakdown Card */}
        <div
          style={{
            position: "absolute",
            top: 720,
            left: 60,
            right: 60,
            background: "rgba(15, 23, 42, 0.9)",
            border: "2px solid rgba(244, 63, 94, 0.4)",
            borderRadius: 24,
            padding: "26px 26px",
          }}
        >
          <div style={{ color: PALETTE.red, fontFamily: FONT_HEAD, fontSize: 20, fontWeight: 900, marginBottom: 14 }}>
            🛑 THE HTTP OVERHEAD PENALTY
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 18px", background: "rgba(244, 63, 94, 0.12)", borderRadius: 12 }}>
              <span style={{ color: PALETTE.textPrimary, fontWeight: 700 }}>Request Headers:</span>
              <span style={{ color: PALETTE.red, fontWeight: 900 }}>~800 Bytes per ping</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 18px", background: "rgba(244, 63, 94, 0.12)", borderRadius: 12 }}>
              <span style={{ color: PALETTE.textPrimary, fontWeight: 700 }}>Payload Data:</span>
              <span style={{ color: PALETTE.yellow, fontWeight: 900 }}>20 Bytes (lat, lng)</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 18px", background: "rgba(244, 63, 94, 0.12)", borderRadius: 12 }}>
              <span style={{ color: PALETTE.textPrimary, fontWeight: 700 }}>Empty Responses:</span>
              <span style={{ color: PALETTE.red, fontWeight: 900 }}>95% of calls return no change!</span>
            </div>
          </div>

          <div style={{ color: PALETTE.textMuted, fontFamily: FONT_BODY, fontSize: 16, marginTop: 16 }}>
            1M users polling every second = <strong>800 Megabytes per second</strong> wasted solely on HTTP headers.
          </div>
        </div>

        <ThinkingOrb
          x={540}
          y={1360}
          size={160}
          color={PALETTE.red}
          label="Short Polling"
          sublabel="Header Waste"
          frame={frame}
          fps={fps}
        />
      </BlueprintCanvas>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // ACT 3: SERVER-SENT EVENTS (SSE) — UNIDIRECTIONAL SERVER PUSH
  // ─────────────────────────────────────────────────────────────
  if (act === "sse") {
    const clientX = 180;
    const serverX = 900;
    const wireY = 540;

    return (
      <BlueprintCanvas frame={frame}>
        <div style={{ position: "absolute", top: 140, left: 60, right: 60 }}>
          <div style={{ color: PALETTE.blue, fontFamily: FONT_HEAD, fontSize: 16, fontWeight: 800, letterSpacing: 2 }}>
            OPTION 02 · 1-WAY PERSISTENT STREAM
          </div>
          <h2 style={{ color: PALETTE.textPrimary, fontFamily: FONT_HEAD, fontSize: 46, fontWeight: 800, margin: "6px 0 0 0" }}>
            Server-Sent Events (SSE)
          </h2>
        </div>

        {/* Persistent 1-Way Push Wire (Reverse Flow: Server to Client) */}
        <InteractivePacketWire
          x1={clientX + 60}
          y1={wireY}
          x2={serverX - 60}
          y2={wireY}
          color={PALETTE.blue}
          frame={frame}
          speed={0.035}
          label="data: {lat, lng} ➔"
          reverse={true}
        />

        {/* Client & Server Nodes */}
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
            Browser / App
          </div>
          <div style={{ color: PALETTE.blue, fontSize: 12, fontWeight: 800 }}>EventSource API</div>
        </div>

        <div
          style={{
            position: "absolute",
            left: serverX - 80,
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
          <div style={{ fontSize: 36 }}>🖥️</div>
          <div style={{ color: PALETTE.textPrimary, fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 16, marginTop: 4 }}>
            Stock / Feed
          </div>
          <div style={{ color: PALETTE.cyan, fontSize: 12, fontWeight: 800 }}>text/event-stream</div>
        </div>

        {/* Benefits Card */}
        <div
          style={{
            position: "absolute",
            top: 720,
            left: 60,
            right: 60,
            background: "rgba(15, 23, 42, 0.9)",
            border: `2px solid ${PALETTE.blue}`,
            borderRadius: 24,
            padding: "26px 26px",
          }}
        >
          <div style={{ color: PALETTE.blue, fontFamily: FONT_HEAD, fontSize: 20, fontWeight: 900, marginBottom: 12 }}>
            ⚡ 1 HTTP CONNECTION • ENDLESS SERVER STREAM
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ color: PALETTE.textPrimary, fontSize: 17, lineHeight: 1.4 }}>
              ✓ Standard HTTP/2 protocol • Zero custom firewall configuration
            </div>
            <div style={{ color: PALETTE.textPrimary, fontSize: 17, lineHeight: 1.4 }}>
              ✓ Built-in browser reconnection & message ID tracking
            </div>
            <div style={{ color: PALETTE.yellow, fontSize: 17, fontWeight: 700, marginTop: 6 }}>
              ⚠️ The Catch: Strict 1-Way Push only. The client cannot send upstream data back!
            </div>
          </div>
        </div>

        <ThinkingOrb
          x={540}
          y={1360}
          size={160}
          color={PALETTE.blue}
          label="Server-Sent Events"
          sublabel="1-Way Push"
          frame={frame}
          fps={fps}
        />
      </BlueprintCanvas>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // ACT 4: WEBSOCKETS — FULL DUPLEX 2-BYTE FRAMING
  // ─────────────────────────────────────────────────────────────
  if (act === "websockets") {
    const clientX = 180;
    const serverX = 900;
    const wireY = 540;

    return (
      <BlueprintCanvas frame={frame}>
        <div style={{ position: "absolute", top: 140, left: 60, right: 60 }}>
          <div style={{ color: PALETTE.green, fontFamily: FONT_HEAD, fontSize: 16, fontWeight: 800, letterSpacing: 2 }}>
            OPTION 03 · THE REAL-TIME GOLD STANDARD
          </div>
          <h2 style={{ color: PALETTE.textPrimary, fontFamily: FONT_HEAD, fontSize: 46, fontWeight: 800, margin: "6px 0 0 0" }}>
            WebSockets: Full Duplex
          </h2>
        </div>

        {/* Dual Bi-Directional Interactive Wires */}
        {/* Forward Wire: Client to Server */}
        <InteractivePacketWire
          x1={clientX + 60}
          y1={wireY - 24}
          x2={serverX - 60}
          y2={wireY - 24}
          color={PALETTE.green}
          frame={frame}
          speed={0.045}
          label="Upstream (Chat / Action) ➔"
        />

        {/* Return Wire: Server to Client */}
        <InteractivePacketWire
          x1={clientX + 60}
          y1={wireY + 24}
          x2={serverX - 60}
          y2={wireY + 24}
          color={PALETTE.cyan}
          frame={frame}
          speed={0.045}
          label="⬅ Downstream (Broadcasts)"
          reverse={true}
        />

        {/* Client & Server Nodes */}
        <div
          style={{
            position: "absolute",
            left: clientX - 80,
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
          <div style={{ fontSize: 36 }}>📱</div>
          <div style={{ color: PALETTE.textPrimary, fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 16, marginTop: 4 }}>
            Client
          </div>
          <div style={{ color: PALETTE.green, fontSize: 12, fontWeight: 800 }}>ws:// Socket</div>
        </div>

        <div
          style={{
            position: "absolute",
            left: serverX - 80,
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
          <div style={{ fontSize: 36 }}>🖥️</div>
          <div style={{ color: PALETTE.textPrimary, fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 16, marginTop: 4 }}>
            Socket Gateway
          </div>
          <div style={{ color: PALETTE.green, fontSize: 12, fontWeight: 800 }}>Stateful TCP</div>
        </div>

        {/* Killer Spec Comparison Card */}
        <div
          style={{
            position: "absolute",
            top: 720,
            left: 60,
            right: 60,
            background: "rgba(15, 23, 42, 0.95)",
            border: `2px solid ${PALETTE.green}`,
            borderRadius: 24,
            padding: "26px 26px",
            boxShadow: `0 0 45px ${PALETTE.green}20`,
          }}
        >
          <div style={{ color: PALETTE.green, fontFamily: FONT_HEAD, fontSize: 22, fontWeight: 900, marginBottom: 14 }}>
            🚀 2-BYTE FRAMING OVERHEAD
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 18px", background: "rgba(16, 185, 129, 0.12)", borderRadius: 12 }}>
              <span style={{ color: PALETTE.textPrimary, fontWeight: 700 }}>Overhead per message:</span>
              <span style={{ color: PALETTE.green, fontWeight: 900 }}>Just 2 to 6 Bytes!</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 18px", background: "rgba(16, 185, 129, 0.12)", borderRadius: 12 }}>
              <span style={{ color: PALETTE.textPrimary, fontWeight: 700 }}>Latency:</span>
              <span style={{ color: PALETTE.cyan, fontWeight: 900 }}>Sub-millisecond push</span>
            </div>
            <div style={{ color: PALETTE.textPrimary, fontSize: 16, marginTop: 6, lineHeight: 1.4 }}>
              Ideal for multiplayer gaming, live chats, collaborative whiteboards, and high-frequency trading.
            </div>
          </div>
        </div>

        <ThinkingOrb
          x={540}
          y={1360}
          size={160}
          color={PALETTE.green}
          label="WebSockets"
          sublabel="2-Byte Framing"
          frame={frame}
          fps={fps}
        />
      </BlueprintCanvas>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // ACT 5: SENIOR DECISION MATRIX & ARCHITECTURAL CHEAT SHEET
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
          🎓 SENIOR SDE DECISION MATRIX
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
          Which One Do You Pick?
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
          { name: "Short Polling", when: "Simple low-traffic status checks (e.g. background batch jobs)", color: PALETTE.red, icon: "🐢" },
          { name: "Server-Sent Events (SSE)", when: "ChatGPT AI streaming, stock tickers, Twitter feeds (1-way)", color: PALETTE.blue, icon: "⚡" },
          { name: "WebSockets", when: "Uber driver tracking, multiplayer games, Discord chat (2-way)", color: PALETTE.green, icon: "🚀" },
        ].map((item) => (
          <div
            key={item.name}
            style={{
              background: "rgba(15, 23, 42, 0.9)",
              border: `1.5px solid ${item.color}60`,
              borderRadius: 20,
              padding: "24px 28px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ color: item.color, fontFamily: FONT_HEAD, fontSize: 24, fontWeight: 900 }}>
                {item.name}
              </div>
              <span style={{ fontSize: 30 }}>{item.icon}</span>
            </div>
            <div style={{ color: PALETTE.textPrimary, fontFamily: FONT_BODY, fontSize: 18, marginTop: 8, lineHeight: 1.4 }}>
              {item.when}
            </div>
          </div>
        ))}
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
