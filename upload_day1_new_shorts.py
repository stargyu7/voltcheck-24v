# -*- coding: utf-8 -*-
"""
=============================================================================
🚀 볼트체크(VoltCheck) 신규 숏츠 2편 유튜브 예약 업로드 실행기
=============================================================================
- 내일(2026년 9월 6일) 밤 10시 정각 & 10시 5분 정각 자동 공개 예약
- 1편: [광고/바이럴] 임팩 렌치 볼트 파단 실화 (22:00 KST / 13:00 UTC)
- 2편: [공학지식] 볼트 조임 토크 공식 T=k·d·F (22:05 KST / 13:05 UTC)
- 업로드 즉시 공식 안내 댓글 등록
=============================================================================
"""

import os
import sys
import time
import json
from pathlib import Path
from datetime import datetime, timezone, timedelta
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from googleapiclient.errors import HttpError
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

NEW_SHORTS = [
    {
        "id": "new_mkt_bolt_torque",
        "type": "marketing",
        "file": str(BASE_DIR / "shorts_new_mkt_bolt_torque.mp4"),
        "title": "임팩 렌치로 볼트 대충 조였다 3억짜리 금형 날릴 뻔한 썰 (실화) 💥 #Shorts #볼트체크",
        "description": (
            "현장에서 감이나 임팩 렌치로 대충 조였다가 M16 10.9 고장력 볼트가 뚝 끊어지며 3억짜리 금형이 날아갈 뻔한 실화!\n"
            "과토크로 볼트가 파단되거나 풀림 사고가 발생하는 치명적인 이유!\n"
            "스마트폰으로 볼트체크 3초 만에 켜서 볼트 호칭(M16)과 10.9 등급 넣고 284.3 N·m 적정 체결 토크 완벽 산출!\n\n"
            "👉 78대 전 산업 무료 공학 계산기 포털: https://voltcheck24.com/\n"
            "👉 볼트 토크 계산기: https://voltcheck24.com/?calc=bolt_torque\n\n"
            "#볼트토크 #기계설계 #금형사고 #스마트팩토리 #체결토크 #임팩렌치 #볼트체크 #Shorts #공학계산기"
        ),
        "comment": (
            "🚨 현장에서 '손맛'이나 '임팩 렌치'로 대충 조이다가 볼트 파단되고 수억 원대 금형·설비 날아갑니다!\n"
            "볼트 규격(M10~M36)과 강도 등급만 넣으면 3초 만에 적정 체결 토크 완벽 계산!\n"
            "👉 볼트 토크 계산기: https://voltcheck24.com/?calc=bolt_torque"
        ),
        "tags": ["볼트체크", "볼트토크", "체결토크", "기계설계", "금형설계", "임팩렌치", "스마트팩토리", "공학계산기", "Shorts"],
        "publish_at_kst": "2026-09-06 22:00:00 KST",
        "publish_at_utc": "2026-09-06T13:00:00.000Z",
        "slot_label": "내일 밤 10:00 KST (광고/바이럴 숏츠)"
    },
    {
        "id": "new_eng_bolt_formula",
        "type": "engineering",
        "file": str(BASE_DIR / "shorts_new_eng_bolt_formula.mp4"),
        "title": "현장 선배도 헷갈리는 볼트 조임 토크 계산 공식 T = k·d·F 완벽 마스터 ⚙️ #Shorts #볼트체크",
        "description": (
            "볼트 체결 토크 기본 공식: T = k × d × F\n"
            "- T: 체결 토크 (N·m)\n"
            "- k: 토크 계수 (건식 0.20 vs 윤활 0.15)\n"
            "- d: 볼트 호칭경 (m)\n"
            "- F: 체결 축력 (N)\n\n"
            "💡 토크 계수(k)를 잘못 적용하면 동일 토크라도 축력이 30% 이상 달라져 파단 위험!\n"
            "M16 10.9 볼트의 항복 축력 98.7kN 기준 최적의 토크를 3초 만에 검증하세요.\n\n"
            "👉 78대 전 산업 무료 공학 계산기 포털: https://voltcheck24.com/\n"
            "👉 볼트 토크 계산기: https://voltcheck24.com/?calc=bolt_torque\n\n"
            "#볼트조임토크 #토크공식 #기계공학 #공학계산기 #축력계산 #볼트체크 #Shorts #전기기사"
        ),
        "comment": (
            "⚙️ 토크 공식 T = k·d·F 에서 토크 계수(k) 하나 잘못 넣으면 체결력 30% 오차 납니다!\n"
            "건식(0.20), 윤활(0.15) 마찰계수와 볼트 강도별 항복강도 3초 만에 자동 검증하세요.\n"
            "👉 볼트체크 계산기: https://voltcheck24.com/?calc=bolt_torque"
        ),
        "tags": ["볼트체크", "토크공식", "볼트조임토크", "기계공학", "축력계산", "항복강도", "공학계산기", "Shorts"],
        "publish_at_kst": "2026-09-06 22:05:00 KST",
        "publish_at_utc": "2026-09-06T13:05:00.000Z",
        "slot_label": "내일 밤 10:05 KST (공학 지식 숏츠)"
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


def upload_video(youtube, item):
    file_path = Path(item["file"])
    if not file_path.exists():
        print(f"❌ 파일이 존재하지 않습니다: {file_path}")
        return None, None

    size_mb = file_path.stat().st_size / (1024 * 1024)
    print("=" * 80)
    print(f"🎬 [{item['slot_label']}] 예약 업로드 시작")
    print(f"   제목: {item['title']}")
    print(f"   용량: {size_mb:.2f} MB ({file_path.name})")
    print(f"   예약 공개 시간: {item['publish_at_kst']} (UTC: {item['publish_at_utc']})")
    print("=" * 80)

    body = {
        "snippet": {
            "title": item["title"],
            "description": item["description"],
            "tags": item["tags"],
            "categoryId": "28"
        },
        "status": {
            "privacyStatus": "private",
            "publishAt": item["publish_at_utc"],
            "selfDeclaredMadeForKids": False
        }
    }

    media = MediaFileUpload(str(file_path), chunksize=4 * 1024 * 1024, resumable=True, mimetype="video/mp4")
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
    print(f"✅ 유튜브 서버 업로드 및 예약 성공! Video ID: {video_id}")
    print(f"📱 영상 링크 (예약 시간에 자동 공개): {video_url}")

    # 공식 댓글 작성
    try:
        comment_body = {
            "snippet": {
                "videoId": video_id,
                "topLevelComment": {
                    "snippet": {
                        "textOriginal": item["comment"]
                    }
                }
            }
        }
        youtube.commentThreads().insert(part="snippet", body=comment_body).execute()
        print("💬 공식 추천 안내 댓글 등록 완료!")
    except Exception as e:
        print(f"⚠️ 댓글 등록 알림: {e}")

    return video_id, video_url


def main():
    youtube = get_youtube()
    results = []

    for item in NEW_SHORTS:
        vid_id, v_url = upload_video(youtube, item)
        if vid_id:
            results.append({
                "item": item,
                "video_id": vid_id,
                "video_url": v_url
            })
        time.sleep(2)

    print("\n" + "#" * 80)
    print("🎉 신규 숏츠 2편 예약 등록이 완료되었습니다!")
    print("#" * 80)
    for res in results:
        it = res["item"]
        print(f"📌 [{it['slot_label']}]")
        print(f"   - 제목: {it['title']}")
        print(f"   - 공개 예약: {it['publish_at_kst']}")
        print(f"   - 영상 URL: {res['video_url']}")
        print()

    # shorts_content_queue.json 업데이트
    try:
        if QUEUE_FILE.exists():
            with open(QUEUE_FILE, "r", encoding="utf-8") as f:
                qdata = json.load(f)
        else:
            qdata = {"queue": []}

        for res in results:
            it = res["item"]
            qdata["queue"].insert(0, {
                "id": it["id"],
                "type": it["type"],
                "name": it["title"],
                "file": Path(it["file"]).name,
                "title": it["title"],
                "description": it["description"],
                "comment": it["comment"],
                "tags": it["tags"],
                "status": "scheduled",
                "last_uploaded_at": datetime.now().isoformat(),
                "video_id": res["video_id"],
                "publish_at": it["publish_at_kst"]
            })

        with open(QUEUE_FILE, "w", encoding="utf-8") as f:
            json.dump(qdata, f, ensure_ascii=False, indent=2)
        print("💾 shorts_content_queue.json 갱신 완료")
    except Exception as e:
        print(f"⚠️ 큐 저장 중 오류: {e}")


if __name__ == "__main__":
    main()
