# SWIM LOG — 수영 운동 기록 사이트 상세 구현 설계서

## 1. 프로젝트 개요

수영 운동 기록을 공개적으로 조회할 수 있는 웹사이트를 구축한다.

핵심 목적은 다음과 같다.

- 별도의 일반 사용자 회원가입/로그인 없이 누구나 기록 조회 가능
- 관리자만 운동 기록을 추가/수정/삭제
- 메인 화면에서 월별 캘린더 제공
- 운동한 날짜에 해당 날짜의 총 수영 거리(TOTAL DISTANCE) 표시
- 날짜를 클릭하면 해당 날짜의 상세 운동 기록 페이지 표시
- 주간/월간/전체 통계 제공
- 운동 기록을 이미지(PNG) 리포트로 생성
- 향후 AI 기반 운동 분석 기능 확장 가능하도록 설계

## 2. 핵심 사용자 흐름

```text
공개 방문자
    ↓
메인 화면
    ↓
월별 캘린더
    ↓
날짜별 Total 거리 확인
    ↓
날짜 클릭
    ↓
해당 날짜 상세 운동 페이지
    ↓
운동 세트 확인
    ↓
운동 리포트 확인/공유
```

관리자는 다음 기능을 추가로 사용할 수 있다.

```text
관리자 로그인
    ↓
관리자 Dashboard
    ├── 운동 기록 추가
    ├── 운동 기록 수정
    ├── 운동 기록 삭제
    ├── 수업 관리
    └── 수영장 관리
```

## 3. 권장 기술 스택

- Frontend: React + TypeScript + Vite
- Styling: Tailwind CSS
- Routing: React Router
- Backend/DB/Auth: Supabase
- Database: PostgreSQL
- Chart: Recharts
- Icon: lucide-react
- Version Control: Git + GitHub
- Hosting: Cloudflare Pages
- 향후 AI: Gemini API 등

## 4. 운영 원칙

### 공개 사용자

회원가입 및 로그인이 필요 없다.

허용:
- 운동 기록 조회
- 캘린더 조회
- 날짜별 상세 조회
- 통계 조회
- 리포트 조회/생성

금지:
- 데이터 추가
- 데이터 수정
- 데이터 삭제

### 관리자

Supabase Auth를 이용한 관리자 인증을 적용한다.

허용:
- 운동 기록 CRUD
- 수영장 관리
- 수업 관리

## 5. 데이터베이스 구조

핵심 테이블은 4개로 구성한다.

```text
pools
  │
  └── classes
        │
        └── workouts
                │
                └── workout_sets
```

### 5.1 pools

수영장 정보를 저장한다.

| 컬럼 | 설명 |
|---|---|
| id | UUID, PK |
| name | 수영장 이름 |
| location | 위치 |
| length | 수영장 길이(m) |
| created_at | 생성일 |

예:

```text
name: 용인시평생학습관스포츠센터
location: 용인시
length: 25
```

### 5.2 classes

수업 정보를 저장한다.

| 컬럼 | 설명 |
|---|---|
| id | UUID, PK |
| pool_id | pools FK |
| name | 수업명 |
| days | 수업 요일 |
| start_time | 시작 시간 |
| end_time | 종료 시간 |
| description | 설명 |
| is_active | 활성 여부 |
| created_at | 생성일 |

예:

```text
name: 저녁 수영 8시 연수반
days: 월수금
start_time: 20:00
end_time: 21:00
```

### 5.3 workouts

하루의 실제 운동 기록을 저장한다.

| 컬럼 | 설명 |
|---|---|
| id | UUID, PK |
| class_id | classes FK, nullable |
| pool_id | pools FK |
| workout_date | 운동 날짜 |
| duration_minutes | 운동 시간 |
| total_distance | 총 거리(m) |
| memo | 메모 |
| created_at | 생성일 |
| updated_at | 수정일 |

`total_distance`는 가능한 한 workout_sets의 distance 합계로 자동 계산한다.

### 5.4 workout_sets

운동 세부 내용을 저장한다.

| 컬럼 | 설명 |
|---|---|
| id | UUID, PK |
| workout_id | workouts FK |
| sequence | 순서 |
| stroke | 영법 |
| distance | 거리(m) |
| laps | 바퀴 수, 필요 시 사용 |
| description | 세트 설명 |

예:

```text
1 / 웜업 / 자유형 / 200m
2 / 잠영 / 잠영 / 100m
3 / 자유형 / 자유형 / 400m
4 / 접영 / 접영 / 300m
5 / 배영 / 배영 / 200m
6 / IM / IM / 400m
7 / 자유형 / 자유형 / 150m
```

## 6. 거리 계산 규칙

기본 수영장은 25m를 기준으로 한다.

