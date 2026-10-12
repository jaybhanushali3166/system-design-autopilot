#!/bin/bash
set -e
AUDIO_DIR="public/audio"
VOICE="${VOICE:-en-US-AndrewMultilingualNeural}"
RATE="${RATE:-+8%}"
mkdir -p "$AUDIO_DIR"

generate() {
  local SCENE=$1; local TEXT=$2; local OUT="${AUDIO_DIR}/caching-fresh-${SCENE}.mp3"
  echo "🎙️ Generating [${SCENE}] with ${VOICE}..."
  edge-tts --voice "$VOICE" --rate="$RATE" --text "$TEXT" --write-media "$OUT"
  DURATION=$(ffprobe -i "$OUT" -show_entries format=duration -v quiet -of csv="p=0" 2>/dev/null)
  echo "   ✅ ${OUT} (${DURATION}s)"
}

generate "hook" \
  "Why can ten million people open Netflix at once and get their home screen in 0.3 seconds? One fundamental concept powers every lightning-fast app you use. It is called Caching. Let's break it down from first principles."

generate "problem" \
  "Here is the naive system design: user makes a request, the app server handles it, and queries the database on spinning disk or flash. Disk I/O takes 150 to 300 milliseconds. Under heavy load, ten thousand concurrent users send ten thousand identical queries straight to the disk. The database gets overwhelmed, CPU hits 100%, and your entire service goes down."

generate "solution" \
  "The fix is adding an in-memory cache like Redis between your server and database. 80% of read traffic asks for the same 20% of popular data. By storing that hot data directly in RAM, cache hits respond in under 1 millisecond. With a 99% hit rate, your database gets 100 times less traffic. Your database barely breaks a sweat."

generate "depth" \
  "In system design, there are three primary caching strategies. First, Cache-Aside: your application reads from the cache, and on a miss, queries the database and populates the cache. Best for read-heavy apps. Second, Write-Through: writes update both cache and database synchronously, guaranteeing zero stale data. Third, Write-Behind: writes update the cache instantly and flush to the database in async batches for maximum throughput."

generate "interview" \
  "When interviewers ask about caching, never just say 'add Redis'. Impress them with four senior points: explicitly state your caching strategy, detail cache invalidation with TTLs and event triggers, define an eviction policy like LRU when RAM is bounded, and explain how you protect against cold-start thundering herds. That is how you pass your system design interview."

echo "🏁 All caching-fresh voiceovers generated successfully!"
