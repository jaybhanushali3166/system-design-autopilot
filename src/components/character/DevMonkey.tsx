import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export type MonkeyMood = "chill" | "panic" | "thinking" | "architect";

interface Props {
  mood: MonkeyMood;
  size?: number;
  thoughtText?: string;
  badgeText?: string;
  holdingItem?: "banana" | "laptop" | "smoothie" | "none";
  hat?: "none" | "cop" | "chef";
}

export const DevMonkey: React.FC<Props> = ({
  mood,
  size = 280,
  thoughtText,
  badgeText,
  holdingItem = "none",
  hat = "none",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Gentle breathing idle bounce
  const breathe = Math.sin(frame * 0.1) * 5;

  // Panic trembling shake
  const panicShakeX = mood === "panic" ? Math.sin(frame * 1.4) * 8 : 0;
  const panicShakeY = mood === "panic" ? Math.cos(frame * 1.6) * 5 : 0;

  // Floating levitation for architect mode
  const levitateY = mood === "architect" ? Math.sin(frame * 0.08) * 10 : 0;

  // Entrance spring
  const scale = spring({
    fps,
    frame,
    config: { damping: 10, stiffness: 180 },
    from: 0.6,
    to: 1,
  });

  // Color schemes
  const furColor = "#7C3F18";
  const furShadow = "#5A2A0C";
  const faceColor = "#F5D0A9";
  const earInner = "#FFAAA6";

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${scale}) translate(${panicShakeX}px, ${panicShakeY + breathe + levitateY}px)`,
      }}
    >
      {/* Architect / Zen Aura Glow */}
      {mood === "architect" && (
        <div
          style={{
            position: "absolute",
            width: size * 1.35,
            height: size * 1.35,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, rgba(52, 211, 153, 0.15) 45%, transparent 70%)",
            filter: "blur(12px)",
            zIndex: 0,
          }}
        />
      )}

      {/* Panic Siren Flash Background */}
      {mood === "panic" && (
        <div
          style={{
            position: "absolute",
            width: size * 1.3,
            height: size * 1.3,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(239, 68, 68, ${0.35 + Math.sin(frame * 0.4) * 0.25}) 0%, transparent 70%)`,
            filter: "blur(14px)",
            zIndex: 0,
          }}
        />
      )}

      {/* SVG Character Rig */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        style={{ zIndex: 1, overflow: "visible" }}
      >
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Ears */}
        <circle cx="45" cy="95" r="28" fill={furColor} filter="url(#shadow)" />
        <circle cx="45" cy="95" r="17" fill={earInner} />

        <circle cx="155" cy="95" r="28" fill={furColor} filter="url(#shadow)" />
        <circle cx="155" cy="95" r="17" fill={earInner} />

        {/* Main Head Fur */}
        <circle cx="100" cy="100" r="54" fill={furColor} filter="url(#shadow)" />

        {/* Hair Tuft at top */}
        <path
          d="M 96 46 Q 100 28 106 38 Q 112 30 108 47 Z"
          fill={furColor}
        />

        {/* Face Oval (Muzzle / Eyes region) */}
        <ellipse cx="100" cy="108" rx="42" ry="36" fill={faceColor} />
        {/* Eye brow arches */}
        <circle cx="82" cy="88" r="20" fill={faceColor} />
        <circle cx="118" cy="88" r="20" fill={faceColor} />

        {/* ── HATS ── */}
        {hat === "cop" && (
          <g filter="url(#shadow)">
            <ellipse cx="100" cy="52" rx="42" ry="14" fill="#1E3A8A" />
            <path d="M 68 52 C 68 30, 132 30, 132 52 Z" fill="#1D4ED8" />
            <polygon points="100,36 104,44 96,44" fill="#FBBF24" />
            <rect x="74" y="50" width="52" height="6" rx="2" fill="#FBBF24" />
          </g>
        )}

        {hat === "chef" && (
          <g filter="url(#shadow)">
            <path d="M 72 50 C 60 20, 140 20, 128 50 Z" fill="#FFFFFF" />
            <circle cx="82" cy="30" r="14" fill="#FFFFFF" />
            <circle cx="100" cy="22" r="16" fill="#FFFFFF" />
            <circle cx="118" cy="30" r="14" fill="#FFFFFF" />
            <rect x="75" y="48" width="50" height="8" rx="3" fill="#E2E8F0" />
          </g>
        )}

        {/* ── MOOD-SPECIFIC FACES ── */}

        {/* 1. CHILL MOOD (Happy cartoon smile + cheerful eyes) */}
        {mood === "chill" && (
          <g>
            {/* Happy Eyes with shiny specular highlights */}
            <circle cx="82" cy="88" r="9" fill="#1E293B" />
            <circle cx="80" cy="85" r="3" fill="#FFFFFF" />
            <circle cx="118" cy="88" r="9" fill="#1E293B" />
            <circle cx="116" cy="85" r="3" fill="#FFFFFF" />

            {/* Nose */}
            <ellipse cx="100" cy="104" rx="4" ry="2.5" fill="#5D2E0C" />

            {/* Happy Wide Smile */}
            <path
              d="M 85 112 Q 100 128 115 112"
              fill="none"
              stroke="#5D2E0C"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Cheek blush */}
            <circle cx="70" cy="110" r="7" fill="#FF8A80" opacity="0.45" />
            <circle cx="130" cy="110" r="7" fill="#FF8A80" opacity="0.45" />
          </g>
        )}

        {/* 2. PANIC MOOD (Wide trembling eyes + screaming mouth + splashing sweat) */}
        {mood === "panic" && (
          <g>
            {/* Big wide panicked eyes */}
            <circle cx="82" cy="88" r="16" fill="#FFFFFF" stroke="#EF4444" strokeWidth="2.5" />
            <circle
              cx={82 + Math.sin(frame * 1.5) * 3}
              cy={88 + Math.cos(frame * 1.5) * 3}
              r="5.5"
              fill="#111827"
            />

            <circle cx="118" cy="88" r="16" fill="#FFFFFF" stroke="#EF4444" strokeWidth="2.5" />
            <circle
              cx={118 + Math.sin(frame * 1.5) * 3}
              cy={88 + Math.cos(frame * 1.5) * 3}
              r="5.5"
              fill="#111827"
            />

            {/* Nose */}
            <ellipse cx="100" cy="104" rx="4" ry="2.5" fill="#5D2E0C" />

            {/* Screaming Open Mouth */}
            <ellipse cx="100" cy="122" rx="14" ry="11" fill="#7F1D1D" stroke="#5D2E0C" strokeWidth="2" />
            <ellipse cx="100" cy="126" rx="9" ry="5" fill="#EF4444" />

            {/* Splashing Sweat Drops */}
            <path
              d="M 52 70 Q 42 75 48 85 Q 56 80 52 70"
              fill="#60A5FA"
              opacity={0.8 + Math.sin(frame * 0.5) * 0.2}
            />
            <path
              d="M 148 70 Q 158 75 152 85 Q 144 80 148 70"
              fill="#60A5FA"
              opacity={0.8 + Math.cos(frame * 0.5) * 0.2}
            />
          </g>
        )}

        {/* 3. THINKING MOOD (One eyebrow raised, looking up, curious) */}
        {mood === "thinking" && (
          <g>
            {/* Raised left eyebrow, flat right eyebrow */}
            <path d="M 72 74 Q 82 66 92 72" fill="none" stroke="#5D2E0C" strokeWidth="3" strokeLinecap="round" />
            <path d="M 108 73 Q 118 73 128 73" fill="none" stroke="#5D2E0C" strokeWidth="3" strokeLinecap="round" />

            {/* Eyes looking up and to the right */}
            <circle cx="82" cy="88" r="11" fill="#FFFFFF" stroke="#5D2E0C" strokeWidth="1.5" />
            <circle cx="85" cy="84" r="5" fill="#1E293B" />
            <circle cx="84" cy="83" r="1.5" fill="#FFFFFF" />

            <circle cx="118" cy="88" r="11" fill="#FFFFFF" stroke="#5D2E0C" strokeWidth="1.5" />
            <circle cx="121" cy="84" r="5" fill="#1E293B" />
            <circle cx="120" cy="83" r="1.5" fill="#FFFFFF" />

            {/* Nose */}
            <ellipse cx="100" cy="104" rx="4" ry="2.5" fill="#5D2E0C" />

            {/* Puzzled wavy mouth */}
            <path
              d="M 88 116 Q 94 112 100 116 Q 106 120 112 116"
              fill="none"
              stroke="#5D2E0C"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* 4. ARCHITECT / ZEN MOOD (Dark cool sunglasses + confident boss smirk) */}
        {mood === "architect" && (
          <g>
            {/* Cool Black Sunglasses */}
            <rect x="66" y="74" width="32" height="22" rx="6" fill="#0F172A" stroke="#334155" strokeWidth="2.5" />
            <rect x="102" y="74" width="32" height="22" rx="6" fill="#0F172A" stroke="#334155" strokeWidth="2.5" />
            <line x1="98" y1="83" x2="102" y2="83" stroke="#334155" strokeWidth="3.5" />
            {/* Glossy Reflection on Glasses */}
            <line x1="70" y1="78" x2="80" y2="92" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
            <line x1="106" y1="78" x2="116" y2="92" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />

            {/* Nose */}
            <ellipse cx="100" cy="104" rx="4" ry="2.5" fill="#5D2E0C" />

            {/* Confident Boss Smirk */}
            <path
              d="M 88 114 Q 100 126 116 112"
              fill="none"
              stroke="#5D2E0C"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Gold Earring */}
            <circle cx="45" cy="115" r="5" fill="none" stroke="#F59E0B" strokeWidth="2.5" />
          </g>
        )}

        {/* ── HOLDING PROPS ── */}
        {holdingItem === "banana" && (
          <g transform="translate(130, 110) rotate(-20)" filter="url(#shadow)">
            <path
              d="M 0 0 C 15 5, 30 25, 20 45 C 10 35, 5 15, 0 0 Z"
              fill="#FBBF24"
              stroke="#D97706"
              strokeWidth="2"
            />
            <rect x="18" y="42" width="4" height="6" fill="#78350F" />
          </g>
        )}

        {holdingItem === "smoothie" && (
          <g transform="translate(135, 105)" filter="url(#shadow)">
            {/* Coconut Drink */}
            <ellipse cx="12" cy="20" rx="14" ry="12" fill="#78350F" />
            <ellipse cx="12" cy="12" rx="12" ry="6" fill="#FDE68A" />
            {/* Straw */}
            <line x1="12" y1="12" x2="22" y2="-4" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
            {/* Tiny Umbrella */}
            <path d="M 0 2 Q 8 -10 16 0 Z" fill="#10B981" />
            <line x1="8" y1="-5" x2="8" y2="12" stroke="#D1D5DB" strokeWidth="1.5" />
          </g>
        )}

        {holdingItem === "laptop" && (
          <g transform="translate(60, 140)" filter="url(#shadow)">
            <rect x="0" y="0" width="80" height="45" rx="4" fill="#94A3B8" stroke="#475569" strokeWidth="2" />
            <rect x="4" y="4" width="72" height="35" rx="2" fill="#0F172A" />
            {/* Banana Logo on Laptop Screen */}
            <text x="36" y="24" fontSize="14" fill="#FBBF24" textAnchor="middle">🍌</text>
            {/* Laptop Base */}
            <rect x="-8" y="45" width="96" height="8" rx="3" fill="#64748B" />
          </g>
        )}
      </svg>

      {/* Thought / Speech Bubble */}
      {thoughtText && (
        <div
          style={{
            position: "absolute",
            top: -55,
            background: "rgba(15, 23, 42, 0.98)",
            border: `2px solid ${mood === "panic" ? "#EF4444" : mood === "architect" ? "#10B981" : "#F59E0B"}`,
            borderRadius: 18,
            padding: "10px 22px",
            color: "#FFFFFF",
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: 0.5,
            whiteSpace: "nowrap",
            boxShadow: `0 8px 30px ${mood === "panic" ? "#EF444440" : mood === "architect" ? "#10B98140" : "#F59E0B40"}`,
            zIndex: 10,
          }}
        >
          {thoughtText}
          {/* Triangular Tail */}
          <div
            style={{
              position: "absolute",
              bottom: -9,
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: `9px solid ${mood === "panic" ? "#EF4444" : mood === "architect" ? "#10B981" : "#F59E0B"}`,
            }}
          />
        </div>
      )}

      {/* Role / Status Badge */}
      {badgeText && (
        <div
          style={{
            position: "absolute",
            bottom: -22,
            background:
              mood === "panic"
                ? "rgba(239, 68, 68, 0.9)"
                : mood === "architect"
                ? "rgba(16, 185, 129, 0.9)"
                : "rgba(245, 158, 11, 0.9)",
            borderRadius: 100,
            padding: "6px 18px",
            color: "#FFFFFF",
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: 1,
            textTransform: "uppercase",
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
            zIndex: 10,
          }}
        >
          {badgeText}
        </div>
      )}
    </div>
  );
};

export default DevMonkey;
