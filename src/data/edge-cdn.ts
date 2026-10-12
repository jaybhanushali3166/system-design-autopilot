import { ReelData } from "./types";

export const edgeCdnData: ReelData = {
  id: "edge-cdn",
  title: "CDN & Edge Networks — How Continents Vanish in 40ms",
  hashtags: [
    "systemdesign",
    "cdn",
    "cloudcomputing",
    "softwareengineering",
    "backend",
    "codinginterview",
    "networking",
    "webdev",
    "beyondlocalhost",
  ],
  fps: 30,
  width: 1080,
  height: 1920,

  scenes: [
    {
      id: "edge-cdn-act1-hook",
      type: "hook",
      durationInSeconds: 14.52,
      narrationFile: "audio/edge-cdn-hook.mp3",
      title: "The Hook",
      visual: {
        type: "edge_cdn" as any,
        config: { act: "hook" },
      },
    },
    {
      id: "edge-cdn-act2-problem",
      type: "problem",
      durationInSeconds: 25.08,
      narrationFile: "audio/edge-cdn-problem.mp3",
      title: "The Problem",
      visual: {
        type: "edge_cdn" as any,
        config: { act: "problem" },
      },
    },
    {
      id: "edge-cdn-act3-solution",
      type: "solution",
      durationInSeconds: 24.77,
      narrationFile: "audio/edge-cdn-solution.mp3",
      title: "The Solution",
      visual: {
        type: "edge_cdn" as any,
        config: { act: "solution" },
      },
    },
    {
      id: "edge-cdn-act4-depth",
      type: "realworld",
      durationInSeconds: 30.19,
      narrationFile: "audio/edge-cdn-depth.mp3",
      title: "Architect Depth",
      visual: {
        type: "edge_cdn" as any,
        config: { act: "depth" },
      },
    },
    {
      id: "edge-cdn-act5-interview",
      type: "realworld",
      durationInSeconds: 20.59,
      narrationFile: "audio/edge-cdn-interview.mp3",
      title: "Interview Cheat Sheet",
      visual: {
        type: "edge_cdn" as any,
        config: { act: "interview" },
      },
    },
  ],
};

export default edgeCdnData;

