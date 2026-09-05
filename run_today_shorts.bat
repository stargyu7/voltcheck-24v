@echo off
cd /d "%~dp0"
title VoltCheck Daily Shorts Runner (Today 2 Videos)
python "%~dp0daily_shorts_publisher.py" --run
echo.
pause
