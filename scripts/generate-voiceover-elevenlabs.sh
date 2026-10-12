#!/bin/bash
# ─────────────────────────────────────────────────────────────
# generate-voiceover-elevenlabs.sh
# Uses ElevenLabs neural TTS (free tier: 10k chars/month)
# Usage: ELEVEN_API_KEY=your_key ./scripts/generate-voiceover-elevenlabs.sh load-balancer
# ─────────────────────────────────────────────────────────────

REEL=$1
API_KEY=${ELEVEN_API_KEY:-$1}

if [ -z "$ELEVEN_API_KEY" ]; then
  echo "❌ Set your ElevenLabs API key:"
  echo "   export ELEVEN_API_KEY=your_key_here"
  echo "   ./scripts/generate-voiceover-elevenlabs.sh load-balancer"
  exit 1
fi

AUDIO_DIR="public/audio"
mkdir -p "$AUDIO_DIR"

# ── Voice: "Rachel" — calm, natural, great for explainers ────────────────────
VOICE_ID="21m00Tcm4TlvDq8ikWAM"
MODEL="eleven_turbo_v2_5"

# Voice settings: stability=0.4 (expressive), similarity=0.8, style=0.3 (slight warmth)
VOICE_SETTINGS='{"stability":0.4,"similarity_boost":0.8,"style":0.3,"use_speaker_boost":true}'

generate() {
  local SCENE=$1
  local TEXT=$2
  local OUT="${AUDIO_DIR}/${REEL}-${SCENE}.mp3"

  echo "🎙️ Generating: ${SCENE}..."

  HTTP_STATUS=$(curl -s -o "$OUT" -w "%{http_code}" \
    -X POST "https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}" \
    -H "xi-api-key: ${ELEVEN_API_KEY}" \
    -H "Content-Type: application/json" \
    -d "{\"text\": \"${TEXT}\", \"model_id\": \"${MODEL}\", \"voice_settings\": ${VOICE_SETTINGS}}")

  if [ "$HTTP_STATUS" = "200" ]; then
    DURATION=$(ffprobe -i "$OUT" -show_entries format=duration -v quiet -of csv="p=0" 2>/dev/null)
    echo "   ✅ ${OUT} (${DURATION}s)"
  else
    echo "   ❌ Failed (HTTP $HTTP_STATUS). Check your API key or quota."
    cat "$OUT"
    rm -f "$OUT"
  fi
}

case $REEL in
  "load-balancer")
    generate "hook" \
      "Why does Netflix never go down?"

    generate "problem" \
      "Without proper architecture, a single server handles all your traffic. It gets overwhelmed. Response times spike. Then it crashes — and everyone is locked out."

    generate "solution" \
      "The fix is a Load Balancer. It sits in front of your servers and distributes incoming traffic evenly. Round Robin rotates requests one by one. Least Connections routes to the least busy server. When a server fails, traffic instantly reroutes to the healthy ones. Need more capacity? Just add another server. Horizontal scaling, with zero downtime."

    generate "realworld" \
      "Netflix, Amazon, Google, Uber, and Twitter all run load balancers. AWS ALB, Nginx, and HAProxy handle millions of requests per second. Follow for more system design."
    ;;
  *)
    echo "❌ No narration found for: $REEL. Add it to the script."
    exit 1
    ;;
esac

echo ""
echo "🏁 All clips ready in ${AUDIO_DIR}/"
echo "   Reload Remotion Studio to hear the new voices."
