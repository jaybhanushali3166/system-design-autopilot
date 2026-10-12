import { ReelData } from "./types";

/**
 * Rate Limiter — Fundamental System Design Reel
 * Durations synced to neural voiceovers (+10% rate, en-US-AndrewMultilingualNeural):
 * - hook: 12.38s -> 12.8s (~384 frames)
 * - problem: 16.82s -> 17.2s (~516 frames)
 * - solution: 23.26s -> 23.8s (~714 frames)
 * - algorithms: 22.15s -> 22.6s (~678 frames)
 * - realworld: 19.68s -> 20.2s (~606 frames)
 * Total duration: ~96.6s (2898 frames @ 30fps)
 */

export const rateLimiterData: ReelData = {
  id: "rate-limiter",
  title: "Rate Limiter: Token Bucket, Leaky Bucket & Redis",
  hashtags: [
    "#SystemDesign",
    "#RateLimiter",
    "#DistributedSystems",
    "#TokenBucket",
    "#Redis",
    "#BackendEngineering",
    "#CodingInterview",
  ],
  fps: 30,
  width: 1080,
  height: 1920,
  scenes: [
    {
      id: "rate-limiter-act1-hook",
      type: "hook",
      durationInSeconds: 12.8,
      narrationFile: "audio/rate-limiter-hook.mp3",
      title: "1,000,000 Requests in 10s",
      subtitle: "Why rate limiting saves your cluster",
      visual: {
        type: "rate_limiter",
        config: { act: "hook" },
      },
    },
    {
      id: "rate-limiter-act2-problem",
      type: "problem",
      durationInSeconds: 17.2,
      narrationFile: "audio/rate-limiter-problem.mp3",
      title: "Cascading Server Meltdown",
      subtitle: "Thread starvation & 504 Timeouts",
      visual: {
        type: "rate_limiter",
        config: { act: "problem" },
      },
    },
    {
      id: "rate-limiter-act3-solution",
      type: "solution",
      durationInSeconds: 23.8,
      narrationFile: "audio/rate-limiter-solution.mp3",
      title: "The Token Bucket Algorithm",
      subtitle: "Refill rate, capacity, and HTTP 429",
      visual: {
        type: "rate_limiter",
        config: { act: "solution" },
      },
    },
    {
      id: "rate-limiter-act4-algorithms",
      type: "solution",
      durationInSeconds: 22.6,
      narrationFile: "audio/rate-limiter-algorithms.mp3",
      title: "The 4 Core Algorithms Compared",
      subtitle: "Token vs Leaky vs Fixed vs Sliding Window",
      visual: {
        type: "rate_limiter",
        config: { act: "algorithms" },
      },
    },
    {
      id: "rate-limiter-act5-realworld",
      type: "realworld",
      durationInSeconds: 20.2,
      narrationFile: "audio/rate-limiter-realworld.mp3",
      title: "Distributed Rate Limiting at Scale",
      subtitle: "Redis Lua scripts & Stripe/Cloudflare design",
      visual: {
        type: "rate_limiter",
        config: { act: "realworld" },
      },
    },
  ],
};

export default rateLimiterData;
