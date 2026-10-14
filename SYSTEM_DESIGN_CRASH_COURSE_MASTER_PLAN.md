# System Design Crash Course — Master Curriculum

Status: planning only. No new scripts, audio, diagrams or videos are authorized by this plan.

Channel: `@beyond.localhost` · Format: vertical reels · Proposed curriculum: **10 series, 60 reels**.

Target watch time: **83.8 minutes** (5,025 seconds), excluding pauses and practice. These are editorial estimates, not rendered durations.

The goal is a compact course that teaches how to choose an architecture, explain its mechanism, and defend its behavior under load or failure. Viewers should learn transferable decisions, then apply them to representative interview problems.

The counts and topic priority below are editorial recommendations. “Interview pattern” means a reusable question archetype, not a measured frequency ranking or a claim about a specific company’s current question bank.

## 1. Course structure

| Series | Scope | Reels | Count | Target watch time | Exit capability |
|---|---|---|---:|---:|---|
| 01 — Design thinking and sizing | Fundamentals | 01–05 | 5 | 6.8 min | Frame the problem, size the load and identify the first bottleneck. |
| 02 — Request paths and traffic | Fundamentals | 06–10 | 5 | 6.5 min | Trace a request and explain routing, connection and edge-cache choices. |
| 03 — Data and storage | Fundamentals | 11–17 | 7 | 9.5 min | Choose a data model and defend its access, durability and storage costs. |
| 04 — Caching and partitioning | Fundamentals | 18–22 | 5 | 6.8 min | Explain cached copies, placement, hotspots and partition trade-offs. |
| 05 — Distributed correctness | Intermediate to advanced | 23–29 | 7 | 10.2 min | State an invariant and reason about replicas, races and coordination. |
| 06 — Asynchronous work and events | Intermediate to advanced | 30–35 | 6 | 8.2 min | Move work off the request path without losing track of effects. |
| 07 — Resilience and overload | Intermediate to advanced | 36–41 | 6 | 9.0 min | Keep overload and dependency failures from spreading. |
| 08 — Production decisions | Advanced applied | 42–46 | 5 | 6.5 min | Explain operation, isolation, deployment and lifecycle obligations. |
| 09 — Reusable product patterns | Advanced applied | 47–52 | 6 | 8.2 min | Recognize the pattern behind different product descriptions. |
| 10 — Interview case studies | Synthesis: four designs, two reels each | 53–60 | 8 | 12.0 min | Combine the concepts into four coherent designs and defend their failures. |

**Total: 52 concept reels + 8 case-study reels = 60 reels across 10 series; 83.8 minutes.**

Four learning phases:

- **Foundation:** series 01–04, reels 01–22. Learn the request path, estimates, storage and placement.
- **Distributed systems:** series 05–07, reels 23–41. Learn correctness, asynchronous work and failure behavior.
- **Applied architecture:** series 08–09, reels 42–52. Learn operational obligations and reusable product patterns.
- **Interview synthesis:** series 10, reels 53–60. Four designs, each split into a working architecture and its scaling/failure story.

## 2. What keeps the course short

1. Teach each mechanism once. Later case studies reference the earlier lesson and apply it.
2. Every reel answers one architectural decision or explains one failure mechanism. Closely connected comparisons share a single worked example.
3. Use 60–75 seconds for a compact concept and up to 90 seconds for a correctness or failure lesson. Do not accelerate narration to squeeze in another topic.
4. Give a difficult mechanism a concrete timeline, race or state transition. Definitions alone do not count as coverage.
5. Teach a few product designs deeply enough to transfer. Keep variants in the interview-pattern map instead of creating a full series for every company name.
6. If a later script cannot teach its promised outcome within 90 seconds, reduce the episode’s scope or revise the count explicitly before production. Do not hide two extra lessons in a rushed reel.

The 60-reel recommendation is a minimum practical scope for this particular breadth and teaching style, not a mathematically shortest possible course. Most programming syntax, low-level object-oriented design and infrastructure-tool tutorials sit outside it.

## 3. Episode inventory

Every row specifies a proposed hook, a learning outcome and the limit that prevents an oversimplified explanation. It is a lesson specification, not a finished script.

### Series 01 — Design thinking and sizing

5 reels · 6.8 minutes · Fundamentals

