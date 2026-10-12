import os
import sys
import json
import urllib.request
import subprocess

API_KEY = os.environ.get("ELEVEN_API_KEY", "").strip()

# Best voice for tech system design explainers:
# Adam: pNInz6obpgDQGcFmaJgB (deep, clear, natural, authoritative tech narrator)
# Rachel: 21m00Tcm4TlvDq8ikWAM (expressive, warm)
VOICE_ID = os.environ.get("VOICE_ID", "pNInz6obpgDQGcFmaJgB") # Adam
MODEL = "eleven_turbo_v2_5"

AUDIO_DIR = "public/audio"
os.makedirs(AUDIO_DIR, exist_ok=True)

SCENES = {
    "rate-limiter-fresh-hook": "How does an API handle 100,000 requests every second without crashing?",
    "rate-limiter-fresh-problem": "Without protection, a single rogue script floods your server. Threads starve, memory spikes, and every legitimate user gets a 504 timeout.",
    "rate-limiter-fresh-solution": "The solution is a Rate Limiter using Token Bucket. New tokens drop into the bucket every second. Incoming requests must take a token to pass through.",
    "rate-limiter-fresh-burst": "If tokens are available, requests fly through with zero delay. But once the bucket is empty, excess requests are instantly dropped with HTTP 429 Too Many Requests.",
    "rate-limiter-fresh-takeaway": "At massive scale, companies like Stripe use Redis Lua scripts to track tokens atomically in sub-millisecond time. That is how your system survives any traffic spike."
}

def generate_elevenlabs(key, name, text):
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    headers = {
        "xi-api-key": key,
        "Content-Type": "application/json"
    }
    payload = {
        "text": text,
        "model_id": MODEL,
        "voice_settings": {
            "stability": 0.45,
            "similarity_boost": 0.82,
            "style": 0.28,
            "use_speaker_boost": True
        }
    }
    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            data = resp.read()
            out_file = os.path.join(AUDIO_DIR, f"{name}.mp3")
            with open(out_file, "wb") as f:
                f.write(data)
            dur = get_duration(out_file)
            print(f"✅ [ElevenLabs] {out_file} ({dur:.2f}s)")
            return dur
    except urllib.error.HTTPError as e:
        print(f"❌ ElevenLabs HTTP Error {e.code}: {e.read().decode('utf-8')}")
        return None
    except Exception as e:
        print(f"❌ ElevenLabs Exception: {e}")
        return None

def generate_edge_tts(name, text):
    out_file = os.path.join(AUDIO_DIR, f"{name}.mp3")
    cmd = [
        "edge-tts",
        "--voice", "en-US-AndrewMultilingualNeural",
        "--rate", "+6%",
        "--text", text,
        "--write-media", out_file
    ]
    subprocess.run(cmd, check=True)
    dur = get_duration(out_file)
    print(f"✅ [Edge-TTS fallback] {out_file} ({dur:.2f}s)")
    return dur

def get_duration(path):
    cmd = ["ffprobe", "-i", path, "-show_entries", "format=duration", "-v", "quiet", "-of", "csv=p=0"]
    res = subprocess.check_output(cmd).decode("utf-8").strip()
    return float(res)

durations = {}

print("=== Generating Voiceovers for Fresh Rate Limiter Reel ===")
use_eleven = bool(API_KEY)
if use_eleven:
    print(f"Using ElevenLabs API Key with Voice: {VOICE_ID}...")
else:
    print("ELEVEN_API_KEY not found in environment, using high-definition neural TTS as default fallback...")

for name, text in SCENES.items():
    dur = None
    if use_eleven:
        dur = generate_elevenlabs(API_KEY, name, text)
    if dur is None:
        dur = generate_edge_tts(name, text)
    durations[name] = round(dur, 2)

manifest_file = os.path.join(AUDIO_DIR, "rate-limiter-fresh-durations.json")
with open(manifest_file, "w") as f:
    json.dump(durations, f, indent=2)

print(f"\nSaved durations to {manifest_file}:")
print(json.dumps(durations, indent=2))

