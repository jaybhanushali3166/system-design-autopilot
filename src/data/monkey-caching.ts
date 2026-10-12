import { ReelData } from "./types";

/**
 * 65-Second System Design Reel: Caching & Redis Explained Through Monkey Logic
 * Tone: Engaging, story-driven, curious, with an authentic Senior Interview Gold Nugget.
 * Aesthetics: #FDFBF7 off-white, minimal 2D vector style, Inter font family.
 */
export const monkeyCachingData: ReelData = {
  id: "monkey-caching",
  title: "Why Without Caching, Your Server Melts in the Banana Mines",
  hashtags: [
    "systemdesign",
    "caching",
    "redis",
    "softwareengineering",
    "backend",
    "codinginterview",
    "faang",
    "webdev",
  ],
  fps: 30,
  width: 1080,
  height: 1920,
  scenes: [
    // ── ACT 1: THE CURIOSITY HOOK (9.67s = 290 frames) ──
    {
      id: "act-1-hook",
      type: "hook",
      durationInSeconds: 9.67,
      narrationFile: "audio/caching-v2-act1-hook.mp3",
      title: "The 10,000 Monkey Surge",
      subtitle: "Why does the same request destroy a database?",
      visual: {
        type: "minimal_monkey",
        config: {
          badge: "Curiosity Hook",
          headlineNormal: "The Banana Stand &",
          headlineHighlight: "10,000 Screaming Chimps",
          subtitle: "What happens when thousands demand the exact same ripe banana at once?",
          stage: "hook",
        },
      },
    },

    // ── ACT 2: THE BOTTLENECK - DISK MINES & LATENCY MATH (17.74s = 532 frames) ──
    {
      id: "act-2-problem",
      type: "problem",
      durationInSeconds: 17.74,
      narrationFile: "audio/caching-v2-act2-problem.mp3",
      title: "Torture in the Disk Mines",
      subtitle: "The brutal physics of Disk I/O vs Memory",
      visual: {
        type: "minimal_monkey",
        config: {
          badge: "The Architecture Bottleneck",
          headlineNormal: "Torture in the",
          headlineHighlight: "Spinning Disk Mines",
          subtitle: "Disk reads take 200ms—that's 100,000x slower than RAM!",
          stage: "problem",
        },
      },
    },

    // ── ACT 3: THE CURE - REDIS & CACHE-ASIDE PATTERN (20.23s = 607 frames) ──
    {
      id: "act-3-solution",
      type: "solution",
      durationInSeconds: 20.23,
      narrationFile: "audio/caching-v2-act3-solution.mp3",
      title: "Enter Redis: High-Speed Conveyor Belt",
      subtitle: "80/20 Pareto Rule & Cache-Aside Implementation",
      visual: {
        type: "minimal_monkey",
        config: {
          badge: "The Architectural Fix",
          headlineNormal: "The High-Speed Conveyor Belt:",
          headlineHighlight: "Redis Cache in RAM",
          subtitle: "80% of traffic wants the top 20% of bananas. Serve in <1ms!",
          stage: "solution",
        },
      },
    },

    // ── ACT 4: THE INTERVIEW GOLD NUGGET (16.46s = 494 frames) ──
    {
      id: "act-4-interview",
      type: "realworld",
      durationInSeconds: 16.46,
      narrationFile: "audio/caching-v2-act4-interview.mp3",
      title: "The Senior Interview Nugget",
      subtitle: "LRU Eviction Policy & Cache Invalidation",
      visual: {
        type: "minimal_monkey",
        config: {
          badge: "Interview Gold Nugget 🏆",
          headlineNormal: "How to Answer in",
          headlineHighlight: "System Design Interviews",
          subtitle: "Never just say 'Add Redis'. Mention LRU Eviction & Smart TTLs!",
          stage: "outro",
        },
      },
    },
  ],
};

export default monkeyCachingData;
