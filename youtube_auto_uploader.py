# -*- coding: utf-8 -*-
"""
=============================================================================
🚀 볼트체크(VoltCheck) 유튜브 숏츠 100% 전자동 업로더 (YouTube Shorts Auto Uploader)
=============================================================================
- 지원 기능:
  1. Google Cloud OAuth 2.0 자동 브라우저 인증 및 토큰 영구 캐싱 (youtube_token.json)
  2. 대용량 동영상 청크(Chunk 4MB) 분할 이어올리기 (Resumable Upload)
  3. 실시간 터미널 업로드 진행률 프로그레스 바 ([████████] 100%)
  4. 9대 숏츠 동영상 메타데이터(제목, 본문, KEC 공식, 태그, 카테고리) 자동 등록
  5. 영상 업로드 완료 즉시 채널 공식 홍보 댓글 자동 등록
  6. 개별 업로드(--video story1), 전체 일괄 업로드(--all), 모의 테스트(--dry-run) 지원
=============================================================================
"""

import os
import sys
import time
import json
import argparse
from pathlib import Path

# Windows 터미널 한글 및 유니코드 출력(cp949 에러 방지) 지원
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Google API Libraries
try:
    from googleapiclient.discovery import build
    from googleapiclient.errors import HttpError
    from googleapiclient.http import MediaFileUpload
    from google_auth_oauthlib.flow import InstalledAppFlow
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials
except ImportError:
    print("[오류] 필수 패키지가 설치되지 않았습니다.")
    print("다음 명령어를 실행하여 설치해주세요:")
    print("pip install google-api-python-client google-auth-oauthlib google-auth-httplib2")
    sys.exit(1)

# 기본 경로 및 설정
BASE_DIR = Path(__file__).resolve().parent
TOKEN_FILE = BASE_DIR / "youtube_token.json"
DEFAULT_CLIENT_SECRET = BASE_DIR / "client_secret.json"

# 유튜브 업로드 및 댓글 작성을 위한 OAuth Scope
SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.force-ssl"
]

