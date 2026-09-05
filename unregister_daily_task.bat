@echo off
cd /d "%~dp0"
schtasks /delete /tn "VoltCheck_Daily_Shorts_10PM" /f
echo [INFO] Daily 10:00 PM task has been removed from Windows Task Scheduler.
echo.
pause
