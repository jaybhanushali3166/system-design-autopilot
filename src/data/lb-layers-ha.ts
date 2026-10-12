import { ReelData } from "./types";

// Part 3: Layer 4 vs Layer 7 & High Availability
// Audio durations (AndrewMultilingualNeural, +12% rate):
// hook: ~10.94s | problem: ~13.82s | solution: ~24.67s | realworld: ~13.75s
// Total runtime: ~63.2s

const lbLayersHAReel: ReelData = {
  id: "lb-layers-ha",
  title: "Part 3: L4 vs L7 & Who Balances the Balancer?",
  hashtags: ["#SystemDesign", "#HighAvailability", "#SoftwareArchitecture", "#SDEPrep", "#CloudComputing"],
  fps: 30,
  width: 1080,
  height: 1920,
  scenes: [
    {
      id: "hook",
      type: "hook",
      durationInSeconds: 11.2,
      narrationFile: "audio/lb-l4l7-hook.mp3",
      title: "The Senior Interview Trap",
      subtitle: "What if the balancer dies? \uD83D\uDC80",
      bodyText: ["Silence in the interview room... \uD83D\uDC40"],
    },
    {
      id: "problem",
      type: "problem",
      durationInSeconds: 14.2,
      narrationFile: "audio/lb-l4l7-problem.mp3",
      title: "The Problem",
      subtitle: "Single Point of Failure + Layer Confusion",
      stressStartFrame: 190,
      bodyTextFrames: [80, 210, 320],
      nodes: [
        { id: "u1", label: "Client 1", type: "client", x: 12, y: 22, emoji: "\uD83D\uDC64", appearAt: 0 },
        { id: "u2", label: "Client 2", type: "client", x: 12, y: 40, emoji: "\uD83D\uDC64", appearAt: 10 },
        { id: "u3", label: "Client 3", type: "client", x: 12, y: 58, emoji: "\uD83D\uDC64", appearAt: 20 },
        { id: "u4", label: "Client 4", type: "client", x: 12, y: 76, emoji: "\uD83D\uDC64", appearAt: 30 },
        { id: "lb", label: "Solo Balancer \uD83D\uDCA5", type: "loadbalancer", x: 76, y: 49, emoji: "\u2696\uFE0F", appearAt: 35 },
      ],
      edges: [
        { from: "u1", to: "lb", color: "#FF6B6B", drawAt: 45 },
        { from: "u2", to: "lb", color: "#FF6B6B", drawAt: 55 },
        { from: "u3", to: "lb", color: "#FF6B6B", drawAt: 65 },
        { from: "u4", to: "lb", color: "#FF6B6B", drawAt: 75 },
      ],
      stressNodeId: "lb",
      bodyText: [
        "\u26A0\uFE0F Single point of failure simply moved one tier up",
        "\uD83E\uDDE0 Layer 7 inspects every cookie & header \u2014 CPU heavy",
        "\uD83D\uDCA5 Balancer dies \u2192 entire company infrastructure goes dark",
      ],
    },
    {
      id: "solution",
      type: "solution",
      durationInSeconds: 25.0,
      narrationFile: "audio/lb-l4l7-solution.mp3",
      title: "L4 vs L7 + Active-Passive Pair",
      subtitle: "Line-Speed Routing & Zero Downtime Failover",
      bodyTextFrames: [100, 270, 460, 600],
      nodes: [
        { id: "u1", label: "Client A", type: "client", x: 6, y: 30, emoji: "\uD83D\uDC64", appearAt: 0 },
        { id: "u2", label: "Client B", type: "client", x: 6, y: 65, emoji: "\uD83D\uDC64", appearAt: 12 },
        { id: "lb_act", label: "Active LB \u2705", type: "loadbalancer", x: 44, y: 32, emoji: "\uD83D\uDFE2", appearAt: 30 },
        { id: "lb_pas", label: "Standby LB \uD83D\uDEE1\uFE0F", type: "loadbalancer", x: 44, y: 68, emoji: "\uD83D\uDFE1", appearAt: 45 },
        { id: "s1", label: "L4 Fast TCP", type: "server", x: 82, y: 26, emoji: "\u26A1", appearAt: 75 },
        { id: "s2", label: "L7 /api Pool", type: "server", x: 82, y: 49, emoji: "\uD83C\uDF10", appearAt: 88 },
        { id: "s3", label: "L7 /video Pool", type: "server", x: 82, y: 72, emoji: "\uD83C\uDFAC", appearAt: 100 },
      ],
      edges: [
        { from: "u1", to: "lb_act", color: "#4ECDC4", drawAt: 45, packetDelay: 15 },
        { from: "u2", to: "lb_act", color: "#4ECDC4", drawAt: 55, packetDelay: 15 },
        { from: "lb_act", to: "lb_pas", color: "#C7ACFF", drawAt: 70, packetDelay: 20 },
        { from: "lb_act", to: "s1", color: "#45B7D1", drawAt: 110, packetDelay: 15 },
        { from: "lb_act", to: "s2", color: "#96CEB4", drawAt: 122, packetDelay: 15 },
        { from: "lb_act", to: "s3", color: "#FFEAA7", drawAt: 134, packetDelay: 15 },
      ],
      highlightNodeId: "lb_act",
      bodyText: [
        "\u26A1 Layer 4 (NLB): Raw TCP line-speed, millions of packets/sec",
        "\uD83E\uDDE0 Layer 7 (ALB): Smart routing by path (/api vs /video)",
        "\uD83D\uDD04 Active-Passive Pair: VRRP heartbeat with Floating Virtual IP",
        "\uD83D\uDEE1\uFE0F Active dies? Standby claims Virtual IP in milliseconds",
      ],
    },
    {
      id: "realworld",
      type: "realworld",
      durationInSeconds: 14.0,
      narrationFile: "audio/lb-l4l7-realworld.mp3",
      title: "The Battle-Tested Architecture",
      companies: ["Cloudflare", "AWS", "Netflix", "Google"],
      metrics: [
        "Global Edge: Anycast DNS routing to closest region",
        "Cluster Edge: L4 for raw throughput \u2022 L7 for microservices",
      ],
      bodyText: ["True 99.999% Five-Nines High Availability \u2705"],
    },
  ],
};

export default lbLayersHAReel;
