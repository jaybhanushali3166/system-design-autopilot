/**
 * MathematicalFormula.tsx
 *
 * 3Blue1Brown style crisp mathematical formula visualizer:
 * - Pure typographic & vector clarity
 * - Color-coded variables matching 3B1B explanations (Cyan for distance, Yellow for speed of light, Red for latency)
 * - Smooth dynamic counter evaluation
 */

import React from "react";
import { interpolate } from "remotion";
import { FONT_HEAD, FONT_BODY } from "../../utils/fonts";

export interface FormulaProps {
  label?: string;
  formulaTex: string;
  variableNotes: { sym: string; name: string; val: string; color: string }[];
  result?: { text: string; sub?: string; color: string };
  frame: number;
}

export const MathematicalFormula: React.FC<FormulaProps> = ({
  label,
  formulaTex,
  variableNotes,
  result,
  frame,
}) => {
  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity: fadeIn,
        background: "rgba(10, 15, 29, 0.85)",
        border: "1.5px solid rgba(56, 189, 248, 0.25)",
        backdropFilter: "blur(16px)",
        borderRadius: 24,
        padding: "36px 36px",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6), inset 0 0 30px rgba(14, 165, 233, 0.08)",
        display: "flex",
        flexDirection: "column",
        gap: 22,
        fontFamily: FONT_BODY,
      }}
    >
      {label && (
        <div
          style={{
            fontFamily: FONT_HEAD,
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: 3,
            color: "#38BDF8",
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>
      )}

      {/* Main mathematical law banner */}
      <div
        style={{
          fontFamily: "'Space Grotesk', monospace",
          fontSize: 38,
          fontWeight: 700,
          color: "#FFFFFF",
          letterSpacing: 1,
          padding: "16px 24px",
          background: "rgba(255, 255, 255, 0.04)",
          borderRadius: 16,
          borderLeft: "4px solid #38BDF8",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>{formulaTex}</span>
        {result && (
          <span
            style={{
              color: result.color,
              fontWeight: 900,
              fontSize: 40,
              textShadow: `0 0 20px ${result.color}80`,
            }}
          >
            {result.text}
          </span>
        )}
      </div>

      {/* Breakdown of mathematical terms */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${variableNotes.length}, 1fr)`,
          gap: 16,
          marginTop: 6,
        }}
      >
        {variableNotes.map((v, i) => (
          <div
            key={i}
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: `1px solid ${v.color}33`,
              borderRadius: 14,
              padding: "14px 18px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontFamily: "monospace",
                  fontWeight: 900,
                  fontSize: 22,
                  color: v.color,
                }}
              >
                {v.sym}
              </span>
              <span style={{ color: "#94A3B8", fontSize: 14, fontWeight: 500 }}>
                {v.name}
              </span>
            </div>
            <div
              style={{
                color: "#F8FAFC",
                fontFamily: FONT_HEAD,
                fontWeight: 700,
                fontSize: 20,
                marginTop: 6,
              }}
            >
              {v.val}
            </div>
          </div>
        ))}
      </div>

      {result?.sub && (
        <div
          style={{
            color: "#94A3B8",
            fontSize: 16,
            lineHeight: 1.5,
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            paddingTop: 14,
          }}
        >
          {result.sub}
        </div>
      )}
    </div>
  );
};

export default MathematicalFormula;
