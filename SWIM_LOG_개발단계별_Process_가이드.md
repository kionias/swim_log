# SWIM LOG 개발 단계별 Process 가이드

## 목적

Gemini를 개발 에이전트로 사용하여 SWIM LOG 수영 운동 기록 웹사이트를 단계적으로 구현한다.

핵심 원칙:

**한 단계 구현 → 실행 → 테스트 → 확인 → Git commit → 다음 단계**

---

# 전체 개발 Roadmap

```text
Phase 0  요구사항/프로젝트 준비
   ↓
Phase 1  개발환경 및 React 프로젝트
   ↓
Phase 2  UI 기본 구조
   ↓
Phase 3  Supabase / Database
   ↓
Phase 4  운동 데이터 CRUD
   ↓
Phase 5  메인 캘린더
   ↓
Phase 6  날짜별 상세 페이지
   ↓
Phase 7  관리자 인증/관리자 화면
   ↓
Phase 8  통계/기록
   ↓
Phase 9  운동 리포트 PNG
   ↓
Phase 10 반응형/UX/품질 개선
   ↓
Phase 11 보안/RLS/최종 점검
   ↓
Phase 12 Cloudflare Pages 배포
   ↓
Phase 13 운영/유지보수
   ↓
Phase 14 향후 AI 분석
```

---

# Phase 0. 요구사항 및 프로젝트 준비

## 목표

코딩하기 전에 프로젝트의 요구사항과 개발 기준을 확정한다.

## 서비스 성격

- 공개 수영 운동 기록 사이트
- 일반 방문자 회원가입 없음
- 일반 방문자 로그인 없음
- 운동 기록은 공개 조회
- 관리자만 데이터 변경 가능

## 핵심 UX

```text
메인 캘린더
    ↓
날짜별 Total 거리
    ↓
날짜 클릭
    ↓
상세 운동 기록
```

## 핵심 기능

- 월별 캘린더
- 날짜별 총 수영 거리
- 전체 / 월수금반 / 화목반 필터
- 날짜별 상세 운동
- 운동 세트
- 월간/주간/전체 통계
- 최고 기록
- PNG 리포트
- 관리자 CRUD
- 향후 AI 분석

## 완료 기준

다음 질문에 답할 수 있으면 완료:

- 누구나 조회할 수 있는가?
- 누가 데이터를 수정할 수 있는가?
- 메인 화면의 핵심 기능은 무엇인가?
- 날짜 클릭 후 어디로 이동하는가?
- 여러 운동이 같은 날짜에 있으면 어떻게 처리하는가?

---

# Phase 1. 개발환경 및 React 프로젝트

## 목표

실행 가능한 React 프로젝트를 만든다.

## 기술 스택

```text
React
TypeScript
Vite
Tailwind CSS
React Router
Supabase
Recharts
lucide-react
```

## 작업

```bash
npm create vite@latest swim-log -- --template react-ts
cd swim-log
npm install
npm run dev
```

## 성공 조건

브라우저에서 React 화면이 정상적으로 열린다.

## Git

```bash
git init
git add .
git commit -m "Initial React project"
```

---

# Phase 2. UI 기본 구조

## 목표

실제 데이터 없이 사이트의 기본 화면과 페이지 이동을 먼저 만든다.

## 페이지

```text
/
├── 메인 캘린더
├── /workouts/:date
├── /statistics
├── /records
└── /admin
```

## 메인 화면

```text
SWIM LOG

2026년 9월

[<]             [>]

[전체] [월수금반] [화목반]

운동 12회
18,500m
평균 1,542m

[캘린더]
```

## 상세 화면

```text
2026년 9월 18일

TOTAL
1,750m

수영장
용인시평생학습관스포츠센터

수업
저녁 수영 8시 연수반
```

## 이 단계에서는 하지 않는 것

- Supabase 연결
- 실제 데이터
- 관리자 인증
- 통계 계산

## 성공 조건

모든 페이지를 클릭하여 이동할 수 있다.

---

# Phase 3. Supabase 및 Database

## 목표

실제 운동 데이터를 저장할 데이터베이스를 만든다.

## 테이블

```text
pools
classes
workouts
workout_sets
```

## 관계

