import { ReelData } from "./types";

// Audio durations (AndrewMultilingualNeural, +12% rate):
// hook: ~10.75s | problem: ~15.05s | solution: ~20.38s | realworld: ~12.34s
// Total runtime: ~58.5s

const loadBalancerReel: ReelData = {
  id: "load-balancer",
  title: "What is a Load Balancer?",
  hashtags: ["#SystemDesign", "#SoftwareEngineering", "#Architecture", "#DevLife", "#Backend"],
  fps: 30,
  width: 1080,
  height: 1920,
  scenes: [
    {
      id: "hook",
      type: "hook",
      durationInSeconds: 11.0,
      narrationFile: "audio/lb-hook.mp3",
      title: "Netflix vs Expense Portal",
      subtitle: "250M users streaming. Zero crashes.",
      bodyText: ["Why does your internal portal die at 3 users? \uD83D\uDC40"],
    },
    {
      id: "problem",
      type: "problem",
      durationInSeconds: 15.5,
      narrationFile: "audio/lb-problem.mp3",
      title: "The Naive Setup",
      subtitle: "One Server Handling All Requests",
      stressStartFrame: 180,
      bodyTextFrames: [110, 205, 320],
      nodes: [
        { id: "u1", label: "User 1", type: "client", x: 12, y: 22, emoji: "\uD83D\uDC64", appearAt: 0 },
        { id: "u2", label: "User 2", type: "client", x: 12, y: 40, emoji: "\uD83D\uDC64", appearAt: 10 },
        { id: "u3", label: "User 3", type: "client", x: 12, y: 58, emoji: "\uD83D\uDC64", appearAt: 20 },
        { id: "u4", label: "User 4", type: "client", x: 12, y: 76, emoji: "\uD83D\uDC64", appearAt: 30 },
        { id: "server", label: "Single Server \u26A0\uFE0F", type: "server", x: 76, y: 49, emoji: "\uD83D\uDDA5\uFE0F", appearAt: 35 },
      ],
      edges: [
        { from: "u1", to: "server", color: "#FF6B6B", drawAt: 45 },
        { from: "u2", to: "server", color: "#FF6B6B", drawAt: 55 },
        { from: "u3", to: "server", color: "#FF6B6B", drawAt: 65 },
        { from: "u4", to: "server", color: "#FF6B6B", drawAt: 75 },
      ],
      stressNodeId: "server",
      bodyText: [
        "\u2615 Works smoothly on localhost...",
        "\u26A0\uFE0F Requests queue up \u2022 CPU throttles",
        "\uD83D\uDCA5 Single Point of Failure \u2192 Total Outage",
      ],
    },
    {
      id: "solution",
      type: "solution",
      durationInSeconds: 20.8,
      narrationFile: "audio/lb-solution.mp3",
      title: "The Load Balancer",
      subtitle: "Intelligent Traffic Distribution at the Edge",
      bodyTextFrames: [130, 265, 385, 510],
      nodes: [
        { id: "u1", label: "User 1", type: "client", x: 6, y: 22, emoji: "\uD83D\uDC64", appearAt: 0 },
        { id: "u2", label: "User 2", type: "client", x: 6, y: 40, emoji: "\uD83D\uDC64", appearAt: 8 },
        { id: "u3", label: "User 3", type: "client", x: 6, y: 58, emoji: "\uD83D\uDC64", appearAt: 16 },
        { id: "u4", label: "User 4", type: "client", x: 6, y: 76, emoji: "\uD83D\uDC64", appearAt: 24 },
        { id: "lb", label: "Load Balancer \u2696\uFE0F", type: "loadbalancer", x: 44, y: 49, emoji: "\uD83D\uDD00", appearAt: 35 },
        { id: "s1", label: "Server Node 1", type: "server", x: 82, y: 26, emoji: "\uD83D\uDDA5\uFE0F", appearAt: 75 },
        { id: "s2", label: "Server Node 2", type: "server", x: 82, y: 49, emoji: "\uD83D\uDDA5\uFE0F", appearAt: 88 },
        { id: "s3", label: "Server Node 3", type: "server", x: 82, y: 72, emoji: "\uD83D\uDDA5\uFE0F", appearAt: 100 },
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
        "\uD83D\uDD00 Round Robin & Least Connections routing",
        "\uD83D\uDEE1\uFE0F Node dies? Sub-second automatic failover",
        "\uD83D\uDE80 Horizontal scale: spin up instances on demand",
        "\u2705 Zero downtime \u2022 No single point of failure",
      ],
    },
    {
      id: "realworld",
      type: "realworld",
      durationInSeconds: 12.8,
      narrationFile: "audio/lb-realworld.mp3",
      title: "Resilient High-Scale Systems",
      companies: ["Netflix", "Stripe", "AWS", "Cloudflare"],
      metrics: [
        "Millions of concurrent requests handled smoothly",
        "Sub-millisecond routing overhead & health checks",
      ],
      bodyText: ["NGINX \u2022 HAProxy \u2022 AWS ALB \u2022 Envoy"],
    },
  ],
};

export default loadBalancerReel;
