import os
import sys
import json
import urllib.request
import subprocess

API_KEY = os.environ.get("ELEVEN_API_KEY", "").strip()
# Voice used in ElevenLabs if key provided: Rachel (21m00Tcm4TlvDq8ikWAM) or Adam (pNInz6obpgDQGcFmaJgB)
VOICE_ID = os.environ.get("VOICE_ID", "21m00Tcm4TlvDq8ikWAM")
MODEL = "eleven_turbo_v2_5"

AUDIO_DIR = "public/audio"
os.makedirs(AUDIO_DIR, exist_ok=True)

# ── Conversational Educator Narration (Same voice & tone as LB Reels) ─────────
SCENES = {
    "packet-journey-act1-question": (
        "Ever wonder why your very first API call takes 300 milliseconds, "
        "but the exact same request a second later takes only 15ms? "
        "Where did 285 milliseconds vanish? "
        "You just paid the internet's invisible trust tax. Here's why."
    ),
    "packet-journey-act2-dns": (
        "Before your app can even talk to a server, it has to find its address. "
        "Your phone halts and asks a recursive DNS resolver: 'Where is stripe.com?'. "
        "That lookup alone burns 60 milliseconds just to get an IP address, "
        "before you've sent a single byte of data."
    ),
    "packet-journey-act3-tcp": (
        "Now you have the IP, but can you send your JSON? Not yet. "
        "TCP requires a reliable three-way handshake. "
        "SYN travels 3,000 miles to the server. SYN ACK travels 3,000 miles back. ACK locks it in. "
        "That is one full round trip across physical glass fiber, burning another 80 milliseconds."
    ),
    "packet-journey-act4-tls": (
        "Next is security. You can't send auth tokens in plaintext across public routers. "
        "So TLS 1.3 kicks in with a Diffie-Hellman key exchange to establish an encrypted tunnel. "
        "Another full round trip across the continent. "
        "We're now at 220 milliseconds of pure handshake tax."
    ),
    "packet-journey-act5-http": (
        "Only now does your actual HTTP request fly across the wire and return JSON. "
        "300 milliseconds total. "
        "But here is the secret: for request number two, DNS is cached, TCP connections stay open with Keep-Alive, "
        "and TLS keys are reused. All three handshakes vanish, dropping your latency straight to 15 milliseconds."
    ),
    "packet-journey-act6-takeaway": (
        "This is why senior engineers obsess over connection pooling, TLS 1.3, and Edge CDNs. "
        "We terminate connections close to users so they never pay that cold start tax. "
        "Follow for more real-world system design."
    )
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
            "stability": 0.40,
            "similarity_boost": 0.82,
            "style": 0.30,
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
    except Exception as e:
        print(f"❌ ElevenLabs error: {e}")
        return None

def generate_edge_tts(name, text):
    out_file = os.path.join(AUDIO_DIR, f"{name}.mp3")
    cmd = [
        "edge-tts",
        "--voice", "en-US-AndrewMultilingualNeural",
        "--rate", "+11%",
        "--text", text,
        "--write-media", out_file
    ]
    for attempt in range(1, 4):
        try:
            subprocess.run(cmd, check=True)
            dur = get_duration(out_file)
            print(f"✅ [LB Reel Voice: AndrewMultilingualNeural] {out_file} ({dur:.2f}s)")
            return dur
        except Exception as e:
            print(f"⚠️ [Attempt {attempt}/3] error: {e}. Retrying in 2 seconds...")
            import time
            time.sleep(2)
    raise RuntimeError(f"Failed to generate {out_file} after 3 attempts")

def get_duration(path):
    cmd = ["ffprobe", "-i", path, "-show_entries", "format=duration", "-v", "quiet", "-of", "csv=p=0"]
    res = subprocess.check_output(cmd).decode("utf-8").strip()
    return float(res)

durations = {}

print("=== Generating Conversational Voiceover for Packet Journey (Same as LB Reel) ===")
use_eleven = bool(API_KEY)
if use_eleven:
    print(f"Using ElevenLabs API Key with Voice: {VOICE_ID}...")
else:
    print("Using exact same voice as Load Balancer Reels (en-US-AndrewMultilingualNeural, +11% rate)...")

for name, text in SCENES.items():
    dur = None
    if use_eleven:
        dur = generate_elevenlabs(API_KEY, name, text)
    if dur is None:
        dur = generate_edge_tts(name, text)
    durations[name] = round(dur, 2)

manifest_file = os.path.join(AUDIO_DIR, "packet-journey-durations.json")
with open(manifest_file, "w") as f:
    json.dump(durations, f, indent=2)

print(f"\nManifest saved to {manifest_file}:")
print(json.dumps(durations, indent=2))
