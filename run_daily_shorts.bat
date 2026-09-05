@echo off
cd /d "%~dp0"
python "%~dp0daily_shorts_publisher.py" >> "%~dp0daily_upload.log" 2>&1
