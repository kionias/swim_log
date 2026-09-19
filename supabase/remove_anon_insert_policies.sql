-- Removes only the anonymous INSERT policies created for one-time seeding.
-- Row Level Security remains enabled on every table.

DROP POLICY IF EXISTS "allow anon inserts" ON public.pools;
DROP POLICY IF EXISTS "allow anon inserts" ON public.classes;
DROP POLICY IF EXISTS "allow anon inserts" ON public.workouts;
DROP POLICY IF EXISTS "allow anon inserts" ON public.workout_sets;
