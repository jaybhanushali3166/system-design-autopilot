#!/bin/bash
set -e

VOICE="en-US-AndrewMultilingualNeural"
RATE="+8%" # Natural engaging storytelling pace like YouTube explainer

mkdir -p public/audio

# Act 1: The Hook & The "Why" (Curiosity & Pain) (~14s)
/Library/Frameworks/Python.framework/Versions/3.13/bin/edge-tts \
  --voice "$VOICE" --rate "$RATE" \
  --text "Imagine you are running a banana stand. Suddenly, ten thousand hungry chimps show up, screaming for the exact same ripe banana! What happens to your backend?" \
  --write-media public/audio/caching-v2-act1-hook.mp3

# Act 2: The Bottleneck - The Disk Mines & The Math (~18s)
/Library/Frameworks/Python.framework/Versions/3.13/bin/edge-tts \
  --voice "$VOICE" --rate "$RATE" \
  --text "Your poor database monkey has to run all the way down into the dark disk vault every single millisecond. Reading spinning disk storage takes two hundred milliseconds. That is one hundred thousand times slower than RAM! CPU hits one hundred percent, connections lock up, and your server crashes." \
  --write-media public/audio/caching-v2-act2-problem.mp3

# Act 3: The Cure - Redis & Cache-Aside Pattern (~22s)
/Library/Frameworks/Python.framework/Versions/3.13/bin/edge-tts \
  --voice "$VOICE" --rate "$RATE" \
  --text "Here is the trick: Eighty percent of users ask for the top twenty percent of bananas! Enter Redis. Instead of digging into disk, you put a high-speed conveyor belt in memory. When a request comes in: check RAM first. That is a cache hit in under one millisecond! Only if it is missing do you touch the disk and update the cache." \
  --write-media public/audio/caching-v2-act3-solution.mp3

# Act 4: The Senior Interview Nugget - Eviction & Invalidation (~16s)
/Library/Frameworks/Python.framework/Versions/3.13/bin/edge-tts \
  --voice "$VOICE" --rate "$RATE" \
  --text "In a system design interview, never just say add Redis. Drop the golden nugget: always choose an LRU eviction policy so old bananas get tossed out, and set a smart TTL to prevent stale data. Cache early, protect your database, and scale effortlessly." \
  --write-media public/audio/caching-v2-act4-interview.mp3

echo "Generated 60-70s audio files. Measuring durations..."
total=0
for f in public/audio/caching-v2-act*.mp3; do
  dur=$(/opt/homebrew/bin/ffprobe -i "$f" -show_entries format=duration -v quiet -of csv="p=0")
  echo "$f: $dur seconds"
done
