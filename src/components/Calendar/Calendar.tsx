import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { generateCalendarDays, formatYearMonth } from '../../utils/date';
import { formatDistance } from '../../utils/distance';
import { DailySummary } from '../../types/database';

interface CalendarProps {
  year: number;
  month: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  dailySummaries: Record<string, DailySummary>; // dateKey -> summary
}

const WEEK_HEADERS = ['일', '월', '화', '수', '목', '금', '토'];

export const Calendar: React.FC<CalendarProps> = ({
  year,
  month,
  onPrevMonth,
  onNextMonth,
  onToday,
  dailySummaries,
}) => {
  const navigate = useNavigate();
  const calendarDays = generateCalendarDays(year, month);

  const handleDayClick = (dateKey: string) => {
    navigate(`/workouts/${dateKey}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Calendar Header with navigation */}
      <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold text-ocean-600 uppercase tracking-wider block">
            MONTHLY VIEW
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {formatYearMonth(year, month)}
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onToday}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>오늘</span>
          </button>
          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={onPrevMonth}
              aria-label="이전 달"
              className="p-2 text-slate-600 hover:bg-slate-100 transition border-r border-slate-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={onNextMonth}
              aria-label="다음 달"
              className="p-2 text-slate-600 hover:bg-slate-100 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/70 text-center py-2 text-xs font-bold">
        {WEEK_HEADERS.map((day, idx) => {
          const isSun = idx === 0;
          const isSat = idx === 6;
          return (
            <div
              key={day}
              className={
                isSun
                  ? 'text-rose-500'
                  : isSat
                  ? 'text-ocean-600'
                  : 'text-slate-500'
              }
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Calendar Days Grid */}
      <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
        {calendarDays.map((day) => {
          const summary = dailySummaries[day.dateKey];
          const hasWorkout = summary && summary.total_distance > 0;
          const isSun = day.dayOfWeek === 0;
          const isSat = day.dayOfWeek === 6;

          return (
            <div
              key={day.dateKey}
              onClick={() => handleDayClick(day.dateKey)}
              className={`min-h-[85px] sm:min-h-[110px] p-2 sm:p-2.5 flex flex-col justify-between transition-all cursor-pointer select-none group relative ${
                !day.isCurrentMonth
                  ? 'bg-slate-50/40 opacity-40'
                  : hasWorkout
                  ? 'bg-ocean-50/20 hover:bg-ocean-100/40'
                  : 'bg-white hover:bg-slate-50'
              } ${day.isToday ? 'ring-2 ring-inset ring-ocean-500/80' : ''}`}
            >
              {/* Day number top bar */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold leading-none inline-flex items-center justify-center w-6 h-6 rounded-full ${
                    day.isToday
                      ? 'bg-ocean-600 text-white shadow-xs'
                      : isSun
                      ? 'text-rose-600'
                      : isSat
                      ? 'text-ocean-600'
                      : 'text-slate-700'
                  }`}
                >
                  {day.dayNumber}
                </span>

                {/* Multiple workouts indicator badge */}
                {summary && summary.workout_count > 1 && (
                  <span
                    title={`${summary.workout_count}개 운동`}
                    className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800"
                  >
                    {summary.workout_count}건
                  </span>
                )}
              </div>

              {/* Distance content */}
              <div className="mt-1">
                {hasWorkout ? (
                  <div className="bg-ocean-600 text-white group-hover:bg-ocean-700 rounded-lg p-1 sm:p-1.5 text-center shadow-xs transition-colors">
                    <span className="block text-[11px] sm:text-xs font-black tracking-tight leading-tight">
                      {formatDistance(summary.total_distance)}
                    </span>
                  </div>
                ) : (
                  <div className="text-center py-1">
                    <span className="text-slate-300 text-xs font-semibold">-</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
