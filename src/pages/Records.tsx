import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Award, Zap, Timer, Flame, ArrowRight, Loader2 } from 'lucide-react';
import { workoutService } from '../services/workoutService';
import { WorkoutWithDetails } from '../types/database';
import { formatDistance, formatDuration } from '../utils/distance';
import { formatKoreanDate } from '../utils/date';

export const Records: React.FC = () => {
  const [workouts, setWorkouts] = useState<WorkoutWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    workoutService.getAllWorkouts()
      .then((data) => {
        setWorkouts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-16 flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-ocean-600" />
        <span className="text-xs font-semibold">명예의 전당 기록을 불러오는 중...</span>
      </div>
    );
  }

  // Calculate Best Records
  // 1. Longest Single Day Distance (aggregating multi-workouts on same day)
  const dayMap: Record<string, number> = {};
  workouts.forEach(w => {
    dayMap[w.workout_date] = (dayMap[w.workout_date] || 0) + (w.total_distance || 0);
  });
  
  let bestDayDate = '';
  let bestDayDistance = 0;
  Object.entries(dayMap).forEach(([d, dist]) => {
    if (dist > bestDayDistance) {
      bestDayDistance = dist;
      bestDayDate = d;
    }
  });

  // 2. Longest Single Workout
  const longestWorkout = workouts.reduce<WorkoutWithDetails | null>((best, cur) => {
    if (!best || cur.total_distance > best.total_distance) return cur;
    return best;
  }, null);

  // 3. Longest Duration Workout
  const longestDuration = workouts.reduce<WorkoutWithDetails | null>((best, cur) => {
    if (!best || cur.duration_minutes > best.duration_minutes) return cur;
    return best;
  }, null);

  // 4. Longest Single Set
  let longestSetDistance = 0;
  let longestSetContent = '';
  workouts.forEach(w => {
    (w.sets || []).forEach(s => {
      if (s.distance > longestSetDistance) {
        longestSetDistance = s.distance;
        longestSetContent = s.description || '';
      }
    });
  });

  // Top 5 workouts by distance
  const topWorkouts = [...workouts]
    .sort((a, b) => b.total_distance - a.total_distance)
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-ocean-600 uppercase tracking-wider block">
          HALL OF FAME
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span>명예의 전당 & 최고 기록</span>
          <Trophy className="w-6 h-6 text-amber-500" />
        </h1>
      </div>

      {/* Record Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Record 1: Longest Daily Total */}
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white p-5 rounded-2xl border border-amber-200/80 shadow-xs relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 mb-3">
            <Trophy className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block mb-0.5">
            1일 최장 기록
          </span>
          <p className="text-2xl font-black text-slate-900 mb-1">
            {formatDistance(bestDayDistance)}
          </p>
          <p className="text-xs text-slate-500 font-medium">
            {bestDayDate ? formatKoreanDate(bestDayDate, false) : '-'}
          </p>
        </div>

        {/* Record 2: Longest Single Session */}
        <div className="bg-gradient-to-br from-ocean-500/10 via-ocean-500/5 to-white p-5 rounded-2xl border border-ocean-200/80 shadow-xs relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-ocean-600 text-white flex items-center justify-center shadow-md shadow-ocean-600/20 mb-3">
            <Award className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-ocean-900 uppercase tracking-wider block mb-0.5">
            단일 세션 최고 거리
          </span>
          <p className="text-2xl font-black text-slate-900 mb-1">
            {longestWorkout ? formatDistance(longestWorkout.total_distance) : '0m'}
          </p>
          <p className="text-xs text-slate-500 font-medium">
            {longestWorkout ? formatKoreanDate(longestWorkout.workout_date, false) : '-'}
          </p>
        </div>

        {/* Record 3: Longest Duration */}
        <div className="bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-white p-5 rounded-2xl border border-indigo-200/80 shadow-xs relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 mb-3">
            <Timer className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider block mb-0.5">
            최장 운동 시간
          </span>
          <p className="text-2xl font-black text-slate-900 mb-1">
            {longestDuration ? formatDuration(longestDuration.duration_minutes) : '0분'}
          </p>
          <p className="text-xs text-slate-500 font-medium">
            {longestDuration ? formatKoreanDate(longestDuration.workout_date, false) : '-'}
          </p>
        </div>

        {/* Record 4: Longest Single Set */}
        <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-white p-5 rounded-2xl border border-emerald-200/80 shadow-xs relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 mb-3">
            <Zap className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block mb-0.5">
            단일 세트 최장 거리
          </span>
          <p className="text-2xl font-black text-slate-900 mb-1">
            {formatDistance(longestSetDistance)}
          </p>
          <p className="text-xs text-slate-500 font-medium truncate">
            {longestSetContent || '운동 내용 미입력'}
          </p>
        </div>
      </div>

      {/* Top Workouts List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>최고 기록 TOP 5 세션</span>
          </h3>
        </div>

        <div className="divide-y divide-slate-100">
          {topWorkouts.map((workout, rank) => (
            <Link
              key={workout.id}
              to={`/workouts/${workout.workout_date}`}
              className="py-3 sm:py-4 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl transition group"
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                  rank === 0 
                    ? 'bg-amber-100 text-amber-700' 
                    : rank === 1 
                    ? 'bg-slate-200 text-slate-700' 
                    : rank === 2 
                    ? 'bg-amber-50 text-amber-800' 
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {rank + 1}
                </span>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-slate-800">
                      {formatKoreanDate(workout.workout_date, true)}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {workout.class?.name || '자유수영'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {workout.pool?.name} · {formatDuration(workout.duration_minutes)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-base sm:text-lg font-black text-ocean-700">
                  {formatDistance(workout.total_distance)}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-ocean-600 transition group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

