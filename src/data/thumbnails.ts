export interface ThumbnailItem {
  id: string;
  reelId: string;
  category: string;
  badge: string;
  title: string;
  subtitle: string;
  accentColor: string;
  tags: [string, string, string];
  diagramType:
    | "load_balancer"
    | "lb_algorithms"
    | "lb_layers_ha"
    | "consistent_hashing"
    | "caching"
    | "rate_limiter"
    | "packet_journey"
    | "http_versions"
    | "realtime_protocols"
    | "proxy_gateway"
    | "monkey_scale"
    | "monkey_caching"
    | "networking_essentials"
    | "edge_cdn";
}

export const THUMBNAILS_DATA: ThumbnailItem[] = [
  {
    id: "thumb-load-balancer",
    reelId: "load-balancer",
    category: "PART 1 • LOAD BALANCERS",
    badge: "CORE ARCHITECTURE",
    title: "LOAD BALANCERS",
    subtitle: "Why Netflix Never Goes Down",
    accentColor: "#10B981", // Emerald
    tags: ["⚡ Reverse Proxy", "🛡️ Health Checks", "⚖️ Traffic Distribution"],
    diagramType: "load_balancer",
  },
  {
    id: "thumb-lb-algorithms",
    reelId: "lb-algorithms",
    category: "PART 2 • LOAD BALANCERS",
    badge: "DECISION MATRIX",
    title: "LB ALGORITHMS",
    subtitle: "Which One Should You Actually Pick?",
    accentColor: "#06B6D4", // Cyan
    tags: ["🔄 Round Robin", "⚖️ Least Connections", "🔑 IP Hashing"],
    diagramType: "lb_algorithms",
  },
  {
    id: "thumb-lb-layers-ha",
    reelId: "lb-layers-ha",
    category: "PART 3 • LOAD BALANCERS",
    badge: "HIGH AVAILABILITY",
    title: "L4 vs L7 & HA",
    subtitle: "Who Balances The Balancer?",
    accentColor: "#8B5CF6", // Violet
    tags: ["⚡ TCP vs HTTP", "🔄 Active-Passive Pair", "🛡️ 99.999% Uptime"],
    diagramType: "lb_layers_ha",
  },
  {
    id: "thumb-lb-consistent-hashing",
    reelId: "lb-consistent-hashing",
    category: "PART 5 • CONSISTENT HASHING",
    badge: "CORE ALGORITHM",
    title: "CONSISTENT HASHING",
    subtitle: "What Happens When You Add +1 Server?",
    accentColor: "#3B82F6", // Electric Blue
    tags: ["⭕ 360° Hash Ring", "🔀 Virtual Nodes", "📉 Only K/N Remapped"],
    diagramType: "consistent_hashing",
  },
  {
    id: "thumb-caching-fresh",
    reelId: "caching-fresh",
    category: "SYSTEM DESIGN FROM FIRST PRINCIPLES",
    badge: "IN-MEMORY CACHING",
    title: "WHAT IS CACHING?",
    subtitle: "RAM vs Disk: Why Databases Melt Without It",
    accentColor: "#10B981", // Emerald
    tags: ["⚡ 0.1ms In-Memory", "🛡️ Cache-Aside", "🧹 LRU Eviction"],
    diagramType: "caching",
  },
  {
    id: "thumb-rate-limiter",
    reelId: "rate-limiter",
    category: "SYSTEM DESIGN DEEP DIVE",
    badge: "SECURITY & SCALE",
    title: "RATE LIMITERS",
    subtitle: "Stopping DDoS & API Abuse at Scale",
    accentColor: "#F43F5E", // Rose / Red
    tags: ["🪣 Token Bucket", "⏱️ Sliding Window", "🚫 HTTP 429 Protection"],
    diagramType: "rate_limiter",
  },
  {
    id: "thumb-packet-journey",
    reelId: "packet-journey",
    category: "COMPUTER NETWORKING",
    badge: "THE JOURNEY",
    title: "PACKET JOURNEY",
    subtitle: "What Happens When You Type google.com?",
    accentColor: "#F59E0B", // Amber
    tags: ["🔎 DNS Lookup", "🤝 TCP 3-Way Handshake", "🔒 TLS 1.3 Handshake"],
    diagramType: "packet_journey",
  },
  {
    id: "thumb-http-versions",
    reelId: "http-versions",
    category: "NETWORK PROTOCOLS",
    badge: "HEAD-OF-LINE BLOCKING",
    title: "HTTP/1.1 vs /2 vs /3",
    subtitle: "Why 1 Dropped Packet Freezes Everything",
    accentColor: "#F43F5E", // Rose
    tags: ["🛑 6 Socket Limit", "⚡ Binary Framing", "🚀 QUIC over UDP"],
    diagramType: "http_versions",
  },
  {
    id: "thumb-realtime-protocols",
    reelId: "realtime-protocols",
    category: "REAL-TIME ARCHITECTURES",
    badge: "STREAMING PROTOCOLS",
    title: "POLLING vs SSE vs WS",
    subtitle: "How Uber Live-Tracks Drivers at Scale",
    accentColor: "#00E5FF", // Cyan
    tags: ["🔄 Short Polling Overhead", "📡 1-Way SSE Push", "⚡ 2-Byte WebSockets"],
    diagramType: "realtime_protocols",
  },
  {
    id: "thumb-proxy-gateway",
    reelId: "proxy-gateway",
    category: "EDGE ARCHITECTURE",
    badge: "INFRA vs APPLICATION",
    title: "PROXY vs GATEWAY",
    subtitle: "Reverse Proxy vs API Gateway Explained",
    accentColor: "#10B981", // Emerald
    tags: ["🛡️ TLS Termination", "🔑 JWT Auth & Quotas", "⚡ Request Aggregation"],
    diagramType: "proxy_gateway",
  },
  {
    id: "thumb-monkey-scale",
    reelId: "monkey-scale",
    category: "SYSTEM DESIGN ARCHITECTURE",
    badge: "1 TO 10M USERS",
    title: "SCALING ARCHITECTURE",
    subtitle: "From Single Node to Distributed System",
    accentColor: "#EC4899", // Pink
    tags: ["📈 1M+ Concurrency", "⚡ Redis + Read Replicas", "📬 Async Queues"],
    diagramType: "monkey_scale",
  },
  {
    id: "thumb-monkey-caching",
    reelId: "monkey-caching",
    category: "DISTRIBUTED CACHING",
    badge: "DESIGN PATTERNS",
    title: "DISTRIBUTED CACHING",
    subtitle: "Cache-Aside, Write-Through & Eviction",
    accentColor: "#14B8A6", // Teal
    tags: ["🎯 99% Cache Hit Rate", "⚡ Sub-ms Invalidation", "🛡️ Stampede Guard"],
    diagramType: "monkey_caching",
  },
  {
    id: "thumb-networking-essentials",
    reelId: "networking-essentials",
    category: "NETWORKING ESSENTIALS",
    badge: "PROTOCOLS",
    title: "NETWORKING FOR SDEs",
    subtitle: "TCP vs UDP, HTTP/2 vs HTTP/3 & QUIC",
    accentColor: "#6366F1", // Indigo
    tags: ["⚡ TCP vs UDP", "🌐 Multiplexing & QUIC", "🔄 Socket Connections"],
    diagramType: "networking_essentials",
  },
  {
    id: "thumb-edge-cdn",
    reelId: "edge-cdn",
    category: "CDN & EDGE ARCHITECTURE",
    badge: "PHYSICS & EDGE",
    title: "EDGE NETWORKS & CDN",
    subtitle: "How Continents Vanish in 40ms",
    accentColor: "#00E5FF", // Cyan
    tags: ["⚡ Anycast Routing", "🌐 300+ Edge PoPs", "🛡️ Origin Shielding"],
    diagramType: "edge_cdn",
  },
];