```text
pools
  ↓
classes
  ↓
workouts
  ↓
workout_sets
```

## pools

```text
id
name
location
length
created_at
```

## classes

```text
id
pool_id
name
days
start_time
end_time
description
is_active
created_at
```

## workouts

```text
id
class_id
pool_id
workout_date
duration_minutes
total_distance
memo
created_at
updated_at
```

## workout_sets

```text
id
workout_id
sequence
stroke
distance
laps
description
```

## 기본 데이터

```text
수영장
용인시평생학습관스포츠센터
25m
```

수업:

```text
저녁 수영 8시 연수반
월수금
20:00 ~ 21:00
```

## 성공 조건

Supabase에서 테이블과 샘플 데이터가 정상적으로 생성/조회된다.

---

# Phase 4. Supabase 연결 및 운동 CRUD

## 목표

React에서 Supabase를 연결하고 운동 데이터를 추가/조회/수정/삭제할 기반을 만든다.

## 환경변수

`.env.local`

```text
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

서비스 role key는 프론트엔드에 넣지 않는다.

## 권장 파일

```text
src/lib/supabase.ts
src/types/database.ts
```

## 운동 입력

```text
날짜
수영장
수업
운동시간

운동 세트
- 영법
- 거리
- 설명

[+ 운동 추가]

총 거리
자동 계산

[저장]
```

## 거리 계산

```text
200
+100
+400
+300
+200
+400
+150
=1750m
```

Total은 세트 합계에서 자동 계산한다.

## CRUD 테스트

```text
추가
조회
수정
삭제
```

모두 정상 동작해야 한다.

---

# Phase 5. 메인 캘린더

## 목표

사이트의 핵심 화면을 완성한다.

## URL

```text
/
```

## 날짜 표시

운동이 있는 날:

```text
18
1,750m
```

운동이 없는 날:

```text
18
-
```

## 월 이동

```text
< 2026년 8월
2026년 9월
2026년 10월 >
```

## 데이터 집계

개념:

```sql
SELECT
  workout_date,
  SUM(total_distance) AS total_distance
FROM workouts
WHERE workout_date >= :start
  AND workout_date < :end
GROUP BY workout_date
ORDER BY workout_date;
```

## 필터

```text
[전체]
[월수금반]
[화목반]
```

필터를 바꾸면 캘린더와 요약 통계도 함께 변경한다.

## 동일 날짜 복수 운동

```text
저녁 수영 1750m
자유수영 1000m
```

캘린더:

```text
2750m
```

## 성공 조건

```text
9/14 → 1500m
9/16 → 1600m
9/18 → 1750m
```

18일 클릭 시:

```text
/workouts/2026-09-18
```

으로 이동한다.

---

# Phase 6. 날짜별 상세 페이지

## 목표

선택한 날짜의 모든 운동을 상세하게 보여준다.

## URL

```text
/workouts/2026-09-18
```

## 표시

```text
← 캘린더

2026년 9월 18일
금요일

TOTAL
1,750m

수영장
용인시평생학습관스포츠센터

수업
저녁 수영 8시 연수반

운동시간
60분
```

## 세트

```text
01 웜업
   자유형
   200m

02 잠영
   100m

03 자유형
   400m
```

## 복수 workout

```text
TOTAL
2,750m

[저녁 수영]
1,750m
상세 세트...

