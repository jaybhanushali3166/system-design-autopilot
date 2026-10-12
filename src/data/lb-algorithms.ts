import { ReelData } from "./types";

// Part 2: Load Balancing Algorithms
// Audio durations (AndrewMultilingualNeural, +12% rate):
// hook: ~9.74s | problem: ~18.67s | solution: ~21.00s | realworld: ~12.24s
// Total runtime: ~61.6s

const lbAlgorithmsReel: ReelData = {
  id: "lb-algorithms",
  title: "Part 2: Which Load Balancing Algorithm to Pick?",
  hashtags: ["#SystemDesign", "#SoftwareEngineering", "#LoadBalancer", "#TechInterview", "#DevCommunity"],
  fps: 30,
  width: 1080,
  height: 1920,
  scenes: [
    {
      id: "hook",
      type: "hook",
      durationInSeconds: 10.0,
      narrationFile: "audio/lb-algo-hook.mp3",
      title: "The Checkout Lane Trap",
      subtitle: "Picked the slowest line again?",
      bodyText: ["That\u2019s what happens with the wrong balancing algorithm. \uD83D\uDED2"],
    },
    {
      id: "problem",
      type: "problem",
      durationInSeconds: 19.0,
      narrationFile: "audio/lb-algo-problem.mp3",
      title: "The Problem",
      subtitle: "Round Robin is Blind to Workload",
      stressStartFrame: 260,
      bodyTextFrames: [100, 240, 390],
      nodes: [
        { id: "u1", label: "2KB Ping", type: "client", x: 12, y: 22, emoji: "\uD83D\uDC64", appearAt: 0 },
        { id: "u2", label: "4K Video Render", type: "client", x: 12, y: 40, emoji: "\uD83D\uDD25", appearAt: 10 },
        { id: "u3", label: "2KB Ping", type: "client", x: 12, y: 58, emoji: "\uD83D\uDC64", appearAt: 20 },
        { id: "u4", label: "Heavy Compute", type: "client", x: 12, y: 76, emoji: "\uD83D\uDD25", appearAt: 30 },
        { id: "server", label: "Overwhelmed Server", type: "server", x: 76, y: 49, emoji: "\uD83D\uDDA5\uFE0F", appearAt: 35 },
      ],
      edges: [
        { from: "u1", to: "server", color: "#4ECDC4", drawAt: 45 },
        { from: "u2", to: "server", color: "#FF6B6B", drawAt: 60 },
        { from: "u3", to: "server", color: "#4ECDC4", drawAt: 75 },
        { from: "u4", to: "server", color: "#FF6B6B", drawAt: 90 },
      ],
      stressNodeId: "server",
      bodyText: [
        "\uD83D\uDD04 Round Robin assumes all requests are identical",
        "\uD83D\uDCC1 2KB JSON fetch vs \uD83C\uDFAC 4K video render",
        "\uD83D\uDCA5 One server melts down while others sit idle at 2% CPU",
      ],
    },
    {
      id: "solution",
      type: "solution",
      durationInSeconds: 21.5,
      narrationFile: "audio/lb-algo-solution.mp3",
      title: "Match Algorithm to Workload",
      subtitle: "Least Connections \u2022 IP Hash \u2022 Weighted",
      bodyTextFrames: [110, 260, 390, 510],
      nodes: [
        { id: "u1", label: "Client A", type: "client", x: 6, y: 22, emoji: "\uD83D\uDC64", appearAt: 0 },
        { id: "u2", label: "Client B", type: "client", x: 6, y: 40, emoji: "\uD83D\uDC64", appearAt: 8 },
        { id: "u3", label: "Client C", type: "client", x: 6, y: 58, emoji: "\uD83D\uDC64", appearAt: 16 },
        { id: "u4", label: "Client D", type: "client", x: 6, y: 76, emoji: "\uD83D\uDC64", appearAt: 24 },
        { id: "lb", label: "Smart Balancer", type: "loadbalancer", x: 44, y: 49, emoji: "\uD83E\uDDE0", appearAt: 35 },
        { id: "s1", label: "Least Conn", type: "server", x: 82, y: 26, emoji: "\u26A1", appearAt: 75 },
        { id: "s2", label: "IP Hashed", type: "server", x: 82, y: 49, emoji: "\uD83C\uDFAF", appearAt: 88 },
        { id: "s3", label: "Weighted Node", type: "server", x: 82, y: 72, emoji: "\u2696\uFE0F", appearAt: 100 },
      ],
      edges: [
        { from: "u1", to: "lb", color: "#4ECDC4", drawAt: 45, packetDelay: 15 },
        { from: "u2", to: "lb", color: "#4ECDC4", drawAt: 55, packetDelay: 15 },
        { from: "u3", to: "lb", color: "#4ECDC4", drawAt: 65, packetDelay: 15 },
        { from: "u4", to: "lb", color: "#4ECDC4", drawAt: 75, packetDelay: 15 },
        { from: "lb", to: "s1", color: "#45B7D1", drawAt: 110, packetDelay: 15 },
        { from: "lb", to: "s2", color: "#96CEB4", drawAt: 122, packetDelay: 15 },
        { from: "lb", to: "s3", color: "#FFEAA7", drawAt: 134, packetDelay: 15 },
      ],
      highlightNodeId: "lb",
      bodyText: [
        "\u26A1 Least Connections: Best for WebSockets & long streams",
        "\uD83C\uDFAF IP Hashing: Sticky sessions & cache affinity",
        "\u2696\uFE0F Weighted Round Robin: Unequal server hardware",
        "\uD83C\uDFC6 Senior Rule: Always match algorithm to request nature",
      ],
    },
    {
      id: "realworld",
      type: "realworld",
      durationInSeconds: 12.5,
      narrationFile: "audio/lb-algo-realworld.mp3",
      title: "How to Ace the Interview",
      companies: ["AWS ALB", "NGINX", "HAProxy", "Envoy"],
      metrics: [
        "Never just say 'Load Balancer' in your design",
        "Specify the algorithm to prove senior-level depth",
      ],
      bodyText: ["Round Robin \u2022 Least Conn \u2022 Weighted \u2022 IP Hash"],
    },
  ],
};

export default lbAlgorithmsReel;