다만 데이터 모델에서는 `pool.length`와 실제 distance(m)를 별도로 관리하여 다른 길이의 수영장도 지원한다.

운동 세트의 거리 합계를 workout의 total_distance로 사용한다.

예:

```text
200m
+ 100m
+ 400m
+ 300m
+ 200m
+ 400m
+ 150m
= 1,750m
```

## 7. 메인 화면

URL:

```text
/
```

메인 화면은 캘린더 중심으로 구성한다.

### 상단

```text
SWIM LOG

2026년 9월

<                >

[전체] [월수금반] [화목반]
```

### 월간 요약

```text
이번 달

운동 12회
총 18,500m
평균 1,542m
```

### 캘린더

각 날짜에 해당 날짜의 총 운동 거리를 표시한다.

예:

```text
18
1,750m
```

운동이 없는 날:

```text
18
-
```

같은 날짜에 여러 workout이 존재하는 경우 모두 합산한다.

예:

```text
저녁 수영 1,750m
자유수영 1,000m
----------------
캘린더: 2,750m
```

## 8. 캘린더 필터

다음 필터를 제공한다.

```text
[전체]
[월수금반]
[화목반]
```

필터 선택 시 캘린더의 일별 total distance와 월간 요약 통계를 해당 조건에 맞게 다시 계산한다.

## 9. 날짜 클릭

날짜 클릭 시 다음 URL로 이동한다.

```text
/workouts/2026-09-18
```

날짜를 URL에 포함하여 특정 날짜의 기록을 직접 공유할 수 있도록 한다.

## 10. 날짜 상세 페이지

URL 예:

```text
/workouts/2026-09-18
```

### 상단

```text
← 캘린더

2026년 9월 18일
금요일
```

### 핵심 정보

```text
TOTAL DISTANCE

1,750m
```

### 운동 정보

```text
수영장
용인시평생학습관스포츠센터

수업
저녁 수영 8시 연수반

운동시간
60분
```

### 세트

```text
01  웜업
    자유형
    200m

02  잠영
    100m

03  자유형
    400m

04  접영
    300m

05  배영
    200m

06  IM
    400m

07  자유형
    150m
```

## 11. 동일 날짜 복수 운동

한 날짜에 여러 workout이 존재할 수 있도록 설계한다.

예:

```text
2026-09-18

저녁 수영
1,750m

자유수영
1,000m
```

캘린더에서는:

```text
2,750m
```

상세 페이지에서는 각각 독립된 workout 카드로 표시한다.

```text
TOTAL
2,750m

────────────────

저녁 수영
1,750m
상세 세트...

────────────────

자유수영
1,000m
상세 세트...
```

## 12. 통계 화면

URL:

```text
/statistics
```

### 월간 통계

- 운동 횟수
- 총 거리
- 평균 거리
- 최장 거리
- 총 운동 시간

### 주간 통계

요일별 거리 및 운동 횟수

### 영법별 통계

예:

```text
자유형 8,000m
배영   2,000m
평영   3,000m
접영   2,500m
IM     3,000m
```

Recharts를 이용해 그래프를 구성한다.

## 13. 기록 화면

URL:

```text
/records
```

전체 기간 기준 주요 기록을 표시한다.

예:

```text
최장 거리       2,500m
월간 최다 거리   21,500m
최다 운동 횟수   18회
최장 운동 시간   90분
```

## 14. 오늘의 수영 한마디

각 운동 리포트에 수영 관련 문구를 표시한다.

초기 버전에서는 배열 또는 별도 quotes 테이블을 사용할 수 있다.

예:

```text
오늘의 수영 한마디

"오늘의 한 바퀴가 내일의 실력을 만든다."
```

문구는 반복을 줄이기 위해 랜덤 선택하거나 날짜 기반으로 결정할 수 있다.

## 15. 관리자 페이지

URL:

```text
/admin
/admin/login
/admin/workouts/new
/admin/workouts/:id/edit
```

### 관리자 Dashboard

```text
운동 기록
수업
수영장
```

### 운동 추가

입력 항목:

- 날짜
- 수영장
- 수업
- 운동 시간
- 운동 세트
- 메모

세트 추가:

```text
[운동 추가]
```

각 세트:

```text
영법
거리
설명
```

저장 시 세트 거리 합계로 total_distance를 자동 계산한다.

## 16. React 폴더 구조

권장 구조:

```text
src/
├── components/
│   ├── Calendar/
│   ├── WorkoutCard/
│   ├── WorkoutSet/
│   ├── StatCard/
│   ├── Header/
│   └── Layout/
│
├── pages/
│   ├── Home.tsx
│   ├── WorkoutDetail.tsx
│   ├── Statistics.tsx
│   ├── Records.tsx
│   ├── AdminLogin.tsx
│   ├── AdminDashboard.tsx
│   └── WorkoutEditor.tsx
│
├── lib/
│   └── supabase.ts
│
├── hooks/
│   ├── useWorkouts.ts
│   └── useCalendar.ts
│
├── types/
│   └── database.ts
│
├── utils/
│   ├── distance.ts
│   ├── date.ts
│   └── report.ts
│
├── App.tsx
└── main.tsx
```

## 17. URL 구조

```text
/
```
메인 캘린더

```text
/workouts/2026-09-18
```
날짜별 상세

```text
/statistics
```
통계

```text
/records
```
기록

```text
/admin/login
```
관리자 로그인

```text
/admin
```
관리자 Dashboard

```text
/admin/workouts/new
```
운동 추가

```text
/admin/workouts/:id/edit
```
운동 수정

## 18. 캘린더 데이터 조회 로직

선택한 월과 필터 조건에 해당하는 workouts를 조회한다.

개념:

```sql
SELECT
  workout_date,
  SUM(total_distance) AS total_distance
FROM workouts
WHERE workout_date >= :month_start
  AND workout_date < :next_month_start
GROUP BY workout_date
ORDER BY workout_date;
```

수업 필터를 적용하는 경우 classes와 JOIN한다.

핵심은 캘린더가 workout 하나의 거리만 표시하지 않고 해당 날짜의 모든 workout을 합산하는 것이다.

## 19. 날짜 상세 조회 로직

선택한 날짜의 모든 workout을 조회한다.

```text
workouts
    ↓
classes
pools
    ↓
workout_sets
```

정렬:

```text
workout_date
→ workout 생성/시간 기준
→ workout_sets.sequence
```

## 20. Supabase RLS

공개 데이터이므로 읽기는 허용한다.

개념:

```text
anon
  SELECT: 허용
  INSERT: 금지
  UPDATE: 금지
  DELETE: 금지
```

관리자 인증 사용자는:

```text
authenticated
  SELECT: 허용
  INSERT: 허용
  UPDATE: 허용
  DELETE: 허용
```

실제 구현에서는 관리자 권한을 안전하게 검증할 수 있도록 Supabase Auth와 적절한 authorization 정책을 구성한다.

서비스 role key는 절대로 프론트엔드 코드에 노출하지 않는다.

## 21. 보안 원칙

절대 금지:

- Supabase service role key를 브라우저 코드에 저장
- 관리자 비밀번호를 코드에 하드코딩
- 일반 사용자에게 INSERT/UPDATE/DELETE 권한 제공

환경변수:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

만 클라이언트에서 사용한다.

## 22. 반응형 UI

Mobile First를 기본으로 한다.

### 모바일

```text
┌────────────────────┐
│ SWIM LOG           │
│                    │
│ 2026년 9월         │
│                    │
│ [전체] [월수금] ... │
│                    │
│     캘린더          │
│                    │
└────────────────────┘
```

### PC

사이드바 + 메인 콘텐츠 구조를 사용할 수 있다.

```text
┌──────────┬──────────────────────┐
│ SWIM LOG │                      │
│          │       캘린더          │
│ 캘린더   │                      │
│ 통계     │                      │
│ 기록     │                      │
│ 관리자   │                      │
└──────────┴──────────────────────┘
```

## 23. 디자인 방향

전체적인 느낌:

- 깔끔함
- 현대적인 운동 기록 앱
- 수영/물의 느낌
- 과도한 장식 배제
- 숫자와 기록이 잘 보이는 UI
- 모바일에서 사용하기 쉬운 카드 UI

추천 구성:

```text
밝은 배경
카드형 콘텐츠
큰 Total Distance
간결한 아이콘
충분한 여백
부드러운 모서리
```

## 24. PNG 운동 리포트

상세 페이지에:

```text
[운동 리포트]
```

버튼을 제공한다.

이미지 구성:

```text
SWIM LOG

2026.09.18 금요일
용인시평생학습관스포츠센터
저녁 수영 8시 연수반

TOTAL
1,750m

자유형 750m
접영   300m
배영   200m
IM     400m
잠영   100m

오늘의 수영 한마디
"..."
```

SNS나 메신저에서 공유하기 좋은 세로형 이미지도 고려한다.

## 25. 개발 단계

### Phase 1 — 기본 구조

1. React + TypeScript + Vite 생성
2. Tailwind CSS 설정
3. React Router 설정
4. GitHub 연결
5. Supabase 프로젝트 생성
6. Database 구축
7. Supabase 연결
8. 샘플 데이터 입력

### Phase 2 — 핵심 기능

