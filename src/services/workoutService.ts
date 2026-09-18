import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  Workout,
  WorkoutSet,
  WorkoutWithDetails,
  Pool,
  ClassInfo,
  MonthlyStats,
} from '../types/database';
import {
  INITIAL_POOLS,
  INITIAL_CLASSES,
  INITIAL_WORKOUTS,
} from '../utils/mockData';
import { calculateTotalDistance } from '../utils/distance';
import { getQuoteForDate } from '../utils/quotes';

const STORAGE_KEYS = {
  WORKOUTS: 'swim_log_workouts',
  CLASSES: 'swim_log_classes',
  POOLS: 'swim_log_pools',
  VERSION: 'swim_log_data_version',
};

const LOCAL_DATA_VERSION = 'image-seed-v1';

function initLocalData() {
  if (localStorage.getItem(STORAGE_KEYS.VERSION) !== LOCAL_DATA_VERSION) {
    localStorage.removeItem(STORAGE_KEYS.WORKOUTS);
    localStorage.removeItem(STORAGE_KEYS.CLASSES);
    localStorage.removeItem(STORAGE_KEYS.POOLS);
    localStorage.setItem(STORAGE_KEYS.VERSION, LOCAL_DATA_VERSION);
  }

  if (!localStorage.getItem(STORAGE_KEYS.WORKOUTS)) {
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(INITIAL_WORKOUTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CLASSES)) {
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(INITIAL_CLASSES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.POOLS)) {
    localStorage.setItem(STORAGE_KEYS.POOLS, JSON.stringify(INITIAL_POOLS));
  }
}

