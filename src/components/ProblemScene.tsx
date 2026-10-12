import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { Scene } from "../data/types";
import DataFlowDiagram from "./DataFlowDiagram";
import { ProtocolFlowVisualizer } from "./visualizers/ProtocolFlowVisualizer";
import { FONT_HEAD, FONT_BODY } from "../utils/fonts";

const ProblemScene: React.FC<{ scene: Scene; videoWidth: number; videoHeight: number }> = ({ scene, videoWidth, videoHeight }) => {
  const frame = useCurrentFrame();
  const DIAGRAM_H = Math.round(videoHeight * 0.31);

  const headerOp = interpolate(frame, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const headerY  = interpolate(frame, [0, 16], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  if (scene.visual?.type === "protocol_flow") {
    return (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "130px 48px 150px", gap: 20 }}>
        {/* Header */}
        <div style={{ opacity: headerOp, transform: `translateY(${headerY}px)` }}>
          <div style={{ fontSize: 13, color: "#FF6B6B", fontFamily: FONT_BODY, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>The Problem</div>
          <div style={{ fontSize: 44, fontWeight: 700, fontFamily: FONT_HEAD, color: "#FFFFFF", lineHeight: 1.15, letterSpacing: -0.5 }}>{scene.subtitle || scene.title}</div>
        </div>

        {/* Dynamic Visualizer */}
        <div style={{ flex: 1, position: "relative", minHeight: 1100 }}>
          <ProtocolFlowVisualizer
            config={scene.visual}
            width={videoWidth - 96}
            height={1150}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "320px 56px 360px", gap: 20 }}>
      {/* Header */}
      <div style={{ opacity: headerOp, transform: `translateY(${headerY}px)` }}>
        <div style={{ fontSize: 13, color: "#FF6B6B", fontFamily: FONT_BODY, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>The Problem</div>
        <div style={{ fontSize: 46, fontWeight: 700, fontFamily: FONT_HEAD, color: "#FFFFFF", lineHeight: 1.1, letterSpacing: -0.5 }}>{scene.subtitle}</div>
      </div>

      {/* Diagram */}
      {scene.nodes && scene.edges && (
        <div style={{ position: "relative", height: DIAGRAM_H, flexShrink: 0 }}>
          <DataFlowDiagram
            nodes={scene.nodes} edges={scene.edges}
            width={videoWidth - 88} height={DIAGRAM_H}
            stressNodeId={scene.stressNodeId}
            stressStartFrame={scene.stressStartFrame}
          />
        </div>
      )}

      {/* Bullets — synced via bodyTextFrames */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
        {scene.bodyText?.map((text, i) => {
          const appearFrame = scene.bodyTextFrames?.[i] ?? (90 + i * 25);
          const op = interpolate(frame, [appearFrame, appearFrame + 16], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          const tx = interpolate(frame, [appearFrame, appearFrame + 16], [-20, 0], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          return (
            <div key={i} style={{
              opacity: op, transform: `translateX(${tx}px)`,
              display: "flex", alignItems: "center", gap: 12,
              background: "#FF6B6B0C", borderRadius: 12, padding: "13px 18px",
              borderLeft: "2px solid #FF6B6B80",
            }}>
              <span style={{ fontSize: 26, color: "#E8E8F8", fontFamily: FONT_BODY, fontWeight: 500, lineHeight: 1.3 }}>{text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProblemScene;
