# -*- coding: utf-8 -*-
"""
=============================================================================
📅 볼트체크(VoltCheck) 유튜브 숏츠 일괄 예약 업로더 (Scheduled Publisher)
=============================================================================
- 컴퓨터를 꺼두어도 구글(유튜브) 본사 서버에서 매일 밤 10시 정각에 자동 공개!
- 내일(9월 6일)부터 매일 밤 10시에 [광고 1편 + 공학 1편] 총 2편씩 순차 예약 발행:
  * Day 1 (09/06): 22:00 [광고] 20억 라인 CCTV / 22:05 [공학] KEC 전압강하 공식
  * Day 2 (09/07): 22:00 [광고] 스피드 대결 3초 / 22:05 [공학] 모터 돌입전류 6배
  * Day 3 (09/08): 22:00 [광고] 8비트 RPG 배틀 / 22:05 [공학] 베어링 ISO 281 수명
  * Day 4 (09/09): 22:00 [광고] 부품 단톡방 유출 / 22:05 [공학] 유압 수격 축압기
  * Day 5 (09/10): 22:00 [공학] ESS 배터리 방폭 환기 공식
=============================================================================
"""

import os
import sys
import time
import json
import argparse
from datetime import datetime, timedelta, timezone
from pathlib import Path

# Windows 콘솔 인코딩 및 버퍼링 설정
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", line_buffering=True)
        sys.stderr.reconfigure(encoding="utf-8", line_buffering=True)
    except Exception:
        pass

BASE_DIR = Path(__file__).resolve().parent
QUEUE_FILE = BASE_DIR / "shorts_content_queue.json"
TOKEN_FILE = BASE_DIR / "youtube_token.json"
LOG_FILE = BASE_DIR / "daily_upload.log"

SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.force-ssl"
]

KST = timezone(timedelta(hours=9))


def log_message(msg: str):
    now_str = datetime.now().strftime("[%Y-%m-%d %H:%M:%S]")
    line = f"{now_str} {msg}"
    print(line)
    try:
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(line + "\n")
    except Exception:
        pass


