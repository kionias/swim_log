import React from 'react';
import { MonthlyStats } from '../../types/database';
import { formatDistance } from '../../utils/distance';

interface MonthSummaryProps {
  stats: MonthlyStats;
  monthName: string;
}

export const MonthSummary: React.FC<MonthSummaryProps> = ({ stats, monthName }) => {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-xs mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <span>{monthName} 수영 요약</span>
        </h2>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span>총 <strong className="text-ocean-700 font-black">{stats.workout_count}회</strong> 수영 기록</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3">
        {/* Workout Count */}
        <div className="flex flex-col justify-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">운동 횟수</span>
          <div className="mt-0.5 text-2xl font-black tracking-tight text-slate-900">
            {stats.workout_count}<span className="text-xs font-bold text-slate-500 ml-1">회</span>
          </div>
        </div>

        {/* Total Distance */}
        <div className="flex flex-col justify-center sm:border-l sm:border-slate-100 sm:pl-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ocean-700">총 거리</span>
          <div className="mt-0.5 text-2xl font-black tracking-tight text-ocean-600">
            {formatDistance(stats.total_distance)}
          </div>
        </div>

        {/* Average Distance */}
        <div className="flex flex-col justify-center sm:border-l sm:border-slate-100 sm:pl-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">평균 거리</span>
          <div className="mt-0.5 text-2xl font-black tracking-tight text-slate-900">
            {formatDistance(stats.avg_distance)}
          </div>
        </div>

        {/* Max Distance */}
        <div className="flex flex-col justify-center sm:border-l sm:border-slate-100 sm:pl-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">최장 거리</span>
          <div className="mt-0.5 text-2xl font-black tracking-tight text-slate-900">
            {formatDistance(stats.max_distance)}
          </div>
        </div>
      </div>
    </div>
  );
};

