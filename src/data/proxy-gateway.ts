import { ReelData } from "./types";

export const proxyGatewayData: ReelData = {
  id: "proxy-gateway",
  title: "Reverse Proxy vs API Gateway — The Architecture Breakdown",
  hashtags: [
    "systemdesign",
    "microservices",
    "apigateway",
    "reverseproxy",
    "nginx",
    "backend",
    "softwareengineering",
    "beyondlocalhost",
  ],
  fps: 30,
  width: 1080,
  height: 1920,

  scenes: [
    {
      id: "proxy-gateway-act1-hook",
      type: "hook",
      durationInSeconds: 11.88,
      narrationFile: "audio/proxy-gateway-act1-hook.mp3",
      title: "The Classic Interview Confusion",
      visual: {
        type: "proxy_gateway" as any,
        config: { act: "hook" },
      },
    },
    {
      id: "proxy-gateway-act2-reverse",
      type: "problem",
      durationInSeconds: 19.58,
      narrationFile: "audio/proxy-gateway-act2-reverse.mp3",
      title: "The Reverse Proxy: Wire Gatekeeper",
      visual: {
        type: "proxy_gateway" as any,
        config: { act: "reverse" },
      },
    },
    {
      id: "proxy-gateway-act3-gateway",
      type: "solution",
      durationInSeconds: 17.23,
      narrationFile: "audio/proxy-gateway-act3-gateway.mp3",
      title: "The API Gateway: Application Brain",
      visual: {
        type: "proxy_gateway" as any,
        config: { act: "gateway" },
      },
    },
    {
      id: "proxy-gateway-act4-aggregation",
      type: "solution",
      durationInSeconds: 18.17,
      narrationFile: "audio/proxy-gateway-act4-aggregation.mp3",
      title: "Request Aggregation & Fan-Out",
      visual: {
        type: "proxy_gateway" as any,
        config: { act: "aggregation" },
      },
    },
    {
      id: "proxy-gateway-act5-takeaway",
      type: "realworld",
      durationInSeconds: 15.19,
      narrationFile: "audio/proxy-gateway-act5-takeaway.mp3",
      title: "The Production Architecture",
      visual: {
        type: "proxy_gateway" as any,
        config: { act: "takeaway" },
      },
    },
  ],
};

export default proxyGatewayData;