[자유수영]
1,000m
상세 세트...
```

## 성공 조건

- 전체 합계가 정확하다.
- 각각의 workout이 구분된다.
- 세트 순서가 유지된다.

---

# Phase 7. 관리자 인증 및 관리자 화면

## 목표

공개 조회와 관리자 변경 권한을 분리한다.

## 공개 사용자

```text
조회 O
추가 X
수정 X
삭제 X
```

## 관리자

```text
조회 O
추가 O
수정 O
삭제 O
```

## URL

```text
/admin/login
/admin
/admin/workouts/new
/admin/workouts/:id/edit
```

Supabase Auth를 사용한다.

## 관리자 Dashboard

```text
운동 기록
수업 관리
수영장 관리
```

## 성공 조건

로그인하지 않은 사용자는 관리자 변경 기능을 사용할 수 없어야 한다.

---

# Phase 8. RLS 보안

## 목표

Supabase DB 자체에서 권한을 통제한다.

## 공개 사용자

```text
SELECT O
INSERT X
UPDATE X
DELETE X
```

## 관리자

```text
SELECT O
INSERT O
UPDATE O
DELETE O
```

UI에서 버튼을 숨기는 것만으로 보안을 구현하지 않는다.

RLS가 최종 방어선이 되어야 한다.

## 테스트

익명:

```text
SELECT → 성공
INSERT → 실패
UPDATE → 실패
DELETE → 실패
```

관리자:

```text
SELECT → 성공
INSERT → 성공
UPDATE → 성공
DELETE → 성공
```

---

# Phase 9. 통계

## 목표

운동 데이터를 시각적으로 분석한다.

## URL

```text
/statistics
```

## 월간

- 운동 횟수
- 총 거리
- 평균 거리
- 최장 거리
- 총 운동 시간

## 주간

요일별 거리와 운동 횟수.

## 영법별

```text
자유형
배영
평영
접영
IM
잠영
```

## 그래프

Recharts를 사용한다.

```text
월별 총 거리
주간 거리
영법별 거리
운동 횟수
```

## 성공 조건

통계 수치와 원본 workout 데이터의 합계가 일치한다.

---

# Phase 10. 전체 기록 / 최고 기록

## 목표

전체 기간의 주요 기록을 보여준다.

## URL

```text
/records
```

## 예

```text
최장 운동 거리
2,500m

최장 운동 시간
90분

월간 최다 거리
21,500m

월간 최다 운동
18회
```

---

# Phase 11. 오늘의 수영 한마디

## 목표

운동 상세/리포트에 수영 관련 문구를 표시한다.

예:

```text
오늘의 한마디가 내일의 실력을 만든다.

물속에서는 꾸준함이 가장 강한 힘이다.

빠르게보다 정확하게.

한 번의 스트로크도 헛되지 않는다.
```

운동을 다시 열었을 때 문구가 계속 바뀌지 않도록 저장하는 방식을 권장한다.

---

# Phase 12. PNG 운동 리포트

## 목표

운동 기록을 공유 가능한 이미지로 만든다.

## 버튼

```text
[운동 리포트]
```

## 이미지 구성

```text
SWIM LOG

2026.09.18 금요일

용인시평생학습관스포츠센터
저녁 수영 8시 연수반

TOTAL
1,750m

────────────

자유형 750m
접영   300m
배영   200m
IM     400m
잠영   100m

────────────

오늘의 수영 한마디
"..."
```

## 고려사항

- 모바일 공유에 적합한 세로형
- 읽기 쉬운 큰 숫자
- 날짜/장소/수업 표시
- 총 거리 강조
- 영법별 거리 표시

---

# Phase 13. 반응형 UI / UX

## 목표

모바일과 PC에서 모두 사용하기 편하게 만든다.

## 모바일 우선순위

```text
Total 거리
날짜
캘린더
상세 운동
```

## PC

사이드바를 사용할 수 있다.

```text
┌──────────┬──────────────────────┐
│ SWIM LOG │      메인 화면        │
│          │                      │
│ 캘린더   │      캘린더           │
│ 통계     │                      │
│ 기록     │                      │
│ 관리자   │                      │
└──────────┴──────────────────────┘
```

## 체크

- 버튼 크기
- 글자 크기
- 캘린더 터치 영역
- 카드 간격
- 로딩 상태
- 빈 상태
- 오류 메시지

---

# Phase 14. 로딩 / 오류 / 빈 데이터

## 목표

실제 서비스에서 발생할 수 있는 상황을 처리한다.

## 로딩

```text
기록을 불러오는 중...
```

## 운동 없음

```text
등록된 수영 기록이 없습니다.
```

## 오류

```text
운동 기록을 불러오지 못했습니다.

[다시 시도]
```

## 잘못된 날짜

```text
해당 날짜의 기록이 없습니다.