| Reel | Topic / hook | Target | What the viewer should understand | Production depth / misconception to address | Interview connection |
|---|---|---:|---|---|---|
| 01 | **Start with requirements**<br>What must this system actually guarantee? | 75s | Turn a vague prompt into user flows, constraints and one measurable success criterion. | Separate functional requirements from latency, durability and availability targets. | Every design prompt |
| 02 | **Estimate traffic**<br>How many requests must this design handle? | 75s | Derive average and peak QPS from active users and operations per user. | State peak-factor assumptions; DAU is not concurrent users. | Sizing any service |
| 03 | **Estimate storage and bandwidth**<br>Will storage or bandwidth become the bottleneck? | 75s | Calculate bytes per day, retention, replication overhead and transfer rate using one worked example. | Label all quantities as assumptions; count indexes and replicas separately. | Media, logging, chat |
| 04 | **Latency, throughput and tail latency**<br>Why is the average fast while users still wait? | 90s | Separate response time from work completed per second; expose p99 and queueing as utilization rises. | Little’s Law uses steady-state average quantities; more concurrency can worsen overload. | Slow APIs, capacity planning |
| 05 | **Grow a simple architecture**<br>What breaks when one server becomes ten? | 90s | Evolve a client–app–database baseline with vertical scaling, horizontal scaling and externalized session state. | Add a component only for a named bottleneck; stateless app servers still depend on stateful systems. | Architecture sketch for every prompt |

**Series checkpoint:** Frame the problem, size the load and identify the first bottleneck.

### Series 02 — Request paths and traffic

5 reels · 6.5 minutes · Fundamentals

| Reel | Topic / hook | Target | What the viewer should understand | Production depth / misconception to address | Interview connection |
|---|---|---:|---|---|---|
| 06 | **DNS, TCP, TLS and connection reuse**<br>Why can the first request be slower? | 75s | Follow name lookup, connection setup and an HTTP exchange; show where reuse avoids work. | Latencies are illustrative; keep-alive and TLS resumption address different setup costs. | API latency, global applications |
| 07 | **HTTP/1.1, HTTP/2 and HTTP/3**<br>Can one lost packet stall several requests? | 75s | Show sequential responses, multiplexing and QUIC stream isolation with moving packets. | HTTP/2 still inherits TCP head-of-line blocking; QUIC has shared congestion control. | Web performance, protocol choice |
| 08 | **Reverse proxy, API gateway and load balancer**<br>Who handles this incoming request? | 75s | Map routing, TLS termination and application policies to the edge request path. | Roles overlap in products; explain responsibility rather than treating names as disjoint boxes. | Public APIs, service boundaries |
| 09 | **Load balancing and health checks**<br>How do requests avoid an unhealthy server? | 90s | Compare round robin and least connections; eject a failed backend and maintain redundant ingress. | Health checks are imperfect; sticky sessions and unequal request costs change distribution. | Scale-out services, failover |
| 10 | **CDNs and edge caching**<br>Why send every image across an ocean? | 75s | Trace edge hit versus origin miss and distinguish static, personalized and dynamic content. | Cache keys and freshness control correctness; DNS resolution and anycast routing are distinct mechanisms. | Media, global reads |

**Series checkpoint:** Trace a request and explain routing, connection and edge-cache choices.

### Series 03 — Data and storage

7 reels · 9.5 minutes · Fundamentals

| Reel | Topic / hook | Target | What the viewer should understand | Production depth / misconception to address | Interview connection |
|---|---|---:|---|---|---|
| 11 | **Choose storage from access patterns**<br>Which database does this workload need? | 75s | Choose among relational, key-value, document and wide-column models from queries and guarantees. | SQL/NoSQL labels do not determine consistency or transaction support. | Database choice in any prompt |
| 12 | **Indexes and query access paths**<br>Why does a lookup scan a million rows? | 90s | Animate table scan versus index lookup; teach composite index order and covering queries. | Indexes add write and storage cost; column order must match predicates and sorting. | Searchable records, slow queries |
| 13 | **B+ trees and LSM trees**<br>Why can fast writes make later reads harder? | 90s | Follow page lookup versus buffered append, flush and compaction. | Read, write and space amplification depend on workload and configuration; avoid universal winners. | Write-heavy ingestion, storage engines |
| 14 | **Transactions and durable commits**<br>What survives a crash halfway through a write? | 90s | Use a two-row money transfer to explain atomicity, commit and write-ahead logging. | Local ACID does not atomically include an external payment provider or message broker. | Orders, balances, durable state |
| 15 | **Normalization and denormalization**<br>Why store the same fact twice? | 75s | Compare joined source data with a read-optimized materialized view. | Denormalization creates an update and reconciliation obligation. | Profiles, catalog, feeds |
| 16 | **Object storage and large files**<br>Should the database store every video byte? | 75s | Separate metadata from blob bytes; trace a client upload using a scoped presigned URL. | An uploaded blob can exist before its metadata is finalized; validate and reconcile incomplete uploads. | Drive, photos, videos |
| 17 | **Distributed identifiers**<br>How do servers create IDs without taking turns? | 75s | Compare random UUIDs, time-ordered UUIDs and Snowflake-style IDs against coordination and index locality. | Time order is not causal order; clocks, worker identity, collision risk and guessability matter. | URL shortener, events, orders |

