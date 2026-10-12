import { ReelData } from "./types";

export const realtimeProtocolsData: ReelData = {
  id: "realtime-protocols",
  title: "Real-Time Protocols — Polling vs SSE vs WebSockets",
  hashtags: [
    "systemdesign",
    "networking",
    "websockets",
    "sse",
    "backend",
    "softwareengineering",
    "webdev",
    "beyondlocalhost",
  ],
  fps: 30,
  width: 1080,
  height: 1920,

  scenes: [
    {
      id: "realtime-protocols-act1-hook",
      type: "hook",
      durationInSeconds: 11.88,
      narrationFile: "audio/realtime-protocols-act1-hook.mp3",
      title: "The Real-Time Telemetry Mystery",
      visual: {
        type: "realtime_protocols" as any,
        config: { act: "hook" },
      },
    },
    {
      id: "realtime-protocols-act2-polling",
      type: "problem",
      durationInSeconds: 16.58,
      narrationFile: "audio/realtime-protocols-act2-polling.mp3",
      title: "Short Polling: Header Waste",
      visual: {
        type: "realtime_protocols" as any,
        config: { act: "polling" },
      },
    },
    {
      id: "realtime-protocols-act3-sse",
      type: "solution",
      durationInSeconds: 18.65,
      narrationFile: "audio/realtime-protocols-act3-sse.mp3",
      title: "Server-Sent Events (SSE)",
      visual: {
        type: "realtime_protocols" as any,
        config: { act: "sse" },
      },
    },
    {
      id: "realtime-protocols-act4-websockets",
      type: "solution",
      durationInSeconds: 20.21,
      narrationFile: "audio/realtime-protocols-act4-websockets.mp3",
      title: "WebSockets: Full Duplex",
      visual: {
        type: "realtime_protocols" as any,
        config: { act: "websockets" },
      },
    },
    {
      id: "realtime-protocols-act5-takeaway",
      type: "realworld",
      durationInSeconds: 16.54,
      narrationFile: "audio/realtime-protocols-act5-takeaway.mp3",
      title: "Senior Decision Matrix",
      visual: {
        type: "realtime_protocols" as any,
        config: { act: "takeaway" },
      },
    },
  ],
};

export default realtimeProtocolsData;
