import React from 'react';
import { WorkoutSet } from '../../types/database';
import { formatDistance } from '../../utils/distance';

interface WorkoutSetListProps {
  sets: WorkoutSet[];
}

export const WorkoutSetList: React.FC<WorkoutSetListProps> = ({ sets }) => {
  if (!sets || sets.length === 0) {
    return <p className="text-xs text-slate-400 py-3 text-center">등록된 세트 정보가 없습니다.</p>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white">
      <div className="grid grid-cols-[44px_minmax(0,1fr)_80px] items-center bg-slate-50 px-3 py-2 text-xs font-extrabold text-slate-600 border-b border-slate-200/60 sm:grid-cols-[56px_minmax(0,1fr)_100px] sm:px-4">
        <div className="text-center">순서</div>
        <div>세트 내용</div>
        <div className="text-right">거리</div>
      </div>

      <div className="divide-y divide-slate-100">
        {sets.map((set, idx) => {
          const seq = String(set.sequence || idx + 1).padStart(2, '0');
          return (
            <div
              key={set.id || idx}
              className="grid grid-cols-[44px_minmax(0,1fr)_80px] items-center px-3 py-2.5 text-xs sm:text-sm transition-colors hover:bg-slate-50/80 sm:grid-cols-[56px_minmax(0,1fr)_100px] sm:px-4"
            >
              <div className="text-center">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-ocean-50 text-[11px] font-extrabold text-ocean-700">
                  {seq}
                </span>
              </div>
              <div className="min-w-0 pr-2">
                <span className="font-semibold text-slate-800 break-words">
                  {set.description || '운동 내용 미입력'}
                </span>
              </div>
              <div className="text-right">
                <span className="font-black text-ocean-700">
                  {formatDistance(set.distance)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