**Series checkpoint:** Choose a data model and defend its access, durability and storage costs.

### Series 04 — Caching and partitioning

5 reels · 6.8 minutes · Fundamentals

| Reel | Topic / hook | Target | What the viewer should understand | Production depth / misconception to address | Interview connection |
|---|---|---:|---|---|---|
| 18 | **Cache-aside reads**<br>Why ask the database for the same thing again? | 75s | Animate miss → database read → populate → hit; explain locality and bounded cache capacity. | A cache is usually a copy; design the miss and cache-down paths. | Read-heavy systems |
| 19 | **Cache writes and invalidation**<br>Why does a successful update show old data? | 90s | Trace a stale-value race; compare invalidate-on-write, write-through and write-back guarantees. | TTL bounds some staleness; it does not repair every race. Write-back needs explicit durability. | Profiles, product catalog |
| 20 | **TTL and eviction**<br>Which cached item should leave first? | 75s | Separate expiry from capacity eviction; compare LRU, LFU and FIFO on the same request sequence. | Policy choice depends on access patterns; expiry and eviction are independent. | Memory-bounded caches |
| 21 | **Sharding and shard keys**<br>Why is one database hot while others are idle? | 90s | Compare range and hash placement; choose a key from the dominant query and demonstrate a hotspot. | Cross-shard queries, secondary indexes and repartitioning have costs; table size alone is not a trigger. | Large user datasets, multi-tenancy |
| 22 | **Consistent hashing**<br>Why does adding one node move so much data? | 75s | Compare modulo remapping with a ring and virtual nodes. | Minimal expected movement assumes suitable key distribution; a hot key stays hot. | Distributed caches, partition placement |

**Series checkpoint:** Explain cached copies, placement, hotspots and partition trade-offs.

### Series 05 — Distributed correctness

7 reels · 10.2 minutes · Intermediate to advanced

| Reel | Topic / hook | Target | What the viewer should understand | Production depth / misconception to address | Interview connection |
|---|---|---:|---|---|---|
| 23 | **Replication, lag and failover**<br>Why does refresh hide a change you just saved? | 75s | Follow primary commit and asynchronous replica catch-up; show read routing for read-your-writes. | Replicas do not multiply write capacity or replace backups; failover can lose unreplicated writes. | Read-heavy apps, profiles |
| 24 | **Consistency models**<br>Which version is this read allowed to return? | 90s | Compare linearizability, eventual convergence and session guarantees with one write/read timeline. | Read-your-writes and monotonic reads are distinct; eventual consistency does not promise a fixed delay. | Chat, inventory, profiles |
| 25 | **CAP and the normal-path trade-off**<br>What should a disconnected replica do? | 90s | Partition a replicated service; contrast refusal with potentially stale answers, then introduce PACELC. | CAP consistency means linearizability; availability is a formal response guarantee, not a general uptime score. | Multi-region and replicated services |
| 26 | **Quorums and consensus**<br>How can replicas agree on one decision? | 90s | Show majority log commitment and quorum intersection; distinguish voting from a consensus protocol. | R + W > N alone does not establish linearizability; membership, versions and failure assumptions matter. | Replicated logs, durable writes |
| 27 | **Leases, distributed locks and fencing**<br>What if an old leader wakes up late? | 90s | Expire one worker’s lease and let a replacement take over; reject the stale worker with a fencing token. | A lease or lock alone cannot stop a paused worker’s later side effects. | Schedulers, exclusive resource access |
| 28 | **Concurrency and isolation**<br>Can two customers buy the last seat? | 90s | Show lost update and check-then-write races; fix one invariant using conditional updates or locking. | Isolation levels have different anomalies; serializable transactions can require retries. | Booking, stock, counters |
| 29 | **Distributed transactions and sagas**<br>What if payment succeeds but the order fails? | 90s | Compare coordinated commit with local steps and compensating actions using an order workflow. | Compensation is a business action and can fail; do not present a saga as an ACID rollback. | Checkout, multi-service workflows |

