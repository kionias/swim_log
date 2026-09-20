# SWIM LOG — Codex UI/UX 개선 및 고해상도 운동 리포트 카드 작업 지시서

## 0. 작업 목적

현재 SWIM LOG 웹사이트는 기능적으로 개발이 완료되어 있습니다.

React + TypeScript + Vite + Tailwind CSS 기반이며 Supabase와 연결되어 있습니다.

현재 화면의 가장 큰 문제는 다음과 같습니다.

1. 전체 UI가 다소 전형적인 AI 생성 Dashboard처럼 보입니다.
2. 카드, 둥근 모서리, 그림자, pill UI가 과도합니다.
3. 정보의 hierarchy가 약합니다.
4. 캘린더가 데이터베이스 관리자 화면처럼 느껴집니다.
5. 운동 상세 화면이 단조롭습니다.
6. 운동 리포트 카드(PNG)가 기존 ChatGPT에서 만들어주던 이미지보다 선명하지 않고 디자인 완성도도 낮습니다.

이번 작업의 목표는 **기존 기능을 유지하면서 실제 스포츠 기록 서비스처럼 자연스럽고 세련된 UI/UX로 개선하는 것**입니다.

특히 **PNG 운동 리포트 카드의 선명도와 완성도 개선을 최우선 과제**로 합니다.

---

# 1. 매우 중요한 작업 원칙

## 반드시 유지

다음 기능은 절대로 깨뜨리거나 삭제하지 마세요.

- Supabase 연결
- PostgreSQL Database 구조
- RLS 정책
- Supabase Auth
- 관리자 로그인
- 관리자 CRUD
- 운동 기록 조회
- 운동 기록 추가/수정/삭제
- 월간 캘린더
- 월수금반 / 화목반 필터
- 화목반 필터
- 전체 필터
- 날짜별 운동 거리
- 같은 날짜 여러 운동의 거리 합산
- 운동 상세 페이지
- 운동 세트 목록
- 총 거리
- 운동 시간
- 수업명
- 장소
- 오늘의 수영 한마디
- PNG 운동 리포트 생성/저장
- React Router
- 기존 URL
- 반응형 기능

## 절대 금지

- Database Schema 변경
- SQL 수정
- RLS 수정
- Auth 구조 변경
- Supabase 권한 변경
- 데이터 삭제
- 기존 기능 삭제
- 기존 URL 변경
- Secret key 추가
- `.env` 파일을 Git에 추가
- 불필요한 패키지 대량 설치
- 전체 프로젝트를 다른 framework로 교체
- 기존 동작을 임의로 변경

UI/UX 개선이 목적이므로 **백엔드와 데이터 구조는 그대로 유지**하세요.

---

# 2. 작업 방식

먼저 repository 전체를 분석하세요.

특히 다음 파일과 코드를 찾아보세요.

- `package.json`
- `src/`
- Router
- Calendar 관련 컴포넌트
- Workout Detail 관련 컴포넌트
- Header
- 통계 영역
- 필터
- PNG/Report 관련 코드
- Canvas / html2canvas / dom-to-image / SVG 등 이미지 생성 방식
- Tailwind 설정
- CSS
- Supabase client

### 중요

이번 작업은 별도의 질문을 반복하지 말고 **현재 소스를 직접 분석한 뒤 필요한 부분을 수정하는 방식으로 진행하세요.**

다만 Database/Auth/Supabase 구조를 변경해야 한다고 판단되는 경우에는 수정하지 말고 그 이유를 작업 결과에 기록하세요.

---

# 3. 전체 디자인 방향

목표는 다음과 같습니다.

- Clean
- Premium
- Sports
- Swimming
- Editorial
- Modern
- Human-designed
- Data-focused
- Crisp
- Lightweight

참고 방향은 Strava, Garmin, Nike Run Club 등의 스포츠 기록 서비스가 가진 **데이터 중심성과 완성도**입니다.

단, 해당 서비스의 디자인을 복사하지 마세요.

SWIM LOG만의 수영 기록 서비스 디자인으로 구현하세요.

---

# 4. AI스러운 UI 제거

현재 다음 요소가 과도하게 사용되어 있다면 줄이세요.

