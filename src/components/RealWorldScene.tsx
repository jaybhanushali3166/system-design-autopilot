import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Scene } from "../data/types";
import { FONT_HEAD, FONT_BODY } from "../utils/fonts";

const COLORS = ["#FF6B9D", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"];

const RealWorldScene: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleScale = spring({ fps, frame, config: { damping: 11, stiffness: 210 }, from: 0.7, to: 1 });

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "320px 56px 360px", gap: 36, alignItems: "center" }}>
      {/* Title */}
      <div style={{ transform: `scale(${titleScale})`, textAlign: "center" }}>
        <div style={{ fontSize: 13, color: "#4ECDC4", fontFamily: FONT_BODY, fontWeight: 600, letterSpacing: 3.5, textTransform: "uppercase", marginBottom: 10 }}>Real World</div>
        <div style={{ fontSize: 56, fontWeight: 800, fontFamily: FONT_HEAD, color: "#FFFFFF", lineHeight: 1.1, letterSpacing: -0.5 }}>{scene.title}</div>
      </div>

      {/* Company chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
        {scene.companies?.map((company, i) => {
          const s = spring({ fps, frame: frame - (8 + i * 10), config: { damping: 9, stiffness: 220 }, from: 0, to: 1 });
          const color = COLORS[i % COLORS.length];
          return (
            <div key={company} style={{
              transform: `scale(${s})`,
              background: `${color}18`,
              border: `1.5px solid ${color}90`,
              borderRadius: 100,
              padding: "12px 26px",
              fontSize: 26, fontWeight: 700, fontFamily: FONT_HEAD, color,
              letterSpacing: -0.2,
              boxShadow: `0 0 18px ${color}25`,
            }}>{company}</div>
          );
        })}
      </div>

      {/* Metrics */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>
        {scene.metrics?.map((m, i) => {
          const delay = 28 + i * 18;
          const op = interpolate(frame, [delay, delay + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={i} style={{
              opacity: op,
              background: "#FFFFFF07", border: "1px solid #FFFFFF12", borderRadius: 14,
              padding: "16px 22px",
              fontSize: 22, color: "#C0C0DC", fontFamily: FONT_BODY, fontWeight: 500,
              textAlign: "center", letterSpacing: 0.2,
            }}>
              📊 {m}
            </div>
          );
        })}
      </div>

      {/* Tools tag */}
      {scene.bodyText?.map((t, i) => {
        const op = interpolate(frame, [55, 72], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{ opacity: op, fontSize: 20, color: "#55557A", fontFamily: FONT_BODY, fontWeight: 500, textAlign: "center", letterSpacing: 1 }}>{t}</div>
        );
      })}
    </div>
  );
};

export default RealWorldScene;
