-- =============================================================================
-- SWIM LOG Database Schema (Supabase PostgreSQL)
-- =============================================================================

-- 1. Create pools table
CREATE TABLE IF NOT EXISTS public.pools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT,
  length INTEGER NOT NULL DEFAULT 25,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create classes table
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pool_id UUID REFERENCES public.pools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  days TEXT NOT NULL,          -- e.g. "월수금", "화목"
  start_time TIME NOT NULL,    -- e.g. '20:00'
  end_time TIME NOT NULL,      -- e.g. '21:00'
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create workouts table
CREATE TABLE IF NOT EXISTS public.workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  pool_id UUID REFERENCES public.pools(id) ON DELETE RESTRICT,
  workout_date DATE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  total_distance INTEGER NOT NULL DEFAULT 0,
  memo TEXT,
  quote TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create workout_sets table
CREATE TABLE IF NOT EXISTS public.workout_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  sequence INTEGER NOT NULL DEFAULT 1,
  distance INTEGER NOT NULL,   -- distance in meters
  laps INTEGER,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_workouts_date ON public.workouts(workout_date);
CREATE INDEX IF NOT EXISTS idx_workouts_class ON public.workouts(class_id);
CREATE INDEX IF NOT EXISTS idx_workout_sets_workout_id ON public.workout_sets(workout_id);

-- =============================================================================
-- Row Level Security (RLS) Setup
-- =============================================================================

-- Enable RLS
ALTER TABLE public.pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;

-- 1) pools Policies
CREATE POLICY "Public pools read access"
  ON public.pools FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin pools insert access"
  ON public.pools FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin pools update access"
  ON public.pools FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Admin pools delete access"
  ON public.pools FOR DELETE
  TO authenticated
  USING (true);

-- 2) classes Policies
CREATE POLICY "Public classes read access"
  ON public.classes FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin classes insert access"
  ON public.classes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin classes update access"
  ON public.classes FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Admin classes delete access"
  ON public.classes FOR DELETE
  TO authenticated
  USING (true);

-- 3) workouts Policies
CREATE POLICY "Public workouts read access"
  ON public.workouts FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin workouts insert access"
  ON public.workouts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin workouts update access"
  ON public.workouts FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Admin workouts delete access"
  ON public.workouts FOR DELETE
  TO authenticated
  USING (true);

-- 4) workout_sets Policies
CREATE POLICY "Public workout_sets read access"
  ON public.workout_sets FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin workout_sets insert access"
  ON public.workout_sets FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin workout_sets update access"
  ON public.workout_sets FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Admin workout_sets delete access"
  ON public.workout_sets FOR DELETE
  TO authenticated
  USING (true);

-- =============================================================================
-- Seed Initial Data
-- =============================================================================

DO $$
DECLARE
  v_pool_id UUID;
  v_class_id UUID;
  v_class2_id UUID;
  v_workout_14 UUID;
  v_workout_16 UUID;
  v_workout_18a UUID;
  v_workout_18b UUID;
BEGIN
  -- Insert Pool
  INSERT INTO public.pools (name, location, length)
  VALUES ('용인시평생학습관스포츠센터', '경기도 용인시 수지구', 25)
  RETURNING id INTO v_pool_id;

  -- Insert Classes
  INSERT INTO public.classes (pool_id, name, days, start_time, end_time, description)
  VALUES (v_pool_id, '저녁 수영 8시 연수반', '월수금', '20:00', '21:00', '월수금 인터벌 및 턴 트레이닝')
  RETURNING id INTO v_class_id;

  INSERT INTO public.classes (pool_id, name, days, start_time, end_time, description)
  VALUES (v_pool_id, '화목 마스터즈반', '화목', '20:00', '21:00', '화목 지구력 및 영법 훈련')
  RETURNING id INTO v_class2_id;

  -- Workout 1: 2026-09-14 (1,500m)
  INSERT INTO public.workouts (pool_id, class_id, workout_date, duration_minutes, total_distance, memo, quote)
  VALUES (v_pool_id, v_class_id, '2026-09-14', 50, 1500, '킥 판 잡고 발차기 중심 훈련', '오늘의 한 바퀴가 내일의 실력을 만든다.')
  RETURNING id INTO v_workout_14;

  INSERT INTO public.workout_sets (workout_id, sequence, distance, description) VALUES
  (v_workout_14, 1, 300, '웜업 자유형'),
  (v_workout_14, 2, 400, '자유형 킥 + 풀'),
  (v_workout_14, 3, 300, '배영 롤링 드릴'),
  (v_workout_14, 4, 300, '평영 타이밍 연습'),
  (v_workout_14, 5, 200, '다운');

  -- Workout 2: 2026-09-16 (1,600m)
  INSERT INTO public.workouts (pool_id, class_id, workout_date, duration_minutes, total_distance, memo, quote)
  VALUES (v_pool_id, v_class_id, '2026-09-16', 55, 1600, '인터벌 100m x 6개 페이스 유지', '빠르게보다 정확하게.')
  RETURNING id INTO v_workout_16;

  INSERT INTO public.workout_sets (workout_id, sequence, distance, description) VALUES
  (v_workout_16, 1, 300, '웜업'),
  (v_workout_16, 2, 600, '자유형 인터벌 100m x 6'),
  (v_workout_16, 3, 400, '개인혼영 100m x 4'),
  (v_workout_16, 4, 300, '쿨다운');

  -- Workout 3: 2026-09-18 저녁 수영 (1,750m)
  INSERT INTO public.workouts (pool_id, class_id, workout_date, duration_minutes, total_distance, memo, quote)
  VALUES (v_pool_id, v_class_id, '2026-09-18', 60, 1750, '금요일 불태우기! IM 세트와 접영 피칭 호흡', '물속에서는 꾸준함이 가장 강한 힘이다.')
  RETURNING id INTO v_workout_18a;

  INSERT INTO public.workout_sets (workout_id, sequence, distance, description) VALUES
  (v_workout_18a, 1, 200, '웜업'),
  (v_workout_18a, 2, 100, '돌핀킥 잠영'),
  (v_workout_18a, 3, 400, '자유형 지속주'),
  (v_workout_18a, 4, 300, '접영 50m x 6'),
  (v_workout_18a, 5, 200, '배영 하이엘보'),
  (v_workout_18a, 6, 400, 'IM 100m x 4'),
  (v_workout_18a, 7, 150, '쿨다운');

  -- Workout 4: 2026-09-18 자유 수영 (1,000m)
  INSERT INTO public.workouts (pool_id, NULL, '2026-09-18', 35, 1000, '수업 후 개인 자유수영 롱 디스턴스', '한 번의 스트로크도 헛되지 않는다.')
  RETURNING id INTO v_workout_18b;

  INSERT INTO public.workout_sets (workout_id, sequence, distance, description) VALUES
  (v_workout_18b, 1, 500, '페이스 유지 장거리'),
  (v_workout_18b, 2, 300, '글라이딩 평영'),
  (v_workout_18b, 3, 200, '다운');
END $$;

