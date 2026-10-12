#!/usr/bin/env python3
"""
Automated Instagram Reel Publisher for @beyond.localhost
Uses Cloudinary for high-speed CDN video hosting + Meta Graph API for publishing.

Usage:
  python3 scripts/publish-instagram.py load-balancer "Your caption here"
  python3 scripts/publish-instagram.py lb-algorithms "Part 2 caption"
  python3 scripts/publish-instagram.py lb-layers-ha "Part 3 caption"
"""

import os
import sys
import time
import requests
import cloudinary
import cloudinary.uploader

# ── 1. LOAD .ENV FILE IF PRESENT ─────────────────────────────────────────────
env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
if os.path.isfile(env_path):
    with open(env_path, "r", encoding="utf-8") as ef:
        for line in ef:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                clean_val = v.strip().strip('"').strip("'")
                os.environ.setdefault(k.strip(), clean_val)

# ── 2. CONFIGURATION ─────────────────────────────────────────────────────────
ACCESS_TOKEN = os.getenv("META_ACCESS_TOKEN", "")
IG_USER_ID = os.getenv("IG_USER_ID", "")
CLOUDINARY_URL = os.getenv("CLOUDINARY_URL", "")

GRAPH_VERSION = "v20.0"
BASE_URL = f"https://graph.facebook.com/{GRAPH_VERSION}"


def resolve_video_path(target: str) -> str:
    """Finds the MP4 file whether user passed 'load-balancer' or 'out/load-balancer.mp4'"""
    if os.path.isfile(target):
        return target
    candidates = [
        os.path.join("out", f"{target}.mp4"),
        os.path.join("out", target),
        f"{target}.mp4",
    ]
    for c in candidates:
        if os.path.isfile(c):
            return c

    # If file doesn't exist yet, auto-render it via Remotion!
    reel_id = os.path.basename(target).replace(".mp4", "")
    out_file = os.path.join("out", f"{reel_id}.mp4")
    print(f"🎬 '{out_file}' not found. Auto-rendering with Remotion now...")
    os.makedirs("out", exist_ok=True)
    ret = os.system(f"npx remotion render src/index.ts {reel_id} {out_file}")
    if ret == 0 and os.path.isfile(out_file):
        print(f"✅ Auto-render complete: {out_file}\n")
        return out_file

    raise FileNotFoundError(f"Could not find or render video file for '{target}'.")


def upload_to_cloudinary(video_path: str, reel_id: str) -> str:
    """Uploads video to Cloudinary CDN and returns direct HTTPS link."""
    print("☁️  1. Uploading video to Cloudinary CDN...")
    import urllib.parse
    parsed = urllib.parse.urlparse(CLOUDINARY_URL)
    cloudinary.config(
        cloud_name=parsed.hostname,
        api_key=parsed.username,
        api_secret=parsed.password,
        secure=True
    )
    upload_res = cloudinary.uploader.upload_large(
        video_path,
        resource_type="video",
        folder="beyond_localhost",
        public_id=f"reel_{reel_id}_{int(time.time())}",
        overwrite=True
    )
    secure_url = upload_res.get("secure_url")
    if not secure_url:
        print("❌ Cloudinary upload failed:", upload_res)
        sys.exit(1)
    print(f"   ✅ CDN Video URL Ready: {secure_url}\n")
    return secure_url


def upload_cover_to_cloudinary(reel_id: str) -> str:
    """Finds matching thumbnail image in out/thumbnails/ and uploads to Cloudinary."""
    candidates = [
        os.path.join("out", "thumbnails", f"thumb-{reel_id}.png"),
        os.path.join("out", "thumbnails", f"{reel_id}.png"),
        os.path.join("..", "out", "thumbnails", f"thumb-{reel_id}.png"),
    ]
    for c in candidates:
        if os.path.isfile(c):
            print(f"🖼️  Found matching thumbnail: {c}. Uploading to Cloudinary CDN...")
            upload_res = cloudinary.uploader.upload(
                c,
                resource_type="image",
                folder="beyond_localhost/covers",
                public_id=f"cover_{reel_id}_{int(time.time())}",
                overwrite=True
            )
            cover_url = upload_res.get("secure_url")
            if cover_url:
                print(f"   ✅ Cover URL Ready: {cover_url}\n")
                return cover_url
    return ""