**Series checkpoint:** State an invariant and reason about replicas, races and coordination.

### Series 06 — Asynchronous work and events

6 reels · 8.2 minutes · Intermediate to advanced

| Reel | Topic / hook | Target | What the viewer should understand | Production depth / misconception to address | Interview connection |
|---|---|---:|---|---|---|
| 30 | **Work queues and retained event logs**<br>Why can two consumers need the same event? | 75s | Compare work distribution with a retained log and independent consumer positions. | Products can support several delivery modes; avoid equating a brand with one abstract model. | Background jobs, analytics |
| 31 | **Acknowledgements and delivery guarantees**<br>Did the worker finish before it crashed? | 90s | Move a crash before and after the side effect and acknowledgement; expose loss versus duplicate execution. | Exactly-once claims need a stated transaction boundary; external effects need their own protection. | Reliable workers, webhook consumers |
| 32 | **Partitions, ordering and consumer groups**<br>Why did event two arrive before event one? | 90s | Route related events to a partition; scale consumers while showing per-partition ordering. | Global ordering limits parallelism; ordering is not automatic across producers, partitions or retries. | Chat, order events, ingestion |
| 33 | **Idempotency and safe retries**<br>Could one retry charge you twice? | 75s | Reuse one operation key; atomically claim, protect the effect and replay an appropriate result. | Scope keys, match payloads, retain records and propagate protection across external boundaries. | Payments, create APIs, deduplication |
| 34 | **Transactional outbox and CDC**<br>What if the database commits but the event disappears? | 90s | Commit business state and an outbox row together; let a relay or CDC publish later. | Publishing can repeat; consumers still need deduplication and relevant ordering. | Order events, notifications |
| 35 | **Poison messages, DLQs and replay**<br>Can one bad event stop the entire queue? | 75s | Bound retries, isolate a malformed message and reprocess it after repair. | DLQs need owners, monitoring and safe replay; moving an event can affect ordering. | Event operations, reliable pipelines |

**Series checkpoint:** Move work off the request path without losing track of effects.

### Series 07 — Resilience and overload

6 reels · 9.0 minutes · Intermediate to advanced

| Reel | Topic / hook | Target | What the viewer should understand | Production depth / misconception to address | Interview connection |
|---|---|---:|---|---|---|
| 36 | **Deadlines, retries and jitter**<br>Can retrying make an outage worse? | 90s | Propagate a deadline and disperse retries using backoff, jitter and a retry budget. | Retry only suitable failures and protected operations; layered retries can multiply traffic. | Dependency failures, payment clients |
| 37 | **Backpressure and load shedding**<br>What if requests arrive faster than work finishes? | 90s | Fill a bounded queue; distinguish slowing producers, limiting concurrency and rejecting excess work. | An unbounded queue moves the outage into latency and memory; autoscaling takes time. | Workers, traffic spikes, uploads |
| 38 | **Rate limiting**<br>Should a client burst or send steadily? | 90s | Compare token bucket, leaky bucket and a sliding-window policy against a clear quota. | Distributed enforcement needs atomic decisions; per-user fairness and global limits differ. | API quotas, abuse prevention |
| 39 | **Circuit breakers and bulkheads**<br>Can a broken dependency consume every worker? | 90s | Fail fast after repeated failures and isolate resource pools so unrelated work survives. | A breaker needs recovery probes; isolation and fallback have capacity and correctness trade-offs. | Checkout dependencies, cascading failures |
| 40 | **Cache stampedes and hot keys**<br>What happens when the popular key expires? | 90s | Contrast synchronized misses, jittered expiry, request coalescing and stale-while-revalidate. | Negative caching helps repeated misses; hot-key capacity and freshness need separate decisions. | Viral content, cache recovery |
| 41 | **Multi-region recovery and disaster recovery**<br>What survives when a region disappears? | 90s | Trace active-passive failover and separate replication, backups, RPO and RTO. | Active-active adds conflict resolution; recovery targets must be tested, not assumed. | Global availability, durable products |

