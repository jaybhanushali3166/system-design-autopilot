#!/bin/bash
set -e

VOICE="en-US-AndrewMultilingualNeural"
RATE="+28%" # Super snappy reel pace

mkdir -p public/audio

# Scene 1: Hook (Target ~2.8s)
/Library/Frameworks/Python.framework/Versions/3.13/bin/edge-tts \
  --voice "$VOICE" --rate "$RATE" \
  --text "Why your server crashes when 10,000 monkeys hit it at once!" \
  --write-media public/audio/caching-scene1-hook.mp3

# Scene 2: Problem (Target ~6.8s)
/Library/Frameworks/Python.framework/Versions/3.13/bin/edge-tts \
  --voice "$VOICE" --rate "$RATE" \
  --text "Without caching, your database is a tired monkey counting 10 million bananas by hand on slow disk! Every query locks up, and the server melts into banana smoothie." \
  --write-media public/audio/caching-scene2-problem.mp3

# Scene 3: Solution (Target ~8.8s)
/Library/Frameworks/Python.framework/Versions/3.13/bin/edge-tts \
  --voice "$VOICE" --rate "$RATE" \
  --text "Enter Redis! Put fresh bananas on a high-speed conveyor belt in memory. Cache hit? Boom! Delivered in 1 millisecond. The database monkey takes a nap!" \
  --write-media public/audio/caching-scene3-solution.mp3

# Scene 4: Outro (Target ~4.5s)
/Library/Frameworks/Python.framework/Versions/3.13/bin/edge-tts \
  --voice "$VOICE" --rate "$RATE" \
  --text "Stop torturing your database monkey in the disk mines. Cache in memory, and scale to millions!" \
  --write-media public/audio/caching-scene4-outro.mp3

echo "Generated refined audio files. Measuring durations..."
for f in public/audio/caching-scene*.mp3; do
  dur=$(/opt/homebrew/bin/ffprobe -i "$f" -show_entries format=duration -v quiet -of csv="p=0")
  echo "$f: $dur seconds"
done