# 9대 유튜브 숏츠 영상 데이터베이스 (제목, 설명란, 고정 댓글, 태그, 카테고리 28: 과학기술)
SHORTS_REGISTRY = {
    "story1": {
        "id": "story1",
        "name": "[실화 썰 #1] 전선 얇은 거 썼다 1억 날린 썰",
        "file": "shorts_story_ep1_electric.mp4",
        "title": "전선 얇은 거 썼다가 1억 날릴 뻔한 썰 (실화) 💥 #Shorts #볼트체크",
        "description": (
            "새벽 2시에 20억짜리 로봇 라인이 갑자기 셧다운된 충격적인 실화!\n"
            "설비팀 다 달려오고 공장장님 얼굴 하얘졌는데...\n"
            "원인은 원가 300원 아끼겠다고 24V 선로 80m에 1.5스퀘어를 깐 것이었습니다!\n"
            "말단 전압 18.2V로 전압 붕괴, 센서 통신 마비!\n\n"
            "이때 과장님이 스마트폰으로 볼트체크 딱 켜고 3초 만에 4.0sq 산출!\n"
            "케이블 교체하자마자 라인 정상 가동 복구 완료!\n\n"
            "📐 핵심 공학 공식:\n"
            "e = (2 × L × I × ρ) / A\n"
            "❌ 1.5 sq 배선: ΔV = 1.90V (강하율 7.92% ➔ 허용치 3% 초과 탈락)\n"
            "✅ 4.0 sq 최적: ΔV = 0.71V (강하율 2.96% ➔ KEC 3% 이내 합격)\n\n"
            "⏱️ 타임라인:\n"
            "00:00 20억 라인 새벽 2시 셧다운\n"
            "00:15 300원짜리 전선의 배신 (18.2V 실측)\n"
            "00:33 볼트체크 3초 산출 (4.0sq)\n"
            "00:41 정상 복구 및 무료 검증 안내\n\n"
            "👉 78대 전 산업 무료 공학 계산기 포털: https://voltcheck24.com/\n"
            "👉 24V 전압강하 계산기 바로가기: https://voltcheck24.com/?calc=volt_drop_dc\n"
            "👉 네이버 / 구글 검색창: [볼트체크]\n\n"
            "#직장인썰 #전기기사 #전압강하 #스마트팩토리 #제어반 #전장설계 #공장자동화 #KEC #볼트체크 #Shorts"
        ),
        "comment": (
            "🚨 '선로 80m인데 대충 1.5sq 깔면 되지' 하다가 공장 멈추고 시말서 씁니다...\n"
            "현장 가시기 전에 스마트폰으로 3초 만에 KEC 전압강하 무료 검증하고 가세요!\n"
            "👉 볼트체크 24V 계산기: https://voltcheck24.com/?calc=volt_drop_dc\n"
            "(회원가입/설치 없음, 스마트폰 100% 무료)"
        ),
        "tags": [
            "볼트체크", "전압강하", "전압강하계산기", "KEC", "KEC규정", "전기기사", "전기공사기사",
            "제어반", "전장설계", "스마트팩토리", "공장자동화", "PLC", "24V전원", "케이블굵기",
            "허용전류", "공학계산기", "전기설비", "직장인썰", "Shorts", "쇼츠"
        ],
        "category_id": "28"
    },
    "story2": {
        "id": "story2",
        "name": "[실화 썰 #2] 모터 켜자마자 펑! 차단기 떨어진 썰",
        "file": "shorts_story_ep2_motor.mp4",
        "title": "모터 스위치 켜자마자 펑! 차단기 떨어져서 공장 세운 썰 💥 #Shorts #볼트체크",
        "description": (
            "신입사원이 15kW 3상 모터 달고 신나서 스위치 딱 올렸는데...\n"
            "메인 차단기가 쾅 하고 떨어지면서 공장 라인이 다 죽어버린 실화!\n"
            "신입은 '모터 불량인가요?' 멘붕 왔는데, 원인은 모터 기동 시 평소의 6배인 182A 돌입전류가 튀는데 일반 배선용 차단기를 달아놨던 것!\n\n"
            "부장님이 볼트체크 모터 계산기 켜고 3초 만에 50AF/40AT Type-D 차단기와 MC-32a 전자접촉기로 즉시 교체!\n"
            "모터 쌩쌩 부드럽게 정상 회전 복구 완료!\n\n"
            "📐 핵심 공학 공식:\n"
            "I_FLC = P / (√3 × V × η × cosθ)\n"
            "전부하 전류: 30.4A ➔ 시동 돌입전류 182.4A (600%)\n"
            "✅ 차단기 추천: 50AF / 40AT (Type-D 기동용)\n"
            "✅ 전자접촉기: MC-32a (AC-3 32A 정격)\n\n"
            "⏱️ 타임라인:\n"
            "00:00 모터 켜자마자 차단기 트립\n"
            "00:13 열화상 카메라 & 돌입전류 182A 원인\n"
            "00:28 볼트체크 3초 모터 솔루션\n"
            "00:38 정상 복구 및 네이버 검색 안내\n\n"
            "👉 78대 전 산업 무료 공학 계산 포털: https://voltcheck24.com/\n"
            "👉 모터 용량 계산기 바로가기: https://voltcheck24.com/?calc=motor_current\n"
            "👉 네이버 / 구글 검색창: [볼트체크]\n\n"
            "#직장인썰 #모터 #돌입전류 #차단기트립 #전자접촉기 #전기기사 #공장자동화 #EOCR #볼트체크 #Shorts"
        ),
        "comment": (
            "⚙️ 모터 정격만 보고 일반 차단기 달았다가 스위치 올릴 때마다 트립됩니다!\n"
            "돌입전류 6배 견디는 Type-D 차단기와 MC 규격, 3초 만에 뽑아보세요.\n"
            "👉 볼트체크 모터 계산기: https://voltcheck24.com/?calc=motor_current"
        ),
        "tags": [
            "볼트체크", "모터용량계산", "돌입전류", "차단기트립", "전자접촉기", "MC선정", "3상모터",
            "유도전동기", "EOCR", "전기기사", "전기공사기사", "공장자동화", "배선용차단기", "MCCB",
            "기동전류", "공학계산기", "직장인썰", "Shorts", "쇼츠"
        ],
        "category_id": "28"
    },
    "story3": {
        "id": "story3",
        "name": "[실화 썰 #3] 쇠 갈리는 귀신 소리 난 썰",
        "file": "shorts_story_ep3_bearing.mp4",
        "title": "공장에서 쇠 갈리는 귀신 소리 나다 축 부러질 뻔한 썰 ⚙️ #Shorts #볼트체크",
        "description": (
            "야간 근무 서는데 펌프 모터에서 쇠 갈리는 끼이익 귀신 곡소리가 난 실화!\n"
            "'구리스나 칠까' 하다가 진동 측정기를 대봤더니 진동 수치가 12.8 mm/s까지 떡상!\n"
            "ISO 281 L10h 정격 수명 다 끝난 6205 베어링 방치하다 회전축 부러지고 3천만 원 날릴 뻔했습니다.\n\n"
            "볼트체크 베어링 계산기로 정격 피로수명 84,200시간과 최적 구리스 윤활 주기 4,200시간을 즉시 산출,\n"
            "새 베어링으로 교체하니 진동 0.8 mm/s, 소음 0으로 완벽 복구!\n\n"
            "📐 핵심 공학 공식:\n"
            "ISO 281 베어링 피로수명: L10h = (10^6 / 60·n) × (C/P)^p\n"
            "✅ 정격 피로 수명 L10h: 84,200 시간 (9.6년 연속 운전 신뢰도 90%)\n"
            "✅ 최적 구리스 윤활 주기: 4,200 시간 (약 6개월 권장)\n\n"
            "⏱️ 타임라인:\n"
            "00:00 펌프 모터 이상 소음 발생\n"
            "00:10 진동계 12.8 mm/s 위험 측정\n"
            "00:26 볼트체크 ISO 281 베어링 수명 산출\n"
            "00:36 진동 0 복구 및 무료 검증 안내\n\n"
            "👉 78대 전 산업 무료 공학 계산 포털: https://voltcheck24.com/\n"
            "👉 베어링 수명 계산기 바로가기: https://voltcheck24.com/?calc=bearing_life\n"
            "👉 네이버 / 구글 검색창: [볼트체크]\n\n"
            "#직장인썰 #베어링 #베어링수명 #기계설계 #진동진단 #윤활주기 #일반기계기사 #설비보전기사 #볼트체크 #Shorts"
        ),
        "comment": (
            "🔧 쇠 갈리는 소리 날 때 구리스만 치면 베어링 고착돼서 모터 축 작살납니다!\n"
            "ISO 281 정격 수명과 윤활 주기, 모바일에서 3초 만에 무료 진단하세요!\n"
            "👉 볼트체크 베어링 계산기: https://voltcheck24.com/?calc=bearing_life"
        ),
        "tags": [
            "볼트체크", "베어링수명계산", "ISO281", "L10h", "베어링소음", "진동측정", "설비보전기사",
            "일반기계기사", "기계설계", "구리스윤활", "볼베어링", "회전기계", "펌프모터", "진동진단",
            "공학계산기", "직장인썰", "Shorts", "쇼츠"
        ],
        "category_id": "28"
    },
    "story4": {
        "id": "story4",
        "name": "[실화 썰 #4] 유압 프레스 찍다 배관 터져 기름바다 될 뻔한 썰",
        "file": "shorts_story_ep4_hydraulic.mp4",
        "title": "유압 프레스 찍다 배관 터져 기름바다 될 뻔한 썰 🚰 #Shorts #볼트체크",
        "description": (
            "사출 프레스 라인에서 실린더 멈출 때마다 배관이 지진 난 것처럼 쾅! 쾅! 요동친 실화!\n"
            "'원래 소리가 크다'고 놔뒀다간 용접부 터져서 200bar 고온 작동유 뿜고 공장 전체 기름바다에 억대 손실!\n"
            "원인은 밸브 급폐쇄로 인한 수격작용(Water Hammer) 압력 서지 280 bar 피크였습니다.\n\n"
            "반장님이 볼트체크 유압 계산기로 3초 만에 126 bar 질소 봉입 압력과 25리터 블래더 축압기(Accumulator) 산출 완료!\n"
            "매니폴드에 장착하자마자 거짓말처럼 소음 진동 0으로 사라짐!\n\n"
            "📐 핵심 공학 공식:\n"
            "가스 단열 변화: P0·V0^n = P1·V1^n (n=1.4)\n"
            "✅ 초기 질소 봉입 압력: 126 bar (0.9 × P_min)\n"
            "✅ 총 축압기 체적: 24.8 L ➔ 표준 25L 블래더 용기 채택\n\n"
            "⏱️ 타임라인:\n"
            "00:00 유압 프레스 배관 쾅쾅 요동\n"
            "00:13 수격작용 280 bar 서지 압력 위험\n"
            "00:29 볼트체크 질소 축압기 25L 산출\n"
            "00:38 진동 소음 0 정상 복구\n\n"
            "👉 78대 전 산업 무료 공학 계산 포털: https://voltcheck24.com/\n"
            "👉 유압 축압기 계산기 바로가기: https://voltcheck24.com/?calc=accumulator_sizing\n"
            "👉 네이버 / 구글 검색창: [볼트체크]\n\n"
            "#직장인썰 #유압설계 #축압기 #어큐뮬레이터 #수격작용 #압력서지 #플랜트설계 #배관진동 #볼트체크 #Shorts"
        ),
        "comment": (
            "🚰 유압 실린더 급정지할 때 배관 흔들리는 건 방치하면 100% 터집니다!\n"
            "워터해머 잡는 질소 축압기 용량, 3초 만에 무료로 산출하세요.\n"
            "👉 볼트체크 유압 계산기: https://voltcheck24.com/?calc=accumulator_sizing"
        ),
        "tags": [
            "볼트체크", "유압축압기", "어큐뮬레이터", "어큐뮬레이터용량", "수격작용", "워터해머",
            "압력서지", "유압배관", "유압프레스", "사출성형기", "플랜트설계", "기계기사", "작동유",
            "유압회로", "공학계산기", "직장인썰", "Shorts", "쇼츠"
        ],
        "category_id": "28"
    },
    "story5": {
        "id": "story5",
        "name": "[실화 썰 #5] ESS 배터리 룸 가스 폭발 막은 썰",
        "file": "shorts_story_ep5_bess.mp4",
        "title": "ESS 배터리 룸 들어갔다 가스 폭발로 실려갈 뻔한 썰 🤖 #Shorts #볼트체크",
        "description": (
            "안전 점검차 대형 ESS 배터리 컨테이너 룸 문을 열었는데...\n"
            "가스 감지기 사이렌이 삐- 울리면서 수소 농도가 치솟았던 일촉즉발 실화!\n"
            "리튬 배터리 셀 하나가 열폭주 나며 1분에 120리터씩 폭발성 수소 가스를 분출!\n"
            "정전기 스파크 하나면 컨테이너 통째로 대폭발할 초비상 상황이었습니다.\n\n"
            "소방 팀장이 볼트체크 NFPA 855 방폭 환기 계산기를 켜고,\n"
            "단 3초 만에 1,250 CMH 방폭 배기팬 긴급 풀가동 지시!\n"
            "폭발 한계선(LFL 4%) 밑으로 안전하게 배출시키며 기적처럼 대폭발을 막았습니다!\n\n"
            "📐 핵심 공학 공식:\n"
            "NFPA 855 방폭 환기 배기량: Q_vent = (G_max × Packs) / (LFL × SF × 60)\n"
            "✅ 최대 수소 방출량: 120 L/min\n"
            "✅ 필요 배기 풍량: 1,250 CMH (735 CFM)\n"
            "✅ 권장 규격: Ex d IIB+H2 T4 방폭 환기팬\n\n"
            "⏱️ 타임라인:\n"
            "00:00 배터리 룸 가스 감지기 경보\n"
            "00:12 리튬 셀 열폭주 120 L/min 수소 분출\n"
            "00:27 볼트체크 NFPA 855 방폭팬 계산\n"
            "00:37 폭발 한계선 강하 & 안전 확보\n\n"
            "👉 78대 전 산업 무료 공학 계산 포털: https://voltcheck24.com/\n"
            "👉 BESS 방폭 환기 계산기 바로가기: https://voltcheck24.com/?calc=bess_safety\n"
            "👉 네이버 / 구글 검색창: [볼트체크]\n\n"
            "#직장인썰 #ESS #BESS #배터리열폭주 #소방설비 #NFPA855 #방폭환기 #배터리화재 #소방설비기사 #볼트체크 #Shorts"
        ),
        "comment": (
            "🔋 리튬 배터리 열폭주 시 수소 가스는 순식간에 폭발 농도에 도달합니다!\n"
            "소방 기준(NFPA 855)에 맞는 방폭 배기 풍량, 지금 바로 무료 검증하세요!\n"
            "👉 볼트체크 방폭 계산기: https://voltcheck24.com/?calc=bess_safety"
        ),
        "tags": [
            "볼트체크", "ESS", "BESS", "배터리열폭주", "리튬이온배터리", "수소가스", "방폭환기팬",
            "NFPA855", "소방설비", "소방설비기사", "화재안전기준", "배터리화재", "Ex방폭",
            "CMH계산", "공학계산기", "직장인썰", "Shorts", "쇼츠"
        ],
        "category_id": "28"
    },
    "mkt1": {
        "id": "mkt1",
        "name": "[바이럴 #1] 20억짜리 로봇 라인이 멈춘 범인 (CCTV 감식)",
        "file": "shorts_viral_mkt_cctv_mystery.mp4",
        "title": "20억짜리 로봇 라인이 멈춘 충격적인 범인 (실제 CCTV 감식 파일) 🚨 #Shorts #볼트체크",
        "description": (
            "새벽 2시 14분, 초당 50만 원씩 손실이 발생하는 스마트팩토리 자동화 라인이 긴급 정지했습니다!\n"
            "원인을 뜯어보니... 원가 300원 아끼겠다고 24V 선로 80m에 1.5스퀘어 케이블을 깐 게 화근이었습니다!\n"
            "전압이 18.2V까지 떡락하며 PLC와 센서 통신이 완전 사망.\n\n"
            "이 일촉즉발 상황에서 수석 엔지니어가 스마트폰으로 볼트체크에 접속,\n"
            "단 3초 만에 KEC 4.0스퀘어를 산출하여 라인을 기적처럼 정상 복구했습니다!\n\n"
            "⚠️ 공장 멈추고 시말서 쓰기 전에, 지금 바로 무료로 검증하세요!\n"
            "👉 78대 전 산업 공학 계산 포털: https://voltcheck24.com/\n"
            "👉 네이버/구글 검색창: [볼트체크]\n\n"
            "#KEC #전압강하 #스마트팩토리 #전기기사 #공장자동화 #PLC #제어반 #전장설계 #볼트체크 #Shorts"
        ),
        "comment": (
            "🚨 300원짜리 케이블 때문에 20억 라인이 셧다운될 수 있습니다.\n"
            "거리와 부하만 넣으면 3초 만에 KEC 전압강하 검증해주는 대한민국 1위 공학 계산기!\n"
            "👉 무료 검증: https://voltcheck24.com/"
        ),
        "tags": [
            "볼트체크", "전압강하", "KEC", "스마트팩토리", "전기기사", "공장자동화", "PLC",
            "제어반", "전장설계", "CCTV", "공장사고", "전기도체", "허용전압강하", "기술검토서",
            "공학계산기", "Shorts", "쇼츠"
        ],
        "category_id": "28"
    },
    "mkt2": {
        "id": "mkt2",
        "name": "[바이럴 #2] 신입 vs 30년차 부장님 vs 볼트체크 3초 컷 (스피드 대결)",
        "file": "shorts_viral_mkt_speed_challenge.mp4",
        "title": "신입 vs 30년차 부장님 vs 볼트체크 3초 컷 ⚡ 공학 계산 스피드 대결 #Shorts #볼트체크",
        "description": (
            "KEC 3상 전압강하와 모터 차단기 용량 계산, 과연 누가 제일 빠를까?\n\n"
            "- 👨‍🎓 신입사원: 두꺼운 전공서적 뒤적거리다 멘붕! (30분 경과)\n"
            "- 👴 30년차 부장님: 공학용 계산기 두드리다 오타 작렬! (5분 경과)\n"
            "- ⚡ 스마트 엔지니어: 커피 한 잔 마시며 스마트폰 터치 두 번! (단 2.8초 DONE!)\n\n"
            "야근과 시말서에서 당신을 100% 구해줄 대한민국 No.1 공학 치트키.\n"
            "전기, 모터, 기계, 유압, 화학, 로봇까지 78대 전 산업 계산기 평생 무료!\n\n"
            "👉 지금 바로 무료 검증: https://voltcheck24.com/\n"
            "👉 네이버/구글 검색창: [볼트체크]\n\n"
            "#칼퇴치트키 #직장인공감 #전기기사 #공대생 #엔지니어 #모터용량 #전압강하 #볼트체크 #Shorts"
        ),
        "comment": (
            "⚡ 두꺼운 전공책, 공학용 계산기 두드리던 시대는 끝났습니다!\n"
            "회원가입 없이 스마트폰으로 전기, 모터, 기계 78대 계산기 3초 만에 써보세요!\n"
            "👉 볼트체크 바로가기: https://voltcheck24.com/"
        ),
        "tags": [
            "볼트체크", "공학계산기", "칼퇴치트키", "직장인공감", "전기기사", "공대생", "엔지니어",
            "모터용량", "전압강하", "공학계산", "KEC", "스피드대결", "직장인유머", "Shorts", "쇼츠"
        ],
        "category_id": "28"
    },
    "creative1": {
        "id": "creative1",
        "name": "[창의 걸작 #1] 던전 & 엔지니어: 전압강하 마왕을 물리쳐라! (8-Bit RPG)",
        "file": "shorts_creative_rpg_battle.mp4",
        "title": "던전 & 엔지니어: 전압강하 마왕을 물리쳐라! 🎮 #Shorts #볼트체크",
        "description": (
            "80년대 고전 아케이드 RPG 게임 화면으로 보는 24V 전압강하 보스 배틀!\n\n"
            "던전 심연에서 출현한 LV.80 전압강하 마왕(ΔV King)!\n"
            "초보 기사가 1.5sq 전선검으로 공격하지만...\n"
            "⚡ MISS! 전압이 18.2V로 떡락하며 센서 통신 마비!\n"
            "마왕의 20억 라인 셧다운 브레스에 기사 체력 1/9999로 전멸 위기!\n\n"
            "이때 치트키 가방에서 꺼낸 전설의 성물 [볼트체크]!\n"
            "단 3초 만에 KEC 4.0sq 메테오 슬래시 작렬!\n"
            "💥 999,999 CRITICAL!! 마왕 원펀치 컷 폭사!\n"
            "LV.99 전기안전 마스터 달성 & 시말서 면제 버프 획득!\n\n"
            "📐 핵심 공학 공식:\n"
            "e = (2 × L × I × ρ) / A\n"
            "❌ 1.5 sq 배선: ΔV = 1.90V (강하율 7.92% ➔ 공격 실패 MISS!)\n"
            "✅ 4.0 sq 최적: ΔV = 0.71V (강하율 2.96% ➔ KEC 3% 이내 합격 999,999 데미지!)\n\n"
            "👉 78대 전 산업 무료 공학 치트키 포털: https://voltcheck24.com/\n"
            "👉 24V 전압강하 계산기 바로가기: https://voltcheck24.com/?calc=volt_drop_dc\n"
            "👉 네이버 / 구글 검색창: [볼트체크]\n\n"
            "#게임패러디 #도트RPG #8비트 #전기기사 #전압강하 #공학계산기 #KEC #볼트체크 #Shorts"
        ),
        "comment": (
            "🎮 1.5sq 장착하고 전장 던전 들어갔다간 18.2V 저주 걸려서 공장 멈춥니다!\n"
            "전설의 치트키 볼트체크로 KEC 4.0sq 장착하고 칼퇴 버프 챙겨가세요!\n"
            "👉 볼트체크 바로가기: https://voltcheck24.com/"
        ),
        "tags": [
            "볼트체크", "게임패러디", "도트RPG", "8비트", "전기기사", "전압강하", "KEC",
            "KEC규정", "전선굵기", "제어반", "전장설계", "스마트팩토리", "치트키", "공학계산기",
            "Shorts", "쇼츠"
        ],
        "category_id": "28"
    },
    "creative2": {
        "id": "creative2",
        "name": "[창의 걸작 #2] 공장 멈춘 날 부품 단톡방 유출 파일 (메신저 드라마)",
        "file": "shorts_creative_chat_drama.mp4",
        "title": "공장 멈춘 날 부품 단톡방 유출 파일 💬 #Shorts #볼트체크",
        "description": (
            "새벽 2시, 초당 50만 원씩 날아가는 스마트팩토리 20억 로봇 라인이 멈춘 충격적인 전말!\n"
            "센서, 1.5sq 전선, PLC, 그리고 설비과장의 비상 단톡방 대화가 유출되었습니다!\n\n"
            "- 센서: '저 오늘 파업합니다 ㅡㅡ 전압 18.2V 줘놓고 20억 로봇 제어하라는 게 말이 됨? 감지 에러 띄우고 퇴근함.'\n"
            "- 1.5sq 전선: '사장님이 원가 300원 아낀다고 80m나 깐 건데 왜 나한테만 그래요 ㅠㅠ'\n"
            "- PLC: '둘 다 나가. 통신 에러 띄우고 나도 잘 거임 ㅂㅂ'\n"
            "- 설비과장: '다들 스톱! 볼트체크로 3초 만에 4.0sq 뽑았다. 10분 뒤 새 케이블 들어가니까 대기 타.'\n"
            "- 센서: '헐 4.0sq 실화임? 23.3V 풀파워 들어옴 ㅋㅋㅋ 과장님 충성충성 ^^7'\n\n"
            "공장 부품들 파업 막고 칼퇴하고 싶다면?\n"
            "현장 가시기 전에 네이버에 [볼트체크]를 검색하세요!\n\n"
            "👉 78대 전 산업 무료 공학 계산 포털: https://voltcheck24.com/\n"
            "👉 24V 전압강하 계산기: https://voltcheck24.com/?calc=volt_drop_dc\n\n"
            "#카톡유출 #직장인썰 #센서 #PLC #전선굵기 #전압강하 #공장사고 #볼트체크 #Shorts"
        ),
        "comment": (
            "💬 부품들한테 18.2V 줘서 파업하게 만들지 마세요 ㅋㅋㅋ\n"
            "거리랑 부하만 넣으면 3초 만에 KEC 규격 뽑아주는 볼트체크!\n"
            "👉 볼트체크 바로가기: https://voltcheck24.com/"
        ),
        "tags": [
            "볼트체크", "카톡유출", "단톡방", "직장인썰", "센서", "PLC", "전압강하",
            "전장설계", "스마트팩토리", "공장자동화", "KEC", "KEC규정", "공학계산기", "Shorts", "쇼츠"
        ],
        "category_id": "28"
    }
}


