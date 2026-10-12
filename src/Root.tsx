import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";

import React from "react";
import { Composition, Still } from "remotion";
import SystemDesignReel from "./compositions/SystemDesignReel";
import { ReelThumbnail } from "./components/thumbnails/ReelThumbnail";
import { THUMBNAILS_DATA } from "./data/thumbnails";
import loadBalancerData from "./data/load-balancer";
import lbAlgorithmsData from "./data/lb-algorithms";
import lbLayersHAData from "./data/lb-layers-ha";
import lbConsistentHashingData from "./data/lb-consistent-hashing";
import packetJourneyData from "./data/packet-journey";
import monkeyScaleData from "./data/monkey-scale";
import monkeyCachingData from "./data/monkey-caching";
import cachingFreshData from "./data/caching-fresh";
import rateLimiterData from "./data/rate-limiter";
import rateLimiterFreshData from "./data/rate-limiter-fresh";
import networkingEssentialsData from "./data/networking-essentials";
import edgeCdnData from "./data/edge-cdn";
import httpVersionsData from "./data/http-versions";
import realtimeProtocolsData from "./data/realtime-protocols";
import proxyGatewayData from "./data/proxy-gateway";
import { ReelData } from "./data/types";

const getTotalFrames = (data: ReelData): number => {
  if (!data?.scenes) return 30 * 10;
  const total = data.scenes.reduce((acc, s) => acc + (s.durationInSeconds || 0), 0);
  return Math.round(total * (data.fps || 30));
};

const resolveReel = (r: any): ReelData | null => {
  if (!r) return null;
  const data = r.default || r;
  if (!data || typeof data !== "object" || !data.id || typeof data.id !== "string") {
    return null;
  }
  return data;
};

const rawReels = [
  httpVersionsData,
  realtimeProtocolsData,
  proxyGatewayData,
  packetJourneyData,
  rateLimiterFreshData,
  edgeCdnData,
  networkingEssentialsData,
  rateLimiterData,
  cachingFreshData,
  monkeyScaleData,
  monkeyCachingData,
  loadBalancerData,
  lbAlgorithmsData,
  lbLayersHAData,
  lbConsistentHashingData,
];

const allReels: ReelData[] = rawReels
  .map(resolveReel)
  .filter((r): r is ReelData => Boolean(r && r.id));

export const RemotionRoot: React.FC = () => (
  <>
    {allReels.map((reel) => (
      <Composition
        key={reel.id}
        id={reel.id}
        component={SystemDesignReel}
        durationInFrames={getTotalFrames(reel)}
        fps={reel.fps || 30}
        width={reel.width || 1080}
        height={reel.height || 1920}
        defaultProps={{ data: reel }}
      />
    ))}

    {THUMBNAILS_DATA.map((thumb) => (
      <Still
        key={thumb.id}
        id={thumb.id}
        component={ReelThumbnail}
        width={1080}
        height={1920}
        defaultProps={{ item: thumb }}
      />
    ))}
  </>
);