def load_queue():
    with open(QUEUE_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_queue(data):
    with open(QUEUE_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def get_youtube_client():
    from googleapiclient.discovery import build
    from google.oauth2.credentials import Credentials
    from google.auth.transport.requests import Request

    if not TOKEN_FILE.exists():
        log_message("❌ youtube_token.json 파일을 찾을 수 없습니다.")
        sys.exit(1)

    creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)
    if not creds.valid:
        if creds.expired and creds.refresh_token:
            creds.refresh(Request())
            with open(TOKEN_FILE, "w", encoding="utf-8") as f:
                f.write(creds.to_json())
    return build("youtube", "v3", credentials=creds)


def calculate_schedule_plan(queue_items):
    """
    내일(2026-09-06) 밤 10시부터 매일 2편씩 예약 시간표 생성:
    - 슬롯 1 (광고): 밤 10시 00분 (22:00:00 KST)
    - 슬롯 2 (공학): 밤 10시 05분 (22:05:00 KST)
    """
    mkt_items = [it for it in queue_items if it["type"] == "marketing" and it.get("status") != "scheduled"]
    eng_items = [it for it in queue_items if it["type"] == "engineering" and it.get("status") != "scheduled"]

    # 시작일: 내일 (2026-09-06)
    start_date = (datetime.now(KST) + timedelta(days=1)).date()

    plan = []
    day_idx = 0

    while mkt_items or eng_items:
        current_date = start_date + timedelta(days=day_idx)

        # 슬롯 1 (광고 우선, 없으면 공학)
        item1 = mkt_items.pop(0) if mkt_items else (eng_items.pop(0) if eng_items else None)
        if item1:
            dt1_kst = datetime(current_date.year, current_date.month, current_date.day, 22, 0, 0, tzinfo=KST)
            dt1_utc = dt1_kst.astimezone(timezone.utc)
            plan.append({
                "item": item1,
                "publish_at_kst": dt1_kst.strftime("%Y-%m-%d %H:%M:%S KST"),
                "publish_at_utc": dt1_utc.strftime("%Y-%m-%dT%H:%M:%S.000Z"),
                "day_label": f"Day {day_idx + 1} (슬롯 1 - 22:00)"
            })

        # 슬롯 2 (공학 우선, 없으면 광고)
        item2 = eng_items.pop(0) if eng_items else (mkt_items.pop(0) if mkt_items else None)
        if item2:
            dt2_kst = datetime(current_date.year, current_date.month, current_date.day, 22, 5, 0, tzinfo=KST)
            dt2_utc = dt2_kst.astimezone(timezone.utc)
            plan.append({
                "item": item2,
                "publish_at_kst": dt2_kst.strftime("%Y-%m-%d %H:%M:%S KST"),
                "publish_at_utc": dt2_utc.strftime("%Y-%m-%dT%H:%M:%S.000Z"),
                "day_label": f"Day {day_idx + 1} (슬롯 2 - 22:05)"
            })

        day_idx += 1

    return plan


def upload_scheduled_video(youtube, plan_entry, dry_run=False):
    from googleapiclient.http import MediaFileUpload
    from googleapiclient.errors import HttpError

    item = plan_entry["item"]
    file_path = BASE_DIR / item["file"]
    if not file_path.exists():
        log_message(f"❌ 파일 누락: {file_path}")
        return None

    file_size_mb = file_path.stat().st_size / (1024 * 1024)
    log_message("-" * 75)
    log_message(f"🎬 [{plan_entry['day_label']}] 예약 업로드 준비")
    log_message(f"   영상: {item['name']} ({file_size_mb:.1f} MB)")
    log_message(f"   제목: {item['title']}")
    log_message(f"   ⏰ 예약 공개 일시: {plan_entry['publish_at_kst']} (컴퓨터 꺼져 있어도 자동 공개)")
    log_message("-" * 75)

    if dry_run:
        log_message("   [DRY-RUN] 모의 테스트 성공")
        return "DRY_RUN_ID"

    # YouTube 예약 업로드 필수 스펙: privacyStatus = "private" & publishAt = UTC ISO 문자열
    body = {
        "snippet": {
            "title": item["title"],
            "description": item["description"],
            "tags": item.get("tags", []),
            "categoryId": "28"
        },
        "status": {
            "privacyStatus": "private",
            "publishAt": plan_entry["publish_at_utc"],
            "selfDeclaredMadeForKids": False
        }
    }

    media = MediaFileUpload(str(file_path), chunksize=4 * 1024 * 1024, resumable=True, mimetype="video/mp4")
    request = youtube.videos().insert(part=",".join(body.keys()), body=body, media_body=media)

    response = None
    while response is None:
        try:
            status, response = request.next_chunk()
            if status:
                pct = int(status.progress() * 100)
                print(f"\r   업로드 진행률: {pct}% ({status.resumable_progress / (1024*1024):.1f} MB)", end="")
        except HttpError as e:
            if "quotaExceeded" in str(e):
                log_message(f"\n⚠️ [YouTube 일일 할당량(Quota) 도달] 오늘 가능한 업로드 한도(약 6편)에 도달했습니다.")
                log_message("남은 예약 영상은 내일 이어서 자동으로 업로드하시면 됩니다!")
                return "QUOTA_EXCEEDED"
            raise e

    print()
    video_id = response.get("id")
    video_url = f"https://www.youtube.com/shorts/{video_id}"
    log_message(f"✅ 유튜브 서버 저장 및 예약 완료! ID: {video_id}")
    log_message(f"📱 영상 링크 (예약시간에 자동 공개): {video_url}")

    # 공식 홍보 댓글 작성
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
            log_message("   💬 공식 추천 댓글 등록 완료")
        except Exception as e:
            log_message(f"   ⚠️ 댓글 등록 생략: {e}")

    return video_id


def main():
    parser = argparse.ArgumentParser(description="볼트체크 유튜브 숏츠 일괄 예약 업로더")
    parser.add_argument("--dry-run", action="store_true", help="실제 업로드 없이 예약 시간표 및 설정만 검증")
    parser.add_argument("--plan-only", action="store_true", help="예약 시간표만 확인")
    parser.add_argument("-y", "--yes", action="store_true", help="확인 질문 없이 즉시 예약 업로드 진행")
    args = parser.parse_args()

    queue_data = load_queue()
    plan = calculate_schedule_plan(queue_data["queue"])

    print("\n" + "=" * 80)
    print("📅 [볼트체크] 매일 밤 10시 숏츠 2편(광고1+공학1) 자동 예약 공개 시간표")
    print("=" * 80)
    for idx, entry in enumerate(plan, 1):
        item = entry["item"]
        print(f"{idx}. [{entry['day_label']:<20}] {entry['publish_at_kst']} | {item['name']}")
    print("=" * 80 + "\n")

    if args.plan_only:
        return

    if not args.dry_run and not args.yes:
        confirm = input("👉 위 시간표대로 지금 유튜브 서버에 일괄 예약 업로드하시겠습니까? (Y/n): ").strip().lower()
        if confirm and confirm != "y":
            print("취소되었습니다.")
            return

    youtube = None
    if not args.dry_run:
        youtube = get_youtube_client()

    success_count = 0
    for idx, entry in enumerate(plan, 1):
        log_message(f"\n[{idx}/{len(plan)}] {entry['item']['name']} 예약 진행 중...")
        res = upload_scheduled_video(youtube, entry, dry_run=args.dry_run)
        if res == "QUOTA_EXCEEDED":
            break
        elif res:
            success_count += 1
            if not args.dry_run:
                entry["item"]["status"] = "scheduled"
                entry["item"]["publish_at"] = entry["publish_at_kst"]
                entry["item"]["video_id"] = res
                save_queue(queue_data)
        time.sleep(2)

    log_message("\n" + "=" * 75)
    log_message(f"🎉 총 {success_count}편의 동영상이 유튜브 서버에 예약 완료되었습니다!")
    log_message("이제 컴퓨터를 완전히 끄셔도 유튜브 서버가 지정된 일시에 매일 밤 10시 정각에 전 세계에 자동 공개합니다! 🌟")
    log_message("=" * 75)


if __name__ == "__main__":
    main()
