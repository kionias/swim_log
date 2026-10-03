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
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
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
    <div className="space-y-5 animate-fade-in">
      {/* Swimming Pool Hero Banner as recommended in ux_개선.png */}
      <div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-ocean-900 via-ocean-800 to-slate-900 p-6 sm:p-8 text-white shadow-lg"
        style={{
          backgroundImage: "url('/image/background_01.png')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-ocean-950/85 via-ocean-900/70 to-transparent" />
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs font-black uppercase tracking-widest text-cyan-300">
            Today's Swim Record
          </span>
          <h1 className="mt-1.5 text-2xl sm:text-4xl font-black leading-tight text-white tracking-tight">
            오늘도 수영하는<br />멋진 당신을 응원합니다.
          </h1>
          <p className="mt-2 text-xs sm:text-sm font-semibold text-ocean-100/90">
            물 위의 작은 도전이 더 큰 변화를 만듭니다.
          </p>
        </div>
      </div>

      <MonthSummary stats={monthlyStats} monthName={formatYearMonth(year, month)} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-xs">
          <button
            type="button"
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-1.5 text-xs font-extrabold rounded-md transition ${
              viewMode === 'calendar' ? 'bg-ocean-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            캘린더
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`px-4 py-1.5 text-xs font-extrabold rounded-md transition ${
              viewMode === 'list' ? 'bg-ocean-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            목록
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
                className="block rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs transition hover:border-ocean-300 hover:shadow-md"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-xs font-extrabold text-ocean-700">
                      {formatKoreanDate(workout.workout_date, true)}
                    </div>
                    <div className="mt-1 text-sm font-extrabold text-slate-900">
                      {workout.class?.name || '자유수영'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-400">TOTAL DISTANCE</div>
                    <div className="text-lg font-black text-ocean-600">{formatDistance(workout.total_distance)}</div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5">{workout.pool?.name || '수영장 미지정'}</span>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5">세트 {workout.sets?.length || 0}개</span>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5">{workout.duration_minutes}분</span>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
};