- 모든 영역의 카드화
- 과도한 border-radius
- 모든 카드의 shadow
- floating card
- 과도한 gradient
- 과도한 아이콘
- pill badge 남발
- 큰 파란색 버튼 남발
- 장식용 요소

대신 다음을 사용하세요.

- 충분한 white space
- 명확한 typography hierarchy
- 얇은 border
- 최소한의 shadow
- 자연스러운 section 구분
- 데이터 중심 layout
- 적절한 alignment

**"카드를 더 추가하는 방식"으로 디자인을 개선하지 마세요.**

---

# 5. 색상

현재 SWIM LOG의 Blue 브랜드 이미지는 유지합니다.

권장 계열:

- Primary: #0B8CCB
- Deep Blue: #05689A
- Light Blue: #EAF7FC
- Background: #F7FAFC
- Text: Navy / Slate
- Secondary Text: Gray / Slate
- Border: 매우 연한 Blue-Gray

Blue는 핵심 데이터와 인터랙션을 강조하는 용도로 사용하세요.

전체를 파란색 카드로 만들지 마세요.

---

# 6. Header 개선

현재:

SWIM LOG
수영 운동 기록

운동기록
로그인

구조를 유지합니다.

개선 방향:

- 높이를 적절히 줄임
- 로고를 선명하게
- 메뉴를 텍스트 중심으로
- 활성 메뉴만 Blue 강조
- 불필요한 pill 제거
- 모바일에서도 깔끔하게 표시

---

# 7. 월간 메인 화면

월간 캘린더는 SWIM LOG의 핵심 화면입니다.

현재 기능은 유지하면서 **스포츠 기록 캘린더** 느낌으로 개선하세요.

## 월간 요약

현재 정보 유지:

- 운동 횟수
- 총 거리
- 평균 거리
- 최장 거리

예:

2026년 9월 수영 요약

14회 | 17,830m | 평균 1,274m | 최장 1,750m

숫자는 크게, 라벨은 작게 표현하세요.

4개의 거대한 독립 카드가 화면을 지배하지 않도록 하세요.

---

# 8. Calendar 개선

현재 거리 표시가 큰 파란 pill/button처럼 보인다면 변경하세요.

운동이 있는 날짜:

4
1,000m

처럼 자연스럽게 표시하세요.

가능한 표현:

- Blue 숫자
- 작은 dot
- 하단 indicator
- subtle background
- 얇은 accent line

운동이 없는 날짜에는 `-`를 반복해서 표시하지 마세요.

선택된 날짜는 단순한 굵은 파란색 테두리보다:

- 날짜 숫자 강조
- 작은 원형 강조
- 하단 indicator
- subtle background

등을 사용하세요.

캘린더가 "표"처럼 보이는 것보다 "운동 기록을 보는 화면"처럼 느껴져야 합니다.

---

# 9. 운동 상세 페이지

상단 정보 hierarchy를 개선하세요.

예:

2026년 9월 4일 금요일

오늘의 총 수영 거리

# 1,000m

10개 운동 세트

핵심은:

**날짜 → 총 거리 → 세트/수업/장소 정보**

순서입니다.

총 거리 `1,000m`는 페이지에서 가장 강하게 보여야 합니다.

---

# 10. 운동 세트 목록

현재 세트 데이터는 그대로 사용하세요.

예:

01  웜업 · 자유형 2바퀴       100m
02  웜업 · 배영 1바퀴           50m
03  웜업 · 평영 1바퀴           50m

현재처럼 각 행을 큰 rounded card로 만들지 마세요.

가능하면 compact list/table 형태로 정리하세요.

각 행의:

- 번호
- 운동명
- 거리

가 명확하게 정렬되어야 합니다.

---

# 11. 오늘의 수영 한마디

기능은 유지합니다.

예:

오늘의 수영 한마디

“수영은 속도를 겨루는 운동이 아니라,
나 자신을 이기는 과정입니다.”

디자인:

- 작은 quote icon
- 충분한 typography
- 아주 옅은 Blue 배경
- 과도한 장식 금지

---

# 12. 운동 리포트 카드(PNG) — 최우선

이번 작업에서 가장 중요합니다.

