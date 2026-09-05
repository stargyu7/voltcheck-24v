# -*- coding: utf-8 -*-
"""
=============================================================================
🚀 볼트체크 첫 공식 게시물 즉시 공개 업로더 (Public Launch Video)
=============================================================================
- 제목: 공장 차단기 떨어졌을 때 절대 바로 올리면 안 되는 이유 (현장 실무) ⚡ #Shorts
- 공개 상태: public (유튜브 전 세계 즉시 공개)
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
VIDEO_FILE = BASE_DIR / "shorts_human_breaker_safety.mp4"

SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.force-ssl"
]

METADATA = {
    "title": "공장 차단기 떨어졌을 때 절대 바로 올리면 안 되는 이유 (현장 실무) ⚡ #Shorts",
    "description": (
        "현장에서 차단기 툭 떨어졌을 때 원인도 안 찾고 바로 올리면 아크 폭발로 대형 사고가 날 수 있습니다.\n"
        "트립 표시창 확인부터 메거 측정, 모터 돌입전류 검증까지 3단계 안전 수칙을 꼭 확인하세요!\n\n"
        "📐 전선 굵기·전압강하·모터 용량 3초 계산기:\n"
        "https://voltcheck24.com/\n\n"
        "#전기실무 #차단기트립 #전기기사 #스마트팩토리 #누전 #공장자동화 #볼트체크 #Shorts"
    ),
    "tags": [
        "전기실무", "차단기", "차단기트립", "누전", "전기기사",
        "공장자동화", "스마트팩토리", "볼트체크", "Shorts"
    ],
    "categoryId": "28",
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
    print("=" * 75)
    print("🚀 [볼트체크] 첫 공식 게시물 즉시 공개 업로드 시작")
    print(f"   제목: {METADATA['title']}")
    print(f"   용량: {size_mb:.2f} MB")
    print(f"   공개 설정: {METADATA['privacyStatus']} (전체 공개)")
    print("=" * 75)

    youtube = get_youtube()

    body = {
        "snippet": {
            "title": METADATA["title"],
            "description": METADATA["description"],
            "tags": METADATA["tags"],
            "categoryId": METADATA["categoryId"]
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
            print(f"\r   업로드 진행률: {pct}% ({status.resumable_progress / (1024*1024):.1f} MB)", end="", flush=True)

    print()
    video_id = response.get("id")
    video_url = f"https://www.youtube.com/shorts/{video_id}"
    print(f"✅ 유튜브 전체 공개 완료! Video ID: {video_id}")
    print(f"📱 영상 바로보기: {video_url}")


if __name__ == "__main__":
    main()