**Series checkpoint:** Keep overload and dependency failures from spreading.

### Series 08 — Production decisions

5 reels · 6.5 minutes · Advanced applied

| Reel | Topic / hook | Target | What the viewer should understand | Production depth / misconception to address | Interview connection |
|---|---|---:|---|---|---|
| 42 | **Observability, SLOs and error budgets**<br>How do you know the system is healthy? | 75s | Tie request traces, metrics and logs to a user-visible latency or availability SLO. | Use tail latency, queue age and actionable alerts; a green process is not a healthy user journey. | Operate any design |
| 43 | **Authentication, authorization and tenant isolation**<br>Can a logged-in user read someone else’s data? | 75s | Separate identity verification from per-resource permission checks; propagate tenant scope through storage and caches. | Tokens do not grant every permission; isolate cache keys and redact sensitive logs. | Multi-tenant SaaS, public APIs |
| 44 | **Monoliths, service boundaries and discovery**<br>Does this feature need a new service? | 75s | Choose boundaries by ownership, change patterns and independent scaling; show endpoint discovery after a split. | A service split adds network failure and operational cost; microservices are not a required milestone. | Architecture evolution |
| 45 | **Safe releases and schema evolution**<br>Why did a harmless deploy break old clients? | 90s | Keep old and new versions compatible with expand–migrate–contract; use one canary and rollback example. | Queued events, old clients and replicas outlive a deploy; destructive changes need staged migration. | API changes, production deployments |
| 46 | **Cost, retention and data lifecycle**<br>What does this design cost every month? | 75s | Estimate storage, replicas, request volume and egress; select retention and tiering from product requirements. | Use assumed unit costs, not universal price claims; deletion must consider derived copies and backups. | Media, analytics, long-lived data |

**Series checkpoint:** Explain operation, isolation, deployment and lifecycle obligations.

### Series 09 — Reusable product patterns

6 reels · 8.2 minutes · Advanced applied

| Reel | Topic / hook | Target | What the viewer should understand | Production depth / misconception to address | Interview connection |
|---|---|---:|---|---|---|
| 47 | **Real-time updates**<br>Does the server need to push, or both sides talk? | 75s | Choose polling, SSE or WebSockets from direction and update frequency; show reconnect and missed-event recovery. | A live connection does not provide durable delivery; long polling is a variation, not a whole new architecture. | Chat, stock ticks, live tracking |
| 48 | **Feeds and fan-out**<br>Why is a celebrity different from a normal user? | 90s | Compare fan-out-on-write with fan-out-on-read and a hybrid for skewed follower counts. | Delivery, ranking and freshness are different concerns; materialized feeds need repair paths. | Social feeds, activity streams |
| 49 | **Search and autocomplete**<br>Why is search not just a database filter? | 90s | Build a derived inverted index; distinguish document retrieval from prefix suggestion lookup. | Indexes lag source data; typo tolerance and ranking are separate extensions. | Catalog search, autocomplete |
| 50 | **Media processing and delivery**<br>What happens between Upload and Play? | 90s | Follow direct upload → queued transcoding → stored renditions → CDN → segment-based playback. | Processing states, failed jobs and bandwidth matter; protocol details stay outside the core reel. | YouTube-style video, photos |
| 51 | **Notifications and webhooks**<br>How does an event become one useful notification? | 75s | Trace a durable event through preferences, channel selection and a retrying delivery worker. | Deduplication, provider throttles, callback signatures and receipt status need explicit ownership. | Email/push, webhooks |
| 52 | **Nearby queries and location updates**<br>How do you find nearby drivers efficiently? | 75s | Turn coordinates into spatial cells, query candidate neighborhoods and filter exact distance. | Cell boundaries and stale coordinates matter; matching and ETA are additional problems. | Ride matching, nearby places |

**Series checkpoint:** Recognize the pattern behind different product descriptions.

### Series 10 — Interview case studies

8 reels · 12.0 minutes · Synthesis: four designs, two reels each

