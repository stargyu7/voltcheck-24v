# -*- coding: utf-8 -*-
"""
=============================================================================
🌅 볼트체크(VoltCheck) 매일 아침 8시 자동 발행 스케줄러 (Daily Shorts Publisher)
=============================================================================
- 매일 아침 8시 실행 시:
  1) 📢 광고/바이럴 숏츠 1편 (직장인 썰 / CCTV 감식 / 8비트 RPG / 단톡방)
  2) 📐 정통 공학 지식 숏츠 1편 (KEC 전압강하 / 모터 돌입전류 / 베어링 수명 / 유압 수격 / BESS)
  ➔ 총 2편을 순차적으로 유튜브에 자동 업로드하고 공식 댓글 등록!
=============================================================================
"""

import os
import sys
import time
import json
import argparse
from datetime import datetime
from pathlib import Path

# Windows 콘솔 인코딩 및 버퍼링 설정
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", line_buffering=True)
        sys.stderr.reconfigure(encoding="utf-8", line_buffering=True)
    except Exception:
        pass

# 프로젝트 경로 설정
BASE_DIR = Path(__file__).resolve().parent
QUEUE_FILE = BASE_DIR / "shorts_content_queue.json"
TOKEN_FILE = BASE_DIR / "youtube_token.json"
CLIENT_SECRET_FILE = BASE_DIR / "client_secret.json"
LOG_FILE = BASE_DIR / "daily_upload.log"

SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.force-ssl"
]


def log_message(msg: str):
    """콘솔 및 로그 파일에 타임스탬프와 함께 기록"""
    now_str = datetime.now().strftime("[%Y-%m-%d %H:%M:%S]")
    line = f"{now_str} {msg}"
    print(line)
    try:
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(line + "\n")
    except Exception:
        pass


