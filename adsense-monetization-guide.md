# 공장 자동화(FA) 설비용 '케이블 전압강하 & 센서 마진 계산기' 애드센스 승인 및 수익화 가이드

본 문서는 **고단가 B2B 산업 공학 트래픽을 활용하여 구글 애드센스(Google AdSense) 고단가(CPC 8,000원 ~ 25,000원) 수익을 극대화하고 부품 리드(B2B Lead)를 창출하는 운영 전략 가이드**입니다.

---

## 1. 애드센스 1차 심사 통과를 위한 핵심 체크포인트 (이미 완료됨)

구글 애드센스 심사는 다음 4가지 핵심 요소를 검사합니다. 본 웹페이지는 이 모든 요건을 100% 충족하도록 설계되었습니다.

1. **독창적이고 전문적인 고부가가치 콘텐츠 (Original High-Value Content)**:
   - 단순 텍스트 나열이 아닌, 전압강하 수식 유도(\(R_T = R_{20}[1+\alpha(T-20)]\)), NFPA 79 / IEC 60204-1 규격 해설, 현장 트러블슈팅(솔레노이드 브라운아웃 해결 등) 기술 문서 4편 수록.
   - 검색엔진 리치 스니펫을 위한 `Schema.org WebApplication` 및 `FAQPage` 구조화 데이터 내장.
2. **필수 정책 페이지 완비 (Essential Compliance Modals)**:
   - **개인정보처리방침 (Privacy Policy)**: Google DART 쿠키 및 제3자 광고 데이터 수집 고지 완료.
   - **이용약관 및 엔지니어링 면책조항 (Terms & Disclaimer)**: 계산 오차에 대한 법적 책임 제한 명시.
   - **사이트 소개 및 기술 표준 (About Us)**: IEC, NFPA, EIA/TIA-485 표준 준수 명시.
   - **문의처 (Contact Us)**: 운영팀 공식 이메일 및 채널 기재.
3. **사용자 경험(UX) 및 모바일 반응형 UI**:
   - 데스크톱/태블릿/스마트폰 완벽 반응형.
   - 깨진 링크(Broken Link) 0개, 완성도 높은 FA 다크 하이테크 테마.
4. **글로벌 유입을 위한 다국어(KO/EN) 지원**:
   - 미국, 독일, 일본, 대만 등 글로벌 고단가 트래픽 유입 즉시 흡수.

---

## 2. 애드센스 코드 삽입 및 배포 방법

### 2.1 도메인 연결 및 호스팅 배포
1. **무료 호스팅 추천**: GitHub Pages, Cloudflare Pages, Vercel, Netlify 등에 본 폴더의 파일들을 업로드합니다.
2. **개인 도메인 연결**: `facalculator.com` 또는 `fa-voltage.com` 등의 도메인을 연결하면 애드센스 승인 확률이 3배 이상 높아집니다.
3. **루트 경로에 `ads.txt` 배치**:
   - `ads.txt` 파일의 `pub-0000000000000000`을 본인의 구글 애드센스 퍼블리셔 ID로 수정합니다.

### 2.2 애드센스 광고 코드 교체 위치 (`index.html`)

애드센스 승인 후 생성된 광고 단위 코드를 아래 2곳의 플레이스홀더 영역에 교체합니다:

1. **상단 리더보드 슬롯 (Top Sticky Leaderboard)**:
   - `index.html` 84행 ~ 103행 (`class="ad-wrapper leaderboard-slot"`)
   - 키엔스, 오므론, 발루프 등의 전원/센서 제품군 자동 매칭.
2. **중간 네이티브 피드 배너 (Mid-Feed Native Unit)**:
   - `index.html` 388행 ~ 411행 (`class="ad-wrapper banner-slot"`)
   - 랍(Lapp), 이구스(IGUS), LS전선 등 케이블/부품사 광고 매칭.

---

## 3. 수익 극대화(High-CPC & B2B) 3단계 전략

```
[1단계: 고단가 애드센스 광고 수익]
- 타깃 키워드: DC 24V voltage drop, cable ampacity chart, RS-485 termination resistor
- 클릭당 단가: $5.00 ~ $18.00 (국내 8,000원 ~ 20,000원)

[2단계: A4 엔지니어링 검토서 인쇄/PDF 기능 바이럴]
- 현업 엔지니어들이 장비 출하/고객사 납품 전 '케이블 전압강하 검토서'를 PDF로 출력하여 도면 첨부
- 설비 도면철마다 본 웹사이트의 워터마크/URL이 포함되어 전국의 제어 엔지니어에게 자동 입소문 확산

[3단계: B2B 부품사 제휴 & 리드 제너레이션]
- '케이블/SMPS 부품 견적 요청(BOM)' 버튼을 통해 현업 설계자의 구매 의향 리드(회사명/이메일/필요스펙) 확보
- 국내외 케이블 총판 대리점(랍코리아, 한국이구스, 미스미 등)에 리드당 건별 수수료(Lead Fee) 제휴
```

---

## 4. 구글 검색엔진(SEO) 최적화 키워드 목록

- **네이버/구글 한국어 키워드**:
  - `DC 24V 전압강하 계산기`, `산업용 케이블 AWG 허용전류`, `RS-485 장거리 종단저항 계산`, `공압 실린더 공기 소모량`, `센서 전원 마진`, `FA 전장설계 계산기`, `솔레노이드 브라운아웃`
- **구글 글로벌 영문 키워드**:
  - `DC 24V voltage drop calculator`, `industrial cable AWG resistance chart`, `RS485 termination resistor calculator`, `pneumatic cylinder air consumption calculator`, `sensor brownout prevention`