export const workoutService = {
  async getPools(): Promise<Pool[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('pools').select('*').order('name');
      if (!error && data) return data;
    }
    initLocalData();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.POOLS) || '[]');
  },

  async savePool(poolData: Partial<Pool> & { id?: string }): Promise<Pool> {
    if (isSupabaseConfigured && supabase) {
      if (poolData.id) {
        const { data, error } = await supabase
          .from('pools')
          .update({
            name: poolData.name,
            location: poolData.location,
            length: poolData.length,
          })
          .eq('id', poolData.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      }

      const { data, error } = await supabase
        .from('pools')
        .insert({
          name: poolData.name,
          location: poolData.location,
          length: poolData.length,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    initLocalData();
    const list: Pool[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.POOLS) || '[]');
    const nextPool: Pool = {
      id: poolData.id || `pool-${Date.now()}`,
      name: poolData.name || '새 수영장',
      location: poolData.location || '',
      length: Number(poolData.length) || 25,
      created_at: new Date().toISOString(),
    };

    const existingIndex = list.findIndex((pool) => pool.id === nextPool.id);
    if (existingIndex >= 0) {
      list[existingIndex] = nextPool;
    } else {
      list.push(nextPool);
    }

    localStorage.setItem(STORAGE_KEYS.POOLS, JSON.stringify(list));
    return nextPool;
  },

  async deletePool(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('pools').delete().eq('id', id);
      if (error) throw error;
      return;
    }

    initLocalData();
    const list: Pool[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.POOLS) || '[]');
    const filtered = list.filter((pool) => pool.id !== id);
    localStorage.setItem(STORAGE_KEYS.POOLS, JSON.stringify(filtered));
  },

  async getClasses(): Promise<ClassInfo[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('classes').select('*').order('name');
      if (!error && data) return data;
    }
    initLocalData();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CLASSES) || '[]');
  },

  async saveClass(classData: Partial<ClassInfo> & { id?: string }): Promise<ClassInfo> {
    if (isSupabaseConfigured && supabase) {
      if (classData.id) {
        const { data, error } = await supabase
          .from('classes')
          .update({
            pool_id: classData.pool_id,
            name: classData.name,
            days: classData.days,
            start_time: classData.start_time,
            end_time: classData.end_time,
            description: classData.description,
            is_active: classData.is_active,
          })
          .eq('id', classData.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      }

      const { data, error } = await supabase
        .from('classes')
        .insert({
          pool_id: classData.pool_id,
          name: classData.name,
          days: classData.days,
          start_time: classData.start_time,
          end_time: classData.end_time,
          description: classData.description,
          is_active: classData.is_active ?? true,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    initLocalData();
    const list: ClassInfo[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLASSES) || '[]');
    const nextClass: ClassInfo = {
      id: classData.id || `class-${Date.now()}`,
      pool_id: classData.pool_id || '',
      name: classData.name || '새 수업',
      days: classData.days || '',
      start_time: classData.start_time || '00:00',
      end_time: classData.end_time || '00:00',
      description: classData.description || '',
      is_active: classData.is_active ?? true,
      created_at: new Date().toISOString(),
    };

    const existingIndex = list.findIndex((item) => item.id === nextClass.id);
    if (existingIndex >= 0) {
      list[existingIndex] = nextClass;
    } else {
      list.push(nextClass);
    }

    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(list));
    return nextClass;
  },

  async deleteClass(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('classes').delete().eq('id', id);
      if (error) throw error;
      return;
    }

    initLocalData();
    const list: ClassInfo[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLASSES) || '[]');
    const filtered = list.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(filtered));
  },

  async getAllWorkouts(): Promise<WorkoutWithDetails[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('workouts')
        .select(`
          *,
          pool:pools(*),
          class:classes(*),
          sets:workout_sets(*)
        `)
        .order('workout_date', { ascending: false });
      if (!error && data) {
        return data.map((w: any) => ({
          ...w,
          sets: (w.sets || []).sort((a: WorkoutSet, b: WorkoutSet) => a.sequence - b.sequence),
        }));
      }
    }
    initLocalData();
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.WORKOUTS) || '[]');
    return stored.sort((a: WorkoutWithDetails, b: WorkoutWithDetails) =>
      b.workout_date.localeCompare(a.workout_date)
    );
  },

  async getWorkoutsByDate(dateStr: string): Promise<WorkoutWithDetails[]> {
    const all = await this.getAllWorkouts();
    return all.filter((w) => w.workout_date === dateStr);
  },

  async getWorkoutsForMonth(year: number, month: number, classFilter?: string): Promise<WorkoutWithDetails[]> {
    const all = await this.getAllWorkouts();
    const prefix = `${year}-${String(month).padStart(2, '0')}`;
    return all.filter((w) => {
      const matchMonth = w.workout_date.startsWith(prefix);
      if (!matchMonth) return false;
      if (!classFilter || classFilter === 'all') return true;
      if (classFilter === 'none') return !w.class_id;
      return w.class_id === classFilter;
    });
  },

  async saveWorkout(
    workoutData: Omit<Workout, 'id' | 'total_distance'> & { id?: string },
    sets: Omit<WorkoutSet, 'id' | 'workout_id'>[]
  ): Promise<WorkoutWithDetails> {
    const totalDistance = calculateTotalDistance(sets);
    const quote = workoutData.quote || getQuoteForDate(workoutData.workout_date);

    if (isSupabaseConfigured && supabase) {
      let workoutId = workoutData.id;

      if (workoutId) {
        const { error: wErr } = await supabase
          .from('workouts')
          .update({
            class_id: workoutData.class_id || null,
            pool_id: workoutData.pool_id,
            workout_date: workoutData.workout_date,
            duration_minutes: workoutData.duration_minutes,
            total_distance: totalDistance,
            memo: workoutData.memo,
            quote,
            updated_at: new Date().toISOString(),
          })
          .eq('id', workoutId);
        if (wErr) throw wErr;

        await supabase.from('workout_sets').delete().eq('workout_id', workoutId);
      } else {
        const { data: newW, error: wErr } = await supabase
          .from('workouts')
          .insert({
            class_id: workoutData.class_id || null,
            pool_id: workoutData.pool_id,
            workout_date: workoutData.workout_date,
            duration_minutes: workoutData.duration_minutes,
            total_distance: totalDistance,
            memo: workoutData.memo,
            quote,
          })
          .select()
          .single();
        if (wErr) throw wErr;
        workoutId = newW.id;
      }

      if (sets.length > 0 && workoutId) {
        const setsToInsert = sets.map((s, idx) => ({
          workout_id: workoutId,
          sequence: s.sequence || idx + 1,
          distance: Number(s.distance) || 0,
          laps: s.laps || null,
          description: s.description || '',
        }));
        const { error: sErr } = await supabase.from('workout_sets').insert(setsToInsert);
        if (sErr) throw sErr;
      }

      const updatedList = await this.getAllWorkouts();
      return updatedList.find((w) => w.id === workoutId)!;
    }

    initLocalData();
    const list: WorkoutWithDetails[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.WORKOUTS) || '[]');
    const pools: Pool[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.POOLS) || '[]');
    const classes: ClassInfo[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLASSES) || '[]');

    const workoutId = workoutData.id || `w-${Date.now()}`;
    const pool = pools.find((p) => p.id === workoutData.pool_id);
    const cls = classes.find((c) => c.id === workoutData.class_id) || null;

    const formattedSets: WorkoutSet[] = sets.map((s, idx) => ({
      id: `s-${Date.now()}-${idx}`,
      workout_id: workoutId,
      sequence: s.sequence || idx + 1,
      distance: Number(s.distance) || 0,
      laps: s.laps,
      description: s.description || '',
    }));

    const fullWorkout: WorkoutWithDetails = {
      id: workoutId,
      class_id: workoutData.class_id || null,
      pool_id: workoutData.pool_id,
      workout_date: workoutData.workout_date,
      duration_minutes: Number(workoutData.duration_minutes) || 0,
      total_distance: totalDistance,
      memo: workoutData.memo || '',
      quote,
      pool,
      class: cls,
      sets: formattedSets,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const existingIndex = list.findIndex((w) => w.id === workoutId);
    if (existingIndex >= 0) {
      list[existingIndex] = fullWorkout;
    } else {
      list.push(fullWorkout);
    }

    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(list));
    return fullWorkout;
  },

  async deleteWorkout(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('workouts').delete().eq('id', id);
      if (error) throw error;
      return;
    }

    initLocalData();
    const list: WorkoutWithDetails[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.WORKOUTS) || '[]');
    const filtered = list.filter((w) => w.id !== id);
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(filtered));
  },

  async getMonthlyStats(year: number, month: number, classFilter?: string): Promise<MonthlyStats> {
    const workouts = await this.getWorkoutsForMonth(year, month, classFilter);
    const workoutCount = workouts.length;
    const totalDistance = workouts.reduce((sum, w) => sum + (w.total_distance || 0), 0);
    const avgDistance = workoutCount > 0 ? Math.round(totalDistance / workoutCount) : 0;
    const maxDistance = workouts.length > 0 ? Math.max(...workouts.map((w) => w.total_distance || 0)) : 0;
    const totalDuration = workouts.reduce((sum, w) => sum + (w.duration_minutes || 0), 0);

    return {
      workout_count: workoutCount,
      total_distance: totalDistance,
      avg_distance: avgDistance,
      max_distance: maxDistance,
      total_duration_minutes: totalDuration,
    };
  },
};

