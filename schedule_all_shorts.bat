@echo off
cd /d "%~dp0"
title VoltCheck YouTube Scheduled Publisher
python "%~dp0schedule_all_shorts.py" %*
echo.
pause