def authenticate_youtube(client_secret_path: Path):
    """
    유튜브 API 인증을 수행합니다.
    1. 이전에 발급받은 youtube_token.json이 있으면 자동 갱신 및 재사용.
    2. 없으면 브라우저를 띄워 1회성 Google 계정 로그인 승인 수행 후 youtube_token.json 저장.
    """
    creds = None
    if TOKEN_FILE.exists():
        try:
            creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)
        except Exception as e:
            print(f"[알림] 저장된 인증 토큰 갱신 필요: {e}")
            creds = None

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            try:
                print("[1/3] 기존 인증 토큰 만료됨. 자동으로 리프레시 중...")
                creds.refresh(Request())
            except Exception as e:
                print(f"[경고] 토큰 자동 갱신 실패: {e}. 새로 로그인합니다.")
                creds = None

        if not creds:
            if not client_secret_path.exists():
                # 폴더 내 client_secret*.json 파일 자동 탐색
                candidates = list(BASE_DIR.glob("client_secret*.json"))
                if candidates:
                    client_secret_path = candidates[0]
                    print(f"💡 [자동 탐색 성공] 인증 키 파일을 발견했습니다: {client_secret_path.name}")
                else:
                    print("=" * 70)
                    print("❌ [오류] Google Cloud 인증 파일(client_secret.json)을 찾을 수 없습니다!")
                    print(f"예상 경로: {client_secret_path}")
                    print("=" * 70)
                    print("💡 [해결 방법 - 2분 소요]:")
                    print("1. Google Cloud Console(https://console.cloud.google.com/) 접속")
                    print("2. 'YouTube Data API v3' 사용 설정")
                    print("3. '사용자 인증 정보' > 'OAuth 클라이언트 ID 만들기' (데스크톱 앱 선택)")
                    print("4. 다운로드한 JSON 파일명을 'client_secret.json'으로 변경하여")
                    print(f"   현재 폴더({BASE_DIR})에 넣어주세요.")
                    print("자세한 내용은 'YOUTUBE_API_SETUP_GUIDE.md' 문서를 참조하세요!")
                    print("=" * 70)
                    sys.exit(1)

            print("[1/3] 브라우저를 열어 YouTube 채널 관리자 Google 로그인을 진행합니다...")
            flow = InstalledAppFlow.from_client_secrets_file(str(client_secret_path), SCOPES)
            creds = flow.run_local_server(port=0)

        # 토큰 영구 저장
        with open(TOKEN_FILE, "w", encoding="utf-8") as token:
            token.write(creds.to_json())
        print(f"[성공] 인증 완료 및 토큰 저장 완료: {TOKEN_FILE.name}")

    youtube = build("youtube", "v3", credentials=creds)
    return youtube


