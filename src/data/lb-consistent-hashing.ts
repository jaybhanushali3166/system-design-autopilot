import { ReelData } from "./types";

// Part 5 (Bonus Edition): Consistent Hashing & Virtual Nodes
// Audio durations (AndrewMultilingualNeural, +12% rate):
// hook: ~10.22s | problem: ~20.26s | solution: ~23.54s | realworld: ~15.31s
// Total runtime: ~70.8s (2124 frames @ 30fps)

const lbConsistentHashingReel: ReelData = {
  id: "lb-consistent-hashing",
  title: "Part 5: Consistent Hashing (Bonus Edition)",
  hashtags: ["#SystemDesign", "#ConsistentHashing", "#DistributedSystems", "#SDEPrep", "#TechInterview", "#Backend"],
  fps: 30,
  width: 1080,
  height: 1920,
  scenes: [
    {
      id: "hook",
      type: "hook",
      durationInSeconds: 10.6,
      narrationFile: "audio/lb-consistent-hashing-hook.mp3",
      title: "The 10x Interview Bonus",
      subtitle: "Add 1 server & crash everything? 🤯",
      visual: { type: "consistent_hashing" },
    },
    {
      id: "problem",
      type: "problem",
      durationInSeconds: 20.6,
      narrationFile: "audio/lb-consistent-hashing-problem.mp3",
      title: "The Problem",
      subtitle: "Naive Hashing & Cache Avalanche",
      visual: { type: "consistent_hashing" },
    },
    {
      id: "solution",
      type: "solution",
      durationInSeconds: 24.0,
      narrationFile: "audio/lb-consistent-hashing-solution.mp3",
      title: "Consistent Hashing Ring",
      subtitle: "Virtual Nodes & Minimal Key Movement",
      visual: { type: "consistent_hashing" },
    },
    {
      id: "realworld",
      type: "realworld",
      durationInSeconds: 15.6,
      narrationFile: "audio/lb-consistent-hashing-realworld.mp3",
      title: "The Senior Architect Level",
      visual: { type: "consistent_hashing" },
    },
  ],
};

export default lbConsistentHashingReel;

