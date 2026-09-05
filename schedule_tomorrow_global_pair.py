# -*- coding: utf-8 -*-
"""
=============================================================================
🌍 [글로벌 전용] 내일(9월 6일) 밤 10시 / 10시 5분 100% 영문 숏츠 예약 업로더
=============================================================================
- 기존 한글 예약본을 100% 영문 글로벌 에디션으로 교체
- 슬롯 1 (22:00 KST): Overtightening Bolts Snapped a $250k Mold! 💥
- 슬롯 2 (22:05 KST): Bolt Tightening Torque Formula T = k·d·F Masterclass ⚙️
- defaultLanguage="en", defaultAudioLanguage="en" 글로벌 유튜브 전용
=============================================================================
"""

import sys
import time
import json
from pathlib import Path
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", line_buffering=True)
        sys.stderr.reconfigure(encoding="utf-8", line_buffering=True)
    except Exception:
        pass

BASE_DIR = Path(r"c:\이규정 개인 프로젝트")
TOKEN_FILE = BASE_DIR / "youtube_token.json"
QUEUE_FILE = BASE_DIR / "shorts_content_queue.json"

SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.force-ssl"
]

OLD_DRAFT_IDS = ["Nt4OqzPS-rw", "ECu5yjnLStE"]

GLOBAL_RESERVATIONS = [
    {
        "id": "global_mkt_bolt_torque",
        "file": str(BASE_DIR / "shorts_global_mkt_bolt_torque.mp4"),
        "title": "Overtightening Bolts with an Impact Wrench Snapped a $250k Mold! 💥 #Shorts",
        "description": (
            "Real shop floor disaster: An operator tightened M16 10.9 high-strength bolts by feel using an impact wrench.\n"
            "The bolt yielded past its ultimate tensile strength, snapped, and ruined a $250,000 injection mold!\n\n"
            "Never guess torque by hand. Calculate precision bolt tightening torque in 3 seconds:\n"
            "👉 https://voltcheck24.com/?calc=bolt_torque\n\n"
            "#machining #moldmaking #bolttorque #impactwrench #machinist #mechanicalengineering #voltcheck #Shorts"
        ),
        "comment": (
            "💥 Machine shops & toolmakers: How do you enforce torque specs on the shop floor?\n"
            "Torque wrench sign-offs, smart tools, or digital checklists? Drop your shop rules below! 👇\n"
            "(Free 3-sec bolt torque calculator: https://voltcheck24.com/?calc=bolt_torque )"
        ),
        "tags": ["machining", "mold making", "bolt torque", "impact wrench", "machinist", "mechanical engineering", "voltcheck", "Shorts"],
        "publish_at_kst": "2026-09-06 22:00:00 KST",
        "publish_at_utc": "2026-09-06T13:00:00.000Z",
        "slot_label": "Day 1 Slot 1 (22:00 KST / 9:00 AM EDT) - Global Story"
    },
    {
        "id": "global_eng_bolt_formula",
        "file": str(BASE_DIR / "shorts_global_eng_bolt_formula.mp4"),
        "title": "Bolt Tightening Torque Formula T = k·d·F Mastered in 40 Seconds ⚙️ #Shorts",
        "description": (
            "Master the universal bolt tightening torque equation: T = k × d × F\n"
            "- T: Tightening Torque (N·m)\n"
            "- k: Torque Coefficient (Dry: 0.20 vs Lubricated: 0.15)\n"
            "- d: Nominal Bolt Diameter (m)\n"
            "- F: Clamping Preload Force (N)\n\n"
            "Using the wrong torque coefficient (k) creates a 30%+ error in clamp force, leading to bolt fatigue or sudden fracture!\n\n"
            "78+ Free Engineering Calculators for Mechanical & Electrical Design:\n"
            "👉 https://voltcheck24.com/?calc=bolt_torque\n\n"
            "#bolttorque #mechanicalengineering #machinist #torqueformula #clampingforce #machining #voltcheck #Shorts"
        ),
        "comment": (
            "⚙️ Engineers: What torque coefficient (k) do you specify for dry vs lubricated fasteners?\n"
            "0.20 dry, 0.15 moly, or custom test bench data? Let's discuss below! 👇\n"
            "(Free bolt torque calculator: https://voltcheck24.com/?calc=bolt_torque )"
        ),
        "tags": ["bolt torque", "mechanical engineering", "machinist", "torque formula", "clamping force", "machining", "voltcheck", "Shorts"],
        "publish_at_kst": "2026-09-06 22:05:00 KST",
        "publish_at_utc": "2026-09-06T13:05:00.000Z",
        "slot_label": "Day 1 Slot 2 (22:05 KST / 9:05 AM EDT) - Global Engineering"
    }
]


