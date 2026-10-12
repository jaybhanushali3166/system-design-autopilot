#!/bin/bash
set -e
AUDIO_DIR="public/audio"
VOICE="${VOICE:-en-US-AndrewMultilingualNeural}"
RATE="${RATE:-+10%}"
mkdir -p "$AUDIO_DIR"

generate() {
  local SCENE=$1; local TEXT=$2; local OUT="${AUDIO_DIR}/rate-limiter-${SCENE}.mp3"
  echo "🎙️ Generating [${SCENE}] with ${VOICE}..."
  edge-tts --voice "$VOICE" --rate="$RATE" --text "$TEXT" --write-media "$OUT"
  DURATION=$(ffprobe -i "$OUT" -show_entries format=duration -v quiet -of csv="p=0" 2>/dev/null)
  echo "   ✅ ${OUT} (${DURATION}s)"
}

generate "hook" \
  "One script just sent one million login requests in ten seconds. If you don't have this single system design building block, your servers instantly crash. It's called Rate Limiting. Here is how it actually works."

generate "problem" \
  "Without rate limiting, any bad actor, rogue scraper, or buggy loop can flood your API. Servers max out their worker threads, the database queue overflows, and legitimate users get 504 Gateway Timeouts. This is denial of service, and it kills your system."

generate "solution" \
  "Enter the Token Bucket algorithm. Imagine a bucket with a fixed capacity, say five tokens. Every second, a refill stream adds new tokens at a steady rate. When a request arrives, it grabs a token. If the bucket has tokens, the request passes instantly! If it's empty, the request is immediately dropped with HTTP 429 Too Many Requests."

generate "algorithms" \
  "In system design interviews, knowing just Token Bucket isn't enough. Compare all four classics: Token Bucket allows bursts while capping average rate. Leaky Bucket smooths traffic into a constant steady drip. Fixed Window Counter is simple but vulnerable to 2x boundary spikes. And Sliding Window Log gives pinpoint precision at the cost of higher memory."

generate "realworld" \
  "How do tech giants scale rate limiters across thousands of servers? They use distributed in-memory stores like Redis. With Redis Lua scripts, token checks and refills run atomically in sub-millisecond time without race conditions. That is how Stripe and Cloudflare protect billions of requests every single day."

echo "🏁 All rate-limiter voiceovers generated successfully!"
