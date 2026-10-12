import { ReelData } from "./types";

export const httpVersionsData: ReelData = {
  id: "http-versions",
  title: "HTTP/1.1 vs HTTP/2 vs HTTP/3 — Head-of-Line Blocking Explained",
  hashtags: [
    "systemdesign",
    "networking",
    "http",
    "backend",
    "webdev",
    "softwareengineering",
    "quic",
    "beyondlocalhost",
  ],
  fps: 30,
  width: 1080,
  height: 1920,

  scenes: [
    {
      id: "http-versions-act1-hook",
      type: "hook",
      durationInSeconds: 13.66,
      narrationFile: "audio/http-versions-act1-hook.mp3",
      title: "The Head-of-Line Bottleneck",
      visual: {
        type: "http_versions" as any,
        config: { act: "hook" },
      },
    },
    {
      id: "http-versions-act2-http1",
      type: "problem",
      durationInSeconds: 18.50,
      narrationFile: "audio/http-versions-act2-http1.mp3",
      title: "HTTP/1.1: Request Blocking",
      visual: {
        type: "http_versions" as any,
        config: { act: "http1" },
      },
    },
    {
      id: "http-versions-act3-http2",
      type: "problem",
      durationInSeconds: 18.43,
      narrationFile: "audio/http-versions-act3-http2.mp3",
      title: "HTTP/2: Stream Multiplexing",
      visual: {
        type: "http_versions" as any,
        config: { act: "http2" },
      },
    },
    {
      id: "http-versions-act4-http3",
      type: "problem",
      durationInSeconds: 16.22,
      narrationFile: "audio/http-versions-act4-http3.mp3",
      title: "The TCP Flaw",
      visual: {
        type: "http_versions" as any,
        config: { act: "http3" },
      },
    },
    {
      id: "http-versions-act5-quic",
      type: "solution",
      durationInSeconds: 22.80,
      narrationFile: "audio/http-versions-act5-quic.mp3",
      title: "HTTP/3: QUIC over UDP",
      visual: {
        type: "http_versions" as any,
        config: { act: "quic" },
      },
    },
    {
      id: "http-versions-act6-takeaway",
      type: "realworld",
      durationInSeconds: 19.10,
      narrationFile: "audio/http-versions-act6-takeaway.mp3",
      title: "Senior SDE Cheat Sheet",
      visual: {
        type: "http_versions" as any,
        config: { act: "takeaway" },
      },
    },
  ],
};

export default httpVersionsData;
