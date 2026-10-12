import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { ProtocolFlowConfig, ProtocolPacket } from "../../data/types";
import { FONT_HEAD, FONT_BODY } from "../../utils/fonts";

interface Props {
  config: ProtocolFlowConfig;
  width: number;
  height: number;
}

export const ProtocolFlowVisualizer: React.FC<Props> = ({ config, width, height }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { actors, packets, showTunnelFrame, tunnelLabel, tunnelColor = "#10B981", comparisonBadge } = config;
  const leftActor = actors[0] || { id: "client", name: "Client", role: "Browser / App", emoji: "💻", color: "#60A5FA" };
  const rightActor = actors[1] || { id: "server", name: "Server", role: "Origin / Edge", emoji: "🌐", color: "#34D399" };

  // Calculate current cumulative latency based on completed or in-flight packets
  let currentLatency = 0;
  let activeRttLabel = "";

  packets.forEach((p) => {
    if (frame >= p.startFrame) {
      const progress = Math.min(1, Math.max(0, (frame - p.startFrame) / p.durationFrames));
      const prevLatency = currentLatency;
      currentLatency = Math.round(prevLatency + (p.latencyAtStepMs - prevLatency) * progress);
      if (p.rttLabel) activeRttLabel = p.rttLabel;
    }
  });

  const isTunnelActive = showTunnelFrame !== undefined && frame >= showTunnelFrame;
  const tunnelProgress = showTunnelFrame !== undefined
    ? interpolate(frame, [showTunnelFrame, showTunnelFrame + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  // Actor Spring Entrances
  const leftActorScale = spring({ fps, frame, config: { damping: 12, stiffness: 180 }, from: 0.8, to: 1 });
  const rightActorScale = spring({ fps, frame: frame - 4, config: { damping: 12, stiffness: 180 }, from: 0.8, to: 1 });

  // Rail layout constants — optimized for 1080x1920 mobile viewport
  const railLeftX = 130;
  const railRightX = width - 130;
  const railWidth = railRightX - railLeftX;
  const startY = 210;
  const stepGap = 105;

  return (
    <div style={{ position: "relative", width, height, overflow: "hidden" }}>
      {/* Top HUD: Latency Meter & Round Trip Counter */}
      <div style={{
        position: "absolute", top: 10, left: 20, right: 20,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "rgba(15, 23, 42, 0.85)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        borderRadius: 22, padding: "16px 28px",
        backdropFilter: "blur(16px)",
        boxShadow: "0 12px 35px rgba(0, 0, 0, 0.5)",
      }}>
        {/* Cumulative Latency Clock */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 16, height: 16, borderRadius: "50%",
            background: currentLatency > 150 ? "#EF4444" : currentLatency > 60 ? "#F59E0B" : "#10B981",
            boxShadow: `0 0 16px ${currentLatency > 150 ? "#EF4444" : currentLatency > 60 ? "#F59E0B" : "#10B981"}`,
          }} />
          <div>
            <div style={{ fontSize: 13, fontFamily: FONT_BODY, color: "#94A3B8", letterSpacing: 1.8, textTransform: "uppercase", fontWeight: 600 }}>
              Physical Latency Tax
            </div>
            <div style={{
              fontSize: 38, fontFamily: FONT_HEAD, fontWeight: 800,
              color: currentLatency > 150 ? "#F87171" : currentLatency > 60 ? "#FBBF24" : "#34D399",
              lineHeight: 1, marginTop: 2,
            }}>
              +{currentLatency} ms
            </div>
          </div>
        </div>

        {/* Phase / RTT Badge */}
        {activeRttLabel && (
          <div style={{
            background: "rgba(99, 102, 241, 0.2)",
            border: "1.5px solid rgba(129, 140, 248, 0.6)",
            borderRadius: 14, padding: "10px 20px",
            color: "#C7D2FE", fontSize: 17, fontFamily: FONT_HEAD, fontWeight: 700,
            letterSpacing: 0.5,
            boxShadow: "0 0 20px rgba(99, 102, 241, 0.25)",
          }}>
            ⚡ {activeRttLabel}
          </div>
        )}
      </div>

      {/* Actors Header (Client vs Server) */}
      <div style={{
        position: "absolute", top: 105, left: 10, right: 10,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        {/* Left Actor: Client */}
        <div style={{
          transform: `scale(${leftActorScale})`,
          width: 250, padding: "16px 20px", borderRadius: 20,
          background: "linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.98) 100%)",
          border: `1.5px solid ${leftActor.color}70`,
          boxShadow: `0 0 28px ${leftActor.color}25`,
          display: "flex", flexDirection: "column", gap: 6,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 32 }}>{leftActor.emoji}</span>
            <div>
              <div style={{ fontSize: 21, fontFamily: FONT_HEAD, fontWeight: 700, color: "#FFFFFF" }}>{leftActor.name}</div>
              <div style={{ fontSize: 13, fontFamily: FONT_BODY, color: "#94A3B8" }}>{leftActor.role}</div>
            </div>
          </div>
          {leftActor.ip && (
            <div style={{ fontSize: 12, fontFamily: "monospace", color: leftActor.color, opacity: 0.85 }}>
              {leftActor.ip}
            </div>
          )}
        </div>

        {/* Center Connection Indicator */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{ fontSize: 12, fontFamily: FONT_BODY, color: "#64748B", letterSpacing: 2.5, textTransform: "uppercase", fontWeight: 600 }}>
            Physical Internet
          </div>
          <div style={{ width: 120, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }} />
        </div>

        {/* Right Actor: Server */}
        <div style={{
          transform: `scale(${rightActorScale})`,
          width: 250, padding: "16px 20px", borderRadius: 20,
          background: "linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.98) 100%)",
          border: `1.5px solid ${rightActor.color}70`,
          boxShadow: `0 0 28px ${rightActor.color}25`,
          display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexDirection: "row-reverse" }}>
            <span style={{ fontSize: 32 }}>{rightActor.emoji}</span>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 21, fontFamily: FONT_HEAD, fontWeight: 700, color: "#FFFFFF" }}>{rightActor.name}</div>
              <div style={{ fontSize: 13, fontFamily: FONT_BODY, color: "#94A3B8" }}>{rightActor.role}</div>
            </div>
          </div>
          {rightActor.ip && (
            <div style={{ fontSize: 12, fontFamily: "monospace", color: rightActor.color, opacity: 0.85 }}>
              {rightActor.ip}
            </div>
          )}
        </div>
      </div>

      {/* Vertical Guideline Tracks with subtle glow */}
      <div style={{
        position: "absolute", top: 220, bottom: 20, left: railLeftX,
        width: 2, background: "linear-gradient(180deg, rgba(96, 165, 250, 0.6) 0%, rgba(96, 165, 250, 0.1) 100%)",
      }} />
      <div style={{
        position: "absolute", top: 220, bottom: 20, left: railRightX,
        width: 2, background: "linear-gradient(180deg, rgba(52, 211, 153, 0.6) 0%, rgba(52, 211, 153, 0.1) 100%)",
      }} />

      {/* Encrypted Tunnel Hologram Overlay — covers the secure session after handshake */}
      {isTunnelActive && (
        <div style={{
          position: "absolute",
          top: startY + (1.8 * stepGap),
          left: railLeftX + 35,
          width: railWidth - 70,
          height: (packets.length - 1.6) * stepGap,
          background: `radial-gradient(ellipse at center, ${tunnelColor}20 0%, transparent 85%)`,
          borderLeft: `2.5px dashed ${tunnelColor}90`,
          borderRight: `2.5px dashed ${tunnelColor}90`,
          opacity: tunnelProgress,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start",
          paddingTop: 8,
          pointerEvents: "none",
        }}>
          <div style={{
            background: "rgba(16, 185, 129, 0.35)",
            border: `2px solid ${tunnelColor}`,
            borderRadius: 100, padding: "8px 24px",
            color: "#6EE7B7", fontSize: 14, fontFamily: FONT_HEAD, fontWeight: 800,
            letterSpacing: 2, textTransform: "uppercase",
            boxShadow: `0 0 35px ${tunnelColor}60`,
          }}>
            🔒 {tunnelLabel || "Encrypted Tunnel Active"}
          </div>
        </div>
      )}

      {/* Packet Sequence Flow */}
      <div style={{ position: "absolute", top: startY, left: 0, width: "100%", height: height - startY }}>
        {packets.map((pkt, idx) => {
          if (frame < pkt.startFrame) return null;

          const travelProgress = Math.min(1, (frame - pkt.startFrame) / pkt.durationFrames);
          const y = idx * stepGap + 30;
          const isLeftToRight = pkt.from === leftActor.id;

          // Docking bounds so capsules stay neatly between rails
          const dockLeftX = railLeftX + 110;
          const dockRightX = railRightX - 110;
          const sourceX = isLeftToRight ? dockLeftX : dockRightX;
          const targetX = isLeftToRight ? dockRightX : dockLeftX;
          const currentPacketX = sourceX + (targetX - sourceX) * travelProgress;

          const pktOpacity = interpolate(travelProgress, [0, 0.2], [0, 1], { extrapolateRight: "clamp" });
          const isFinished = travelProgress >= 1;

          const arrowSymbol = isLeftToRight ? "➔" : "⬅";

          return (
            <React.Fragment key={pkt.id}>
              {/* Wire Path with glowing pulse */}
              <div style={{
                position: "absolute",
                top: y + 22,
                left: railLeftX,
                width: railWidth,
                height: 2,
                background: isFinished
                  ? `linear-gradient(${isLeftToRight ? "90deg" : "270deg"}, ${pkt.color}40, ${pkt.color}80)`
                  : "rgba(255, 255, 255, 0.08)",
                boxShadow: isFinished ? `0 0 10px ${pkt.color}40` : "none",
              }} />

              {/* In-Flight Packet Capsule */}
              <div style={{
                position: "absolute",
                top: y,
                left: currentPacketX - 110,
                width: 220,
                opacity: pktOpacity,
                transform: `scale(${isFinished ? 0.98 : 1.05})`,
                transition: "transform 0.15s ease",
              }}>
                <div style={{
                  background: isFinished
                    ? "rgba(15, 23, 42, 0.92)"
                    : `linear-gradient(135deg, ${pkt.color}45 0%, rgba(15, 23, 42, 0.98) 100%)`,
                  border: `2px solid ${pkt.color}`,
                  borderRadius: 16,
                  padding: "8px 16px",
                  display: "flex", flexDirection: "column", alignItems: "center",
                  boxShadow: `0 0 25px ${pkt.color}${isFinished ? "35" : "80"}`,
                }}>
                  <div style={{
                    fontSize: 16, fontFamily: FONT_HEAD, fontWeight: 700,
                    color: "#FFFFFF", letterSpacing: 0.5, whiteSpace: "nowrap",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    {isLeftToRight ? (
                      <><span>{pkt.title}</span><span style={{ color: pkt.color }}>{arrowSymbol}</span></>
                    ) : (
                      <><span style={{ color: pkt.color }}>{arrowSymbol}</span><span>{pkt.title}</span></>
                    )}
                  </div>
                  {pkt.subtitle && (
                    <div style={{
                      fontSize: 11, fontFamily: FONT_BODY, color: pkt.color,
                      letterSpacing: 0.5, fontWeight: 600, opacity: 0.95, marginTop: 2, whiteSpace: "nowrap",
                    }}>
                      {pkt.subtitle}
                    </div>
                  )}
                </div>
              </div>

              {/* Impact Ping Dot on Target Rail */}
              {isFinished && (
                <div style={{
                  position: "absolute",
                  top: y + 14,
                  left: (isLeftToRight ? railRightX : railLeftX) - 8,
                  width: 16, height: 16, borderRadius: "50%",
                  background: pkt.color,
                  boxShadow: `0 0 16px ${pkt.color}`,
                }} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Comparison Badge / Punchline Card at Bottom */}
      {comparisonBadge && frame >= comparisonBadge.frame && (
        <div style={{
          position: "absolute", bottom: 20, left: 20, right: 20,
          background: "linear-gradient(135deg, rgba(30, 27, 75, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)",
          border: `2px solid ${comparisonBadge.highlightColor}`,
          borderRadius: 22, padding: "20px 28px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          boxShadow: `0 12px 35px ${comparisonBadge.highlightColor}35`,
        }}>
          <div>
            <div style={{ fontSize: 13, fontFamily: FONT_BODY, color: "#C7D2FE", letterSpacing: 2, textTransform: "uppercase", fontWeight: 700 }}>
              {comparisonBadge.title}
            </div>
            <div style={{ fontSize: 20, fontFamily: FONT_BODY, fontWeight: 600, color: "#FFFFFF", marginTop: 4 }}>
              {comparisonBadge.subtext}
            </div>
          </div>
          <div style={{
            fontSize: 36, fontFamily: FONT_HEAD, fontWeight: 800,
            color: comparisonBadge.highlightColor, textShadow: `0 0 25px ${comparisonBadge.highlightColor}70`,
            paddingLeft: 16,
          }}>
            {comparisonBadge.value}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProtocolFlowVisualizer;