1. 메인 캘린더
2. 월 이동
3. 전체/월수금/화목 필터
4. 날짜별 Total 거리
5. 날짜 클릭
6. 날짜 상세 페이지
7. 복수 workout 지원

### Phase 3 — 관리자

1. 관리자 로그인
2. Dashboard
3. 운동 추가
4. 운동 수정
5. 운동 삭제
6. 수업 관리
7. 수영장 관리

### Phase 4 — 통계

1. 월간 통계
2. 주간 통계
3. 영법별 통계
4. 전체 기록
5. 최고 기록

### Phase 5 — 리포트

1. 리포트 UI
2. PNG 생성
3. 모바일 공유 최적화

### Phase 6 — 품질

1. 모바일 반응형
2. 로딩 상태
3. 오류 처리
4. 빈 데이터 처리
5. RLS 보안 점검
6. SEO 기본 설정
7. 접근성 점검

### Phase 7 — 배포

1. GitHub push
2. Cloudflare Pages 연결
3. 환경변수 설정
4. Production build
5. 배포
6. 실제 도메인 연결(선택)

### Phase 8 — 향후 AI

기본 서비스가 안정화된 후 추가한다.

예:

```text
이번 달 운동 분석

총 운동 횟수
총 거리
평균 거리
영법별 비율
지난달 대비 변화
```

AI가 기록을 분석하여 자연어로 요약하도록 확장한다.

## 26. 1차 완성 테스트

다음 테스트 데이터로 핵심 흐름을 검증한다.

```text
2026-09-14
1,500m

2026-09-16
1,600m

2026-09-18
1,750m
```

메인:

```text
14 → 1,500m
16 → 1,600m
18 → 1,750m
```

18일 클릭:

```text
/workouts/2026-09-18
```

그리고:

```text
2026년 9월 18일
TOTAL 1,750m
운동 세트 표시
```

가 정상적으로 표시되면 핵심 기능 1차 완료.

## 27. 구현 우선순위

처음부터 모든 기능을 동시에 구현하지 않는다.

가장 먼저 완성해야 할 기능:

```text
Supabase
   ↓
운동 데이터 저장
   ↓
메인 캘린더
   ↓
날짜별 Total
   ↓
날짜 클릭
   ↓
상세 운동 페이지
```

그 이후:

```text
관리자
   ↓
통계
   ↓
PNG 리포트
   ↓
모바일 최적화
   ↓
AI 분석
```

순으로 진행한다.

## 28. Gemini 개발용 작업 원칙

이 설계서를 기준으로 Gemini에게 개발을 맡길 때 다음 원칙을 지킨다.

1. 한 번에 전체 프로젝트를 무리하게 작성하지 않는다.
2. 단계별로 구현한다.
3. 각 단계마다 실행 및 테스트 방법을 제시한다.
4. 기존 기능을 깨뜨리지 않는 방식으로 수정한다.
5. 데이터베이스 변경이 필요한 경우 SQL을 별도로 제시한다.
6. 환경변수와 비밀키를 코드에 하드코딩하지 않는다.
7. Supabase RLS 정책을 반드시 구현한다.
8. 모바일 UI를 우선적으로 확인한다.
9. 실제 샘플 데이터를 이용해 캘린더 → 상세 페이지 흐름을 검증한다.
10. 배포 전에 production build와 주요 URL을 모두 테스트한다.

## 29. 최종 목표 구조

```text
                         SWIM LOG
                            │
             ┌──────────────┴──────────────┐
             │                             │
          공개 영역                      관리자
             │                             │
        메인 캘린더                    관리자 로그인
             │                             │
       날짜별 Total                   Dashboard
             │                             │
       날짜 상세                    운동 CRUD
             │                             │
       통계 / 기록                  수업 / 수영장
             │
        PNG 리포트
             │
        향후 AI 분석
             │
             ▼
        Supabase PostgreSQL
```

## 30. MVP에서 제외할 기능

초기 무료 버전에서는 다음 기능을 넣지 않는다.

- 일반 사용자 회원가입
- 사용자 프로필
- 커뮤니티
- 댓글
- 좋아요
- 동영상 업로드
- 결제
- 광고
- 복잡한 소셜 기능

이 기능들은 향후 필요성이 확인된 경우 별도 검토한다.

---

# 결론

이 프로젝트의 핵심 UX는 다음 한 줄로 요약된다.

**캘린더 → 날짜 클릭 → 상세 운동 기록 → 리포트**

따라서 개발 초기에는 이 흐름을 가장 먼저 완성하고, 이후 관리자/통계/리포트/AI 기능을 단계적으로 추가한다.

Gemini를 개발 에이전트로 사용하는 경우에도 이 문서를 프로젝트의 기준 설계서로 사용하고, 각 Phase를 순차적으로 구현하는 것을 권장한다.
