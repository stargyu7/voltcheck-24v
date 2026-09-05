# -*- coding: utf-8 -*-
import subprocess
import sys
from pathlib import Path

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

bat_path = Path(__file__).resolve().parent / "run_daily_shorts.bat"

# Windows schtasks 명령어 구성
cmd = [
    "schtasks", "/create",
    "/tn", "VoltCheck_Daily_Shorts_8AM",
    "/tr", f'"{bat_path}"',
    "/sc", "daily",
    "/st", "08:00",
    "/f"
]

print("작업 스케줄러 등록 중:", " ".join(cmd))
res = subprocess.run(cmd, capture_output=True, text=True, errors="replace")
print("출력:\n", res.stdout)
if res.stderr:
    print("오류:\n", res.stderr)

if res.returncode == 0:
    print("🎉 [성공] 매일 아침 8시 자동 발행 스케줄이 Windows 작업 스케줄러에 등록되었습니다!")
else:
    print(f"⚠️ 등록 실패 (코드 {res.returncode}). 관리자 권한으로 다시 시도해주세요.")
