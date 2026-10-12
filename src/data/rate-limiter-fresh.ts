import { ReelData } from "./types";

/**
 * Fresh Progressive Rate Limiter Reel
 * Concept: Progressive architecture disclosure with light black background,
 * single question hook, and dynamic data-flow through thinking orbs & dotted lines.
 */
export const rateLimiterFreshData: ReelData = {
  id: "rate-limiter-fresh",
  title: "How to Handle 100,000 Requests/sec Without Crashing",
  hashtags: [
    "#SystemDesign",
    "#RateLimiter",
    "#BackendEngineering",
    "#DistributedSystems",
    "#SoftwareEngineering",
    "#Stripe",
    "#CodingInterview",
  ],
  fps: 30,
  width: 1080,
  height: 1920,
  scenes: [
    {
      id: "rlf-act1-question",
      type: "hook",
      durationInSeconds: 5.8,
      narrationFile: "audio/rate-limiter-fresh-hook.mp3",
      title: "The Single Question",
      visual: {
        type: "rate_limiter_fresh" as any,
        config: { act: "question" },
      },
    },
    {
      id: "rlf-act2-problem",
      type: "problem",
      durationInSeconds: 10.2,
      narrationFile: "audio/rate-limiter-fresh-problem.mp3",
      title: "The Meltdown",
      visual: {
        type: "rate_limiter_fresh" as any,
        config: { act: "problem" },
      },
    },
    {
      id: "rlf-act3-solution",
      type: "solution",
      durationInSeconds: 9.8,
      narrationFile: "audio/rate-limiter-fresh-solution.mp3",
      title: "Introducing Token Bucket",
      visual: {
        type: "rate_limiter_fresh" as any,
        config: { act: "solution" },
      },
    },
    {
      id: "rlf-act4-burst",
      type: "solution",
      durationInSeconds: 13.2,
      narrationFile: "audio/rate-limiter-fresh-burst.mp3",
      title: "Burst vs HTTP 429",
      visual: {
        type: "rate_limiter_fresh" as any,
        config: { act: "burst" },
      },
    },
    {
      id: "rlf-act5-takeaway",
      type: "realworld",
      durationInSeconds: 11.2,
      narrationFile: "audio/rate-limiter-fresh-takeaway.mp3",
      title: "Production Scale with Redis Lua",
      visual: {
        type: "rate_limiter_fresh" as any,
        config: { act: "takeaway" },
      },
    },
  ],
};

export default rateLimiterFreshData;

