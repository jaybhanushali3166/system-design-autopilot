#!/usr/bin/env python3
"""
Automated Instagram Reel Scheduler for @beyond.localhost
Manages queue in scripts/schedule.json and publishes at the exact scheduled timestamp.

Commands:
  python3 scripts/scheduler.py list              # View scheduled reels & status
  python3 scripts/scheduler.py check             # Check and publish any reels whose time has passed
  python3 scripts/scheduler.py daemon            # Run continuous background worker (every 60s)
  python3 scripts/scheduler.py publish-now <id>  # Force publish an item immediately
  python3 scripts/scheduler.py install-launchd   # Auto-run via macOS LaunchAgent (recommended)
  python3 scripts/scheduler.py uninstall-launchd # Remove macOS LaunchAgent
"""

import os
import sys
import json
import time
import datetime
import subprocess

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
SCHEDULE_FILE = os.path.join(SCRIPT_DIR, "schedule.json")
LOG_FILE = os.path.join(SCRIPT_DIR, "scheduler.log")
PLIST_LABEL = "com.beyondlocalhost.reelscheduler"
PLIST_PATH = os.path.expanduser(f"~/Library/LaunchAgents/{PLIST_LABEL}.plist")


def log(msg: str):
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    formatted = f"[{timestamp}] {msg}"
    print(formatted)
    try:
        with open(LOG_FILE, "a", encoding="utf-8") as lf:
            lf.write(formatted + "\n")
    except Exception:
        pass


