export type NodeType = "client" | "server" | "database" | "cache" | "loadbalancer" | "queue" | "cdn";

export interface DiagramNode {
  id: string; label: string; type: NodeType;
  x: number; y: number; emoji?: string;
  appearAt?: number;
}

export interface DiagramEdge {
  from: string; to: string;
  color?: string;
  drawAt?: number;
  packetDelay?: number;
}

export interface ProtocolActor {
  id: string;
  name: string;
  role: string;
  ip?: string;
  color: string;
  emoji: string;
}

export interface ProtocolPacket {
  id: string;
  from: string;
  to: string;
  title: string;
  subtitle?: string;
  category: "tcp" | "tls" | "http" | "dns";
  color: string;
  startFrame: number;
  durationFrames: number;
  latencyAtStepMs: number;
  rttLabel?: string;
  statusText?: string;
}

export interface ProtocolFlowConfig {
  type: "protocol_flow";
  actors: ProtocolActor[];
  packets: ProtocolPacket[];
  showTunnelFrame?: number;
  tunnelLabel?: string;
  tunnelColor?: string;
  comparisonBadge?: {
    frame: number;
    title: string;
    value: string;
    subtext: string;
    highlightColor: string;
  };
}

export type VisualArchetype =
  | ProtocolFlowConfig
  | { type: "monkey_story"; config: any }
  | { type: "minimal_monkey"; config: any }
  | { type: "fresh_caching"; config: any }
  | { type: "consistent_hashing" }
  | { type: "rate_limiter"; config?: any }
  | { type: "generic_diagram" };

export interface Scene {
  id: string;
  type: "hook" | "problem" | "solution" | "realworld" | "interactive";
  durationInSeconds: number;
  narrationFile?: string;
  title?: string; subtitle?: string;
  bodyText?: string[];
  bodyTextFrames?: number[]; // frame each bullet appears — synced to voice
  nodes?: DiagramNode[];
  edges?: DiagramEdge[];
  highlightNodeId?: string;
  stressNodeId?: string;
  stressStartFrame?: number;
  companies?: string[];
  metrics?: string[];
  visual?: VisualArchetype;
}

export interface ReelData {
  id: string; title: string;
  hashtags: string[];
  fps: number; width: number; height: number;
  bgMusicFile?: string;
  scenes: Scene[];
}

