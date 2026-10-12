import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Scene } from "../data/types";
import { FONT_HEAD, FONT_BODY } from "../utils/fonts";

const HookScene: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ fps, frame, config: { damping: 9, stiffness: 160 }, from: 0.4, to: 1 });
  const subY   = interpolate(frame, [10, 25], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subOp  = interpolate(frame, [10, 25], [0, 1],  { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bodyOp = interpolate(frame, [28, 42], [0, 1],  { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: "0 56px", position: "relative" }}>
      {/* BG glow */}
      <div style={{ position: "absolute", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, #FF6B9D18 0%, transparent 70%)" }} />

      <div style={{ fontSize: 88, transform: `scale(${titleScale})` }}>🚀</div>

      <div style={{ transform: `scale(${titleScale})`, textAlign: "center" }}>
        <div style={{ fontSize: 72, fontWeight: 800, fontFamily: FONT_HEAD, color: "#FFFFFF", lineHeight: 1.05, letterSpacing: -1 }}>
          {scene.title}
        </div>
      </div>

      <div style={{ transform: `translateY(${subY}px)`, opacity: subOp, textAlign: "center" }}>
        <div style={{ fontSize: 68, fontWeight: 800, fontFamily: FONT_HEAD, color: "#FF6B9D", lineHeight: 1.05, letterSpacing: -0.5, textShadow: "0 0 40px #FF6B9D60" }}>
          {scene.subtitle}
        </div>
      </div>

      {scene.bodyText?.map((t, i) => (
        <div key={i} style={{ opacity: bodyOp, fontSize: 28, color: "#8888AA", fontFamily: FONT_BODY, fontWeight: 500, textAlign: "center", letterSpacing: 0.3 }}>{t}</div>
      ))}
    </div>
  );
};

export default HookScene;