def load_schedule():
    if not os.path.isfile(SCHEDULE_FILE):
        return []
    with open(SCHEDULE_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_schedule(data):
    with open(SCHEDULE_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


def list_schedule():
    items = load_schedule()
    print("\n=======================================================")
    print(" 📅 @beyond.localhost INSTAGRAM REEL SCHEDULE QUEUE")
    print("=======================================================")
    if not items:
        print("  (Queue is empty)")
        return

    now = datetime.datetime.now()
    for item in items:
        status_icon = "⏳" if item["status"] == "PENDING" else ("✅" if item["status"] == "PUBLISHED" else "❌")
        video_full = os.path.join(PROJECT_DIR, item["video"])
        video_exists = "✅ Video Ready" if os.path.isfile(video_full) else "⚠️ File Missing"
        
        item_id = item["id"]
        title = item["title"]
        status = item["status"]
        sched = item["scheduled_time"]
        vid = item["video"]
        print(f"[{status_icon} {status}] ID: {item_id} | {title}")
        print(f"   🕒 Scheduled: {sched} (Local Time)")
        print(f"   📁 File: {vid} ({video_exists})")
        if item.get("post_id"):
            print(f"   🔥 Instagram Post ID: {item['post_id']}")
        print("-" * 55)
    print()


def trigger_publish(item) -> bool:
    item_id = item["id"]
    title = item["title"]
    log(f"🚀 Triggering publication for {item_id} ({title})...")
    # Import publisher logic
    sys.path.insert(0, SCRIPT_DIR)
    from importlib import import_module
    publisher = import_module("publish-instagram")
    
    video_path = os.path.join(PROJECT_DIR, item["video"])
    caption = item["caption"]
    share_to_feed = item.get("share_to_feed", True)
    
    try:
        post_id = publisher.publish_reel(video_path, caption, share_to_feed=share_to_feed)
        if post_id:
            item["status"] = "PUBLISHED"
            item["post_id"] = str(post_id)
            item["published_at"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            log(f"✅ Successfully published {item_id}! Post ID: {post_id}")
            return True
        else:
            item["status"] = "FAILED"
            log(f"❌ Failed to publish {item_id}: No post_id returned")
            return False
    except Exception as e:
        item["status"] = "FAILED"
        item["error"] = str(e)
        log(f"❌ Exception publishing {item_id}: {e}")
        return False


def run_check():
    items = load_schedule()
    now = datetime.datetime.now()
    modified = False

    for item in items:
        if item["status"] == "PENDING":
            sched_dt = datetime.datetime.strptime(item["scheduled_time"], "%Y-%m-%d %H:%M:%S")
            item_id = item["id"]
            sched_str = item["scheduled_time"]
            if now >= sched_dt:
                log(f"⏰ Time arrived for {item_id} (Scheduled: {sched_str}, Current: {now.strftime('%Y-%m-%d %H:%M:%S')})")
                success = trigger_publish(item)
                modified = True
            else:
                remaining = sched_dt - now
                hours = remaining.total_seconds() / 3600
                log(f"⏳ {item_id} scheduled in {hours:.1f} hours ({sched_str})")

    if modified:
        save_schedule(items)


def run_daemon():
    log("🔄 Starting Instagram Reel Scheduler Daemon (polling every 60s)...")
    print(f"Log output redirected to {LOG_FILE}")
    try:
        while True:
            run_check()
            time.sleep(60)
    except KeyboardInterrupt:
        log("🛑 Scheduler daemon stopped by user.")


def publish_now(target_id: str):
    items = load_schedule()
    for item in items:
        if item["id"] == target_id:
            log(f"⚡ Force publishing {target_id} now...")
            success = trigger_publish(item)
            save_schedule(items)
            return
    print(f"❌ Item with ID '{target_id}' not found in schedule.")


def install_launchd():
    python_bin = sys.executable
    os.makedirs(os.path.expanduser("~/Library/LaunchAgents"), exist_ok=True)
    
    items = load_schedule()
    pending = [i for i in items if i.get("status") == "PENDING"]
    
    calendar_intervals = []
    for item in pending:
        try:
            dt = datetime.datetime.strptime(item["scheduled_time"], "%Y-%m-%d %H:%M:%S")
            calendar_intervals.append(f"""        <dict>
            <key>Month</key>
            <integer>{dt.month}</integer>
            <key>Day</key>
            <integer>{dt.day}</integer>
            <key>Hour</key>
            <integer>{dt.hour}</integer>
            <key>Minute</key>
            <integer>{dt.minute}</integer>
        </dict>""")
        except Exception:
            pass

    intervals_block = "\n".join(calendar_intervals)
    
    plist_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>{PLIST_LABEL}</string>
    <key>ProgramArguments</key>
    <array>
        <string>{python_bin}</string>
        <string>{os.path.join(SCRIPT_DIR, "scheduler.py")}</string>
        <string>check</string>
    </array>
    <key>WorkingDirectory</key>
    <string>{PROJECT_DIR}</string>
    <key>StartCalendarInterval</key>
    <array>
{intervals_block}
    </array>
    <key>StandardOutPath</key>
    <string>{LOG_FILE}</string>
    <key>StandardErrorPath</key>
    <string>{LOG_FILE}</string>
</dict>
</plist>
"""
    with open(PLIST_PATH, "w", encoding="utf-8") as f:
        f.write(plist_content)
    
    subprocess.run(["launchctl", "unload", PLIST_PATH], stderr=subprocess.DEVNULL)
    ret = subprocess.run(["launchctl", "load", PLIST_PATH])
    if ret.returncode == 0:
        print("=======================================================")
        print("✅ macOS Exact Calendar Alarms Installed & Loaded!")
        print(f"   Plist: {PLIST_PATH}")
        print("   Exact Trigger Times:")
        for item in pending:
            print(f"     ⏰ {item['title']} -> {item['scheduled_time']}")
        print("   (The system remains 100% asleep until these exact minutes)")
        print(f"   Log: {LOG_FILE}")
        print("=======================================================\n")
    else:
        print("❌ Failed to load LaunchAgent plist via launchctl.")


def uninstall_launchd():
    if os.path.isfile(PLIST_PATH):
        subprocess.run(["launchctl", "unload", PLIST_PATH])
        os.remove(PLIST_PATH)
        print("✅ macOS Background LaunchAgent unloaded and removed.")
    else:
        print("ℹ️  No LaunchAgent found to uninstall.")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        list_schedule()
        print("Usage: python3 scripts/scheduler.py [list|check|daemon|publish-now <id>|install-launchd|uninstall-launchd]")
        sys.exit(0)

    cmd = sys.argv[1].lower()
    if cmd == "list":
        list_schedule()
    elif cmd == "check":
        run_check()
    elif cmd == "daemon":
        run_daemon()
    elif cmd == "publish-now" and len(sys.argv) > 2:
        publish_now(sys.argv[2])
    elif cmd == "install-launchd":
        install_launchd()
    elif cmd == "uninstall-launchd":
        uninstall_launchd()
    else:
        print(f"Unknown command: {cmd}")