[캘린더로 돌아가기]
```

---

# Phase 15. SEO / 공유

## 목표

공개 페이지가 검색과 공유에 적합하도록 한다.

설정:

- 페이지 title
- meta description
- Open Graph
- favicon
- 공유 제목
- 공유 설명

날짜 상세 페이지도 가능하면 날짜와 운동 정보가 반영되도록 구성한다.

---

# Phase 16. 보안 최종 점검

## 반드시 확인

환경변수:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

절대 소스 코드에 포함하면 안 되는 것:

```text
service_role key
관리자 비밀번호
API secret
```

## 관리자 권한

프론트엔드의 단순 boolean 값만으로 관리자 여부를 판정하지 않는다.

## 삭제

삭제는 관리자만 가능해야 한다.

---

# Phase 17. Git 버전 관리

큰 기능 하나가 완료될 때마다 commit한다.

예:

```bash
git add .
git commit -m "Add calendar"
git push
```

권장 commit:

```text
Initial React project
Add Tailwind layout
Add Supabase client
Add database schema
Add workout CRUD
Add calendar
Add workout detail page
Add admin authentication
Add statistics
Add report generation
Improve responsive UI
Add security policies
```

---

# Phase 18. Cloudflare Pages 배포

## 목표

완성된 React 앱을 실제 웹사이트로 공개한다.

## 순서

```text
GitHub
   ↓
Cloudflare Pages
   ↓
Repository 연결
   ↓
Build 설정
   ↓
Environment Variables
   ↓
Deploy
```

## 빌드

```bash
npm run build
```

Vite 기본 출력:

```text
dist
```

## 배포 후 확인

```text
/
 /workouts/2026-09-18
 /statistics
 /records
 /admin/login
```

React Router URL을 직접 새로고침해도 정상적으로 열리는지 확인한다.

---

# Phase 19. 실제 운영 테스트

## 테스트 데이터

```text
2026-09-14
1500m

2026-09-16
1600m

2026-09-18
1750m
```

동일 날짜 복수 운동:

```text
2026-09-18
저녁 수영 1750m
자유수영 1000m
```

## 예상 결과

캘린더:

```text
9/14  1500m
9/16  1600m
9/18  2750m
```

상세:

```text
9/18
TOTAL 2750m

저녁 수영
1750m

자유수영
1000m
```

필터:

```text
전체
월수금반
화목반
```

각각의 결과가 정확해야 한다.

---

# Phase 20. 성능 점검

## 원칙

- 필요한 컬럼만 조회
- 캘린더는 해당 월 데이터만 조회
- 상세 페이지는 해당 날짜 데이터만 조회
- 불필요한 전체 데이터 조회 방지
- 이미지 최적화
- 불필요한 React 렌더링 확인

처음부터 과도하게 최적화하지 말고 실제 문제가 확인된 부분부터 개선한다.

---

# Phase 21. MVP 완료 기준

## 공개 기능

- [ ] 메인 캘린더
- [ ] 월 이동
- [ ] 날짜별 Total 거리
- [ ] 전체 필터
- [ ] 월수금반 필터
- [ ] 화목반 필터
- [ ] 날짜 클릭
- [ ] 날짜 상세
- [ ] 여러 workout 표시
- [ ] 통계
- [ ] 기록
- [ ] 오늘의 수영 한마디
- [ ] PNG 리포트

## 관리자

- [ ] 관리자 로그인
- [ ] 운동 추가
- [ ] 운동 수정
- [ ] 운동 삭제
- [ ] 수업 관리
- [ ] 수영장 관리

## 보안

- [ ] RLS
- [ ] 공개 사용자는 조회만 가능
- [ ] 관리자만 변경 가능
- [ ] service role key 미노출
- [ ] secret 하드코딩 없음

## 품질

- [ ] 모바일 정상
- [ ] PC 정상
- [ ] 로딩 처리
- [ ] 오류 처리
- [ ] 빈 상태 처리
- [ ] production build 성공
- [ ] Cloudflare 배포 성공

---

# Phase 22. Gemini를 이용한 실제 개발 Process

Gemini에게 전체 설계서를 한 번에 주고 "전부 개발해줘"라고 요청하기보다 단계별로 작업시키는 것을 권장한다.

## 첫 요청

```text
첨부된 SWIM LOG 설계서를 기준으로 프로젝트 구조를 분석하고
Phase 1만 구현해 주세요.

아직 Supabase와 실제 데이터를 연결하지 마세요.

