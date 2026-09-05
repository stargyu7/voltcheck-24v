# -*- coding: utf-8 -*-
"""
=============================================================================
🚀 [알고리즘 노출 극대화] 차단기 트립 고도화 숏츠 유튜브 업로더
=============================================================================
- 클릭률(CTR)과 유튜브 쇼츠 피드 노출을 극대화한 타이틀 및 메타데이터
- 검색 유입(SEO) 키워드 20개 최적화 및 타임스탬프 구조
- 댓글 반응(Engagement) 유도형 설명란 구성
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
VIDEO_FILE = BASE_DIR / "shorts_pro_breaker_safety.mp4"

SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.force-ssl"
]

METADATA = {
    "title": "차단기 떨어졌을 때 그냥 올리면 공장 날아가는 이유 ⚡ (선배들이 절대 안 알려주는 현장 비밀) #Shorts",
    "description": (
        "공장이나 현장에서 차단기가 툭 떨어졌을 때, 원인도 모른 채 그냥 바로 올리셨나요?\n"
        "차단기 트립은 단순 접촉 불량이 아니라 선로 단락(쇼트)이나 심각한 누전의 강력한 경고입니다.\n"
        "무리하게 재투입하면 내부에서 고온의 아크 폭발이 일어나 배전반 전체가 전소될 수 있습니다!\n\n"
        "🚨 현장 선배들이 목숨처럼 지키는 [차단기 트립 3대 안전 수칙]:\n"
        "1️⃣ 트립 표시창 색상 확인 (과부하 vs 누전 원인 구분)\n"
        "2️⃣ 절연저항계(메거)로 선로 누전 측정 (0.2 MΩ 이하 색출)\n"
        "3️⃣ 모터 기동 시 정격 6배 돌입전류 초과 여부 검증\n\n"
        "📐 KEC 전선 굵기·전압강하·모터 돌입전류 3초 무료 계산기:\n"
        "👉 https://voltcheck24.com/\n\n"
        "💬 현장 선배님들은 차단기 떨어졌을 때 가장 먼저 무엇을 찍어보시나요? 댓글로 실무 꿀팁을 공유해 주세요! 👇\n\n"
        "#차단기 #누전차단기 #배선차단기 #차단기트립 #전기실무 #전기기사 #스마트팩토리 #공장자동화 #전기안전 #볼트체크 #Shorts #쇼츠"
    ),
    "tags": [
        "차단기", "누전차단기", "배선차단기", "차단기트립", "차단기떨어짐",
        "전기실무", "전기기사", "전기공사기사", "스마트팩토리", "공장자동화",
        "PLC", "제어반", "배전반", "누전", "전기안전", "공장사고",
        "볼트체크", "공학계산기", "Shorts", "쇼츠"
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
    print("🚀 [알고리즘 노출 극대화] 고도화 숏츠 업로드 시작")
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