현재 웹 화면의 리포트 카드와 다운로드되는 PNG를 분석하고, **PNG 자체의 품질을 개선하세요.**

목표:

> 실제 스포츠 앱에서 공유하는 운동 기록 이미지처럼 선명하고 완성도 높은 카드

단순히 현재 HTML을 screenshot하는 방식이라면 그 방식의 품질 문제를 분석하세요.

---

# 13. PNG 고해상도 출력

현재 PNG 생성 방식이 무엇인지 먼저 확인하세요.

가능하면 출력 전용 rendering과 화면 Preview를 분리하세요.

예:

화면 Preview
→ 일반 responsive CSS

PNG Download
→ 고해상도 rendering

권장 출력 크기:

- 최소 1600 × 2000 px 이상
- 가능하면 2400 × 3000 px 수준
- 실제 CSS 표시 크기보다 2x~3x 해상도로 렌더링

다음을 반드시 점검하세요.

1. devicePixelRatio
2. Canvas 실제 width/height
3. CSS width/height
4. transform scale
5. canvas scaling
6. 폰트 rendering
7. SVG rendering
8. background image resolution
9. PNG export 과정의 resize
10. 이미지 압축

특히 `html2canvas` 등을 사용하고 있다면 현재 구현을 분석하고 고해상도 렌더링이 되도록 개선하세요.

---

# 14. PNG 카드 디자인

현재 카드의 정보는 유지하세요.

필수 정보:

- SWIM LOG
- 날짜
- 장소
- 수업명
- 운동 세트
- 각 세트 거리
- 총 거리
- 오늘의 수영 한마디

추천 hierarchy:

상단:

SWIM LOG
SWIMMING WORKOUT

2026.09.04 FRI

중앙:

TOTAL DISTANCE

1,000m

중앙/하단:

WORKOUT SETS

01  웜업 · 자유형 2바퀴      100m
02  웜업 · 배영 1바퀴          50m
...

하단:

오늘의 수영 한마디

“수영은 속도를 겨루는 운동이 아니라,
나 자신을 이기는 과정입니다.”

---

# 15. PNG Typography

한글 가독성을 최우선으로 합니다.

가능하면 기존 프로젝트 폰트를 우선 사용하고, 필요하면 Pretendard/Noto Sans KR 계열을 검토하세요.

핵심 숫자:

1,000m

가 가장 선명하고 강하게 보여야 합니다.

PNG에서 한글과 숫자가 흐려지지 않도록 폰트 로딩 완료 후 렌더링하는지 확인하세요.

---

# 16. PNG 배경

수영장 이미지를 사용할 경우:

- 원본 해상도 확인
- aspect ratio 유지
- 텍스트 대비 확보
- 필요한 부분에만 overlay
- 과도한 blur 금지

배경보다 텍스트와 운동 데이터가 우선입니다.

저해상도 이미지를 확대해서 사용하는 경우 가능한 대안을 검토하세요.

---

# 17. 모바일

Mobile-first를 유지하세요.

특히:

- Header
- 필터
- Calendar
- 운동 상세
- 운동 세트
- PNG Preview

를 모바일에서 확인하세요.

PC 화면을 단순 축소한 것처럼 보이지 않도록 합니다.

---

# 18. 컴포넌트 구조

현재 프로젝트 구조를 먼저 존중하세요.

필요하다면 다음처럼 역할별로 정리할 수 있습니다.

```text
src/
├── components/
│   ├── layout/
│   ├── calendar/
│   ├── workout/
│   ├── report/
│   └── common/
│
├── pages/
│   ├── WorkoutCalendarPage
│   ├── WorkoutDetailPage
│   └── AdminPage
```

단, 기존 구조가 이미 적절하다면 불필요한 파일 이동/대규모 refactor는 하지 마세요.

---

# 19. 패키지

기존 패키지를 최대한 활용하세요.

새 패키지는 정말 필요한 경우에만 추가하세요.

추가한다면:

- 왜 필요한지
- 기존 방식보다 어떤 장점이 있는지
- 무료/라이선스 문제
- 번들 크기 영향

을 작업 결과에 기록하세요.

---

# 20. 작업 순서

다음 순서로 실제 작업하세요.

