import React from "react";
import { AbsoluteFill } from "remotion";
import { ThumbnailItem } from "../../data/thumbnails";
import { FONT_HEAD, FONT_BODY } from "../../utils/fonts";

export const ReelThumbnail: React.FC<{
  item: ThumbnailItem;
  diagram?: React.ReactNode;
  footerLabel?: string;
  sectionLabel?: string;
}> = ({ item, diagram, footerLabel, sectionLabel }) => {
  const { category, title, subtitle, accentColor, tags, diagramType } = item;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#07080D",
        fontFamily: FONT_BODY,
        color: "#FFFFFF",
        overflow: "hidden",
        width: 1080,
        height: 1920,
      }}
    >
      {/* Background Engineering Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.028) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.028) 1px, transparent 1px)
          `,
          backgroundSize: "44px 44px",
        }}
      />

      {/* Top Ambient Glow */}
      <div
        style={{
          position: "absolute",
          top: 180,
          left: "50%",
          transform: "translateX(-50%)",
          width: 900,
          height: 550,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}1D 0%, transparent 68%)`,
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* Bottom Ambient Glow */}
      <div
        style={{
          position: "absolute",
          bottom: 220,
          left: "50%",
          transform: "translateX(-50%)",
          width: 800,
          height: 480,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}15 0%, transparent 68%)`,
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      {/* ─────────────────────────────────────────────────────────────
          INSTAGRAM FEED SAFE ZONE CONTAINER
          Center 1080 x 1080 px (Y: 420px to 1500px)
          Ensures perfect 1:1 Instagram profile grid presentation!
         ───────────────────────────────────────────────────────────── */}
      <div
        data-thumbnail-safe="true"
        style={{
          position: "absolute",
          top: 420,
          left: 54,
          width: 972,
          height: 1080,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          boxSizing: "border-box",
          padding: "16px 0 22px 0",
        }}
      >
        {/* ── TOP HEADER BLOCK (Brand & Series Pill) ── */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Series / Category Pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 22px",
              borderRadius: 999,
              background: "rgba(255, 255, 255, 0.05)",
              border: `1.5px solid ${accentColor}66`,
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: accentColor,
                boxShadow: `0 0 12px ${accentColor}`,
              }}
            />
            <span
              style={{
                fontFamily: FONT_HEAD,
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: 2,
                color: "#FFFFFF",
                textTransform: "uppercase",
              }}
            >
              {category}
            </span>
          </div>

          {/* Watermark / Channel Name */}
          <div
            style={{
              fontFamily: FONT_HEAD,
              fontSize: 21,
              fontWeight: 700,
              letterSpacing: 1.2,
              color: "rgba(255, 255, 255, 0.7)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ color: accentColor }}>@</span>beyond.localhost
          </div>
        </div>

        {/* ── TITLE & SUBTITLE HEADLINE ── */}
        <div style={{ width: "100%", textAlign: "center", marginTop: 4 }}>
          {sectionLabel && (
            <div style={{ fontFamily: FONT_HEAD, fontSize: 21, fontWeight: 700, letterSpacing: 2, color: "#CBD5E1", marginBottom: 12 }}>
              {sectionLabel}
            </div>
          )}
          <h1
            style={{
              fontFamily: FONT_HEAD,
              fontSize: 66,
              fontWeight: 800,
              letterSpacing: -1,
              lineHeight: 1.08,
              margin: 0,
              color: "#FFFFFF",
              textTransform: "uppercase",
              textShadow: "0 6px 32px rgba(0,0,0,0.85)",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontFamily: FONT_BODY,
              fontSize: 26,
              fontWeight: 600,
              lineHeight: 1.3,
              margin: "10px 0 0 0",
              color: accentColor,
              letterSpacing: 0.2,
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* ── CENTRAL INFORMATIVE DIAGRAM CARD ── */}
        <div
          style={{
            width: "100%",
            height: 600,
            background: "rgba(13, 17, 28, 0.85)",
            border: "1.5px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 28,
            boxShadow: `0 28px 70px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.12)`,
            backdropFilter: "blur(24px)",
            padding: "26px 28px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle Corner Glow */}
          <div
            style={{
              position: "absolute",
              top: -60,
              right: -60,
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: `${accentColor}1C`,
              filter: "blur(50px)",
              pointerEvents: "none",
            }}
          />

          {diagram ?? renderDiagram(diagramType, accentColor)}
        </div>

        {/* ── BOTTOM INFORMATIVE PILLS (What you will learn) ── */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 12,
            marginTop: 4,
          }}
        >
          {tags.map((tag, idx) => (
            <div
              key={idx}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "13px 14px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 14,
                fontFamily: FONT_BODY,
                fontSize: 18,
                fontWeight: 600,
                color: "#E2E8F0",
                letterSpacing: 0.3,
                whiteSpace: "nowrap",
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* ── FOOTER PROMPT ── */}
        <div
          style={{
            fontFamily: FONT_HEAD,
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: 2.2,
            color: "rgba(255, 255, 255, 0.5)",
            textTransform: "uppercase",
            marginTop: 4,
          }}
        >
          {footerLabel ?? "SWIPE FOR SENIOR SYSTEM BREAKDOWN ➔"}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SPECIFIC INFORMATIVE SCHEMATIC DIAGRAMS
// ─────────────────────────────────────────────────────────────────────────────

function renderDiagram(type: ThumbnailItem["diagramType"], accent: string) {
  switch (type) {
    case "load_balancer":
      return <LoadBalancerDiagram accent={accent} />;
    case "lb_algorithms":
      return <LBAlgorithmsDiagram accent={accent} />;
    case "lb_layers_ha":
      return <LBLayersHADiagram accent={accent} />;
    case "consistent_hashing":
      return <ConsistentHashingDiagram accent={accent} />;
    case "caching":
      return <CachingDiagram accent={accent} />;
    case "rate_limiter":
      return <RateLimiterDiagram accent={accent} />;
    case "packet_journey":
      return <PacketJourneyDiagram accent={accent} />;
    case "http_versions":
      return <HttpVersionsDiagram accent={accent} />;
    case "realtime_protocols":
      return <RealtimeProtocolsDiagram accent={accent} />;
    case "proxy_gateway":
      return <ProxyGatewayDiagram accent={accent} />;
    case "monkey_scale":
      return <MonkeyScaleDiagram accent={accent} />;
    case "monkey_caching":
      return <MonkeyCachingDiagram accent={accent} />;
    case "networking_essentials":
      return <NetworkingEssentialsDiagram accent={accent} />;
    default:
      return null;
  }
}

// 1. Load Balancer Architecture
const LoadBalancerDiagram: React.FC<{ accent: string }> = ({ accent }) => (
  <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
    <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 26 }}>⚡</div>
        <div>
          <div style={{ fontSize: 19, fontWeight: 800, color: "#FFFFFF" }}>Reverse Proxy & Layer 7 Gateway</div>
          <div style={{ fontSize: 14, color: "#94A3B8" }}>Zero downtime • Instant auto-failover</div>
        </div>
      </div>
      <div style={{ padding: "8px 16px", borderRadius: 10, background: `${accent}25`, border: `1.5px solid ${accent}66`, fontSize: 14, fontWeight: 800, color: accent }}>
        99.999% SLA
      </div>
    </div>

    {/* Nodes Row */}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "14px 0" }}>
      {/* Client */}
      <div style={{ width: 165, padding: "26px 14px", borderRadius: 18, background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.12)", textAlign: "center" }}>
        <div style={{ fontSize: 38 }}>👥</div>
        <div style={{ fontSize: 17, fontWeight: 800, marginTop: 10 }}>1M Clients</div>
        <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>Concurrent requests</div>
      </div>

      {/* Directed Arrow */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <span style={{ fontSize: 13, color: accent, fontWeight: 800 }}>HTTPS</span>
        <div style={{ width: 55, height: 3, background: `linear-gradient(90deg, transparent, ${accent})` }} />
        <span style={{ fontSize: 22, color: accent }}>➔</span>
      </div>

      {/* Central Load Balancer */}
      <div style={{ width: 250, padding: "26px 16px", borderRadius: 20, background: `${accent}18`, border: `2.5px solid ${accent}`, textAlign: "center", boxShadow: `0 0 35px ${accent}30` }}>
        <div style={{ fontSize: 40 }}>⚖️</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#FFFFFF", marginTop: 8 }}>LOAD BALANCER</div>
        <div style={{ fontSize: 13, color: accent, fontWeight: 700, marginTop: 4 }}>NGINX • HAProxy • Envoy</div>
      </div>

      {/* Directed Branch Arrow */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <span style={{ fontSize: 13, color: accent, fontWeight: 800 }}>Balanced</span>
        <div style={{ width: 55, height: 3, background: `linear-gradient(90deg, ${accent}, transparent)` }} />
        <span style={{ fontSize: 22, color: accent }}>➔</span>
      </div>

      {/* Backend Pool */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {["Server 01", "Server 02", "Server 03"].map((srv, i) => (
          <div key={i} style={{ width: 180, padding: "12px 14px", borderRadius: 14, background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.12)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 15, fontWeight: 800 }}>🖥️ {srv}</span>
            <span style={{ fontSize: 13, color: accent, fontWeight: 800 }}>33%</span>
          </div>
        ))}
      </div>
    </div>

    {/* Metric Bar */}
    <div style={{ display: "flex", justifyContent: "space-around", padding: "14px 16px", borderRadius: 14, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ fontSize: 15, color: "#94A3B8" }}>Ping: <strong style={{ color: "#FFFFFF" }}>Healthy</strong></div>
      <div style={{ fontSize: 15, color: "#94A3B8" }}>Algorithm: <strong style={{ color: accent }}>Round Robin</strong></div>
      <div style={{ fontSize: 15, color: "#94A3B8" }}>Failover: <strong style={{ color: "#FFFFFF" }}>Sub-second Auto-heal</strong></div>
    </div>
  </div>
);

// 2. Load Balancing Algorithms
const LBAlgorithmsDiagram: React.FC<{ accent: string }> = ({ accent }) => (
  <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 19, fontWeight: 800 }}>Algorithm Decision Matrix</span>
      <span style={{ color: accent, fontSize: 14, fontWeight: 700, padding: "5px 12px", borderRadius: 8, background: `${accent}20` }}>
        Workload Comparison
      </span>
    </div>

    <div style={{ display: "flex", gap: 14, margin: "12px 0", flex: 1 }}>
      {/* Round Robin */}
      <div style={{ flex: 1, padding: "20px 16px", borderRadius: 18, background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 32 }}>🔄</span>
            <span style={{ fontSize: 12, padding: "4px 8px", borderRadius: 6, background: "rgba(255,255,255,0.1)", fontWeight: 800 }}>CYCLIC</span>
          </div>
          <div style={{ fontSize: 19, fontWeight: 900, marginTop: 10 }}>Round Robin</div>
          <div style={{ fontSize: 14, color: "#94A3B8", marginTop: 8, lineHeight: 1.45 }}>
            Cycles 1 ➔ 2 ➔ 3 sequentially. Simple & stateless.
          </div>
        </div>
        <div style={{ padding: "8px 10px", borderRadius: 8, background: "rgba(239, 68, 68, 0.12)", color: "#F87171", fontSize: 12, fontWeight: 800 }}>
          ⚠️ Ignores server load
        </div>
      </div>

      {/* Least Connections */}
      <div style={{ flex: 1, padding: "20px 16px", borderRadius: 18, background: `${accent}16`, border: `2.5px solid ${accent}`, display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: `0 0 30px ${accent}25` }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 32 }}>⚖️</span>
            <span style={{ fontSize: 12, padding: "4px 8px", borderRadius: 6, background: `${accent}33`, color: accent, fontWeight: 800 }}>OPTIMAL</span>
          </div>
          <div style={{ fontSize: 19, fontWeight: 900, color: "#FFFFFF", marginTop: 10 }}>Least Conns</div>
          <div style={{ fontSize: 14, color: "#E2E8F0", marginTop: 8, lineHeight: 1.45 }}>
            Routes to server with lowest active client sessions.
          </div>
        </div>
        <div style={{ padding: "8px 10px", borderRadius: 8, background: `${accent}30`, color: accent, fontSize: 12, fontWeight: 800 }}>
          ✅ Heavy queries & tasks
        </div>
      </div>

      {/* IP Hash */}
      <div style={{ flex: 1, padding: "20px 16px", borderRadius: 18, background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 32 }}>🔑</span>
            <span style={{ fontSize: 12, padding: "4px 8px", borderRadius: 6, background: "rgba(255,255,255,0.1)", fontWeight: 800 }}>STATEFUL</span>
          </div>
          <div style={{ fontSize: 19, fontWeight: 900, marginTop: 10 }}>IP Hashing</div>
          <div style={{ fontSize: 14, color: "#94A3B8", marginTop: 8, lineHeight: 1.45 }}>
            hash(Client IP) % N guarantees client lands on same host.
          </div>
        </div>
        <div style={{ padding: "8px 10px", borderRadius: 8, background: "rgba(56, 189, 248, 0.12)", color: "#38BDF8", fontSize: 12, fontWeight: 800 }}>
          🎯 Sticky session affinity
        </div>
      </div>
    </div>

    <div style={{ padding: "14px 18px", borderRadius: 12, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 14, color: "#94A3B8" }}>Interview Golden Rule:</span>
      <span style={{ fontSize: 14, fontWeight: 800, color: "#FFFFFF" }}>Always match algorithm to job duration & statefulness</span>
    </div>
  </div>
);

// 3. L4 vs L7 & HA Failover
const LBLayersHADiagram: React.FC<{ accent: string }> = ({ accent }) => (
  <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
    {/* Upper Section: VRRP Active-Passive */}
    <div style={{ padding: "18px 20px", borderRadius: 18, background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.1)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: accent, letterSpacing: 1.5, textTransform: "uppercase" }}>
          HIGH AVAILABILITY: VRRP FLOATING VIP
        </span>
        <span style={{ fontSize: 12, color: "#94A3B8" }}>Virtual IP: 192.0.2.1</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
        <div style={{ flex: 1, padding: "12px 18px", borderRadius: 14, background: "rgba(16, 185, 129, 0.15)", border: "1.5px solid #10B981", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 12px #10B981" }} />
          <div>
            <div style={{ fontSize: 16, fontWeight: 900 }}>LB 1 (ACTIVE)</div>
            <div style={{ fontSize: 12, color: "#A7F3D0" }}>Serving 100% Traffic</div>
          </div>
        </div>

        <div style={{ padding: "0 18px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 12, color: "#F59E0B", fontWeight: 800 }}>Heartbeat ping</span>
          <span style={{ fontSize: 22, color: "#F59E0B" }}>⟷</span>
        </div>

        <div style={{ flex: 1, padding: "12px 18px", borderRadius: 14, background: "rgba(245, 158, 11, 0.12)", border: "1.5px solid #F59E0B", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#F59E0B" }} />
          <div>
            <div style={{ fontSize: 16, fontWeight: 900 }}>LB 2 (STANDBY)</div>
            <div style={{ fontSize: 12, color: "#FDE68A" }}>Hot Standby Takeover</div>
          </div>
        </div>
      </div>
    </div>

    {/* Lower Section: Layer 4 vs Layer 7 */}
    <div style={{ display: "flex", gap: 14, flex: 1, marginTop: 14 }}>
      <div style={{ flex: 1, padding: "18px 20px", borderRadius: 16, background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#38BDF8" }}>Layer 4 (Transport)</div>
          <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>TCP / UDP Raw Packets</div>
          <div style={{ fontSize: 14, marginTop: 10, color: "#E2E8F0", lineHeight: 1.4 }}>
            • Zero payload inspection<br />
            • Millions of QPS at wire speed
          </div>
        </div>
        <div style={{ fontSize: 12, color: "#38BDF8", fontWeight: 700 }}>Ultra-fast packet routing</div>
      </div>

      <div style={{ flex: 1, padding: "18px 20px", borderRadius: 16, background: `${accent}16`, border: `2px solid ${accent}`, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#FFFFFF" }}>Layer 7 (Application)</div>
          <div style={{ fontSize: 13, color: accent, marginTop: 4 }}>HTTP / HTTPS / Headers</div>
          <div style={{ fontSize: 14, marginTop: 10, color: "#FFFFFF", lineHeight: 1.4 }}>
            • Path routing (/api vs /static)<br />
            • SSL termination & Auth cookies
          </div>
        </div>
        <div style={{ fontSize: 12, color: accent, fontWeight: 700 }}>Smart content-aware routing</div>
      </div>
    </div>
  </div>
);

// 4. Consistent Hashing Ring
const ConsistentHashingDiagram: React.FC<{ accent: string }> = ({ accent }) => (
  <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}>
    <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 19, fontWeight: 800 }}>360° Distributed Hash Ring</span>
      <span style={{ fontSize: 13, padding: "6px 12px", borderRadius: 8, background: `${accent}25`, color: accent, fontWeight: 800 }}>
        Virtual Nodes Enabled
      </span>
    </div>

    {/* SVG Hash Ring */}
    <div style={{ position: "relative", width: 560, height: 360 }}>
      <svg width="560" height="360" viewBox="0 0 560 360" style={{ overflow: "visible" }}>
        {/* Ring circle */}
        <circle cx="280" cy="180" r="140" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="3" strokeDasharray="8 8" />
        <circle cx="280" cy="180" r="140" fill="none" stroke={accent} strokeWidth="4" strokeDasharray="240 800" strokeDashoffset="60" />

        {/* Node S1 (top right ~ 45 deg: cx=379, cy=81) */}
        <circle cx="379" cy="81" r="24" fill="#10B981" />
        <text x="379" y="88" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="900">S1</text>
        <text x="420" y="70" fill="#10B981" fontSize="13" fontWeight="800">Node A</text>

        {/* Node S2 (bottom right ~ 135 deg: cx=379, cy=279) */}
        <circle cx="379" cy="279" r="24" fill="#3B82F6" />
        <text x="379" y="286" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="900">S2</text>
        <text x="420" y="300" fill="#3B82F6" fontSize="13" fontWeight="800">Node B</text>

        {/* Node S3 (bottom left ~ 225 deg: cx=181, cy=279) */}
        <circle cx="181" cy="279" r="24" fill="#8B5CF6" />
        <text x="181" y="286" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="900">S3</text>
        <text x="135" y="300" fill="#8B5CF6" fontSize="13" fontWeight="800">Node C</text>

        {/* Added Node +S4 (top left ~ 315 deg: cx=181, cy=81) */}
        <circle cx="181" cy="81" r="26" fill="#F43F5E" stroke="#FFFFFF" strokeWidth="2.5" />
        <text x="181" y="88" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="900">+S4</text>
        <text x="115" y="70" fill="#F43F5E" fontSize="13" fontWeight="800">New Server</text>

        {/* Keys Mapped clockwise */}
        <circle cx="330" cy="46" r="8" fill="#F59E0B" />
        <text x="330" y="32" textAnchor="middle" fill="#F59E0B" fontSize="12" fontWeight="800">Key 1 ➔ S1</text>

        <circle cx="420" cy="180" r="8" fill="#F59E0B" />
        <text x="475" y="185" textAnchor="middle" fill="#F59E0B" fontSize="12" fontWeight="800">Key 2 ➔ S2</text>

        <circle cx="140" cy="180" r="8" fill="#F59E0B" />
        <text x="80" y="185" textAnchor="middle" fill="#F59E0B" fontSize="12" fontWeight="800">Key 3 ➔ +S4</text>

        {/* Center Text */}
        <text x="280" y="172" textAnchor="middle" fill="#FFFFFF" fontSize="24" fontWeight="900">0 → 2³² - 1</text>
        <text x="280" y="198" textAnchor="middle" fill={accent} fontSize="15" fontWeight="700">Clockwise Key Routing</text>
      </svg>
    </div>

    {/* Metric Comparison Banner */}
    <div style={{ width: "100%", padding: "14px 18px", borderRadius: 14, background: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between" }}>
      <div>
        <span style={{ fontSize: 13, color: "#EF4444", fontWeight: 800 }}>Naive Hash (key % N): </span>
        <span style={{ fontSize: 14, color: "#FFFFFF" }}>100% Keys Remapped 🔥</span>
      </div>
      <div>
        <span style={{ fontSize: 13, color: accent, fontWeight: 800 }}>Consistent Hash: </span>
        <span style={{ fontSize: 14, color: "#FFFFFF" }}>Only K/N Keys Relocate ✅</span>
      </div>
    </div>
  </div>
);

// 5. Caching & Redis Architecture
const CachingDiagram: React.FC<{ accent: string }> = ({ accent }) => (
  <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 19, fontWeight: 800 }}>In-Memory Cache vs Disk Storage</span>
      <span style={{ fontSize: 13, color: accent, fontWeight: 800, padding: "5px 12px", borderRadius: 8, background: `${accent}25` }}>
        100x Latency Advantage
      </span>
    </div>

    {/* Flow Rows */}
    <div style={{ display: "flex", flexDirection: "column", gap: 14, margin: "10px 0", flex: 1, justifyContent: "space-between" }}>
      {/* Top Application Header */}
      <div style={{ padding: "12px 18px", borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>🖥️</span>
          <span style={{ fontSize: 15, fontWeight: 800 }}>Application Server Tier</span>
        </div>
        <span style={{ fontSize: 13, color: "#94A3B8" }}>50,000 Reads / sec</span>
      </div>

      {/* Path 1: Redis RAM */}
      <div style={{ padding: "20px 22px", borderRadius: 18, background: "rgba(16, 185, 129, 0.14)", border: "2px solid #10B981", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 0 25px rgba(16,185,129,0.18)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 38 }}>⚡</div>
          <div>
            <div style={{ fontSize: 19, fontWeight: 900, color: "#FFFFFF" }}>Redis / Memcached (RAM)</div>
            <div style={{ fontSize: 14, color: "#A7F3D0", marginTop: 2 }}>Sub-millisecond memory lookup • Cache-Aside pattern</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#10B981" }}>0.1 ms</div>
          <div style={{ fontSize: 12, color: "#A7F3D0", fontWeight: 800 }}>99.2% HIT RATE</div>
        </div>
      </div>

      {/* Path 2: PostgreSQL Disk */}
      <div style={{ padding: "20px 22px", borderRadius: 18, background: "rgba(239, 68, 68, 0.08)", border: "1.5px solid rgba(239, 68, 68, 0.35)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 38 }}>💾</div>
          <div>
            <div style={{ fontSize: 19, fontWeight: 900, color: "#FFFFFF" }}>PostgreSQL / MySQL (Disk)</div>
            <div style={{ fontSize: 14, color: "#FCA5A5", marginTop: 2 }}>Disk I/O, B-Tree index scans, connection pool queue</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#EF4444" }}>25.0 ms</div>
          <div style={{ fontSize: 12, color: "#FCA5A5", fontWeight: 800 }}>250X SLOWER</div>
        </div>
      </div>
    </div>

    {/* Metric highlights */}
    <div style={{ display: "flex", justifyContent: "space-around", padding: "14px 16px", borderRadius: 14, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ fontSize: 15, color: "#94A3B8" }}>Cache Hit: <strong style={{ color: "#10B981" }}>99.2%</strong></div>
      <div style={{ fontSize: 15, color: "#94A3B8" }}>Eviction: <strong style={{ color: "#FFFFFF" }}>LRU / LFU</strong></div>
      <div style={{ fontSize: 15, color: "#94A3B8" }}>DB Offload: <strong style={{ color: "#10B981" }}>-90% Queries</strong></div>
    </div>
  </div>
);

// 6. Rate Limiter System Design
const RateLimiterDiagram: React.FC<{ accent: string }> = ({ accent }) => (
  <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 19, fontWeight: 800 }}>Token Bucket Rate Limiting</span>
      <span style={{ fontSize: 13, color: accent, fontWeight: 800, padding: "5px 12px", borderRadius: 8, background: `${accent}25` }}>
        DDoS & Burst Protection
      </span>
    </div>

    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "14px 0", flex: 1 }}>
      {/* Inflow */}
      <div style={{ width: 180, padding: "26px 14px", borderRadius: 18, background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.12)", textAlign: "center" }}>
        <div style={{ fontSize: 36 }}>🔥</div>
        <div style={{ fontSize: 18, fontWeight: 900, marginTop: 6 }}>10,000 req/s</div>
        <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>Surge Traffic Stream</div>
      </div>

      <div style={{ fontSize: 26, color: accent, fontWeight: 900 }}>➔</div>

      {/* Bucket */}
      <div style={{ width: 260, padding: "24px 16px", borderRadius: 20, background: `${accent}18`, border: `2.5px solid ${accent}`, textAlign: "center", boxShadow: `0 0 35px ${accent}30` }}>
        <div style={{ fontSize: 40 }}>🪣</div>
        <div style={{ fontSize: 19, fontWeight: 900, marginTop: 4 }}>TOKEN BUCKET</div>
        <div style={{ fontSize: 13, color: "#FFFFFF", marginTop: 6 }}>Capacity: <strong>100 Tokens</strong></div>
        <div style={{ fontSize: 13, color: accent, fontWeight: 800, marginTop: 4 }}>Refill: +10 tokens/sec</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 8 }}>
          {"🪙 🪙 🪙 🪙".split(" ").map((t, idx) => (
            <span key={idx} style={{ fontSize: 16 }}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 26, color: accent, fontWeight: 900 }}>➔</div>

      {/* Outflow Branch */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ width: 190, padding: "14px 16px", borderRadius: 14, background: "rgba(16, 185, 129, 0.16)", border: "1.5px solid #10B981" }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#10B981" }}>✅ 200 OK</div>
          <div style={{ fontSize: 12, color: "#A7F3D0", marginTop: 2 }}>Token consumed • Handled</div>
        </div>
        <div style={{ width: 190, padding: "14px 16px", borderRadius: 14, background: "rgba(239, 68, 68, 0.16)", border: "1.5px solid #EF4444" }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#EF4444" }}>🚫 429 Too Many</div>
          <div style={{ fontSize: 12, color: "#FCA5A5", marginTop: 2 }}>Bucket empty • Dropped</div>
        </div>
      </div>
    </div>

    <div style={{ padding: "14px 18px", borderRadius: 14, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between" }}>
      <span style={{ fontSize: 14, color: "#94A3B8" }}>Distributed Tracking:</span>
      <span style={{ fontSize: 14, fontWeight: 800, color: "#FFFFFF" }}>Redis In-Memory Counter + Sliding Window Log</span>
    </div>
  </div>
);

// 7. Journey of a Packet
const PacketJourneyDiagram: React.FC<{ accent: string }> = ({ accent }) => (
  <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 19, fontWeight: 800 }}>End-to-End Network Pipeline</span>
      <span style={{ fontSize: 13, color: accent, fontWeight: 800, padding: "5px 12px", borderRadius: 8, background: `${accent}25` }}>
        4 Handshake Stages
      </span>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "10px 0", flex: 1, justifyContent: "center" }}>
      {[
        { step: "1", icon: "🔎", title: "DNS Lookup (UDP Port 53)", desc: "Browser Cache ➔ Root DNS ➔ Authoritative IP (142.250.x.x)", speed: "2ms" },
        { step: "2", icon: "🤝", title: "TCP 3-Way Handshake", desc: "SYN ➔ SYN-ACK ➔ ACK establish reliable byte stream", speed: "1 RTT" },
        { step: "3", icon: "🔒", title: "TLS 1.3 Key Exchange", desc: "ECDHE Diffie-Hellman + AES-256 GCM encryption", speed: "1 RTT" },
        { step: "4", icon: "🚀", title: "HTTP Request & Reverse Proxy", desc: "GET /api/feed ➔ Load Balancer ➔ Backend Cluster", speed: "0.1ms" },
      ].map((s, idx) => (
        <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderRadius: 14, background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.09)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ width: 30, height: 30, borderRadius: "50%", background: `${accent}30`, color: accent, fontSize: 14, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{s.step}</span>
            <span style={{ fontSize: 24 }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#FFFFFF" }}>{s.title}</div>
              <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 2 }}>{s.desc}</div>
            </div>
          </div>
          <span style={{ fontSize: 14, fontWeight: 800, color: accent }}>{s.speed}</span>
        </div>
      ))}
    </div>

    <div style={{ padding: "12px 16px", borderRadius: 12, background: "rgba(0,0,0,0.4)", textAlign: "center", fontSize: 14, color: "#94A3B8" }}>
      Total latency: <strong style={{ color: "#FFFFFF" }}>under 50ms</strong> across global fiber backbones
    </div>
  </div>
);

// 7B. HTTP Versions & Head-of-Line Blocking Diagram
const HttpVersionsDiagram: React.FC<{ accent: string }> = ({ accent }) => (
  <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 19, fontWeight: 800 }}>Protocol Evolution & Transport Layer</span>
      <span style={{ fontSize: 13, color: accent, fontWeight: 800, padding: "5px 12px", borderRadius: 8, background: `${accent}25` }}>
        HoL Blocking Solved
      </span>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "10px 0", flex: 1, justifyContent: "center" }}>
      <div style={{ padding: "16px 18px", borderRadius: 14, background: "rgba(244, 63, 94, 0.1)", border: "1.5px solid rgba(244, 63, 94, 0.4)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#F43F5E" }}>HTTP/1.1 (1997) · 6 TCP Sockets</div>
          <div style={{ fontSize: 13, color: "#E2E8F0", marginTop: 2 }}>Head-of-Line queue stalls browser socket pool</div>
        </div>
        <span style={{ fontSize: 24 }}>🛑</span>
      </div>

      <div style={{ padding: "16px 18px", borderRadius: 14, background: "rgba(251, 191, 36, 0.1)", border: "1.5px solid rgba(251, 191, 36, 0.4)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#FBBF24" }}>HTTP/2 (2015) · Binary Framing Layer</div>
          <div style={{ fontSize: 13, color: "#E2E8F0", marginTop: 2 }}>Multiplexed streams over 1 TCP pipe • Wi-Fi packet drop halts all</div>
        </div>
        <span style={{ fontSize: 24 }}>⚠️</span>
      </div>

      <div style={{ padding: "18px 18px", borderRadius: 16, background: "rgba(16, 185, 129, 0.15)", border: "2px solid #10B981", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 0 25px rgba(16,185,129,0.2)" }}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 900, color: "#FFFFFF" }}>HTTP/3 QUIC (2022) · UDP Transport</div>
          <div style={{ fontSize: 13, color: "#A7F3D0", marginTop: 2 }}>Independent streams • Zero TCP HoL Blocking • 0-RTT Reconnect</div>
        </div>
        <span style={{ fontSize: 28 }}>🚀</span>
      </div>
    </div>

    <div style={{ padding: "12px 16px", borderRadius: 12, background: "rgba(0,0,0,0.4)", textAlign: "center", fontSize: 14, color: "#94A3B8" }}>
      Key Shift: <strong style={{ color: "#10B981" }}>Application multiplexing moved to UDP transport layer</strong>
    </div>
  </div>
);

// 7C. Real-Time Protocols Diagram
const RealtimeProtocolsDiagram: React.FC<{ accent: string }> = ({ accent }) => (
  <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 19, fontWeight: 800 }}>Real-Time Architectures Comparison</span>
      <span style={{ fontSize: 13, color: accent, fontWeight: 800, padding: "5px 12px", borderRadius: 8, background: `${accent}25` }}>
        Live Telemetry
      </span>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "10px 0", flex: 1, justifyContent: "center" }}>
      <div style={{ padding: "16px 18px", borderRadius: 14, background: "rgba(244, 63, 94, 0.08)", border: "1.5px solid rgba(244, 63, 94, 0.35)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#F43F5E" }}>Short Polling (HTTP Overhead)</div>
          <div style={{ fontSize: 13, color: "#E2E8F0", marginTop: 2 }}>~800 bytes HTTP header per ping • 95% empty 304 responses</div>
        </div>
        <span style={{ fontSize: 24 }}>🐢</span>
      </div>

      <div style={{ padding: "16px 18px", borderRadius: 14, background: "rgba(56, 189, 248, 0.1)", border: "1.5px solid rgba(56, 189, 248, 0.4)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#38BDF8" }}>Server-Sent Events (SSE)</div>
          <div style={{ fontSize: 13, color: "#E2E8F0", marginTop: 2 }}>1-Way server push • Built-in reconnect • ChatGPT & Stocks</div>
        </div>
        <span style={{ fontSize: 24 }}>⚡</span>
      </div>

      <div style={{ padding: "18px 18px", borderRadius: 16, background: "rgba(0, 229, 255, 0.15)", border: "2px solid #00E5FF", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 0 25px rgba(0,229,255,0.2)" }}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 900, color: "#FFFFFF" }}>WebSockets (Full Duplex)</div>
          <div style={{ fontSize: 13, color: "#A5F3FC", marginTop: 2 }}>2-byte framing overhead • Bi-directional live telemetry (Uber/Chat)</div>
        </div>
        <span style={{ fontSize: 28 }}>🚀</span>
      </div>
    </div>

    <div style={{ padding: "12px 16px", borderRadius: 12, background: "rgba(0,0,0,0.4)", textAlign: "center", fontSize: 14, color: "#94A3B8" }}>
      Efficiency: <strong style={{ color: "#00E5FF" }}>WebSockets saves 99% bandwidth vs Short Polling</strong>
    </div>
  </div>
);

// 7D. Reverse Proxy vs API Gateway Diagram
const ProxyGatewayDiagram: React.FC<{ accent: string }> = ({ accent }) => (
  <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 19, fontWeight: 800 }}>Edge Architecture: Two-Tier Pattern</span>
      <span style={{ fontSize: 13, color: accent, fontWeight: 800, padding: "5px 12px", borderRadius: 8, background: `${accent}25` }}>
        Infra vs App Layer
      </span>
    </div>

    <div style={{ display: "flex", gap: 14, margin: "10px 0", flex: 1 }}>
      {/* Tier 1: Reverse Proxy */}
      <div style={{ flex: 1, padding: "18px 16px", borderRadius: 16, background: "rgba(0, 229, 255, 0.08)", border: "1.5px solid rgba(0, 229, 255, 0.4)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 28 }}>🛡️</div>
          <div style={{ fontSize: 17, fontWeight: 900, color: "#00E5FF", marginTop: 6 }}>REVERSE PROXY</div>
          <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>Infrastructure Gatekeeper</div>
          <div style={{ fontSize: 13, color: "#E2E8F0", marginTop: 8, lineHeight: 1.5 }}>
            • TLS / SSL Termination<br />
            • L4/L7 DDoS Defense<br />
            • Static File CDN Caching<br />
            • Hides Backend IPs
          </div>
        </div>
        <div style={{ fontSize: 12, color: "#00E5FF", fontWeight: 700 }}>NGINX · Envoy · HAProxy</div>
      </div>

      {/* Tier 2: API Gateway */}
      <div style={{ flex: 1, padding: "18px 16px", borderRadius: 16, background: "rgba(16, 185, 129, 0.08)", border: "1.5px solid rgba(16, 185, 129, 0.4)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 28 }}>🧠</div>
          <div style={{ fontSize: 17, fontWeight: 900, color: "#10B981", marginTop: 6 }}>API GATEWAY</div>
          <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>Application Intelligence</div>
          <div style={{ fontSize: 13, color: "#E2E8F0", marginTop: 8, lineHeight: 1.5 }}>
            • JWT Authentication<br />
            • User Rate Limiting<br />
            • Request Fan-Out Merge<br />
            • REST ➔ gRPC Translate
          </div>
        </div>
        <div style={{ fontSize: 12, color: "#10B981", fontWeight: 700 }}>Kong · Spring Cloud · AWS</div>
      </div>
    </div>

    <div style={{ padding: "12px 16px", borderRadius: 12, background: "rgba(0,0,0,0.4)", textAlign: "center", fontSize: 14, color: "#94A3B8" }}>
      Best Practice: <strong style={{ color: "#FFFFFF" }}>Reverse Proxy at Edge ➔ API Gateway for Microservices</strong>
    </div>
  </div>
);

// 8. Scaling 1 to 10M Users
const MonkeyScaleDiagram: React.FC<{ accent: string }> = ({ accent }) => (
  <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 19, fontWeight: 800 }}>Evolutionary Scaling Milestones</span>
      <span style={{ fontSize: 13, color: accent, fontWeight: 800, padding: "5px 12px", borderRadius: 8, background: `${accent}25` }}>
        1 ➔ 10M Users
      </span>
    </div>

    <div style={{ display: "flex", gap: 16, margin: "12px 0", flex: 1 }}>
      {/* Monolith Failure */}
      <div style={{ flex: 1, padding: "22px 18px", borderRadius: 18, background: "rgba(239, 68, 68, 0.08)", border: "1.5px solid rgba(239, 68, 68, 0.35)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 32 }}>💥</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#EF4444", marginTop: 8 }}>Single Node Limit</div>
          <div style={{ fontSize: 13, color: "#FCA5A5", marginTop: 2 }}>10,000 Concurrent Users</div>
          <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 12, lineHeight: 1.5 }}>
            • CPU 100% pegged<br />
            • Disk locks on heavy writes<br />
            • Memory exhaustion crashes
          </div>
        </div>
        <div style={{ padding: "8px 10px", borderRadius: 8, background: "rgba(239, 68, 68, 0.15)", color: "#EF4444", fontSize: 12, fontWeight: 800 }}>
          Single Point of Failure
        </div>
      </div>

      {/* Distributed Architecture */}
      <div style={{ flex: 1.4, padding: "22px 20px", borderRadius: 18, background: `${accent}16`, border: `2.5px solid ${accent}`, display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: `0 0 30px ${accent}25` }}>
        <div>
          <div style={{ fontSize: 32 }}>🚀</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#FFFFFF", marginTop: 8 }}>Distributed Cluster</div>
          <div style={{ fontSize: 13, color: accent, fontWeight: 800, marginTop: 2 }}>10M+ Global Concurrent Users</div>
          <div style={{ fontSize: 13, color: "#E2E8F0", marginTop: 12, lineHeight: 1.5 }}>
            • Cloudflare Edge CDN Caching<br />
            • Autoscaling K8s App Tier<br />
            • DB Read Replicas + Redis Cluster<br />
            • Apache Kafka Async Worker Queues
          </div>
        </div>
        <div style={{ padding: "8px 10px", borderRadius: 8, background: `${accent}30`, color: "#FFFFFF", fontSize: 12, fontWeight: 800 }}>
          Horizontally Scalable Architecture
        </div>
      </div>
    </div>

    <div style={{ padding: "14px 18px", borderRadius: 14, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between" }}>
      <span style={{ fontSize: 14, color: "#94A3B8" }}>Architectural Rule:</span>
      <span style={{ fontSize: 14, fontWeight: 800, color: "#FFFFFF" }}>Keep web nodes stateless, decouple database reads/writes</span>
    </div>
  </div>
);

// 9. Distributed Caching Patterns
const MonkeyCachingDiagram: React.FC<{ accent: string }> = ({ accent }) => (
  <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 19, fontWeight: 800 }}>Cache-Aside & Invalidation Logic</span>
      <span style={{ fontSize: 13, color: accent, fontWeight: 800, padding: "5px 12px", borderRadius: 8, background: `${accent}25` }}>
        Read-Through Pattern
      </span>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: 14, margin: "10px 0", flex: 1, justifyContent: "center" }}>
      <div style={{ padding: "16px 20px", borderRadius: 16, background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span style={{ fontSize: 12, color: accent, fontWeight: 800 }}>STEP 1</span>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#FFFFFF", marginTop: 2 }}>App checks In-Memory Cache for Key</div>
        </div>
        <span style={{ fontSize: 24 }}>🔍</span>
      </div>

      <div style={{ padding: "16px 20px", borderRadius: 16, background: "rgba(16, 185, 129, 0.16)", border: "2px solid #10B981", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span style={{ fontSize: 12, color: "#10B981", fontWeight: 800 }}>STEP 2A: CACHE HIT (98%)</span>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#FFFFFF", marginTop: 2 }}>Return immediately from RAM (0.1ms latency)</div>
        </div>
        <span style={{ fontSize: 24 }}>⚡</span>
      </div>

      <div style={{ padding: "16px 20px", borderRadius: 16, background: "rgba(239, 68, 68, 0.12)", border: "1.5px solid rgba(239, 68, 68, 0.4)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span style={{ fontSize: 12, color: "#EF4444", fontWeight: 800 }}>STEP 2B: CACHE MISS (2%)</span>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#FFFFFF", marginTop: 2 }}>Query Database ➔ Populate Cache with Jittered TTL</div>
        </div>
        <span style={{ fontSize: 24 }}>🔄</span>
      </div>
    </div>

    <div style={{ padding: "14px 18px", borderRadius: 14, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between" }}>
      <span style={{ fontSize: 14, color: "#94A3B8" }}>Eviction Strategy:</span>
      <span style={{ fontSize: 14, fontWeight: 800, color: "#FFFFFF" }}>LRU (Least Recently Used) + Cache Stampede Locks</span>
    </div>
  </div>
);

// 10. Networking Essentials
const NetworkingEssentialsDiagram: React.FC<{ accent: string }> = ({ accent }) => (
  <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 19, fontWeight: 800 }}>Transport Protocols Comparison</span>
      <span style={{ fontSize: 13, color: accent, fontWeight: 800, padding: "5px 12px", borderRadius: 8, background: `${accent}25` }}>
        TCP vs UDP vs QUIC
      </span>
    </div>

    <div style={{ display: "flex", gap: 16, margin: "10px 0", flex: 1 }}>
      {/* TCP */}
      <div style={{ flex: 1, padding: "20px 18px", borderRadius: 18, background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 30 }}>🛡️</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#38BDF8", marginTop: 8 }}>TCP (Reliable)</div>
          <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 2 }}>Connection-oriented byte stream</div>
          <div style={{ fontSize: 13, color: "#E2E8F0", marginTop: 10, lineHeight: 1.5 }}>
            • SYN ➔ SYN-ACK ➔ ACK<br />
            • Guaranteed in-order delivery<br />
            • Congestion window throttle
          </div>
        </div>
        <div style={{ fontSize: 12, color: "#38BDF8", fontWeight: 700 }}>Databases, APIs, File transfer</div>
      </div>

      {/* UDP */}
      <div style={{ flex: 1, padding: "20px 18px", borderRadius: 18, background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 30 }}>⚡</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#F59E0B", marginTop: 8 }}>UDP (Fast)</div>
          <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 2 }}>Connectionless datagrams</div>
          <div style={{ fontSize: 13, color: "#E2E8F0", marginTop: 10, lineHeight: 1.5 }}>
            • Zero handshake overhead<br />
            • Fire & forget packet delivery<br />
            • No head-of-line blocking
          </div>
        </div>
        <div style={{ fontSize: 12, color: "#F59E0B", fontWeight: 700 }}>Live Video, Voice, DNS, Games</div>
      </div>
    </div>

    {/* HTTP/3 QUIC */}
    <div style={{ padding: "16px 20px", borderRadius: 16, background: `${accent}18`, border: `2px solid ${accent}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <div style={{ fontSize: 16, fontWeight: 900, color: "#FFFFFF" }}>HTTP/3 over UDP (QUIC)</div>
        <div style={{ fontSize: 13, color: accent, marginTop: 2 }}>Zero Head-of-line blocking • 0-RTT Connection Resumption</div>
      </div>
      <span style={{ fontSize: 26 }}>🚀</span>
    </div>
  </div>
);