def get_youtube():
    creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)
    if not creds.valid:
        if creds.expired and creds.refresh_token:
            creds.refresh(Request())
            with open(TOKEN_FILE, "w", encoding="utf-8") as f:
                f.write(creds.to_json())
    return build("youtube", "v3", credentials=creds)


def upload_scheduled(youtube, item):
    f_path = Path(item["file"])
    if not f_path.exists():
        print(f"❌ File missing: {f_path}")
        return None

    size_mb = f_path.stat().st_size / (1024 * 1024)
    print("=" * 80)
    print(f"🎬 [{item['slot_label']}] Scheduling Global English Short")
    print(f"   Title: {item['title']}")
    print(f"   Size: {size_mb:.2f} MB")
    print(f"   Scheduled Release: {item['publish_at_kst']} (UTC: {item['publish_at_utc']})")
    print("=" * 80)

    body = {
        "snippet": {
            "title": item["title"],
            "description": item["description"],
            "tags": item["tags"],
            "categoryId": "28",
            "defaultLanguage": "en",
            "defaultAudioLanguage": "en"
        },
        "status": {
            "privacyStatus": "private",
            "publishAt": item["publish_at_utc"],
            "selfDeclaredMadeForKids": False
        }
    }

    media = MediaFileUpload(str(f_path), chunksize=4 * 1024 * 1024, resumable=True, mimetype="video/mp4")
    request = youtube.videos().insert(part="snippet,status", body=body, media_body=media)

    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            pct = int(status.progress() * 100)
            print(f"\r   Upload Progress: {pct}% ({status.resumable_progress / (1024*1024):.1f} MB)", end="", flush=True)

    print()
    vid_id = response.get("id")
    video_url = f"https://www.youtube.com/shorts/{vid_id}"
    print(f"✅ Global English Short Scheduled Successfully! Video ID: {vid_id}")
    print(f"📱 Video URL (Auto-Publishes tomorrow at {item['publish_at_kst']}): {video_url}")

    # Official discussion comment
    try:
        cbody = {
            "snippet": {
                "videoId": vid_id,
                "topLevelComment": {"snippet": {"textOriginal": item["comment"]}}
            }
        }
        youtube.commentThreads().insert(part="snippet", body=cbody).execute()
        print("💬 Global Discussion Comment Pinned!")
    except Exception as e:
        print(f"Notice: {e}")

    return vid_id, video_url


def main():
    youtube = get_youtube()

    # 1. Clean up old Korean draft reservations
    for old_id in OLD_DRAFT_IDS:
        try:
            youtube.videos().delete(id=old_id).execute()
            print(f"🗑️ Removed old draft reservation: {old_id}")
        except Exception as e:
            print(f"Notice deleting {old_id}: {e}")

    # 2. Upload and schedule 100% Global English videos
    results = []
    for item in GLOBAL_RESERVATIONS:
        vid_id, v_url = upload_scheduled(youtube, item)
        if vid_id:
            results.append({"item": item, "video_id": vid_id, "video_url": v_url})
        time.sleep(2)

    print("\n" + "#" * 80)
    print("🎉 Tomorrow's 100% Global English Shorts Successfully Scheduled!")
    print("#" * 80)
    for r in results:
        it = r["item"]
        print(f"📌 [{it['slot_label']}]")
        print(f"   - Title: {it['title']}")
        print(f"   - Auto Release: {it['publish_at_kst']}")
        print(f"   - Video Link: {r['video_url']}")
        print()

    # Update shorts_content_queue.json
    try:
        qdata = {"queue": []}
        for r in results:
            it = r["item"]
            qdata["queue"].append({
                "id": it["id"],
                "type": "global_english",
                "name": it["title"],
                "file": Path(it["file"]).name,
                "title": it["title"],
                "description": it["description"],
                "comment": it["comment"],
                "tags": it["tags"],
                "status": "scheduled",
                "last_uploaded_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
                "video_id": r["video_id"],
                "publish_at": it["publish_at_kst"]
            })
        with open(QUEUE_FILE, "w", encoding="utf-8") as f:
            json.dump(qdata, f, ensure_ascii=False, indent=2)
        print("💾 shorts_content_queue.json updated with 100% Global English lineup!")
    except Exception as e:
        print(f"Queue update error: {e}")


if __name__ == "__main__":
    main()
