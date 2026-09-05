@echo off
cd /d "%~dp0"
schtasks /delete /tn "VoltCheck_Daily_Shorts_8AM" /f
echo [INFO] Daily 8:00 AM task has been removed from Windows Task Scheduler.
echo.
pause