구현 후:
1. 변경한 파일 목록
2. 각 파일의 역할
3. 실행 방법
4. 테스트 방법
5. 다음 단계에서 할 작업
을 설명해 주세요.
```

## 다음 단계 요청

```text
Phase 2를 구현해 주세요.

기존 기능을 유지하고
UI 기본 구조와 React Router를 구현해 주세요.

작업 후 반드시 npm run build가 성공하는지
확인할 수 있도록 테스트 방법을 제시해 주세요.
```

## Database 단계

```text
Phase 3를 구현해 주세요.

Supabase PostgreSQL schema를 생성할 SQL을 먼저 제시하고,
각 테이블의 관계와 RLS 설계까지 설명해 주세요.

기존 React 기능은 깨뜨리지 마세요.
```

이런 방식으로 Phase별로 진행한다.

---

# Gemini 공통 개발 규칙

모든 요청에 다음 원칙을 유지한다.

```text
1. 기존 기능을 임의로 삭제하지 않는다.

2. 새로운 기능을 추가할 때 기존 기능의 동작을 유지한다.

3. 변경한 파일을 명확하게 알려준다.

4. 필요한 경우 전체 파일 코드를 제공한다.

5. DB 변경이 필요한 경우 SQL을 별도로 제공한다.

6. 환경변수와 비밀키를 소스 코드에 하드코딩하지 않는다.

7. Supabase RLS를 반드시 고려한다.

8. TypeScript 타입 오류를 해결한다.

9. npm run build가 성공하도록 한다.

10. 모바일 화면을 반드시 고려한다.

11. 실제 샘플 데이터를 이용해 테스트한다.

12. 기능 구현 후 테스트 방법을 제시한다.

13. 기존 데이터가 손실될 수 있는 DB 변경은 실행 전에 경고한다.

14. 라이브러리를 추가할 경우 추가 이유를 설명한다.

15. 불필요하게 새로운 라이브러리를 추가하지 않는다.
```

---

# 각 Phase 완료 체크

각 단계가 끝날 때:

```text
[ ] 구현 완료
[ ] 기존 기능 정상
[ ] npm run build 성공
[ ] 브라우저 테스트 성공
[ ] 모바일 테스트 성공
[ ] DB 오류 없음
[ ] Console 오류 없음
[ ] Git commit 완료
```

하나라도 실패하면 다음 Phase로 넘어가지 않는다.

---

# 최종 사용자 경험

```text
SWIM LOG 접속
      ↓
2026년 9월 캘린더
      ↓
9월 18일
1,750m
      ↓
날짜 클릭
      ↓
2026년 9월 18일 상세
      ↓
TOTAL 1,750m
      ↓
웜업 / 자유형 / 접영 / 배영 / IM ...
      ↓
오늘의 수영 한마디
      ↓
운동 리포트
```

관리자는:

```text
관리자 로그인
      ↓
운동 추가
      ↓
세트 입력
      ↓
Total 자동 계산
      ↓
저장
      ↓
캘린더에 반영
```

---

# 향후 AI 기능

MVP가 안정적으로 운영된 후 추가한다.

## AI 분석 예

```text
이번 달 수영 분석

운동 횟수: 12회
총 거리: 18,500m
평균 거리: 1,542m

가장 많이 수행한 영법:
자유형

지난달과 비교:
총 거리 변화
운동 횟수 변화
영법별 변화

훈련 패턴 요약
```

AI 기능은 데이터 구조가 안정된 이후 추가한다.

---

# 최종 개발 순서 요약

```text
Phase 0  요구사항
Phase 1  React
Phase 2  UI
Phase 3  Database
Phase 4  Supabase 연결 / CRUD
Phase 5  Calendar
Phase 6  Detail
Phase 7  Admin
Phase 8  RLS
Phase 9  Statistics
Phase 10 Records
Phase 11 Quote
Phase 12 PNG
Phase 13 Responsive
Phase 14 Error/Loading
Phase 15 SEO
Phase 16 Security
Phase 17 Git
Phase 18 Deploy
Phase 19 Test
Phase 20 Performance
Phase 21 MVP 완료
Phase 22 Gemini 개발 Process
```

## 핵심 순서

> **데이터 → 캘린더 → 상세 → 관리자 → 통계 → 리포트 → 보안 → 배포 → AI**
