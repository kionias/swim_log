import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MonthSummary } from '../components/Calendar/MonthSummary';
import { ClassFilter } from '../components/Calendar/ClassFilter';
import { Calendar } from '../components/Calendar/Calendar';
import { workoutService } from '../services/workoutService';
import { ClassInfo, DailySummary, MonthlyStats, WorkoutWithDetails } from '../types/database';
import { formatKoreanDate, formatYearMonth } from '../utils/date';
import { formatDistance } from '../utils/distance';
import { Loader2 } from 'lucide-react';

export const Home: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(9);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [workouts, setWorkouts] = useState<WorkoutWithDetails[]>([]);
  const [dailySummaries, setDailySummaries] = useState<Record<string, DailySummary>>({});
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats>({
    workout_count: 0,
    total_distance: 0,
    avg_distance: 0,
    max_distance: 0,
    total_duration_minutes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    workoutService.getClasses().then(setClasses).catch(console.error);
  }, []);

  useEffect(() => {
    setSelectedFilter(searchParams.get('class') || 'all');
  }, [searchParams]);

  const handleClassFilterChange = (filterId: string) => {
    setSelectedFilter(filterId);
    const nextParams = new URLSearchParams(searchParams);
    if (filterId === 'all') {
      nextParams.delete('class');
    } else {
      nextParams.set('class', filterId);
    }
    setSearchParams(nextParams, { replace: true });
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      workoutService.getWorkoutsForMonth(year, month, selectedFilter),
      workoutService.getMonthlyStats(year, month, selectedFilter),
    ]).then(([monthWorkouts, stats]) => {
      if (!isMounted) return;

      const summaries: Record<string, DailySummary> = {};
      monthWorkouts.forEach((w) => {
        const d = w.workout_date;
        if (!summaries[d]) {
          summaries[d] = {
            workout_date: d,
            total_distance: 0,
            workout_count: 0,
            workouts: [],
          };
        }
        summaries[d].total_distance += Number(w.total_distance) || 0;
        summaries[d].workout_count += 1;
        summaries[d].workouts.push(w);
      });

      setWorkouts(monthWorkouts);
      setDailySummaries(summaries);
      setMonthlyStats(stats);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [year, month, selectedFilter]);

  const handlePrevMonth = () => {
    if (month === 1) {
      setYear((y) => y - 1);
      setMonth(12);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setYear((y) => y + 1);
      setMonth(1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const handleToday = () => {
    const today = new Date();
    setYear(today.getFullYear());
    setMonth(today.getMonth() + 1);
  };

  const sortedWorkouts = [...workouts].sort((a, b) => b.workout_date.localeCompare(a.workout_date));

  return (
    <div className="space-y-4 animate-fade-in">
      <MonthSummary stats={monthlyStats} monthName={formatYearMonth(year, month)} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-xs">
          <button
            type="button"
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition ${
              viewMode === 'calendar' ? 'bg-ocean-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            [캘린더]
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition ${
              viewMode === 'list' ? 'bg-ocean-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            [목록]
          </button>
        </div>

        <ClassFilter
          classes={classes}
          selectedFilter={selectedFilter}
          onSelectFilter={handleClassFilterChange}
        />
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-ocean-600" />
          <span className="text-xs font-semibold">운동 기록을 불러오는 중...</span>
        </div>
      ) : viewMode === 'calendar' ? (
        <Calendar
          year={year}
          month={month}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onToday={handleToday}
          dailySummaries={dailySummaries}
        />
      ) : (
        <div className="space-y-3">
          {sortedWorkouts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
              해당 월에 등록된 운동 기록이 없습니다.
            </div>
          ) : (
            sortedWorkouts.map((workout) => (
              <Link
                key={workout.id}
                to={`/workouts/${workout.workout_date}`}
                className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-ocean-200 hover:shadow-md"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-xs font-bold text-ocean-600">
                      {formatKoreanDate(workout.workout_date, true)}
                    </div>
                    <div className="mt-1 text-sm font-bold text-slate-800">
                      {workout.class?.name || '자유수영'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] uppercase font-bold text-slate-400">거리</div>
                    <div className="text-lg font-black text-ocean-700">{formatDistance(workout.total_distance)}</div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="rounded-full bg-slate-100 px-2 py-1">{workout.pool?.name || '수영장 미지정'}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-1">세트 {workout.sets?.length || 0}개</span>
                  <span className="rounded-full bg-slate-100 px-2 py-1">{workout.duration_minutes}분</span>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
};
