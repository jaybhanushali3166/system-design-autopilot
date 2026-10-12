import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig, Audio, staticFile } from "remotion";
import { ReelData } from "../data/types";
import HookScene from "../components/HookScene";
import ProblemScene from "../components/ProblemScene";
import SolutionScene from "../components/SolutionScene";
import RealWorldScene from "../components/RealWorldScene";

const Background: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(160deg, #0A0A1A 0%, #0D0D20 40%, #0A0A18 100%)" }}>
    <div style={{
      position: "absolute", inset: 0,
      backgroundImage: "linear-gradient(rgba(78,205,196,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(78,205,196,0.04) 1px, transparent 1px)",
      backgroundSize: "60px 60px",
    }} />
    <div style={{ position: "absolute", top: -200, left: -200, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, #FF6B9D08 0%, transparent 70%)" }} />
    <div style={{ position: "absolute", bottom: -200, right: -200, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, #4ECDC408 0%, transparent 70%)" }} />
  </AbsoluteFill>
);

const Watermark: React.FC = () => (
  <div style={{
    position: "absolute", bottom: 180, left: 0, right: 0,
    display: "flex", justifyContent: "center", alignItems: "center", gap: 8,
    fontSize: 20, color: "#FFFFFF45", fontFamily: "Inter, sans-serif", fontWeight: 600, letterSpacing: 1.5,
  }}>
    <span style={{ color: "#4ECDC4", fontSize: 14 }}>●</span> @beyond.localhost
  </div>
);

import MonkeyStoryScene from "../components/character/MonkeyStoryScene";
import { MonkeyCachingScene } from "../components/character/MonkeyCachingScene";
import FreshCachingScene from "../components/fresh/FreshCachingScene";
import ConsistentHashingScene from "../components/fresh/ConsistentHashingScene";
import RateLimiterScene from "../components/fresh/RateLimiterScene";
import { NetworkingEssentialsScene } from "../components/fresh/NetworkingEssentialsScene";
import EdgeCdnScene from "../components/infinite/EdgeCdnScene";
import RateLimiterFreshScene from "../components/fresh/RateLimiterFreshScene";
import { PacketJourneyScene } from "../components/infinite/PacketJourneyScene";
import { HttpVersionsScene } from "../components/infinite/HttpVersionsScene";
import { RealtimeProtocolsScene } from "../components/infinite/RealtimeProtocolsScene";
import { ProxyGatewayScene } from "../components/infinite/ProxyGatewayScene";

const SystemDesignReel: React.FC<{ data: ReelData }> = ({ data }) => {
  const { fps, width, height } = useVideoConfig();
  let frameOffset = 0;

  const sequences = data.scenes.map((scene) => {
    const durationInFrames = Math.round(scene.durationInSeconds * fps);
    const from = frameOffset;
    frameOffset += durationInFrames;

    const isCachingAct =
      scene.visual?.type === "monkey_story" &&
      typeof scene.visual.config?.act === "string" &&
      (scene.visual.config.act as string).startsWith("caching-");

    const isPacketJourney = scene.visual?.type === ("packet_journey" as any);
    const isHttpVersions = scene.visual?.type === ("http_versions" as any);
    const isRealtimeProtocols = scene.visual?.type === ("realtime_protocols" as any);
    const isProxyGateway = scene.visual?.type === ("proxy_gateway" as any);
    const isRateLimiterFresh = scene.visual?.type === ("rate_limiter_fresh" as any);
    const isFreshCaching = scene.visual?.type === "fresh_caching";
    const isConsistentHashing = scene.visual?.type === "consistent_hashing";
    const isRateLimiter = scene.visual?.type === "rate_limiter";
    const isNetworking = scene.visual?.type === ("networking_essentials" as any);
    const isEdgeCdn = scene.visual?.type === ("edge_cdn" as any);

    return (
      <Sequence key={scene.id} from={from} durationInFrames={durationInFrames} name={scene.id}>
        {/* Per-scene narration — starts exactly when this scene starts */}
        {scene.narrationFile && (
          <Audio
            src={staticFile(scene.narrationFile)}
            volume={1}
            startFrom={0}
          />
        )}

        {isPacketJourney ? (
          <PacketJourneyScene act={((scene.visual as any)?.config)?.act || "question"} />
        ) : isHttpVersions ? (
          <HttpVersionsScene act={((scene.visual as any)?.config)?.act || "hook"} />
        ) : isRealtimeProtocols ? (
          <RealtimeProtocolsScene act={((scene.visual as any)?.config)?.act || "hook"} />
        ) : isProxyGateway ? (
          <ProxyGatewayScene act={((scene.visual as any)?.config)?.act || "hook"} />
        ) : isRateLimiterFresh ? (
          <RateLimiterFreshScene act={((scene.visual as any)?.config)?.act || scene.type} />
        ) : isEdgeCdn ? (
          <EdgeCdnScene act={((scene.visual as any)?.config)?.act || scene.type} />
        ) : isNetworking ? (
          <NetworkingEssentialsScene config={((scene.visual as any)?.config)} />
        ) : isRateLimiter ? (
          <RateLimiterScene act={((scene.visual as any)?.config)?.act || scene.type} />
        ) : isConsistentHashing ? (
          <ConsistentHashingScene act={scene.id} />
        ) : isFreshCaching ? (
          <FreshCachingScene config={(scene.visual as any).config} videoWidth={width} videoHeight={height} />
        ) : isCachingAct ? (
          <MonkeyCachingScene config={(scene.visual as any).config} videoWidth={width} videoHeight={height} />
        ) : scene.visual?.type === "monkey_story" ? (
          <MonkeyStoryScene config={(scene.visual as any).config} videoWidth={width} videoHeight={height} />
        ) : (
          <>
            {scene.type === "hook"      && <HookScene scene={scene} />}
            {scene.type === "problem"   && <ProblemScene scene={scene} videoWidth={width} videoHeight={height} />}
            {scene.type === "solution"  && <SolutionScene scene={scene} videoWidth={width} videoHeight={height} />}
            {scene.type === "realworld" && <RealWorldScene scene={scene} />}
          </>
        )}
      </Sequence>
    );
  });

  const isFreshReel =
    data.id === "packet-journey" ||
    data.id === "http-versions" ||
    data.id === "realtime-protocols" ||
    data.id === "proxy-gateway" ||
    data.id === "rate-limiter-fresh" ||
    data.id === "caching-fresh" ||
    data.id === "lb-consistent-hashing" ||
    data.id === "rate-limiter" ||
    data.id === "networking-essentials" ||
    data.id === "edge-cdn";

  return (
    <AbsoluteFill>
      {!isFreshReel && <Background />}

      {/* Optional looping background music at very low volume */}
      {data.bgMusicFile && (
        <Audio src={staticFile(data.bgMusicFile)} volume={0.12} startFrom={0} loop />
      )}

      {sequences}
      {![
        "packet-journey",
        "http-versions",
        "realtime-protocols",
        "proxy-gateway",
        "rate-limiter-fresh",
        "monkey-scale",
        "monkey-caching",
        "caching-fresh",
        "rate-limiter",
        "lb-consistent-hashing",
        "networking-essentials",
        "edge-cdn",
      ].includes(data.id) && <Watermark />}
    </AbsoluteFill>
  );
};

export default SystemDesignReel;