### Step 1
현재 프로젝트 분석

### Step 2
현재 UI 구조와 문제점 파악

### Step 3
현재 PNG 생성 방식 파악

### Step 4
디자인 시스템 정리

### Step 5
Header 개선

### Step 6
월간 요약 개선

### Step 7
Calendar 개선

### Step 8
Workout Detail 개선

### Step 9
Quote 영역 개선

### Step 10
PNG Report Card 디자인 및 고해상도 출력 개선

### Step 11
Mobile Responsive 확인

### Step 12
전체 QA

---

# 21. 코드 수정 원칙

가능한 한 기존 코드를 재사용하세요.

작은 변경으로 해결할 수 있는 문제를 전체 컴포넌트 재작성으로 해결하지 마세요.

특히 다음은 신중하게 처리하세요.

- Supabase client
- Router
- Auth
- Database query
- RLS
- workout data type
- PNG data source

UI 작업과 데이터 작업을 분리하세요.

---

# 22. 테스트

작업 후 반드시 실행:

```bash
npm run build
```

TypeScript 오류가 없어야 합니다.

가능하면:

```bash
npm run lint
```

도 실행하세요.

확인할 기능:

- 메인 화면
- 월 이동
- 오늘 버튼
- 전체 필터
- 월수금반
- 화목반
- 날짜 클릭
- 상세 페이지
- 운동 데이터
- 관리자 로그인
- 운동 추가
- 운동 수정
- 운동 삭제
- PNG 저장

---

# 23. PNG 테스트

특히 다음을 확인하세요.

### Preview

정상적으로 보이는지

### Download PNG

고해상도로 저장되는지

### 확대

200% 이상 확대했을 때:

- 한글이 흐리지 않는가?
- 숫자가 흐리지 않는가?
- 아이콘이 깨지지 않는가?
- 선이 깨지지 않는가?
- 배경 이미지가 과도하게 픽셀화되지 않는가?

확인하세요.

가능하다면 실제 생성된 PNG의 width/height도 확인하세요.

---

# 24. Git

작업 완료 후 변경사항을 확인하세요.

```bash
git status
```

필요하면 적절한 commit을 생성하세요.

예:

```bash
git add .
git commit -m "Improve SWIM LOG UI and report card"
```

push 전에 변경 파일을 확인하세요.

`.env` 또는 Secret key가 포함되지 않았는지 반드시 확인하세요.

---

# 25. 최종 보고 형식

작업이 끝나면 다음 형식으로 보고하세요.

## 1. UI 변경 요약

- Header:
- Calendar:
- Summary:
- Workout Detail:
- Quote:
- Mobile:

## 2. PNG 변경

- 기존 PNG 생성 방식:
- 변경한 방식:
- 출력 해상도:
- DPR:
- 폰트 처리:
- 배경 이미지 처리:

## 3. 변경 파일

파일별로:

```text
src/xxx.tsx
- 변경 내용
```

## 4. 추가 패키지

없으면:

`없음`

있으면 패키지와 추가 이유를 설명

## 5. 테스트

```text
npm run build: PASS/FAIL
npm run lint: PASS/FAIL
```

그리고 주요 기능 테스트 결과를 기록

## 6. Supabase 영향

반드시:

`Database / RLS / Auth 변경 없음`

또는 실제 변경 사항을 정확히 기록

---

# 최종 지시

**현재 소스가 이미 완성되어 있으므로 기능을 새로 만드는 것이 아니라 기존 SWIM LOG를 더 세련된 스포츠 기록 서비스로 리디자인하는 작업입니다.**

가장 중요한 우선순위는:

1. 기존 기능 보존
2. AI스러운 UI 제거
3. 데이터 hierarchy 개선
4. Calendar 개선
5. Workout Detail 개선
6. **PNG 운동 리포트 카드의 고해상도/선명도 개선**
7. 모바일 완성도 개선

입니다.

**특히 PNG는 단순히 크기만 키우지 말고 실제 렌더링 방식의 원인을 분석해서 선명도를 개선하세요.**

작업 중 기존 기능을 깨뜨릴 가능성이 있는 변경은 피하고, 변경 후 반드시 `npm run build`까지 완료하세요.