def print_progress_bar(iteration, total, prefix="", suffix="", decimals=1, length=40, fill="█", print_end="\r"):
    """
    터미널 진행률 표시 바
    """
    percent = ("{0:." + str(decimals) + "f}").format(100 * (iteration / float(total))) if total > 0 else "0.0"
    filled_length = int(length * iteration // total) if total > 0 else 0
    bar = fill * filled_length + "-" * (length - filled_length)
    print(f"\r{prefix} |{bar}| {percent}% {suffix}", end=print_end)
    if iteration >= total:
        print()


def upload_video_resumable(youtube, video_meta, privacy_status="public", dry_run=False):
    """
    단일 동영상을 4MB 청크 단위로 이어올리기(Resumable Upload) 업로드합니다.
    """
    file_path = BASE_DIR / video_meta["file"]
    if not file_path.exists():
        print(f"❌ [에러] 동영상 파일이 존재하지 않습니다: {file_path}")
        return None

    file_size = file_path.stat().st_size
    file_size_mb = file_size / (1024 * 1024)

    print("-" * 70)
    print(f"🎬 업로드 대상: {video_meta['name']}")
    print(f"📁 파일: {video_meta['file']} ({file_size_mb:.1f} MB)")
    print(f"🏷️ 제목: {video_meta['title']}")
    print(f"🔒 공개 상태: {privacy_status}")
    print("-" * 70)

    if dry_run:
        print("🔍 [DRY-RUN 모드] 실제 업로드는 수행하지 않고 설정을 검증했습니다. (정상)")
        return "DRY_RUN_SUCCESS_ID"

    body = {
        "snippet": {
            "title": video_meta["title"],
            "description": video_meta["description"],
            "tags": video_meta["tags"],
            "categoryId": video_meta.get("category_id", "28")
        },
        "status": {
            "privacyStatus": privacy_status,
            "selfDeclaredMadeForKids": False
        }
    }

    # 4MB 청크 분할 전송 설정
    chunk_size = 4 * 1024 * 1024
    media = MediaFileUpload(str(file_path), chunksize=chunk_size, resumable=True, mimetype="video/mp4")

    request = youtube.videos().insert(
        part=",".join(body.keys()),
        body=body,
        media_body=media
    )

    print("🚀 업로드 시작...")
    response = None
    start_time = time.time()
    last_uploaded = 0

    while response is None:
        status, response = request.next_chunk()
        if status:
            uploaded_bytes = status.resumable_progress
            elapsed = time.time() - start_time
            speed = (uploaded_bytes / (1024 * 1024)) / elapsed if elapsed > 0 else 0
            uploaded_mb = uploaded_bytes / (1024 * 1024)
            suffix = f"({uploaded_mb:.1f}/{file_size_mb:.1f} MB, {speed:.1f} MB/s)"
            print_progress_bar(uploaded_bytes, file_size, prefix="진행률", suffix=suffix, length=30)

    print_progress_bar(file_size, file_size, prefix="진행률", suffix=f"({file_size_mb:.1f}/{file_size_mb:.1f} MB) [완료!]", length=30)

    video_id = response.get("id")
    video_url = f"https://youtu.be/{video_id}"
    shorts_url = f"https://www.youtube.com/shorts/{video_id}"
    print(f"✅ 동영상 업로드 완료!")
    print(f"🔗 유튜브 영상 링크: {video_url}")
    print(f"📱 숏츠 직링크: {shorts_url}")

    # 홍보 고정 댓글 자동 등록 시도
    comment_text = video_meta.get("comment")
    if comment_text:
        try:
            print("💬 공식 추천/홍보 댓글 자동 등록 중...")
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
            print("✅ 댓글 등록 성공! (유튜브 스튜디오에서 '댓글 상단 고정'을 클릭해주세요)")
        except Exception as e:
            print(f"⚠️ 댓글 등록 건너뜀 (권한 또는 API 채널 댓글 설정 제한): {e}")

    return video_id


def list_videos():
    """등록된 9대 숏츠 동영상 목록 및 상태 출력"""
    print("\n" + "=" * 80)
    print("📋 [볼트체크] 유튜브 숏츠 자동 업로드 등록 영상 목록 (총 9편)")
    print("=" * 80)
    for key, item in SHORTS_REGISTRY.items():
        fp = BASE_DIR / item["file"]
        status = "✅ 파일 존재" if fp.exists() else "❌ 파일 누락"
        size_mb = f"{fp.stat().st_size / (1024 * 1024):.1f}MB" if fp.exists() else "-"
        print(f"[{key:<9}] {item['name']:<42} | {size_mb:>7} | {status}")
    print("=" * 80 + "\n")


def main():
    parser = argparse.ArgumentParser(description="볼트체크(VoltCheck) 유튜브 숏츠 100% 전자동 업로더")
    parser.add_argument("--all", action="store_true", help="등록된 9편의 숏츠 전체를 순차적으로 업로드합니다.")
    parser.add_argument("--video", type=str, default=None, help="특정 동영상 키(예: story1, mkt1, creative1 등)만 업로드합니다.")
    parser.add_argument("--privacy", type=str, default="public", choices=["public", "unlisted", "private"],
                        help="공개 상태 (기본값: public, 테스트 시 unlisted 권장)")
    parser.add_argument("--client-secret", type=str, default=str(DEFAULT_CLIENT_SECRET),
                        help="Google OAuth client_secret.json 파일 경로")
    parser.add_argument("--list", action="store_true", help="등록된 동영상 목록을 확인합니다.")
    parser.add_argument("--dry-run", action="store_true", help="실제 업로드를 수행하지 않고 파일 및 설정 유효성만 테스트합니다.")

    args = parser.parse_args()

    if args.list:
        list_videos()
        return

    if not args.all and not args.video:
        print("💡 사용 방법 안내:")
        print("  - 전체 업로드: python youtube_auto_uploader.py --all")
        print("  - 일부 비공개 테스트: python youtube_auto_uploader.py --all --privacy unlisted")
        print("  - 단일 영상 업로드: python youtube_auto_uploader.py --video story1")
        print("  - 목록 보기: python youtube_auto_uploader.py --list")
        print("  - 설정 테스트: python youtube_auto_uploader.py --all --dry-run")
        list_videos()
        return

    # 업로드 대상 선정
    targets = []
    if args.all:
        targets = list(SHORTS_REGISTRY.values())
    elif args.video:
        if args.video not in SHORTS_REGISTRY:
            print(f"❌ 존재하지 않는 동영상 키입니다: '{args.video}'")
            print(f"가능한 키: {list(SHORTS_REGISTRY.keys())}")
            sys.exit(1)
        targets = [SHORTS_REGISTRY[args.video]]

    # Dry-run 테스트가 아닐 경우 Google OAuth 인증
    youtube = None
    if not args.dry_run:
        client_secret_path = Path(args.client_secret)
        youtube = authenticate_youtube(client_secret_path)

    print(f"\n🚀 총 {len(targets)}개의 숏츠 업로드를 시작합니다! (공개설정: {args.privacy})\n")

    success_count = 0
    for idx, video_meta in enumerate(targets, 1):
        print(f"\n[{idx}/{len(targets)}] {video_meta['name']} 작업 진행...")
        res = upload_video_resumable(youtube, video_meta, privacy_status=args.privacy, dry_run=args.dry_run)
        if res:
            success_count += 1
        time.sleep(1)  # API 부하 방지 1초 대기

    print("\n" + "=" * 70)
    print(f"🎉 모든 작업이 완료되었습니다! (성공: {success_count} / 총: {len(targets)})")
    print("=" * 70)


if __name__ == "__main__":
    main()