| Reel | Topic / hook | Target | What the viewer should understand | Production depth / misconception to address | Interview connection |
|---|---|---:|---|---|---|
| 53 | **URL shortener — minimal working design**<br>Where does a short link come from? | 90s | State requirements and a worked traffic assumption; define create/redirect APIs, ID strategy and lookup storage. | Explain redirects and expiry; keep analytics off the critical redirect path. | Read-heavy key lookup |
| 54 | **URL shortener — scale and failures**<br>What if one short link becomes viral? | 90s | Evolve the same diagram with caching, sharding, abuse controls and redirect-path recovery. | Choose a shard key and identify the actual failure bottleneck; avoid repeating concept definitions. | Hot keys, global reads |
| 55 | **Social feed — write and read paths**<br>Who builds the feed before you open it? | 90s | Define post/follow/feed access patterns and materialized timelines using previously taught fan-out. | Separate candidate delivery from ranking; show one practical cursor-pagination decision. | Fan-out and derived views |
| 56 | **Social feed — celebrity spike and repair**<br>What happens when millions follow one author? | 90s | Switch high-fan-out authors to read-time merge; handle lag, duplicates and rebuild of derived feeds. | Keep stable cursor semantics and a source of truth for repair. | Skew, asynchronous consistency |
| 57 | **Chat — durable message delivery**<br>When is a message really sent? | 90s | Trace sender → durable append → receiver; define message IDs, conversation partitioning and acknowledgements. | Distinguish accepted, delivered and read; connection state is separate from message storage. | Real-time plus durable storage |
| 58 | **Chat — reconnects, ordering and duplicates**<br>What happens after the phone goes offline? | 90s | Resume from a cursor; deduplicate retried sends and recover connection routing after a node failure. | Explain per-conversation order and lag; presence can be eventually consistent. | Session recovery, delivery guarantees |
| 59 | **Checkout — stock and payment invariants**<br>How do you sell the last item only once? | 90s | Define stock reservation and order state; protect inventory with a conditional update and payment with idempotency. | An invariant drives the architecture; payment, reservation and final order are distinct states. | Booking, inventory, money movement |
| 60 | **Checkout — partial failure and recovery**<br>What if payment works but checkout times out? | 90s | Continue the same state machine with outbox events, compensation, retry handling and reconciliation. | Specify reservation expiry and refund failure handling; one timeout does not determine payment outcome. | Distributed workflow correctness |

**Series checkpoint:** Combine the concepts into four coherent designs and defend their failures.

## 4. Where depth is mandatory

| Focus | Reels | Evidence the explanation must show |
|---|---|---|
| Quantitative reasoning | 02–04 | One worked assumption set; peak load; unit conversions; why a bottleneck follows from the numbers. |
| Data durability and access | 12–14, 21 | An actual lookup or write path; crash or hotspot; cost of the chosen fix. |
| Distributed correctness | 23–29 | A read/write timeline or race; the exact invariant; the behavior during partition or failover. |
| Delivery versus effects | 31–35 | Crash before/after acknowledgement; duplicate execution; protected side-effect boundary. |
| Overload and recovery | 36–41 | Bounded resources; retry or queue growth; controlled recovery and a stated sacrifice. |
| Product composition | 48, 53–60 | Read path, write path, dominant bottleneck and a named failure without re-teaching every component. |

These lessons receive up to 90 seconds and an explicit failure demonstration. Lower-level mechanics such as a complete Raft implementation or a cache eviction data structure are not smuggled into the core reel.

## 5. Interview question patterns and transfer

The named products below are representative prompts, not claims about actual internal implementations. The pattern and constraints determine the answer.

