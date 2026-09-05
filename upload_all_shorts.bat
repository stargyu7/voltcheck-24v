@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

:: 관리자 권한 실행 등으로 작업 경로가 System32로 변경되는 현상 방지 (배치 파일 폴더로 이동)
cd /d "%~dp0"

title 볼트체크(VoltCheck) 유튜브 숏츠 자동 업로더

cls
echo ==============================================================================
echo   🚀 볼트체크 (VoltCheck) 유튜브 숏츠 100%% 전자동 업로더
echo   YouTube Shorts 100%% Automated Production Uploader
echo ==============================================================================
echo.

:: 1. 파이썬 설치 여부 확인
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo [오류] Python이 시스템에 설치되어 있지 않거나 환경 변수(PATH)에 등록되지 않았습니다.
    echo Python 3.9 이상을 설치한 후 다시 실행해주세요.
    echo.
    pause
    exit /b 1
)

:: 2. Google OAuth client_secret.json 확인
if not exist "client_secret.json" (
    if not exist "youtube_token.json" (
        echo ------------------------------------------------------------------------------
        echo ⚠️ [안내] Google Cloud 인증 파일 (client_secret.json)이 현재 폴더에 없습니다!
        echo ------------------------------------------------------------------------------
        echo YouTube API를 통한 자동 업로드를 위해서는 1회성 Google 인증 키가 필요합니다.
        echo.
        echo [2분 만에 발급받는 방법]:
        echo 1. 같은 폴더의 'YOUTUBE_API_SETUP_GUIDE.md' 설명서를 확인하세요.
        echo 2. Google Cloud Console(https://console.cloud.google.com/)에서
        echo    OAuth 2.0 클라이언트 ID (데스크톱 앱)를 다운로드하여
        echo    이 폴더에 'client_secret.json' 이름으로 저장하면 즉시 사용 가능합니다!
        echo ------------------------------------------------------------------------------
        echo.
        echo [1] YOUTUBE_API_SETUP_GUIDE.md 가이드 문서 열기
        echo [2] Google Cloud 콘솔 웹페이지 열기
        echo [3] 모의 테스트(Dry-Run) 실행하기 (인증키 없이도 동작 테스트 가능)
        echo [0] 종료
        echo.
        set /p INIT_CHOICE="선택 (기본값 1): "
        if "!INIT_CHOICE!"=="" set INIT_CHOICE=1
        if "!INIT_CHOICE!"=="1" (
            start YOUTUBE_API_SETUP_GUIDE.md
            pause
            exit /b 0
        )
        if "!INIT_CHOICE!"=="2" (
            start https://console.cloud.google.com/apis/library/youtube.googleapis.com
            pause
            exit /b 0
        )
        if "!INIT_CHOICE!"=="3" (
            goto RUN_DRY_RUN
        )
        exit /b 0
    )
)

:MENU
cls
echo ==============================================================================
echo   🚀 볼트체크 (VoltCheck) 유튜브 숏츠 자동 업로드 메뉴
echo ==============================================================================
echo.
echo   [1] 🌟 9편 전체 일괄 업로드 (공개: Public) - 강력 추천!
echo   [2] 🧪 9편 전체 일괄 업로드 (일부공개: Unlisted 테스트용)
echo   [3] 🎬 단일 영상 선택 업로드 (1편만 골라서 올리기)
echo   [4] 📋 등록된 9편 동영상 목록 및 상태 확인
echo   [5] 🔍 업로드 사전 점검 모의 테스트 (Dry-Run)
echo   [6] 📖 Google API 연동 가이드 (YOUTUBE_API_SETUP_GUIDE.md) 열기
echo   [0] 프로그램 종료
echo.
echo ==============================================================================
set /p MENU_CHOICE="원하시는 번호를 입력하고 Enter를 누르세요: "

if "%MENU_CHOICE%"=="1" goto UPLOAD_ALL_PUBLIC
if "%MENU_CHOICE%"=="2" goto UPLOAD_ALL_UNLISTED
if "%MENU_CHOICE%"=="3" goto UPLOAD_SINGLE
if "%MENU_CHOICE%"=="4" goto SHOW_LIST
if "%MENU_CHOICE%"=="5" goto RUN_DRY_RUN
if "%MENU_CHOICE%"=="6" goto OPEN_GUIDE
if "%MENU_CHOICE%"=="0" exit /b 0

echo 잘못된 입력입니다. 다시 선택해주세요.
timeout /t 2 > nul
goto MENU

:UPLOAD_ALL_PUBLIC
cls
echo ==============================================================================
echo 🚀 9편 전체 동영상을 [공개 (Public)]로 순차 자동 업로드합니다.
echo ==============================================================================
echo.
python "%~dp0youtube_auto_uploader.py" --all --privacy public
echo.
echo 모든 작업이 끝났습니다.
pause
goto MENU

:UPLOAD_ALL_UNLISTED
cls
echo ==============================================================================
echo 🧪 9편 전체 동영상을 [일부공개 (Unlisted)]로 순차 자동 업로드합니다.
echo ==============================================================================
echo.
python "%~dp0youtube_auto_uploader.py" --all --privacy unlisted
echo.
echo 모든 작업이 끝났습니다.
pause
goto MENU

:UPLOAD_SINGLE
cls
echo ==============================================================================
echo 🎬 업로드할 동영상의 키를 입력하세요:
echo ------------------------------------------------------------------------------
echo   story1    : [실화 썰 #1] 전선 얇은 거 썼다 1억 날린 썰
echo   story2    : [실화 썰 #2] 모터 켜자마자 펑! 차단기 떨어진 썰
echo   story3    : [실화 썰 #3] 쇠 갈리는 귀신 소리 난 썰
echo   story4    : [실화 썰 #4] 유압 프레스 찍다 배관 터져 기름바다 될 뻔한 썰
echo   story5    : [실화 썰 #5] ESS 배터리 룸 가스 폭발 막은 썰
echo   mkt1      : [바이럴 #1] 20억짜리 로봇 라인이 멈춘 범인 (CCTV 감식)
echo   mkt2      : [바이럴 #2] 신입 vs 30년차 부장님 vs 볼트체크 3초 컷 (스피드 대결)
echo   creative1 : [창의 걸작 #1] 던전 & 엔지니어: 전압강하 마왕을 물리쳐라! (RPG)
echo   creative2 : [창의 걸작 #2] 공장 멈춘 날 부품 단톡방 유출 파일 (카톡)
echo ==============================================================================
set /p VIDEO_KEY="동영상 키 입력 (예: story1): "
if "%VIDEO_KEY%"=="" goto MENU
python "%~dp0youtube_auto_uploader.py" --video %VIDEO_KEY% --privacy public
echo.
pause
goto MENU

:SHOW_LIST
cls
python "%~dp0youtube_auto_uploader.py" --list
echo.
pause
goto MENU

:RUN_DRY_RUN
cls
echo ==============================================================================
echo 🔍 [모의 테스트] 실제 업로드 없이 파일 및 설정 유효성 검증
echo ==============================================================================
echo.
python "%~dp0youtube_auto_uploader.py" --all --dry-run
echo.
pause
goto MENU

:OPEN_GUIDE
start YOUTUBE_API_SETUP_GUIDE.md
goto MENU
