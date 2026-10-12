import { ReelData } from "./types";

export const packetJourneyData: ReelData = {
  id: "packet-journey",
  title: "The 300ms Cold Start Tax — Why Request #1 is 20x Slower",
  hashtags: [
    "systemdesign",
    "networking",
    "backend",
    "softwareengineering",
    "webdev",
    "codinginterview",
    "devops",
    "beyondlocalhost",
  ],
  fps: 30,
  width: 1080,
  height: 1920,

  scenes: [
    {
      id: "packet-journey-act1-question",
      type: "hook",
      durationInSeconds: 16.20,
      narrationFile: "audio/packet-journey-act1-question.mp3",
      title: "The Solo Question Hook",
      visual: {
        type: "packet_journey" as any,
        config: { act: "question" },
      },
    },
    {
      id: "packet-journey-act2-dns",
      type: "problem",
      durationInSeconds: 15.14,
      narrationFile: "audio/packet-journey-act2-dns.mp3",
      title: "Element 1: DNS Resolution",
      visual: {
        type: "packet_journey" as any,
        config: { act: "dns" },
      },
    },
    {
      id: "packet-journey-act3-tcp",
      type: "problem",
      durationInSeconds: 21.46,
      narrationFile: "audio/packet-journey-act3-tcp.mp3",
      title: "Element 2: TCP 3-Way Handshake",
      visual: {
        type: "packet_journey" as any,
        config: { act: "tcp" },
      },
    },
    {
      id: "packet-journey-act4-tls",
      type: "solution",
      durationInSeconds: 18.46,
      narrationFile: "audio/packet-journey-act4-tls.mp3",
      title: "Element 3: TLS 1.3 Encryption Tunnel",
      visual: {
        type: "packet_journey" as any,
        config: { act: "tls" },
      },
    },
    {
      id: "packet-journey-act5-http",
      type: "solution",
      durationInSeconds: 21.55,
      narrationFile: "audio/packet-journey-act5-http.mp3",
      title: "Element 4: HTTP Request & Keep-Alive Pooling",
      visual: {
        type: "packet_journey" as any,
        config: { act: "http" },
      },
    },
    {
      id: "packet-journey-act6-takeaway",
      type: "realworld",
      durationInSeconds: 13.73,
      narrationFile: "audio/packet-journey-act6-takeaway.mp3",
      title: "Senior Architect Takeaway",
      visual: {
        type: "packet_journey" as any,
        config: { act: "takeaway" },
      },
    },
  ],
};

export default packetJourneyData;