| Reusable pattern | Representative prompts | Required concept reels | Worked case in the core course | Follow-up to practice |
|---|---|---|---|---|
| Read-heavy lookup | URL shortener, paste service, profile service | 02–03, 09–12, 17–23, 38, 40 | 53–54 | What happens when one key accounts for most reads? |
| Fan-out and derived views | Social feed, activity feed, follower notifications | 15, 19, 23–24, 30–35, 48, 51 | 55–56 | What changes for a user with ten million followers? |
| Real-time durable messaging | Chat, collaboration updates, live notifications | 23–24, 31–33, 36–37, 43, 47 | 57–58 | How does an offline client recover missed events? |
| Scarce-resource correctness | Ticket booking, reservations, inventory | 14, 24–29, 33–34, 36 | 59–60 | Which invariant prevents two successful claims on one item? |
| Money and workflow recovery | Payments, checkout, transfer orchestration | 14, 28–29, 31–36, 42 | 59–60 | What is the response when the external payment outcome is unknown? |
| Asynchronous delivery | Notification service, webhook delivery, background jobs | 30–39, 42–45, 51 | Pattern lesson 51 | Can replay send an unwanted second notification? |
| Ingestion and analytics | Event collector, metrics pipeline, log ingestion | 03, 13, 21, 30–32, 35, 37, 46 | Transfer exercise | Can consumers keep up, and what happens when they cannot? |
| Media and file delivery | Video platform, cloud drive, photo service | 03, 10, 16, 30–31, 35, 37, 43, 46, 50 | Pattern lesson 50 | How are incomplete uploads and failed processing reconciled? |
| Search and suggestion | Product search, autocomplete, document search | 12, 15, 19, 23–24, 34, 49 | Pattern lesson 49 | How stale can a search result be after an update or deletion? |
| Location and matching | Nearby places, ride discovery | 21, 24, 37, 47, 52 | Pattern lesson 52 | How do you query across spatial-cell boundaries? |
| Shared enforcement | Rate limiter, quota service | 21, 27–28, 36–38, 43 | Mechanism lesson 38 | How much over-admission is acceptable during a partition? |
| Coordination and timed jobs | Distributed lock, leader-based scheduler | 26–28, 30–33, 35–37 | Transfer exercise; scheduler detail deferred | How do stale workers lose the right to mutate the resource? |

Use this interview answer order after the course: clarify requirements → estimate load → define API and data model → trace writes and reads → identify bottleneck → add the smallest useful change → test failures → explain the trade-off. Spend most of the discussion on the constraints that distinguish this prompt.

## 6. Retention and reel teaching format

The approved idempotency sample is the reference for pacing and clarity. Maintain its progressive diagram approach while varying the opening situation.

| Beat | Approximate share of a 75-second reel | Purpose |
|---|---:|---|
| Concrete hook | 0–5s | One surprising outcome or question; show its stakes. |
| Setup and failed behavior | 5–20s | Introduce only the actors needed to observe the problem. |
| Mechanism | 20–48s | Move packets, entries, votes or state; show why the fix changes the outcome. |
| Production boundary | 48–66s | Introduce one race, failure or cost that the simple explanation omitted. |
| Retrieval and hand-off | 66–75s | One usable mental model and the question that motivates the next episode. |

Do not force every reel into identical timestamps. A 90-second correctness lesson may need a longer race demonstration. A CTA should never displace the final explanation.

Visual rules for later production:

- Keep the diagram stable while the mechanism evolves. Prefer a lost packet, overflowing queue or stale value over a list of definitions.
- Use the same color meanings across the course: cyan for requests/identity, green for a valid result, red for failure, muted colors for context.
- On the first occurrence, expand abbreviations and define actor roles. Each reel should be understandable independently with one sentence of context.
- Show one principal diagram at a time. Avoid four algorithm demonstrations racing simultaneously.
- Keep captions and important labels inside the vertical safe area; verify phone-size readability.
- Mark example numbers as illustrative and state assumptions. Do not repeat hardware timings or vendor prices as universal constants.
- End with a transferable decision: “Choose X when constraint Y matters; account for cost Z.”

Suggested visual families: request timelines for protocols; moving table entries for indexes; replicas and version markers for consistency; queues and bounded workers for overload; state machines for workflows; one evolving architecture for case studies.

## 7. Learning checks without adding reels

Each series gets a short practice prompt in its written description or companion notes. These are not extra episodes.

| Series | Retrieval exercise |
|---|---|
| 01 | Estimate peak QPS and storage for an assumed workload, then name the likely bottleneck. |
| 02 | Trace a cache hit and miss from client to origin; identify which hops can be reused. |
| 03 | Choose storage and an index from three explicit query patterns; describe the write cost. |
| 04 | Explain a stale-cache race and a shard hotspot using your own timeline. |
| 05 | Pick an inventory invariant; test it under concurrent writers and a partition. |
| 06 | Place a worker crash on both sides of an acknowledgement and explain the retry. |
| 07 | Bound a queue and retry budget; state what the user receives during overload. |
| 08 | Name the dashboard signal, permission check and migration step your design needs. |
| 09 | Given a new product prompt, identify the dominant reusable pattern and its exception. |
| 10 | Reconstruct one case study without the video, then change a constraint and defend a revised design. |

