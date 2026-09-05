# 🔑 볼트체크 유튜브 숏츠 자동 업로더 API 연동 가이드 (2분 완성)

본 문서는 `youtube_auto_uploader.py` 및 `upload_all_shorts.bat`를 실행하기 위해 필요한 **Google Cloud OAuth 2.0 인증키(`client_secret.json`)**를 발급받는 초간단 3단계 가이드입니다.

Google 정책상 유튜브에 영상을 자동으로 업로드하려면 본인 구글 계정의 1회성 OAuth 승인이 필요합니다. (비밀번호 노출 없이 가장 안전한 방식)

---

## ⚡ 요약 (딱 3가지만 하시면 끝납니다!)
1. **API 켜기**: [Google Cloud Console](https://console.cloud.google.com/apis/library/youtube.googleapis.com)에서 **YouTube Data API v3** [사용] 클릭
2. **동의 화면 등록**: [OAuth 동의 화면](https://console.cloud.google.com/apis/credentials/consent)에서 **외부(External)** 선택, 앱 이름 입력, 테스트 사용자에 **본인 Gmail** 추가
3. **키 다운로드**: [사용자 인증 정보](https://console.cloud.google.com/apis/credentials)에서 **OAuth 클라이언트 ID (데스크톱 앱)** 생성 후 다운로드하여 본 프로젝트 폴더에 `client_secret.json`으로 저장!

---

## 📋 단계별 상세 캡처 가이드

### 1단계: YouTube Data API v3 활성화
1. 아래 링크를 클릭하여 Google Cloud 콘솔의 YouTube API 라이브러리로 이동합니다:
   👉 **[YouTube Data API v3 라이브러리 바로가기](https://console.cloud.google.com/apis/library/youtube.googleapis.com)**
2. 화면 상단 프로젝트 선택 드롭다운에서 새 프로젝트를 생성하거나 기존 프로젝트를 선택합니다. (예: `VoltCheck-Shorts`)
3. 파란색 **[사용] (Enable)** 버튼을 클릭합니다.

---

### 2단계: OAuth 동의 화면 구성 (1회만 수행)
1. 좌측 메뉴에서 **[OAuth 동의 화면]**을 클릭합니다.
   👉 **[OAuth 동의 화면 바로가기](https://console.cloud.google.com/apis/credentials/consent)**
2. User Type: **[외부 (External)]** 선택 후 [만들기] 클릭
3. 앱 정보 입력:
   - **앱 이름**: `VoltCheck Uploader`
   - **사용자 지원 이메일**: 본인 Gmail 선택
   - **개발자 연락처 정보**: 본인 Gmail 입력
   - [저장 후 계속] 클릭
4. **범위(Scopes)** 단계: 별도 추가 없이 맨 아래 [저장 후 계속] 클릭
5. **테스트 사용자 (중요! ⭐)**:
   - **[+ ADD USERS]** 버튼 클릭
   - 유튜브 채널이 개설된 **본인의 구글 이메일(Gmail)**을 입력하고 [추가]
   - [저장 후 계속] 클릭

---

### 3단계: 데스크톱 클라이언트 ID 발급 및 다운로드
1. 좌측 메뉴에서 **[사용자 인증 정보]**를 클릭합니다.
   👉 **[사용자 인증 정보 페이지 바로가기](https://console.cloud.google.com/apis/credentials)**
2. 상단의 **[+ 사용자 인증 정보 만들기]** ➔ **[OAuth 클라이언트 ID]** 선택
3. 애플리케이션 유형: **[데스크톱 앱 (Desktop App)]** 선택
4. 이름: `VoltCheck Desktop Uploader` 입력 후 [만들기] 클릭
5. 생성 완료 팝업에서 **[JSON 다운로드]** 버튼을 누릅니다.
6. 다운로드된 파일 (예: `client_secret_xxxxxxxx.json`)의 이름을 **`client_secret.json`**으로 변경합니다.
7. 변경한 `client_secret.json` 파일을 본 프로젝트 폴더(`c:\이규정 개인 프로젝트\`)에 복사해 넣습니다.

---

## 🚀 업로드 실행 방법 (클릭 한 번으로 끝!)

1. `c:\이규정 개인 프로젝트\` 폴더에서 **`upload_all_shorts.bat`**를 더블 클릭합니다.
2. 최초 1회 실행 시 웹 브라우저 창이 자동으로 열립니다.
3. 테스트 사용자로 등록한 본인 Gmail 계정으로 로그인 후 **[계속]** 또는 **[허용]**을 클릭합니다.
   *(자체 개발 비게시 앱이므로 "확인되지 않은 앱" 경고가 뜨면 [고급] ➔ [이동(안전하지 않음)]을 클릭하시면 됩니다)*
4. 브라우저에 "The authentication flow has completed" 메시지가 뜨면 인증 끝!
   - 인증 토큰이 `youtube_token.json`에 영구 저장되므로, **다음부터는 로그인 창도 안 뜨고 바로 업로드됩니다!**
5. 콘솔 창에서 9편의 숏츠가 초당 전송 속도 프로그레스 바와 함께 순차적으로 유튜브에 업로드되고, 공식 홍보 댓글까지 100% 자동 등록됩니다! 🎉

---

## 💡 유용한 팁
- **테스트 업로드**: 유튜브에 공개하기 전에 나만 먼저 확인하고 싶다면 배치 메뉴에서 `[2] 일부공개 (Unlisted)`를 선택하세요.
- **개별 업로드**: 특정 영상 하나만 올리고 싶다면 배치 메뉴에서 `[3]`을 선택하고 영상 키(`story1`, `creative1` 등)를 입력하세요.
- **할당량(Quota) 안내**: YouTube API 기본 무료 일일 할당량은 10,000 포인트이며, 비디오 1편 업로드당 약 1,600 포인트가 소모됩니다. 하루 최대 약 6편까지 무료 업로드 가능하므로, 9편 전체 업로드 시 이틀에 걸쳐 나누어 올리거나 할당량 증설을 신청하시면 됩니다.
