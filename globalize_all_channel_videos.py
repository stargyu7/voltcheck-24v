# -*- coding: utf-8 -*-
"""
=============================================================================
🌍 [글로벌 유튜브 최적화] 채널 전 동영상 영문 현지화(Localization) 일괄 적용기
=============================================================================
- 기존에 업로드된 모든 쇼츠 동영상에 다국어 메타데이터(English Localization) 등록
- 해외 시청자(미국, 유럽, 인도, 아시아 등)에게는 영문 제목/설명/태그가 자동 노출!
- 국내 시청자에게는 한글 제목이 그대로 유지되어 양쪽 시장 모두 장악!
- 글로벌 검색창(Google / YouTube Search)에 영문 공학 키워드로 자동 인덱싱
=============================================================================
"""

import sys
import time
import json
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from pathlib import Path

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", line_buffering=True)
        sys.stderr.reconfigure(encoding="utf-8", line_buffering=True)
    except Exception:
        pass

BASE_DIR = Path(r"c:\이규정 개인 프로젝트")
TOKEN_FILE = BASE_DIR / "youtube_token.json"

SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.force-ssl"
]

# 15개 동영상 맞춤형 영문 고품질 메타데이터
GLOBAL_CATALOG = {
    # 1. 최신 고도화 차단기 숏츠
    "pYbK_ZyHdkE": {
        "en_title": "Never Reset a Tripped Breaker Right Away! (Arc Flash Hazard) ⚡ #Shorts",
        "en_desc": (
            "Never force a tripped industrial circuit breaker back on!\n"
            "A tripped breaker is a critical warning of a dead short or ground fault down the line. "
            "Forcing it back on risks a catastrophic arc flash explosion that can destroy switchgear and cause severe injury!\n\n"
            "🚨 3 Essential Safety Checks Before Resetting:\n"
            "1️⃣ Check Trip Flag: Overload vs Ground Fault\n"
            "2️⃣ Megger Test: Verify line insulation resistance (>0.2 MΩ)\n"
            "3️⃣ Motor Inrush: Verify starting current doesn't exceed 6x rating\n\n"
            "📐 Free 3-Second Cable Sizing & Voltage Drop Calculator:\n"
            "👉 https://voltcheck24.com/\n\n"
            "#electrician #circuitbreaker #electricalsafety #arcflash #switchgear #smartfactory #voltcheck #Shorts"
        ),
        "en_tags": ["electrician", "circuit breaker", "electrical safety", "arc flash", "switchgear", "smart factory", "voltcheck", "Shorts"]
    },
    # 2. 볼트 토크 공식 숏츠 (예약)
    "ECu5yjnLStE": {
        "en_title": "Bolt Tightening Torque Formula T = k·d·F Mastered in 40 Seconds ⚙️ #Shorts",
        "en_desc": (
            "Master the universal bolt tightening torque equation: T = k × d × F\n"
            "- T: Tightening Torque (N·m)\n"
            "- k: Torque Coefficient (Dry: 0.20 vs Lubricated: 0.15)\n"
            "- d: Nominal Bolt Diameter (m)\n"
            "- F: Clamping Preload Force (N)\n\n"
            "⚠️ Using the wrong torque coefficient (k) creates a 30%+ error in clamp force, leading to bolt fatigue or catastrophic snap!\n\n"
            "📐 78+ Free Engineering Calculators for Mechanical & Electrical Design:\n"
            "👉 https://voltcheck24.com/?calc=bolt_torque\n\n"
            "#bolttorque #mechanicalengineering #machinist #torqueformula #clampingforce #machining #voltcheck #Shorts"
        ),
        "en_tags": ["bolt torque", "mechanical engineering", "machinist", "torque formula", "clamping force", "machining", "voltcheck", "Shorts"]
    },
    # 3. 임팩 렌치 볼트 파단 실화 숏츠 (예약)
    "Nt4OqzPS-rw": {
        "en_title": "Overtightening Bolts with an Impact Wrench Snapped a $250k Mold! 💥 #Shorts",
        "en_desc": (
            "Real shop floor horror story: An operator tightened M16 10.9 high-strength bolts by feel using an impact wrench.\n"
            "The bolt yielded past its ultimate tensile strength, snapped, and ruined a $250,000 injection mold!\n\n"
            "Never guess torque by hand. Calculate precision bolt tightening torque in 3 seconds:\n"
            "👉 https://voltcheck24.com/?calc=bolt_torque\n\n"
            "#machining #moldmaking #bolttorque #impactwrench #machinist #mechanicalengineering #engineeringdisaster #Shorts"
        ),
        "en_tags": ["machining", "mold making", "bolt torque", "impact wrench", "machinist", "mechanical engineering", "engineering disaster", "Shorts"]
    },
    # 4. 부품 단톡방 유출 숏츠
    "TAp99EeOSvI": {
        "en_title": "Industrial Components Group Chat Leaked: Factory Shutdown Mystery 💬 #Shorts",
        "en_desc": (
            "When a high-speed production line shuts down at 2 AM, the components start pointing fingers!\n"
            "Was it the 24V power supply, the undersized cable, or the PLC?\n\n"
            "Solve voltage drop in 3 seconds before your factory stops:\n"
            "👉 https://voltcheck24.com/\n\n"
            "#automation #plc #smartfactory #electrical #voltagedrop #voltcheck #Shorts"
        ),
        "en_tags": ["automation", "plc", "smart factory", "electrical", "voltage drop", "voltcheck", "Shorts"]
    },
    # 5. RPG 배틀 숏츠
    "iBzn3n_YIh4": {
        "en_title": "8-Bit Retro RPG: Defeating the 24V Voltage Drop Boss! 🎮 #Shorts",
        "en_desc": (
            "Boss Battle: 24V Voltage Drop Monster drains line voltage down to 18.2V!\n"
            "Smart Engineer summons VoltCheck: 4.0 sq Cable Upgrade Critical Hit! 💥\n\n"
            "Level up your engineering with 78+ free calculators:\n"
            "👉 https://voltcheck24.com/\n\n"
            "#retrogame #pixelart #engineering #voltagedrop #rpg #voltcheck #Shorts"
        ),
        "en_tags": ["retro game", "pixel art", "engineering", "voltage drop", "rpg", "voltcheck", "Shorts"]
    },
    # 6. 스피드 대결 숏츠
    "33bDCkgcR7Q": {
        "en_title": "Rookie vs 30-Year Senior Engineer vs 3-Second Engineering Cheat Code ⚡ #Shorts",
        "en_desc": (
            "Engineering Speed Challenge:\n"
            "- Rookie: Reading 500-page textbook (30 min)\n"
            "- 30-Year Senior: Punching scientific calculator (5 min)\n"
            "- VoltCheck User: 2 taps on smartphone (2.8 seconds DONE!)\n\n"
            "Work smarter, not harder. Free online engineering portal:\n"
            "👉 https://voltcheck24.com/\n\n"
            "#engineering #electrician #engineeringstudent #stem #electricalengineering #voltcheck #Shorts"
        ),
        "en_tags": ["engineering", "electrician", "engineering student", "stem", "electrical engineering", "voltcheck", "Shorts"]
    },
    # 7. CCTV 감식 숏츠
    "NhUIgfndTtE": {
        "en_title": "The Shocking Reason a $2 Million Robot Line Shut Down (CCTV File) 🚨 #Shorts",
        "en_desc": (
            "At 2:14 AM, a $2M robotic automation line suddenly faulted out.\n"
            "The culprit? Saving $2 by running 1.5 sq wire over 80 meters on a 24V DC bus!\n"
            "Voltage dropped to 18.2V, causing optical sensor communication death.\n\n"
            "Verify voltage drop in 3 seconds before you pull cable:\n"
            "👉 https://voltcheck24.com/\n\n"
            "#robotics #smartfactory #automation #cctv #voltagedrop #electrician #voltcheck #Shorts"
        ),
        "en_tags": ["robotics", "smart factory", "automation", "cctv", "voltage drop", "electrician", "voltcheck", "Shorts"]
    },
    # 8. ESS 배터리 룸 숏츠
    "GWIcHmShChg": {
        "en_title": "Almost Caught in an ESS Battery Room Gas Explosion! (NFPA 855 / IEC) 🤖 #Shorts",
        "en_desc": (
            "Lithium battery thermal runaway releases explosive hydrogen and toxic gases.\n"
            "Without proper ventilation and explosive gas limit calculations (NFPA 855), disaster is inevitable.\n\n"
            "Calculate battery room ventilation and explosion safety margins:\n"
            "👉 https://voltcheck24.com/\n\n"
            "#bess #battery #energy #electricalsafety #nfpa855 #lithiumion #voltcheck #Shorts"
        ),
        "en_tags": ["bess", "battery", "energy", "electrical safety", "nfpa855", "lithium ion", "voltcheck", "Shorts"]
    },
    # 9. 유압 프레스 배관 터짐 숏츠
    "dKXwcHWxSxk": {
        "en_title": "Hydraulic Pipe Ruptured by 300 Bar Water Hammer Shock! (Accumulator Fix) 🚰 #Shorts",
        "en_desc": (
            "Rapid valve closure created massive acoustic shock waves in a 300-bar hydraulic system, blowing the high-pressure line!\n"
            "How proper accumulator gas pre-charge sizing prevents catastrophic hydraulic hammer.\n\n"
            "Free hydraulic accumulator & pressure drop calculators:\n"
            "👉 https://voltcheck24.com/\n\n"
            "#hydraulics #mechanicalengineering #accumulator #waterhammer #fluidpower #voltcheck #Shorts"
        ),
        "en_tags": ["hydraulics", "mechanical engineering", "accumulator", "water hammer", "fluid power", "voltcheck", "Shorts"]
    },
    # 10. 베어링 소음 & 축 파단 숏츠
    "nzT8RjhxYvA": {
        "en_title": "Horrible Screeching Noise Before an Industrial Drive Shaft Snapped! (ISO 281) ⚙️ #Shorts",
        "en_desc": (
            "A high-speed industrial motor bearing seized up, grinding the drive shaft to pieces.\n"
            "Understanding bearing L10h rating, dynamic load rating (C), and ISO 281 fatigue life.\n\n"
            "Calculate bearing life and shaft deflection in 3 seconds:\n"
            "👉 https://voltcheck24.com/\n\n"
            "#bearing #mechanicalengineering #machinist #iso281 #vibrationanalysis #reliability #voltcheck #Shorts"
        ),
        "en_tags": ["bearing", "mechanical engineering", "machinist", "iso281", "vibration analysis", "reliability", "voltcheck", "Shorts"]
    },
    # 11 & 12. 모터 기동 돌입전류 숏츠
    "q4QT455H2q4": {
        "en_title": "Breaker Tripped the Instant the 15kW Motor Started! (Inrush Current 600%) 💥 #Shorts",
        "en_desc": (
            "Sizing a circuit breaker only for full load current (FLC)? You're in for a surprise!\n"
            "Induction motors draw 600% inrush current during DOL starting, instantly tripping standard Type-B/C breakers.\n"
            "Why Type-D breakers and proper magnetic contactors (MC) are mandatory.\n\n"
            "Free motor starting current & breaker sizing calculator:\n"
            "👉 https://voltcheck24.com/\n\n"
            "#electricmotor #electrician #inrushcurrent #circuitbreaker #electrical #voltcheck #Shorts"
        ),
        "en_tags": ["electric motor", "electrician", "inrush current", "circuit breaker", "electrical", "voltcheck", "Shorts"]
    },
    "_JHY4pwty3g": {
        "en_title": "Why Motors Trip Circuit Breakers on Startup (600% Inrush Explained) 💥 #Shorts",
        "en_desc": (
            "Starting an electric motor causes an instantaneous inrush spike up to 6x normal current!\n"
            "Calculate required Type-D breaker rating and contactor sizing in 3 seconds:\n"
            "👉 https://voltcheck24.com/\n\n"
            "#electrician #motorcontrol #breaker #electricalengineering #voltcheck #Shorts"
        ),
        "en_tags": ["electrician", "motor control", "breaker", "electrical engineering", "voltcheck", "Shorts"]
    },
    # 13. 전선 굵기 1억 손실 숏츠
    "yQaJ8Cj5410": {
        "en_title": "Using Undersized Cables Almost Cost $100k in Equipment Damage! (IEC/KEC) 💥 #Shorts",
        "en_desc": (
            "Running 80m of 1.5 sq cable on a 24V line caused a 1.9V drop (7.9%), dropping end voltage to 18.2V and killing PLC sensors!\n"
            "Upgrading to 4.0 sq dropped voltage loss to just 0.71V (2.9%), passing standard limits.\n\n"
            "Check cable size & voltage drop in 3 seconds:\n"
            "👉 https://voltcheck24.com/\n\n"
            "#cablesizing #voltagedrop #electrician #electricalengineering #iec #nec #voltcheck #Shorts"
        ),
        "en_tags": ["cable sizing", "voltage drop", "electrician", "electrical engineering", "iec", "nec", "voltcheck", "Shorts"]
    },
    # 14. 새벽 2시 로봇 전원 다운 숏츠
    "qY_Iwxbs1IA": {
        "en_title": "2 AM Robot Power Failure: 30-Year Veteran Solves 24V Line Drop #Shorts",
        "en_desc": (
            "When production halts at 2 AM, don't guess. 24V line resistance compounds over distance.\n"
            "Formula: ΔV = (2 × L × I × ρ) / A\n"
            "Size your industrial cables accurately in seconds:\n"
            "👉 https://voltcheck24.com/\n\n"
            "#automation #robotics #electrician #smartfactory #voltagedrop #voltcheck #Shorts"
        ),
        "en_tags": ["automation", "robotics", "electrician", "smart factory", "voltage drop", "voltcheck", "Shorts"]
    },
    # 15. 24V 제어선로 80m PLC 통신 에러 숏츠
    "7meKiqeh_Cc": {
        "en_title": "24V Bus at 80m Causing PLC Communication Errors? Solved in 3 Sec ⚡ #Shorts",
        "en_desc": (
            "Mystery PLC intermittent faults are almost always DC voltage drop on long sensor lines!\n"
            "Calculate proper conductor gauge and voltage margins before installation:\n"
            "👉 https://voltcheck24.com/\n\n"
            "#plc #industrialautomation #electrician #voltagedrop #engineering #voltcheck #Shorts"
        ),
        "en_tags": ["plc", "industrial automation", "electrician", "voltage drop", "engineering", "voltcheck", "Shorts"]
    }
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
    youtube = get_youtube()
    print("=" * 80)
    print("🌍 [글로벌 유튜브] 채널 전체 숏츠 영문 현지화(Localization) 작업 시작")
    print("=" * 80)

    updated_count = 0

    for vid_id, meta in GLOBAL_CATALOG.items():
        try:
            # 1. 기존 비디오 정보 가져오기
            res = youtube.videos().list(part="snippet,localizations", id=vid_id).execute()
            items = res.get("items", [])
            if not items:
                print(f"⚠️ 동영상 미발견 (삭제되었거나 접근 불가): {vid_id}")
                continue

            item = items[0]
            snippet = item["snippet"]
            existing_localizations = item.get("localizations", {})

            # 영문 로컬라이제이션 설정
            existing_localizations["en"] = {
                "title": meta["en_title"],
                "description": meta["en_desc"]
            }

            # 태그 확장: 기존 한글 태그 + 신규 글로벌 영문 태그 결합 (중복 제거)
            curr_tags = snippet.get("tags", [])
            combined_tags = list(dict.fromkeys(curr_tags + meta["en_tags"]))[:30]

            update_body = {
                "id": vid_id,
                "snippet": {
                    "defaultLanguage": "ko",
                    "categoryId": snippet.get("categoryId", "28"),
                    "title": snippet["title"],
                    "description": snippet["description"],
                    "tags": combined_tags
                },
                "localizations": existing_localizations
            }

            youtube.videos().update(part="snippet,localizations", body=update_body).execute()
            updated_count += 1
            print(f"✅ [{updated_count}/{len(GLOBAL_CATALOG)}] 글로벌 현지화 완료: {vid_id}")
            print(f"   🇺🇸 EN: {meta['en_title']}")
            print(f"   🇰🇷 KO: {snippet['title'][:40]}...")
            time.sleep(1)

        except Exception as e:
            print(f"❌ {vid_id} 처리 중 오류: {e}")

    print("\n" + "#" * 80)
    print(f"🎉 총 {updated_count}편의 모든 쇼츠 동영상에 글로벌 영문 현지화가 완벽 적용되었습니다!")
    print("이제 미국, 유럽, 인도 등 전 세계 영어권 사용자에게는 영문 제목과 설명이 자동으로 보입니다! 🌍")
    print("#" * 80)


if __name__ == "__main__":
    main()
