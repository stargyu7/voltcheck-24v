@echo off
chcp 65001 > nul
cd /d "%~dp0"
title 볼트체크(VoltCheck) 유튜브 숏츠 자동 업로더

python "%~dp0youtube_auto_uploader.py" %*

if %errorlevel% neq 0 (
    echo.
    echo [안내] 작업이 중단되었거나 오류가 발생했습니다.
)

echo.
pause
