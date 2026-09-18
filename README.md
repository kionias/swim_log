# SWIM LOG — 수영 운동 기록 사이트

수영 운동 기록을 캘린더 중심으로 관리하고 통계 및 공유용 PNG 리포트를 생성할 수 있는 웹 서비스입니다.

---

## 🌟 주요 기능

1. **메인 캘린더 (`/`)**
   - 월별 달력 보기 및 이전달/다음달 이동
   - 해당 날짜의 총 운동 거리 (TOTAL DISTANCE) 자동 합산 표시
   - 같은 날짜에 복수 운동(예: 강습 + 자유수영)이 있는 경우 자동 합계 및 뱃지 표시
   - 전체 / 수업별 (월수금반, 화목반, 자유수영) 실시간 필터링
   - 월간 요약 카드: 총 운동 횟수, 총 거리, 평균 거리, 최장 거리

2. **날짜별 상세 기록 (`/workouts/:date`)**
   - 일별 총 거리 하이라이트 배너
   - 복수 세션 독립 카드 구분 표시 (수영장, 수업, 소요시간)
   - 세트별 상세 목록 (순번, 영법 뱃지, 세트 거리, 랩수, 설명)
   - 오늘의 수영 한마디 및 운동 메모 표시
   - **운동 리포트 카드 (PNG 이미지 저장)**

3. **운동 리포트 카드 (PNG 생성 & 모바일 공유)**
   - `html-to-image` 기반 세로형 카드 자동 렌더링
   - 날짜, 수영장, 수업, 총 거리, 영법별 상세 거리, 명언 포함
   - 버튼 클릭 시 즉시 고해상도 PNG 파일로 저장

4. **수영 운동 통계 (`/statistics`)**
   - Recharts 기반 대화형 차트
   - 영법별 (자유형, 배영, 평영, 접영, IM, 잠영) 거리 및 비중
   - 요일별 (월~일) 운동 거리 및 횟수 패턴 분석

5. **명예의 전당 & 최고 기록 (`/records`)**
   - 1일 최장 수영 거리, 단일 세션 최고 기록, 최장 운동 시간, 단일 세트 최장 거리
   - 전체 기간 TOP 5 수영 세션 랭킹

6. **관리자 모드 (`/admin`, `/admin/login`)**
   - 관리자 인증 (Supabase Auth / 로컬 데모 모드 지원)
   - 운동 기록 추가/수정/삭제 (CRUD)
   - **운동 세트 입력 시 총 거리(total_distance) 자동 실시간 계산**
   - 수영장 및 수업 관리 대시보드

---

## 🚀 빠른 시작 (Local Development)

### 1. 패키지 설치 & 개발 서버 실행
```bash
# 개발 서버 실행
npm run dev
```
브라우저에서 `http://localhost:5173`으로 접속합니다.

### 2. 프로덕션 빌드
```bash
npm run build
```

---

## 🗄️ Supabase 데이터베이스 연동

Supabase에 연결하지 않아도 기본 내장된 목(Mock) 데이터와 로컬 스토리지를 통해 모든 기능을 즉시 테스트할 수 있습니다. 실제 클라우드 DB 연동 방법은 다음과 같습니다:

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. SQL Editor에 접속하여 `supabase/schema.sql` 파일의 내용을 붙여넣고 실행
   - `pools`, `classes`, `workouts`, `workout_sets` 테이블 자동 생성
   - Row Level Security (RLS) 정책 자동 적용 (공개 읽기 / 관리자 쓰기)
   - 초기 샘플 데이터 자동 삽입
3. 루트 디렉토리에 `.env.local` 파일 생성:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
4. 앱 재시작 (`npm run dev`) 시 상단에 `Live DB` 뱃지가 표시되며 Supabase와 연동됩니다.

---

## ☁️ Cloudflare Pages 배포

1. GitHub 저장소에 코드를 push합니다.
2. Cloudflare Pages 대시보드에서 `Create a project` -> `Connect to Git` 선택
3. 빌드 설정:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. 환경변수(Environment Variables) 설정:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. 배포 완료! (`public/_redirects` 파일이 내장되어 SPA 새로고침 라우팅이 정상 작동합니다.)

