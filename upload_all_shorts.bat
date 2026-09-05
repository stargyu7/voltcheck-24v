@echo off
cd /d "%~dp0"
python "%~dp0youtube_auto_uploader.py" %*
if errorlevel 1 (
    echo.
    echo An error occurred or the process was canceled.
)
echo.
pause
