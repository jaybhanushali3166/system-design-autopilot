import os
import sys
import json
import urllib.request
import subprocess
import time

API_KEY = os.environ.get("ELEVEN_API_KEY", "").strip()
VOICE_ID = os.environ.get("VOICE_ID", "21m00Tcm4TlvDq8ikWAM") # Rachel or custom
MODEL = "eleven_turbo_v2_5"

AUDIO_DIR = "public/audio"
os.makedirs(AUDIO_DIR, exist_ok=True)

# ── Dynamic, Conversational Educator Scripts for Module 1 Reels 2, 3, 4 ────────
REELS = {
    # ── REEL 02: HTTP/1.1 vs HTTP/2 vs HTTP/3 (QUIC) ──────────────────────────
    "http-versions": {
        "http-versions-act1-hook": (
            "Ever wonder why your webpage completely freezes while waiting for one single tiny image to load? "
            "Where did the bottleneck come from? "
            "It's called Head-of-Line Blocking. "
            "Here is how 25 years of HTTP evolution solved it."
        ),
        "http-versions-act2-http1": (
            "In HTTP 1.1, each TCP connection handles only one request at a time. "
            "To speed things up, browsers open six parallel TCP connections. "
            "But if request number one gets stuck on a slow database query, "
            "every request queued behind it is completely blocked. "
            "That is application-layer Head-of-Line Blocking."
        ),
        "http-versions-act3-http2": (
            "HTTP 2 fixed this by introducing multiplexing over a single TCP connection. "
            "Requests are split into binary frames and interleaved simultaneously. "
            "Images, CSS, and API data fly across the same wire together. "
            "Sounds perfect, right? But there is a hidden trap."
        ),
        "http-versions-act4-http3": (
            "The trap is TCP itself. Because TCP guarantees strict order, "
            "if just one single packet drops on the network, "
            "TCP halts the entire connection until that packet is retransmitted. "
            "Every multiplexed stream freezes! That is transport-layer Head-of-Line Blocking."
        ),
        "http-versions-act5-quic": (
            "Enter HTTP 3. It says goodbye to TCP entirely and runs over UDP using QUIC. "
            "In HTTP 3, every stream is completely independent. "
            "If stream two drops a packet, stream one and stream three keep flying with zero delay. "
            "Plus, connection migration lets you switch from Wi-Fi to 5G without dropping your session."
        ),
        "http-versions-act6-takeaway": (
            "In your next interview, remember: "
            "HTTP 1.1 suffered from request blocking. "
            "HTTP 2 introduced multiplexing but suffered from TCP packet blocking. "
            "HTTP 3 uses QUIC over UDP for true stream independence. "
            "Follow for more real-world system design."
        )
    },

    # ── REEL 03: REAL-TIME PROTOCOLS (Polling vs SSE vs WebSockets) ───────────
    "realtime-protocols": {
        "realtime-protocols-act1-hook": (
            "How does Uber update a moving car on your screen every single second, "
            "without draining your phone's battery or melting their servers? "
            "Here are the four real-time architectures every system designer must know."
        ),
        "realtime-protocols-act2-polling": (
            "The beginner approach is Short Polling. "
            "Your app sends an HTTP GET request every second asking: 'Is there new data?'. "
            "99% of responses return empty 304s, "
            "burning CPU and wasting 800 bytes of HTTP headers on every single ping."
        ),
        "realtime-protocols-act3-sse": (
            "For one-way streaming from server to client, use Server-Sent Events. "
            "The client opens a single persistent HTTP connection, "
            "and the server pushes live events as they happen. "
            "This is how ChatGPT streams AI tokens and how stock tickers update—"
            "lightweight, with built-in browser reconnection."
        ),
        "realtime-protocols-act4-websockets": (
            "But what if you need full two-way communication? "
            "Enter WebSockets. It starts as an HTTP handshake and upgrades to a full-duplex TCP socket. "
            "Framing overhead drops from 800 bytes of HTTP headers down to just two bytes per message. "
            "Both client and server send messages simultaneously with sub-millisecond latency."
        ),
        "realtime-protocols-act5-takeaway": (
            "Here is the senior engineer decision matrix: "
            "Use Server-Sent Events when only the server needs to push, like live notifications or AI streaming. "
            "Use WebSockets when both sides talk rapidly, like live chat or multiplayer games. "
            "Save this reel for your next system design interview!"
        )
    },

    # ── REEL 04: REVERSE PROXY VS API GATEWAY ──────────────────────────────────
    "proxy-gateway": {
        "proxy-gateway-act1-hook": (
            "In almost every system design interview, "
            "candidates confuse a Reverse Proxy with an API Gateway. "
            "They both sit in front of your servers, but they do completely different jobs. "
            "Let's break down the architecture."
        ),
        "proxy-gateway-act2-reverse": (
            "A Reverse Proxy, like NGINX or HAProxy, is an infrastructure gatekeeper. "
            "It sits at the wire edge to protect your servers: "
            "terminating SSL certificates, caching static assets, and load balancing raw TCP or HTTP traffic. "
            "Clients have no idea which physical backend server actually answered."
        ),
        "proxy-gateway-act3-gateway": (
            "An API Gateway, like Kong or AWS API Gateway, is an application brain. "
            "It understands your business logic: "
            "validating JWT authentication tokens, enforcing per-user rate limits, "
            "and translating public REST endpoints into internal gRPC microservices."
        ),
        "proxy-gateway-act4-aggregation": (
            "Even better, API Gateways perform Request Aggregation. "
            "Instead of your mobile app making five separate network calls for user profile, orders, and recommendations, "
            "it makes one call to the gateway. "
            "The gateway queries the internal microservices in parallel and returns a single clean JSON response."
        ),
        "proxy-gateway-act5-takeaway": (
            "In production, top tech companies combine both: "
            "a Reverse Proxy at the edge for line-speed SSL termination and DDoS defense, "
            "routing into an API Gateway for auth, rate limiting, and microservice orchestration. "
            "Follow for more real-world system design."
        )
    }
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
            print(f"✅ [LB Voice] {out_file} ({dur:.2f}s)")
            return dur
        except Exception as e:
            print(f"⚠️ [Attempt {attempt}/3] {e}. Retrying in 2s...")
            time.sleep(2)
    raise RuntimeError(f"Failed to generate {out_file} after 3 attempts")

def get_duration(path):
    cmd = ["ffprobe", "-i", path, "-show_entries", "format=duration", "-v", "quiet", "-of", "csv=p=0"]
    res = subprocess.check_output(cmd).decode("utf-8").strip()
    return float(res)

all_manifests = {}
use_eleven = bool(API_KEY)

for reel_id, scenes in REELS.items():
    print(f"\n=== Generating Voiceovers for {reel_id} ===")
    durations = {}
    for name, text in scenes.items():
        dur = None
        if use_eleven:
            dur = generate_elevenlabs(API_KEY, name, text)
        if dur is None:
            dur = generate_edge_tts(name, text)
        durations[name] = round(dur, 2)
    
    manifest_file = os.path.join(AUDIO_DIR, f"{reel_id}-durations.json")
    with open(manifest_file, "w") as f:
        json.dump(durations, f, indent=2)
    all_manifests[reel_id] = durations
    print(f"Saved {manifest_file}")

print("\n🎉 All 3 Reels Voiceovers Generated Successfully!")
print(json.dumps(all_manifests, indent=2))

