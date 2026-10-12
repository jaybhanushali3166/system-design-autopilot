import { ReelData } from "./types";

const monkeyScaleData: ReelData = {
  id: "monkey-scale",
  title: "BananaNow: The Story of Monkey Scaling to 1M Users",
  hashtags: [
    "systemdesign",
    "softwareengineering",
    "devops",
    "backend",
    "loadbalancer",
    "redis",
    "kafka",
    "coding",
    "webdev",
  ],
  fps: 30,
  width: 1080,
  height: 1920,
  scenes: [
    // ── ACT 1: LOCALHOST & 2 USERS (32.64s = 979 frames) ────────────────────
    {
      id: "act-1-intro",
      type: "hook",
      durationInSeconds: 32.64,
      narrationFile: "audio/monkey-scale-act1-intro.mp3",
      title: "BANANANOW IS BORN 🍌",
      subtitle: "Meet Monkey: The Solo Laptop Founder",
      visual: {
        type: "monkey_story",
        config: {
          act: 1,
          badge: "Episode 1: The Localhost Dream",
          title: "BananaNow: 10-Min Delivery",
          subtitle: "2 Users, 1 Kitchen, 1 Happy Monkey",
        },
      },
    },

    // ── ACT 2: VIRAL TWEET & MELTDOWN (36.82s = 1104 frames) ────────────────
    {
      id: "act-2-panic",
      type: "problem",
      durationInSeconds: 36.82,
      narrationFile: "audio/monkey-scale-act2-panic.mp3",
      title: "THE 2 AM DISASTER 🔥",
      subtitle: "100,000 Users Crash The Monolith",
      visual: {
        type: "monkey_story",
        config: {
          act: 2,
          badge: "Episode 2: The Viral Tweet Catastrophe",
          title: "100k Chimps Rush The App 🔥",
          subtitle: "Single Server Melts Down into Banana Smoothie",
        },
      },
    },

    // ── ACT 3: THE 3 BANANA HACKS (67.10s = 2013 frames) ────────────────────
    {
      id: "act-3-hacks",
      type: "solution",
      durationInSeconds: 67.10,
      narrationFile: "audio/monkey-scale-act3-hacks.mp3",
      title: "THE 3 BANANA HACKS ⚡",
      subtitle: "Traffic Cop + Snack Counter + Ticket Line",
      visual: {
        type: "monkey_story",
        config: {
          act: 3,
          badge: "Episode 3: The Architectural Cure",
          title: "The 3 Golden Rules of Scale",
          subtitle: "Load Balancer + Redis Cache + Message Queue",
        },
      },
    },

    // ── ACT 4: THE ZEN TECH LEAD (39.72s = 1192 frames) ────────────────────
    {
      id: "act-4-zen",
      type: "realworld",
      durationInSeconds: 39.72,
      narrationFile: "audio/monkey-scale-act4-zen.mp3",
      title: "THE ZEN TECH LEAD 🏖️",
      subtitle: "1 Million Orders & Beach Retirement",
      visual: {
        type: "monkey_story",
        config: {
          act: 4,
          badge: "Episode 4: The Senior Takeaway",
          title: "Never Peel Bananas Alone",
          subtitle: "How Senior Devs Scale Systems Without Stress",
        },
      },
    },
  ],
};

export { monkeyScaleData };
export default monkeyScaleData;
