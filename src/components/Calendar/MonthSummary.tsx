import React from 'react';
import { Activity, Gauge, Flame, Award } from 'lucide-react';
import { MonthlyStats } from '../../types/database';
import { formatDistance } from '../../utils/distance';

interface MonthSummaryProps {
  stats: MonthlyStats;
  monthName: string;
}

export const MonthSummary: React.FC<MonthSummaryProps> = ({ stats, monthName }) => {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs mb-6">
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-ocean-600" />
          <span>{monthName} 수영 요약</span>
        </h2>
        <span className="text-xs text-slate-400 font-medium">
          총 {stats.workout_count}회 완료
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Workout Count */}
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>운동 횟수</span>
          </div>
          <p className="text-xl font-black text-slate-800 tracking-tight">
            {stats.workout_count}<span className="text-xs font-semibold text-slate-500 ml-0.5">회</span>
          </p>
        </div>

        {/* Total Distance */}
        <div className="bg-ocean-50/70 rounded-xl p-3 border border-ocean-100/70">
          <div className="flex items-center gap-1.5 text-xs text-ocean-700 font-semibold mb-1">
            <Gauge className="w-3.5 h-3.5 text-ocean-600" />
            <span>총 거리</span>
          </div>
          <p className="text-xl font-black text-ocean-800 tracking-tight">
            {formatDistance(stats.total_distance)}
          </p>
        </div>

        {/* Average Distance */}
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <Activity className="w-3.5 h-3.5 text-sky-500" />
            <span>평균 거리</span>
          </div>
          <p className="text-xl font-black text-slate-800 tracking-tight">
            {formatDistance(stats.avg_distance)}
          </p>
        </div>

        {/* Max Distance */}
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <Award className="w-3.5 h-3.5 text-emerald-500" />
            <span>최장 거리</span>
          </div>
          <p className="text-xl font-black text-slate-800 tracking-tight">
            {formatDistance(stats.max_distance)}
          </p>
        </div>
      </div>
    </div>
  );
};

