# -*- coding: utf-8 -*-
"""
=============================================================================
🔄 [SPLIT-SCREEN VIDEO REPLACEMENT ENGINE]
=============================================================================
Deletes the older non-split-screen draft uploads and replaces them with
the brand-new 1080x1920 60fps Split-Screen (Project Farm style) videos.
=============================================================================
"""

import sys
import time
import json
from pathlib import Path
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.oauth2.credentials import Credentials
from schedule_all_shorts import upload_scheduled_video, calculate_schedule_plan

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", line_buffering=True)
    except Exception:
        pass

BASE_DIR = Path(r"c:\이규정 개인 프로젝트")
TOKEN_FILE = BASE_DIR / "youtube_token.json"
QUEUE_FILE = BASE_DIR / "shorts_content_queue.json"

SCOPES = ["https://www.googleapis.com/auth/youtube.upload", "https://www.googleapis.com/auth/youtube.force-ssl"]
creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)
youtube = build("youtube", "v3", credentials=creds)

with open(QUEUE_FILE, "r", encoding="utf-8") as f:
    queue_data = json.load(f)

EDU_IDS = [
    "edu_s1_420ma_loop",
    "edu_s2_vfd_reflected_wave",
    "edu_s3_shaft_stress_notch",
    "edu_s4_hydraulic_cavitation",
    "edu_s5_panel_dewpoint",
    "edu_s6_robot_inertia_ratio"
]

print("=" * 80)
print("🔄 [SPLIT-SCREEN UPGRADE] Replacing Old Uploads with Upgraded Videos")
print("=" * 80)

# Step 1: Delete older non-split-screen video IDs
for item in queue_data["queue"]:
    if item["id"] in EDU_IDS and "video_id" in item:
        old_id = item["video_id"]
        print(f"🗑️ Deleting old non-split video from YouTube: {old_id} ({item['id']})...")
        try:
            youtube.videos().delete(id=old_id).execute()
            print(f"   ✅ Deleted {old_id}")
        except HttpError as e:
            print(f"   ⚠️ Could not delete {old_id}: {e}")
        item["status"] = "pending"
        del item["video_id"]

with open(QUEUE_FILE, "w", encoding="utf-8") as f:
    json.dump(queue_data, f, ensure_ascii=False, indent=2)

print("\n🚀 Step 2: Uploading Upgraded Split-Screen Videos to YouTube...")
plan = calculate_schedule_plan(queue_data["queue"])
edu_plan = [p for p in plan if p["item"]["id"] in EDU_IDS]

success = 0
for idx, entry in enumerate(edu_plan, 1):
    print(f"\n[{idx}/{len(edu_plan)}] Uploading Split-Screen Video for {entry['item']['id']}...")
    res = upload_scheduled_video(youtube, entry, dry_run=False)
    if res == "QUOTA_EXCEEDED":
        print("⚠️ Quota limit reached for today. Remaining items will auto-upload tomorrow.")
        break
    elif res:
        success += 1
        entry["item"]["status"] = "scheduled"
        entry["item"]["publish_at"] = entry["publish_at_kst"]
        entry["item"]["video_id"] = res
        with open(QUEUE_FILE, "w", encoding="utf-8") as f:
            json.dump(queue_data, f, ensure_ascii=False, indent=2)
    time.sleep(3)

print("\n" + "=" * 80)
print(f"🎉 Successfully registered {success} upgraded Split-Screen videos to YouTube!")
print("=" * 80)
