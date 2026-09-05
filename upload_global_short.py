# -*- coding: utf-8 -*-
"""
=============================================================================
🌍 [글로벌 전용] 영문 음성 & 영문 자막 숏츠 유튜브 즉시 공개 업로더
=============================================================================
- 미국/유럽/글로벌 피드 타겟: defaultLanguage="en", defaultAudioLanguage="en"
- 영문 제목: Never Reset a Tripped Breaker Immediately! (Arc Flash Hazard) ⚡ #Shorts
- 공개 상태: public
=============================================================================
"""

import sys
import time
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
VIDEO_FILE = BASE_DIR / "shorts_global_breaker_safety.mp4"

SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.force-ssl"
]

METADATA = {
    "title": "Never Reset a Tripped Breaker Immediately! (Arc Flash Hazard) ⚡ #Shorts",
    "description": (
        "Never force a tripped industrial circuit breaker back on!\n"
        "A tripped breaker is a critical warning of a dead short or ground fault down the line. "
        "Forcing it back on risks a catastrophic arc flash explosion that can destroy switchgear and cause severe injury!\n\n"
        "🚨 3 Essential Safety Checks Before Resetting:\n"
        "1️⃣ Check Trip Flag: Overload vs Ground Fault\n"
        "2️⃣ Megger Test: Verify line insulation resistance (min 0.2 M-Ohm)\n"
        "3️⃣ Motor Inrush: Verify starting current doesn't exceed 6x rating\n\n"
        "📐 Free 3-Second Cable Sizing & Voltage Drop Calculator:\n"
        "👉 https://voltcheck24.com/\n\n"
        "#electrician #circuitbreaker #electricalsafety #arcflash #switchgear #smartfactory #voltcheck #Shorts"
    ),
    "tags": [
        "electrician", "circuit breaker", "electrical safety", "arc flash", "switchgear",
        "smart factory", "electrical engineering", "industrial automation", "plc",
        "lineman", "voltcheck", "voltage drop", "cable sizing", "Shorts"
    ],
    "categoryId": "28",
    "defaultLanguage": "en",
    "defaultAudioLanguage": "en",
    "privacyStatus": "public"
}


def get_youtube():
    creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)
    if not creds.valid:
        if creds.expired and creds.refresh_token:
            creds.refresh(Request())
            with open(TOKEN_FILE, "w", encoding="utf-8") as f:
                f.write(creds.to_json())
    return build("youtube", "v3", credentials=creds)


def main():
    if not VIDEO_FILE.exists():
        print(f"❌ 비디오 파일이 존재하지 않습니다: {VIDEO_FILE}")
        return

    size_mb = VIDEO_FILE.stat().st_size / (1024 * 1024)
    print("=" * 80)
    print("🌍 [GLOBAL YOUTUBE] Uploading Dedicated English Short")
    print(f"   Title: {METADATA['title']}")
    print(f"   Size: {size_mb:.2f} MB")
    print(f"   Target: Global English Algorithm (defaultLanguage='en')")
    print("=" * 80)

    youtube = get_youtube()

    body = {
        "snippet": {
            "title": METADATA["title"],
            "description": METADATA["description"],
            "tags": METADATA["tags"],
            "categoryId": METADATA["categoryId"],
            "defaultLanguage": METADATA["defaultLanguage"],
            "defaultAudioLanguage": METADATA["defaultAudioLanguage"]
        },
        "status": {
            "privacyStatus": METADATA["privacyStatus"],
            "selfDeclaredMadeForKids": False
        }
    }

    media = MediaFileUpload(str(VIDEO_FILE), chunksize=4 * 1024 * 1024, resumable=True, mimetype="video/mp4")
    request = youtube.videos().insert(part="snippet,status", body=body, media_body=media)

    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            pct = int(status.progress() * 100)
            print(f"\r   Upload Progress: {pct}% ({status.resumable_progress / (1024*1024):.1f} MB)", end="", flush=True)

    print()
    video_id = response.get("id")
    video_url = f"https://www.youtube.com/shorts/{video_id}"
    print(f"✅ Global English Short Uploaded Successfully! Video ID: {video_id}")
    print(f"📱 Video URL: {video_url}")


if __name__ == "__main__":
    main()