def publish_reel(video_target: str, caption: str, share_to_feed: bool = True):
    # Validation
    if not ACCESS_TOKEN or not IG_USER_ID or "YOUR_" in ACCESS_TOKEN or "YOUR_" in IG_USER_ID:
        print("❌ Configuration Error:")
        print("   Please ensure META_ACCESS_TOKEN and IG_USER_ID are set in system-design-reels/.env")
        sys.exit(1)

    if not CLOUDINARY_URL or "YOUR_" in CLOUDINARY_URL:
        print("❌ Cloudinary Configuration Error:")
        print("   Please add CLOUDINARY_URL to your system-design-reels/.env file:")
        print("   CLOUDINARY_URL=\"cloudinary://api_key:api_secret@cloud_name\"")
        print("   (Find it on your free Cloudinary Dashboard at https://cloudinary.com)")
        sys.exit(1)

    # 1. Resolve local video file
    video_path = resolve_video_path(video_target)
    reel_id = os.path.splitext(os.path.basename(video_path))[0]
    file_size_mb = os.path.getsize(video_path) / (1024 * 1024)
    print(f"📁 Video: {video_path} ({file_size_mb:.2f} MB)")

    # 2. Upload to Cloudinary to get pristine direct CDN URL
    video_url = upload_to_cloudinary(video_path, reel_id)
    cover_url = upload_cover_to_cloudinary(reel_id)

    # 3. Create Meta Media Container using video_url
    print(f"🚀 2. Initializing Reel Media Container with Meta Graph API (share_to_feed={share_to_feed})...")
    payload = {
        "media_type": "REELS",
        "video_url": video_url,
        "caption": caption,
        "share_to_feed": share_to_feed,
        "access_token": ACCESS_TOKEN,
    }
    if cover_url:
        payload["cover_url"] = cover_url
        print(f"   🎨 Attached custom cover: {cover_url}")

    container_res = requests.post(f"{BASE_URL}/{IG_USER_ID}/media", data=payload).json()
    if "id" not in container_res:
        print("❌ Error creating Reel container with Meta:", container_res)
        sys.exit(1)

    container_id = container_res["id"]
    print(f"   ✅ Container created! ID: {container_id}\n")

    # 4. Wait for Meta's servers to download and transcode
    print("⏳ 3. Instagram is downloading & encoding the video...")
    for attempt in range(40):
        time.sleep(5)
        status_res = requests.get(
            f"{BASE_URL}/{container_id}",
            params={"fields": "status_code,status", "access_token": ACCESS_TOKEN},
        ).json()

        status = status_res.get("status_code")
        print(f"   Status check [{attempt + 1}]: {status}")

        if status == "FINISHED":
            print("   ✅ Meta processing finished successfully!\n")
            break
        elif status == "ERROR":
            print("❌ Meta processing failed:", status_res)
            sys.exit(1)
    else:
        print("❌ Timed out waiting for Meta to process the video.")
        sys.exit(1)

    # 5. Publish Live!
    print("🎉 4. Publishing Reel live to @beyond.localhost...")
    publish_res = requests.post(
        f"{BASE_URL}/{IG_USER_ID}/media_publish",
        data={"creation_id": container_id, "access_token": ACCESS_TOKEN},
    ).json()

    if "id" in publish_res:
        post_id = publish_res["id"]
        print("\n" + "=" * 50)
        print("🔥 SUCCESS! YOUR REEL IS LIVE ON INSTAGRAM!")
        print(f"   Post ID: {post_id}")
        print("=" * 50 + "\n")
        return post_id
    else:
        print("❌ Publishing failed:", publish_res)
        return None


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage:")
        print('  python3 scripts/publish-instagram.py <video-id-or-path> "<caption>" [--reels-only]')
        print("Examples:")
        print('  python3 scripts/publish-instagram.py load-balancer "Netflix vs Company Portal 👀 #beyondlocalhost"')
        print('  python3 scripts/publish-instagram.py lb-algorithms "Which Load Balancing Algorithm to pick? #systemdesign"')
        print('  python3 scripts/publish-instagram.py lb-algorithms "..." --reels-only')
        sys.exit(1)

    share_feed = True
    if len(sys.argv) > 3 and sys.argv[3] in ("--reels-only", "--no-feed"):
        share_feed = False

    publish_reel(sys.argv[1], sys.argv[2], share_to_feed=share_feed)
