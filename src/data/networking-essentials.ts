import { ReelData } from "./types";

/**
 * Networking Essentials System Design Reel
 * Based on HelloInterview Core Concepts write-up.
 * Visual concept: The Jungle Banana Protocol & Dev Monkey.
 * Subtle, intentional motion synced with each audio explanation.
 */
export const networkingEssentialsData: ReelData = {
  id: "networking-essentials",
  title: "Networking Essentials for System Design: The Banana Protocol",
  hashtags: [
    "systemdesign",
    "networking",
    "tcp",
    "udp",
    "rest",
    "grpc",
    "websockets",
    "loadbalancing",
    "softwareengineering",
    "interviewprep",
  ],
  fps: 30,
  width: 1080,
  height: 1920,
  scenes: [
    // ── ACT 1: NETWORKING LAYERS (L3 IP, L4 TCP/UDP, L7 APP) (22.39s = 672 frames) ──
    {
      id: "net-act-1-layers",
      type: "hook",
      durationInSeconds: 22.39,
      narrationFile: "audio/networking-act1-layers.mp3",
      title: "Networking Layers",
      subtitle: "L3 Routing, L4 Transport, L7 Application",
      visual: {
        type: "networking_essentials" as any,
        config: {
          act: "layers",
          badge: "Networking 101",
          headlineNormal: "The Three Critical",
          headlineHighlight: "Networking Layers",
          subtitle: "L3 routes the tree, L4 packages the delivery, L7 defines the order",
        },
      },
    },

    // ── ACT 2: TCP VS UDP (23.81s = 714 frames) ──
    {
      id: "net-act-2-tcp-udp",
      type: "problem",
      durationInSeconds: 23.81,
      narrationFile: "audio/networking-act2-tcp-udp.mp3",
      title: "TCP vs UDP",
      subtitle: "Guaranteed Parcels vs High-Speed Banana Cannon",
      visual: {
        type: "networking_essentials" as any,
        config: {
          act: "tcp_udp",
          badge: "Transport Layer Battle",
          headlineNormal: "Guaranteed Parcels vs",
          headlineHighlight: "High-Speed Cannon",
          subtitle: "SYN-ACK 3-way handshake vs Fire-and-forget streaming",
        },
      },
    },

    // ── ACT 3: APPLICATION PROTOCOLS (REST, GRAPHQL, GRPC, WEBSOCKETS) (26.09s = 783 frames) ──
    {
      id: "net-act-3-protocols",
      type: "solution",
      durationInSeconds: 26.09,
      narrationFile: "audio/networking-act3-protocols.mp3",
      title: "Application Protocols",
      subtitle: "REST vs GraphQL vs gRPC vs WebSockets",
      visual: {
        type: "networking_essentials" as any,
        config: {
          act: "protocols",
          badge: "Layer 7 Protocol Menu",
          headlineNormal: "Picking The Right",
          headlineHighlight: "Jungle Protocol",
          subtitle: "REST for CRUD, GraphQL for custom slices, gRPC for binary microservices, WebSockets for 2-way talk",
        },
      },
    },

    // ── ACT 4: LOAD BALANCING & CDNS (21.26s = 638 frames) ──
    {
      id: "net-act-4-scaling",
      type: "realworld",
      durationInSeconds: 21.26,
      narrationFile: "audio/networking-act4-scaling.mp3",
      title: "Scaling & Resilience",
      subtitle: "Layer 7 Load Balancing & Edge CDNs",
      visual: {
        type: "networking_essentials" as any,
        config: {
          act: "scaling",
          badge: "Production Scaling",
          headlineNormal: "Routing Load &",
          headlineHighlight: "Beating The Speed of Light",
          subtitle: "Gorilla Load Balancer distributes requests; Edge CDNs serve bananas locally",
        },
      },
    },
  ],
};

export default networkingEssentialsData;