def load_queue():
    if not QUEUE_FILE.exists():
        log_message(f"❌ 큐 파일이 없습니다: {QUEUE_FILE}")
        sys.exit(1)
    with open(QUEUE_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_queue(data):
    with open(QUEUE_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def get_next_items(queue_data):
    """마케팅 1편 + 공학지식 1편을 각각 1편씩 선별 (없으면 큐 자동 리셋 후 순환)"""
    items = queue_data.get("queue", [])

    # 1. 마케팅 아이템 찾기
    mkt_item = next((it for it in items if it["type"] == "marketing" and it["status"] == "pending"), None)
    if not mkt_item:
        log_message("🔄 마케팅 숏츠 큐가 소진되어 상태를 초기화(리셋)하고 다시 순환합니다.")
        for it in items:
            if it["type"] == "marketing":
                it["status"] = "pending"
        mkt_item = next((it for it in items if it["type"] == "marketing" and it["status"] == "pending"), None)

    # 2. 공학지식 아이템 찾기
    eng_item = next((it for it in items if it["type"] == "engineering" and it["status"] == "pending"), None)
    if not eng_item:
        log_message("🔄 공학지식 숏츠 큐가 소진되어 상태를 초기화(리셋)하고 다시 순환합니다.")
        for it in items:
            if it["type"] == "engineering":
                it["status"] = "pending"
        eng_item = next((it for it in items if it["type"] == "engineering" and it["status"] == "pending"), None)

    return mkt_item, eng_item


def authenticate_youtube():
    from googleapiclient.discovery import build
    from google_auth_oauthlib.flow import InstalledAppFlow
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials

    creds = None
    if TOKEN_FILE.exists():
        try:
            creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)
        except Exception as e:
            log_message(f"⚠️ 토큰 파일 읽기 오류: {e}")
            creds = None

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            try:
                log_message("🔄 기존 토큰 만료됨. 자동으로 리프레시 중...")
                creds.refresh(Request())
            except Exception as e:
                log_message(f"⚠️ 토큰 자동 갱신 실패: {e}")
                creds = None

        if not creds:
            secret_candidates = list(BASE_DIR.glob("client_secret*.json"))
            if not secret_candidates:
                log_message("❌ client_secret.json 파일이 없습니다! 최초 1회 인증 설정이 필요합니다.")
                sys.exit(1)
            secret_path = secret_candidates[0]
            log_message(f"🌐 1회성 구글 로그인을 진행합니다 ({secret_path.name})...")
            flow = InstalledAppFlow.from_client_secrets_file(str(secret_path), SCOPES)
            creds = flow.run_local_server(port=0, open_browser=True)

        with open(TOKEN_FILE, "w", encoding="utf-8") as f:
            f.write(creds.to_json())
        log_message("✅ 인증 완료 및 토큰 영구 저장 완료!")

    return build("youtube", "v3", credentials=creds)


def upload_single_short(youtube, item, privacy="public", dry_run=False):
    from googleapiclient.http import MediaFileUpload

    file_path = BASE_DIR / item["file"]
    if not file_path.exists():
        log_message(f"❌ 영상 파일 누락: {file_path}")
        return None

    file_size_mb = file_path.stat().st_size / (1024 * 1024)
    log_message(f"🎬 업로드 시작 [{item['type'].upper()}]: {item['name']} ({file_size_mb:.1f} MB)")
    log_message(f"   제목: {item['title']}")

    if dry_run:
        log_message("   [DRY-RUN] 모의 테스트 완료 (실제 업로드 생략)")
        return "DRY_RUN_ID"

    body = {
        "snippet": {
            "title": item["title"].replace("<", "").replace(">", ""),
            "description": item["description"].replace("<", "").replace(">", ""),
            "tags": item.get("tags", []),
            "categoryId": "28",  # 과학기술
            "defaultLanguage": "en",
            "defaultAudioLanguage": "en"
        },
        "status": {
            "privacyStatus": privacy,
            "selfDeclaredMadeForKids": False
        }
    }

    media = MediaFileUpload(str(file_path), chunksize=4 * 1024 * 1024, resumable=True, mimetype="video/mp4")
    request = youtube.videos().insert(part=",".join(body.keys()), body=body, media_body=media)

    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            pct = int(status.progress() * 100)
            print(f"\r   업로드 진행률: {pct}%", end="")

    print()
    video_id = response.get("id")
    video_url = f"https://www.youtube.com/shorts/{video_id}"
    log_message(f"✅ 업로드 완료! 직링크: {video_url}")

    # 공식 댓글 등록
    comment_text = item.get("comment")
    if comment_text:
        try:
            comment_body = {
                "snippet": {
                    "videoId": video_id,
                    "topLevelComment": {
                        "snippet": {
                            "textOriginal": comment_text
                        }
                    }
                }
            }
            youtube.commentThreads().insert(part="snippet", body=comment_body).execute()
            log_message("   💬 공식 홍보 댓글 자동 등록 완료")
        except Exception as e:
            log_message(f"   ⚠️ 댓글 등록 생략: {e}")

    return video_id


def run_daily_batch(privacy="public", dry_run=False):
    log_message("=" * 70)
    log_message("🌅 [볼트체크] 매일 아침 8시 정기 숏츠 2편 자동 발행 작업 시작!")
    log_message("=" * 70)

    queue_data = load_queue()
    mkt_item, eng_item = get_next_items(queue_data)

    if not mkt_item or not eng_item:
        log_message("❌ 발행할 숏츠를 큐에서 찾지 못했습니다.")
        return

    log_message(f"📋 오늘의 발행 계획:")
    log_message(f"  1) [광고/바이럴] {mkt_item['name']}")
    log_message(f"  2) [공학 지식]  {eng_item['name']}")

    youtube = None
    if not dry_run:
        youtube = authenticate_youtube()

    # 1. 광고/바이럴 숏츠 업로드
    log_message("\n--- [1/2] 광고/바이럴 숏츠 업로드 진행 ---")
    mkt_vid = upload_single_short(youtube, mkt_item, privacy=privacy, dry_run=dry_run)
    if mkt_vid:
        mkt_item["status"] = "uploaded"
        mkt_item["last_uploaded_at"] = datetime.now().isoformat()
        mkt_item["video_id"] = mkt_vid
        save_queue(queue_data)

    # 유튜브 API 텀 대기 (안정적 처리)
    log_message("⏱️ 다음 영상 업로드 전 5초 대기 중...")
    time.sleep(5)

    # 2. 공학 지식 숏츠 업로드
    log_message("\n--- [2/2] 공학 지식 숏츠 업로드 진행 ---")
    eng_vid = upload_single_short(youtube, eng_item, privacy=privacy, dry_run=dry_run)
    if eng_vid:
        eng_item["status"] = "uploaded"
        eng_item["last_uploaded_at"] = datetime.now().isoformat()
        eng_item["video_id"] = eng_vid
        save_queue(queue_data)

    log_message("=" * 70)
    log_message("🎉 오늘의 숏츠 2편(광고 1편 + 공학지식 1편) 자동 발행 완료!")
    log_message("=" * 70)


def print_status():
    queue_data = load_queue()
    print("\n" + "=" * 80)
    print("📊 [볼트체크] 숏츠 일일 발행 큐 현황표")
    print("=" * 80)
    for idx, it in enumerate(queue_data.get("queue", []), 1):
        status_tag = "✅ 발행완료" if it["status"] == "uploaded" else "⏳ 대기중"
        date_str = it.get("last_uploaded_at")[:10] if it.get("last_uploaded_at") else "-"
        print(f"{idx}. [{it['type']:<11}] {status_tag} | 최근발행: {date_str} | {it['name']}")
    print("=" * 80 + "\n")


def main():
    parser = argparse.ArgumentParser(description="볼트체크 매일 8시 숏츠 2편 자동 발행기")
    parser.add_argument("--run", action="store_true", help="지금 즉시 오늘의 2편(광고 1편 + 공학 1편)을 업로드합니다.")
    parser.add_argument("--dry-run", action="store_true", help="실제 업로드 없이 모의 테스트만 수행합니다.")
    parser.add_argument("--status", action="store_true", help="큐 현황 및 대기 목록을 출력합니다.")
    parser.add_argument("--privacy", type=str, default="public", choices=["public", "unlisted", "private"],
                        help="공개 상태 (기본값: public)")

    args = parser.parse_args()

    if args.status:
        print_status()
        return

    if args.run or args.dry_run:
        run_daily_batch(privacy=args.privacy, dry_run=args.dry_run)
    else:
        # 인자 없이 실행 시 즉시 실행
        run_daily_batch(privacy=args.privacy, dry_run=False)


if __name__ == "__main__":
    main()
