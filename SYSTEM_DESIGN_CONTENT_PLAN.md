# 🚀 System Design Reels: Content Coverage & Publishing Master Plan
> **Channel:** `@beyond.localhost`  
> **Format:** 9:16 Vertical Video (1080x1920 @ 30 FPS)  
> **Engine:** Remotion + React + TypeScript + Microsoft Neural TTS  
> **Goal:** High-retention, intuition-first engineering education that replaces static slideshows with animated physical mental models and relatable storytelling.

---

## 📑 Table of Contents
1. [Core Philosophy & Visual Archetypes](#1-core-philosophy--visual-archetypes)
2. [Current Production & Publishing Pipeline](#2-current-production--publishing-pipeline)
3. [The 32-Topic Fundamentals Roadmap](#3-the-32-topic-fundamentals-roadmap)
   - [Module 1: Request Anatomy & Networking (Reels 01–04)](#module-1-request-anatomy--networking)
   - [Module 2: Traffic Distribution & Edge Architecture (Reels 05–08)](#module-2-traffic-distribution--edge-architecture)
   - [Module 3: Caching Mechanics & Memory Hierarchies (Reels 09–13)](#module-3-caching-mechanics--memory-hierarchies)
   - [Module 4: Storage Engines & Database Internals (Reels 14–18)](#module-4-storage-engines--database-internals)
   - [Module 5: Distributed Systems Core Theory (Reels 19–23)](#module-5-distributed-systems-core-theory)
   - [Module 6: Asynchronous Systems & Event-Driven (Reels 24–27)](#module-6-asynchronous-systems--event-driven)
   - [Module 7: Resilience, Failover & Rate Limiting (Reels 28–32)](#module-7-resilience-failover--rate-limiting)
4. [Publishing Schedule & Automation Ops](#4-publishing-schedule--automation-ops)
5. [Storytelling & Comic Tracks](#5-storytelling--comic-tracks)

---

## 1. Core Philosophy & Visual Archetypes

Traditional tech reels suffer from the **"Bullet-Point Trap"**: static boxes, dashed arrows, and text bullets sliding up from the bottom. In real systems engineering, **the diagram must BE the explanation**.

We structure our visual engine around **6 Domain-Specific Archetypes**:

```
                              ┌────────────────────────────────────────┐
                              │       Visual Archetype Engine          │
                              └───────────────────┬────────────────────┘
                                                  │
         ┌───────────────────┬────────────────────┼───────────────────┬───────────────────┐
         ▼                   ▼                    ▼                   ▼                   ▼
  [Protocol Flow]     [Ring Topology]      [Pipes & Buffers]   [Storage Engine]   [Network Partition]
(Handshake / Packets)(Consistent Hashing) (Queues / Leaky)     (B+ Tree vs LSM)     (CAP / Quorum)
```

1. **Protocol Flow & Packet Inspector:** Timeline rails with packet capsules traveling with timestamps, payload unzipping (L4 vs L7), and RTT latency meters.
2. **Circular Ring Topology:** 360° glowing rings mapping nodes and keys, showing clockwise traversal and minimal $K/N$ remapping on node failure.
3. **Pipes, Buffers & Fluid Mechanics:** Queues simulated as fluid tanks with workers draining at steady speed; token buckets with dropping coins and overflow deflection.
4. **Memory Ladder & Speed Hierarchy:** Physical scaling of time ($L1 = 0.5\text{ns}$ vs $\text{RAM} = 100\text{ns}$ vs $\text{Disk} = 2\text{ms}$).
5. **Storage Engine Internals:** Sequential append-only WAL logs vs branching B+ Tree disk page traversal.
6. **Network Partition & Quorum:** Severed communication links dividing data centers with majority voting formulas $Q = \lfloor N/2 \rfloor + 1$.

---

## 2. Current Production & Publishing Pipeline

### 🟢 Live Publishing Status

| Reel ID | Module & Topic | Video File | Status | Notes / Post ID |
| :--- | :--- | :--- | :--- | :--- |
| `load-balancer` | Module 2: Load Balancing Part 1 | `out/load-balancer.mp4` | ✅ **PUBLISHED** | Core Reverse Proxy & Health Checks |
| `lb-algorithms` | Module 2: Load Balancing Part 2 | `out/lb-algorithms.mp4` | ✅ **PUBLISHED** | Post ID: `18101131655566040` (Round Robin vs Least Conn vs IP Hash) |
| `lb-layers-ha` | Module 2: L4 vs L7 & HA Failover | `out/lb-layers-ha.mp4` | ✅ **PUBLISHED** | Layer 4 wire routing vs Layer 7 parsing & VRRP |
| `lb-consistent-hashing` | Module 2: Consistent Hashing | `out/lb-consistent-hashing.mp4` | ✅ **PUBLISHED** | 360° Ring topology, virtual nodes, $K/N$ remapping |
| `caching-fresh` | Module 3: What is Caching? | `out/caching-fresh.mp4` | ✅ **PUBLISHED** | RAM vs Disk, Cache-Aside, Write-Through, Write-Behind |
| `packet-journey` | Module 1: The 300ms Cold Start Tax | `out/packet-journey.mp4` | ✅ **PUBLISHED** | Post ID: `17993179311022702` (DNS -> TCP -> TLS 1.3 -> Keep-Alive) |

---

### 📦 Active Master Render Assets Ready in `out/`

| Output File | Size | Topic / Series | Runtime |
| :--- | :--- | :--- | :--- |
| `out/packet-journey.mp4` | ~12 MB | Module 1 Reel 01: Cold Start Tax (DNS $\rightarrow$ TCP $\rightarrow$ TLS 1.3) | 107.6s |
| `out/edge-cdn.mp4` | 8.3 MB | Module 2 Reel 07: CDN & Edge Architecture (Anycast) | 58.0s |
| `out/rate-limiter-fresh.mp4` | 8.5 MB | Module 2 Reel: Token Bucket & Redis Lua Scripting | 50.2s |
| `out/lb-consistent-hashing.mp4` | 5.5 MB | Module 2 Reel 06: Consistent Hashing & Ring Topology | 70.8s |
| `out/lb-layers-ha.mp4` | 5.4 MB | Module 2 Reel 05: Load Balancing Part 3 (HA & L4/L7) | 64.4s |
| `out/caching-fresh.mp4` | 14 MB | Module 3: What is Caching & Invalidation Patterns | 113.0s |

---

## 3. The 32-Topic Fundamentals Roadmap

### Module 1: Request Anatomy & Networking Foundation
*Target: Engineers who use HTTP requests daily, but don't understand the physical latency, handshakes, and transport mechanics underneath.*

| Reel # | Topic | Core Engineering Insight | Teacher's Mental Model | Readiness |
| :--- | :--- | :--- | :--- | :--- |
| **01** | **The 300ms Cold Start Tax (The Packet Journey)** | Why Request #1 takes 300ms while Request #2 takes 15ms. The handshake tax. | Solo question hook, DNS (60ms) $\rightarrow$ TCP (80ms) $\rightarrow$ TLS 1.3 (80ms) $\rightarrow$ Keep-Alive pooling. | 🚀 **Generated Sample** |
| **02** | **HTTP/1.1 vs HTTP/2 vs HTTP/3 (QUIC)** | Why one dropped packet freezes an entire site; TCP HoL vs UDP QUIC streams. | Multi-lane railway vs multiplexed colored trains vs independent UDP hovercrafts. | 📝 Next in Queue |
| **03** | **Real-Time: Polling vs Long-Polling vs SSE vs WebSockets** | How Uber/WhatsApp push live updates without killing phone battery. | Repeated door knocking vs hanging phone call vs radio tower vs full-duplex wire. | 📝 Queued |
| **04** | **Forward Proxy vs Reverse Proxy vs API Gateway** | Masking client IP vs protecting internal clusters vs auth/rate-limiting enforcement. | Privacy sunglasses vs fortress gatekeeper vs full customs border control. | 📝 Queued |

---

### Module 2: Traffic Distribution & Edge Architecture
*Target: Engineers who assume load balancing is just Round Robin.*

| Reel # | Topic | Core Engineering Insight | Teacher's Mental Model | Readiness |
| :--- | :--- | :--- | :--- | :--- |
| **05** | **L4 vs L7 & Who Balances the Balancer? (HA)** | Wire-speed TCP routing vs payload parsing; Active-Passive VRRP failover. | Envelope address sorter vs letter inspector + dual heartbeat standby. | ⏳ Pending (`lb-layers-ha.mp4`) |
| **06** | **Consistent Hashing & Virtual Nodes** | Why modulo `hash % N` wipes caches on server reboot; $K/N$ remapping. | 360° circular neon ring with clockwise token travel. | ✅ Rendered (`lb-consistent-hashing.mp4`) |
| **07** | **CDN Topologies: Push vs Pull & Edge Compute** | Anycast DNS routing, Point of Presence (PoP), origin shielding, 40ms global reach. | Tokyo user hitting Tokyo edge (5ms) vs crossing Pacific to US origin (220ms). | ✅ Rendered (`edge-cdn.mp4`) |
| **08** | **Health Checks & The Gray Failure Trap** | Active vs Passive health checks; zombie nodes returning 200 OK while hung. | EKG heartbeat flatlining; load balancer flipping the ejector seat. | 📝 Scripted |

---

### Module 3: Caching Mechanics & Memory Hierarchies
*Target: Engineers who slap Redis in front of a database without eviction or stampede defenses.*

| Reel # | Topic | Core Engineering Insight | Teacher's Mental Model | Readiness |
| :--- | :--- | :--- | :--- | :--- |
| **09** | **Latency Numbers Every SDE Must Know** | CPU L1 (0.5ns) vs RAM (100ns) vs SSD (16μs) vs Disk (2ms) vs Cross-country (150ms). | Speed Ladder: If L1 were 1 second, cross-country network would be 10 years. | 📝 Scripted |
| **10** | **Caching Patterns: Cache-Aside vs Write-Through vs Write-Back** | Read-heavy vs write-heavy tradeoffs; power-loss risks in Write-Back caches. | Three split numbered packet flows showing who commits first. | ✅ Rendered (`monkey-caching.mp4`) |
| **11** | **Cache Eviction: LRU vs LFU vs FIFO** | Eviction under memory caps; Doubly Linked Lists + Hash Maps for $O(1)$ operations. | Sliding queue where accessed nodes jump to front and tails fall off. | 📝 Scripted |
| **12** | **The 3 Disasters: Penetration, Avalanche, Stampede** | Fake IDs piercing cache; midnight bulk key expiration; hot-key dogpiling. | Domino collapse; Bloom Filter shield deflecting fake queries. | 📝 Scripted |
| **13** | **Bloom Filters in Distributed Systems** | Probabilistic bit arrays: checking existence in 100M items with 0 disk hits. | Bit array flashlight: 3 hash functions toggling binary bits `[0, 1, 0, 1]`. | 📝 Scripted |

---

### Module 4: Storage Engines & Database Internals
*Target: Engineers choosing databases based on hype instead of underlying storage engines.*

| Reel # | Topic | Core Engineering Insight | Teacher's Mental Model | Readiness |
| :--- | :--- | :--- | :--- | :--- |
| **14** | **SQL vs NoSQL: Under the Engine Hood** | Normalized ACID joins vs denormalized high-throughput key-document lookups. | Structured filing cabinet vs modular self-contained dossier folders. | 📝 Scripted |
| **15** | **B+ Tree (Postgres/MySQL) vs LSM Tree (Cassandra/RocksDB)** | Why B+ Trees excel at range reads, while LSM Trees dominate write bursts. | Branching tree disk traversal vs Append-only WAL + MemTable flush. | 📝 Scripted |
| **16** | **Database Indexing: Clustered vs Non-Clustered** | Why `SELECT *` causes bookmark lookups; covering composite indexes. | Physical book pages vs separate glossary index with pointers. | 📝 Scripted |
| **17** | **Read Replicas & Replication Lag** | Primary-Replica async lag; why users refresh and see missing data. | Ghost refresh: Leader commits write, Follower lag returns 404. | 📝 Scripted |
| **18** | **Database Sharding: Hash vs Range vs Directory** | Scaling tables past 500GB; shard keys, cross-shard join performance death. | Warehouse splitting: alphabetical range hotspot vs uniform hash scatter. | 📝 Scripted |

---

### Module 5: Distributed Systems Core Theory
*Target: Senior interview filter—moving from syntax to architectural trade-off analysis.*

| Reel # | Topic | Core Engineering Insight | Teacher's Mental Model | Readiness |
| :--- | :--- | :--- | :--- | :--- |
| **19** | **The Real CAP Theorem (Debunking "Pick 2")** | Network partitions ($P$) are unavoidable; real choice is Consistency vs Availability. | Severed undersea cable isolating nodes; rejecting writes vs serving stale. | 📝 Scripted |
| **20** | **PACELC Theorem: Life Without Partitions** | Trade-off between Latency ($L$) vs Consistency ($C$) during normal execution. | Balancing scale slider between "wait for all replicas" vs "instant return". | 📝 Scripted |
| **21** | **Strong vs Eventual vs Monotonic Consistency** | Read-your-own-writes guarantees; propagation ripple delay across nodes. | Stone dropped in water: concentric ripple rings expanding at different speeds. | 📝 Scripted |
| **22** | **Split-Brain & Quorum Consensus** | Why 2 nodes can't agree on leadership; odd numbers for Quorum: $Q = \lfloor N/2 \rfloor + 1$. | Island fracture: 4 nodes split 2 vs 2, both claiming leader until quorum rules. | 📝 Scripted |
| **23** | **Two-Phase Commit (2PC) vs Saga Pattern** | Distributed transactions: 2PC coordinator lockup vs Choreography/Orchestration Sagas. | Contract signing holding locks vs baton relay with compensating rollbacks. | 📝 Scripted |

---

### Module 6: Asynchronous Systems & Event-Driven Architecture
*Target: Engineers confusing transient message queues with durable event streams.*

| Reel # | Topic | Core Engineering Insight | Teacher's Mental Model | Readiness |
| :--- | :--- | :--- | :--- | :--- |
| **24** | **Message Queue (RabbitMQ) vs Event Stream (Kafka)** | Smart broker / dumb consumer vs Dumb broker / smart consumer append log. | Popcorn conveyor belt (eaten on receipt) vs Cassette tape with multiple heads. | 📝 Scripted |
| **25** | **The Myth of "Exactly-Once" Delivery** | Networks drop ACKs; why systems are At-Least-Once; Idempotency keys. | Duplicate delivery truck dropping package twice; idempotency lock ignores #2. | 📝 Scripted |
| **26** | **The Transactional Outbox Pattern** | Solving dual-write race conditions when DB commits but broker fails. | Safe deposit box inside DB; CDC / background worker publishes to broker. | 📝 Scripted |
| **27** | **Dead Letter Queues (DLQ) & Poison Pills** | Preventing 1 malformed payload from crash-looping workers and blocking queue. | Toxic waste ejection chute: 3 failed retries sent to DLQ while stream flows. | 📝 Scripted |

---

### Module 7: Resilience, Failover & Rate Limiting
*Target: Engineers whose systems collapse during traffic spikes or cascading dependency failures.*

| Reel # | Topic | Core Engineering Insight | Teacher's Mental Model | Readiness |
| :--- | :--- | :--- | :--- | :--- |
| **28** | **Circuit Breaker Pattern (Closed $\rightarrow$ Open $\rightarrow$ Half-Open)** | Failing fast so unhealthy dependencies don't exhaust connection pools. | Sparking switch flipping open, blocking calls; test packet resets breaker. | 📝 Scripted |
| **29** | **Rate Limiting: Token Bucket vs Leaky Bucket** | Burst allowance (Token Bucket) vs constant smoothed output (Leaky Bucket). | Tokens dropping into dispenser; excess requests deflecting with HTTP 429. | ✅ Rendered (`rate-limiter.mp4`) |
| **30** | **Retry Storms & Exponential Backoff with Jitter** | Why standard retries DDOS recovering databases; randomized jitter dispersion. | Synchronous retry spikes dispersed into a flat, smooth cloud of requests. | 📝 Scripted |
| **31** | **Bulkheading & Graceful Degradation** | Titanic water-tight bulkheads: isolating thread pools so checkout survives. | Flooded compartment sealed off while engine room keeps ship afloat. | 📝 Scripted |
| **32** | **Distributed Unique ID Generation (Snowflake vs UUID)** | Why UUIDv4 causes B+ Tree index fragmentation; ordered 64-bit Snowflakes. | 64-bit bar split into timestamp + machine ID + sequence bits. | 📝 Scripted |

---

## 4. Publishing Schedule & Automation Ops

### Recommended Weekly Publishing Cadence

| Day | Slot | Content Archetype | Target Focus |
| :--- | :--- | :--- | :--- |
| **Tuesday** | 11:00 AM | **Core Fundamentals Series** | Deep dive concept (Load Balancing, Hashing, Databases) |
| **Thursday** | 11:00 AM | **Comic / Storytelling Short** | High-energy "Monkey Mind 101" reel (25–40s rapid-fire intuition) |
| **Saturday** | 11:00 AM | **Senior Architect Deep Dive** | Trade-offs, Failures & Resilience (CAP, Kafka, Rate Limiters) |

---

### Automation CLI Commands

The scheduler runs via `scripts/scheduler.py` integrated with the Meta Graph API:

```bash
# View current queue and publication status
python3 scripts/scheduler.py list

# Check and publish any reels whose scheduled time has passed
python3 scripts/scheduler.py check

# Force-publish an item immediately
python3 scripts/scheduler.py publish-now part-3

# Run background daemon polling every 60 seconds
python3 scripts/scheduler.py daemon

# Install macOS LaunchAgent for 24/7 background automation
python3 scripts/scheduler.py install-launchd
```

---

## 5. Visual Paradigm: The Progressive Darkroom Format

Replacing legacy slideshows and comic metaphors, every reel adheres to the **3Blue1Brown / Linear-Grade Darkroom Philosophy**:

1. **Light Black Blueprint Canvas:**
   * Palette: Deep slate `#070913` to `#0d1428` with subtle 72px grid lines (`rgba(56, 189, 248, 0.035)`), coordinate axes, and ambient colored glows.
   * Eliminates distracting gradients and white paper slop.
2. **The Solo Question Hook:**
   * Scene 1 contains **only one single question** recited clearly with natural neural intonation.
   * Accompanied by a clean visual contrast (e.g. Cold Request 300ms vs Warm Request 15ms).
   * Zero visual clutter until the question finishes reciting.
3. **Progressive Element Introduction:**
   * Once the problem is stated, elements appear **one scene at a time** as the explanation unfolds:
     - Step 1: Client appears $\rightarrow$ queries DNS Resolver (+60ms).
     - Step 2: Destination Origin Server appears $\rightarrow$ TCP 3-Way Handshake establishes (+80ms).
     - Step 3: Cryptographic Cipher Lock appears $\rightarrow$ TLS 1.3 Key Exchange (+80ms).
     - Step 4: Encrypted tunnel forms $\rightarrow$ HTTP JSON payload flies through (+80ms).
     - Step 5: The warm connection secret: DNS cached, Keep-Alive socket reused, TLS resumed $\rightarrow$ 15ms!
4. **Continuous Thinking Orb & Dotted Path Motion:**
   * Moving packets and state transitions travel along animated dotted lines via the reusable [`ThinkingOrb`](file:///Users/jaybhanushali/Desktop/Projects/Learn/SDE%20Prep/interview-prep/system-design-reels/src/components/fresh/ThinkingOrb.tsx) component.
   * Floating live cumulative latency counter (+60ms, +140ms, +220ms, +300ms) anchors physical intuition.

---

*Document maintained automatically in repository root at [`SYSTEM_DESIGN_CONTENT_PLAN.md`](file:///Users/jaybhanushali/Desktop/Projects/Learn/SDE%20Prep/interview-prep/system-design-reels/SYSTEM_DESIGN_CONTENT_PLAN.md).*


