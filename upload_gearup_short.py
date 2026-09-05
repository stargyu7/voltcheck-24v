# -*- coding: utf-8 -*-
"""
=============================================================================
🚀 [글로벌 제휴 마케팅] GearUP Booster 숏츠 유튜브 즉시 공개 업로더
=============================================================================
- 클릭률(CTR)과 다운로드 전환율을 극대화한 영문 숏츠
- 설명란 1순위 및 고정 댓글에 사용자님의 CJ 제휴 링크 탑재
- 제휴 링크: https://www.dpbolvw.net/click-101877144-17327791
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
VIDEO_FILE = BASE_DIR / "shorts_gearup_affiliate_global.mp4"

SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.force-ssl"
]

AFFILIATE_LINK = "https://www.dpbolvw.net/click-101877144-17327791"

METADATA = {
    "title": "How to Fix 180ms Ping & Lag Spikes in FPS Games! (GearUP Booster) ⚡ #Shorts",
    "description": (
        "⚡ Download GearUP Booster to cut lag and lower your ping:\n"
        f"👉 {AFFILIATE_LINK}\n\n"
        "Tired of losing gunfights to 180ms ping spikes, jitter, and packet loss?\n"
        "GearUP Booster uses patented multi-path intelligent routing to bypass congested ISP nodes, "
        "dropping latency down to smooth, competitive levels for games like Valorant, Call of Duty, Apex Legends, CS2, and Fortnite.\n\n"
        "Try GearUP Booster free today via the link above!\n\n"
        "#gearupbooster #gaming #lagfix #lowerping #fps #valorant #callofduty #apexlegends #cs2 #Shorts"
    ),
    "comment": (
        "⚡ Download GearUP Booster Free & Lower Your Ping:\n"
        f"👉 {AFFILIATE_LINK}\n"
        "(Cut lag, eliminate packet loss & win more gunfights!)"
    ),
    "tags": [
        "gearup booster", "how to lower ping", "fix lag", "reduce packet loss",
        "game booster", "valorant lag fix", "call of duty", "apex legends",
        "cs2", "gaming tips", "high ping fix", "Shorts"
    ],
    "categoryId": "20",  # Gaming
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
    print("🌍 [AFFILIATE MARKETING] Uploading GearUP Booster Global Short")
    print(f"   Title: {METADATA['title']}")
    print(f"   Size: {size_mb:.2f} MB")
    print(f"   Affiliate Link: {AFFILIATE_LINK}")
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
    print(f"✅ Global Affiliate Short Uploaded! Video ID: {video_id}")
    print(f"📱 Video URL: {video_url}")

    # Pin affiliate comment
    try:
        cbody = {
            "snippet": {
                "videoId": video_id,
                "topLevelComment": {"snippet": {"textOriginal": METADATA["comment"]}}
            }
        }
        youtube.commentThreads().insert(part="snippet", body=cbody).execute()
        print("💬 Pinned Affiliate Link Comment Posted Successfully!")
    except Exception as e:
        print(f"Comment notice: {e}")


if __name__ == "__main__":
    main()
