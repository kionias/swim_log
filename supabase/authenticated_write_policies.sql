-- Allows signed-in Supabase Auth users to manage SWIM LOG data.
-- Anonymous visitors retain read-only access through the separate read policies.

-- Pools
DROP POLICY IF EXISTS "authenticated can insert pools" ON public.pools;
CREATE POLICY "authenticated can insert pools"
ON public.pools FOR INSERT TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated can update pools" ON public.pools;
CREATE POLICY "authenticated can update pools"
ON public.pools FOR UPDATE TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated can delete pools" ON public.pools;
CREATE POLICY "authenticated can delete pools"
ON public.pools FOR DELETE TO authenticated
USING (true);

-- Classes
DROP POLICY IF EXISTS "authenticated can insert classes" ON public.classes;
CREATE POLICY "authenticated can insert classes"
ON public.classes FOR INSERT TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated can update classes" ON public.classes;
CREATE POLICY "authenticated can update classes"
ON public.classes FOR UPDATE TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated can delete classes" ON public.classes;
CREATE POLICY "authenticated can delete classes"
ON public.classes FOR DELETE TO authenticated
USING (true);

-- Workouts
DROP POLICY IF EXISTS "authenticated can insert workouts" ON public.workouts;
CREATE POLICY "authenticated can insert workouts"
ON public.workouts FOR INSERT TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated can update workouts" ON public.workouts;
CREATE POLICY "authenticated can update workouts"
ON public.workouts FOR UPDATE TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated can delete workouts" ON public.workouts;
CREATE POLICY "authenticated can delete workouts"
ON public.workouts FOR DELETE TO authenticated
USING (true);

-- Workout sets
DROP POLICY IF EXISTS "authenticated can insert workout sets" ON public.workout_sets;
CREATE POLICY "authenticated can insert workout sets"
ON public.workout_sets FOR INSERT TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated can update workout sets" ON public.workout_sets;
CREATE POLICY "authenticated can update workout sets"
ON public.workout_sets FOR UPDATE TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated can delete workout sets" ON public.workout_sets;
CREATE POLICY "authenticated can delete workout sets"
ON public.workout_sets FOR DELETE TO authenticated
USING (true);
