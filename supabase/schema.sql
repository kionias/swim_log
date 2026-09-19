-- SWIM LOG Supabase PostgreSQL schema
-- This file creates tables, constraints, indexes, and timestamp behavior only.
-- RLS policies are intentionally provided separately in the project documentation.

-- 0. UUID generation used by the table defaults.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Pools
CREATE TABLE IF NOT EXISTS public.pools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT,
  length INTEGER NOT NULL DEFAULT 25,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Classes / training groups
-- One pool can have multiple classes, including the 월수금반 and 화목반 used by SWIM LOG.
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pool_id UUID NOT NULL REFERENCES public.pools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  days TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Workouts
-- workout_date is intentionally not unique: one day may contain multiple workouts.
CREATE TABLE IF NOT EXISTS public.workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  pool_id UUID NOT NULL REFERENCES public.pools(id) ON DELETE RESTRICT,
  workout_date DATE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  total_distance INTEGER NOT NULL DEFAULT 0,
  memo TEXT,
  quote TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Workout sets
-- There is intentionally no stroke column. The current React UI stores the full
-- 운동 내용 in description and the distance in distance.
CREATE TABLE IF NOT EXISTS public.workout_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  sequence INTEGER NOT NULL DEFAULT 1,
  distance INTEGER NOT NULL,
  laps INTEGER,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. updated_at behavior for workouts updated by the application.
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'workouts_set_updated_at'
      AND tgrelid = 'public.workouts'::regclass
  ) THEN
    CREATE TRIGGER workouts_set_updated_at
    BEFORE UPDATE ON public.workouts
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();
  END IF;
END;
$$;

-- 6. Indexes used by the React service queries.
CREATE INDEX IF NOT EXISTS idx_pools_name
  ON public.pools(name);

CREATE INDEX IF NOT EXISTS idx_classes_pool_id
  ON public.classes(pool_id);

CREATE INDEX IF NOT EXISTS idx_classes_name
  ON public.classes(name);

CREATE INDEX IF NOT EXISTS idx_workouts_date
  ON public.workouts(workout_date);

CREATE INDEX IF NOT EXISTS idx_workouts_class_id
  ON public.workouts(class_id);

CREATE INDEX IF NOT EXISTS idx_workouts_pool_id
  ON public.workouts(pool_id);

CREATE INDEX IF NOT EXISTS idx_workout_sets_workout_sequence
  ON public.workout_sets(workout_id, sequence);
