import React from 'react';
import { WorkoutSet } from '../../types/database';
import { formatDistance } from '../../utils/distance';

interface WorkoutSetListProps {
  sets: WorkoutSet[];
}

export const WorkoutSetList: React.FC<WorkoutSetListProps> = ({ sets }) => {
  if (!sets || sets.length === 0) {
    return <p className="text-xs text-slate-400 py-2">등록된 세트 정보가 없습니다.</p>;
  }

  return (
    <div className="space-y-2">
      {sets.map((set, idx) => {
        return (
          <div
            key={set.id || idx}
            className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-slate-50 transition"
          >
            <div className="min-w-0 flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-slate-400 w-5">
                {String(set.sequence || idx + 1).padStart(2, '0')}
              </span>
              <span className="min-w-0 truncate text-xs sm:text-sm font-medium text-slate-700">
                {set.description || '운동 내용 미입력'}
              </span>
            </div>

            {/* Distance */}
            <div className="text-right">
              <span className="text-xs sm:text-sm font-black text-slate-900">
                {formatDistance(set.distance)}
              </span>
              {set.laps && (
                <span className="block text-[10px] text-slate-400 font-medium">
                  {set.laps}바퀴
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

