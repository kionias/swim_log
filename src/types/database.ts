export interface Pool {
  id: string;
  name: string;
  location: string;
  length: number; // in meters (e.g. 25)
  created_at?: string;
}

export interface ClassInfo {
  id: string;
  pool_id: string;
  name: string; // e.g. "저녁 수영 8시 연수반"
  days: string; // e.g. "월수금"
  start_time: string; // e.g. "20:00"
  end_time: string; // e.g. "21:00"
  description?: string;
  is_active: boolean;
  created_at?: string;
}

export interface WorkoutSet {
  id: string;
  workout_id: string;
  sequence: number;
  distance: number; // in meters
  laps?: number;
  description?: string;
}

export interface Workout {
  id: string;
  class_id?: string | null;
  pool_id: string;
  workout_date: string; // YYYY-MM-DD
  duration_minutes: number;
  total_distance: number; // in meters
  memo?: string;
  quote?: string;
  created_at?: string;
  updated_at?: string;
}

export interface WorkoutWithDetails extends Workout {
  pool?: Pool;
  class?: ClassInfo | null;
  sets: WorkoutSet[];
}

export interface DailySummary {
  workout_date: string;
  total_distance: number;
  workout_count: number;
  workouts: WorkoutWithDetails[];
}

export interface MonthlyStats {
  workout_count: number;
  total_distance: number;
  avg_distance: number;
  max_distance: number;
  total_duration_minutes: number;
}

