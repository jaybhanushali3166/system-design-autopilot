#!/bin/bash
# ─────────────────────────────────────────────────────────────
# generate-voiceover.sh
# Uses Microsoft Neural TTS via edge-tts (100% free, no API key)
# High-quality natural male voice: en-US-AndrewMultilingualNeural
# Usage: ./scripts/generate-voiceover.sh load-balancer
# ─────────────────────────────────────────────────────────────

REEL=$1
if [ -z "$REEL" ]; then
  echo "Usage: ./scripts/generate-voiceover.sh <reel-id>"
  exit 1
fi

AUDIO_DIR="public/audio"
VOICE="${VOICE:-en-US-AndrewMultilingualNeural}"
RATE="${RATE:-+12%}"
mkdir -p "$AUDIO_DIR"

generate() {
  local SCENE=$1; local TEXT=$2; local OUT="${AUDIO_DIR}/${REEL}-${SCENE}.mp3"
  echo "🎙️  Generating [${SCENE}] with ${VOICE} (rate: ${RATE})..."
  edge-tts --voice "$VOICE" --rate="$RATE" --text "$TEXT" --write-media "$OUT"
  DURATION=$(ffprobe -i "$OUT" -show_entries format=duration -v quiet -of csv="p=0" 2>/dev/null)
  echo "   ✅ ${OUT} (${DURATION}s)"
}

case $REEL in
  "load-balancer")
    generate "hook" \
      "Ever wonder why 250 million people can stream Netflix at once, but an internal company portal crashes when three people file expenses? The secret is a Load Balancer."
    generate "problem" \
      "Here is the naive architecture: one server handling every single incoming request. It works fine in localhost... until real traffic hits. Requests queue up, latency spikes, and your single point of failure becomes a total outage."
    generate "solution" \
      "The solution is not buying an expensive supercomputer. It is a Load Balancer. It sits at the edge, distributing requests across a pool of servers using algorithms like Round Robin or Least Connections. If a node fails, traffic reroutes in milliseconds. When traffic surges, you simply spin up more instances behind it. Seamless horizontal scaling."
    generate "realworld" \
      "Every high-scale system from Netflix to Stripe relies on this. Whether it is NGINX, HAProxy, or AWS ALB, it is the unsung hero keeping you away from 3 AM on-call incidents."
    ;;
  "lb-algorithms")
    generate "hook" \
      "Ever picked the slowest checkout lane at the supermarket while the line next to you flies by? That is exactly what happens when your architecture uses the wrong load balancing algorithm."
    generate "problem" \
      "Most beginners assume Round Robin is always the answer: Request one to Server A, Request two to Server B. But real-world requests are not equal. One user fetches a 2-kilobyte profile pic, while another triggers a 4K video export. Blind rotation suffocates one server while others sit idle."
    generate "solution" \
      "Enter smart algorithms. For long-running tasks or streaming, use Least Connections — routing requests to the server with the fewest active jobs. For stateful apps and caching, use IP Hashing so a client consistently sticks to the same node. For unequal server hardware, use Weighted Round Robin. You match the algorithm to the workload."
    generate "realworld" \
      "In your system design interview, never just draw a load balancer box and move on. Mentioning Least Connections for WebSockets or IP Hashing for session stickiness is the difference between a mid-level and senior answer."
    ;;
  "lb-layers-ha")
    generate "hook" \
      "Every junior engineer puts a load balancer in their interview design and says the system is scalable. Then the interviewer asks: What happens when the load balancer itself dies? Silence."
    generate "problem" \
      "Congratulations, you just moved your single point of failure one level up. And worse: picking the wrong layer ruins performance. Layer 7 inspects HTTP headers, cookies, and URL paths — powerful, but CPU-intensive."
    generate "solution" \
      "Here is the senior blueprint. First, pick your layer. Layer 4 routes raw TCP packets at line-speed with zero payload inspection. Layer 7 routes by application logic, like sending slash-api to payments and slash-video to streaming. Second, eliminate the single point of failure with an Active-Passive pair. If the active balancer drops, the standby claims the Virtual IP instantly."
    generate "realworld" \
      "Cloudflare, AWS, and Netflix combine this: Anycast DNS at the global edge, Layer 4 for ultra-fast packet routing, and Layer 7 at the service boundary. That is how you deliver true five-nines availability."
    ;;
  "lb-consistent-hashing")
    generate "hook" \
      "Here is the ultimate bonus question that separates senior candidates from the rest: What happens to your cache or stateful backend when you add just one new server behind your load balancer?"
    generate "problem" \
      "Most engineers use naive hashing: hash of key, modulo N servers. It works great... until server three crashes or you scale to N plus one. Suddenly, nearly every key maps to a completely different node! You trigger a catastrophic cache avalanche, crushing your database and causing a total cascade failure."
    generate "solution" \
      "The solution is Consistent Hashing on a virtual ring. Both servers and keys are hashed onto a zero to 360-degree circle. A request simply walks clockwise to the nearest server node. When a server dies, only its immediate neighbor takes the load — leaving the other servers completely untouched. With virtual nodes, load stays mathematically balanced across the entire cluster."
    generate "realworld" \
      "This is the core architecture powering Amazon DynamoDB, Apache Cassandra, Discord voice servers, and Akamai CDNs. Mentioning virtual nodes and minimal key relocation will instantly earn you bonus points in any distributed system interview."
    ;;
  *)
    echo "❌ No narration for: $REEL. Add it to this script."
    exit 1
    ;;
esac

echo ""
echo "🏁 Done! Reload Remotion Studio or run: npm run render"