For interview practice, follow the course with a timed design discussion and a failure follow-up. The reel course provides the reasoning tools; recalling component names is not the completion criterion.

## 8. Existing material and reuse

The existing `SYSTEM_DESIGN_CONTENT_PLAN.md` remains a production/publication record. This curriculum is a separate proposal; old episode numbers do not become course episode numbers automatically.

| Existing material | Candidate position in this course | Action when production is approved |
|---|---|---|
| Newly approved idempotency sample | 33 | Reuse the explanation; align numbering and any factual wording after review. |
| Packet journey | 06 | Review pacing and numerical assumptions, then reuse or recut. |
| HTTP versions | 07 | Review protocol claims and keep the blocking distinction clear. |
| Load-balancer family / proxy-gateway | 08–09 | Consolidate around responsibilities and routing failure; prevent repeated intros. |
| CDN / edge | 10 | Review routing terminology, cache keys and freshness. |
| Existing caching videos | 18–20 | Split by read behavior, update correctness and bounded capacity. |
| Consistent hashing | 22 | Review remapping assumptions and distinguish it from hot-key control. |
| Existing rate limiter | 38 | Review atomicity, distributed enforcement and algorithm scope. |
| Existing real-time protocols | 47 | Focus on direction, recovery and durability, with realistic latency claims. |

Reuse is a content decision after checking each asset, not an assertion that all existing videos meet this curriculum. The target is 60 final lessons; the number of newly produced videos will be lower if reviewed material fills some slots. No regeneration or recutting is initiated by this document.

## 9. Deliberate omissions and later extensions

To keep the core compact, the following are deferred. They may become a separate optional advanced season; no additional reels are included in the committed count.

- Bloom filters, probabilistic sketches, heavy-hitter detection and approximate analytics.
- Full Raft/log-replication mechanics, gossip, leaderless repair and anti-entropy.
- CRDTs and collaborative conflict resolution.
- CQRS and event sourcing beyond the materialized-view and outbox foundations.
- Stream-processing event time, watermarks and windowing.
- Distributed scheduler implementation and large-scale timing wheels.
- Database-specific MVCC internals, index types and online resharding procedures.
- Deep ranking/recommendation, media codec details and ETA/matching optimization.
- Service mesh, Kubernetes, infrastructure as code and provider-specific configuration.
- AI/vector-search systems and model-serving architectures.
- Low-level design, coding patterns and algorithm interview preparation.

These are valuable specialties. They do not all need dedicated lessons in a short general system-design crash course. Core lessons flag the extension point rather than implying that it has been taught.

## 10. Accuracy and planning sources

The topic order and episode count are our editorial choices. Official guidance supports the emphasis on practical trade-offs and system behavior; it does not establish a universal interview-question frequency list.

- [Amazon senior SDE interview guidance](https://www.amazon.jobs/content/en/how-we-hire/sde-iii-interview-prep) identifies practicality, accuracy, efficiency, reliability, optimization and scalability as design objectives. This supports teaching defensible decisions and follow-up reasoning rather than memorized diagrams.
- [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/) supports giving idempotency, caller intent and duplicate side effects explicit depth in reel 33.
- [Stripe idempotent requests](https://docs.stripe.com/api/idempotent_requests) provides a concrete API example for key reuse, parameter matching and retention. Its API v1 and v2 retry-result behavior differ; any future branded example must identify the relevant API version.
- [Apache Kafka design documentation, version 4.1](https://kafka.apache.org/41/design/design/) informs partitioning, consumer positions and bounded delivery guarantees in reels 30–32. This is a versioned reference, not a claim that 4.1 is the latest release.
- [PostgreSQL transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html) informs the concurrency anomalies and retry obligations taught in reel 28; do not generalize a particular database’s isolation behavior to every engine.
- [Google SRE: Handling overload](https://sre.google/sre-book/handling-overload/) informs the resource limits, load shedding and overload reasoning in reels 37–39.

## 11. Planning gate

This document completes curriculum planning only. The next production decision is approval or revision of the scope, order and 60-reel count. After that, prepare a batch-level storyboard and lesson specifications, review factual boundaries, audit reusable assets, and produce in dependency order.

Do not start generating scripts, narration, diagrams or video assets until the user asks to proceed.
