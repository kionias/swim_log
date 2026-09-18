import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Edit2, Trash2, BookOpen, Quote } from 'lucide-react';
import { WorkoutWithDetails } from '../../types/database';
import { formatDistance, formatDuration } from '../../utils/distance';
import { WorkoutSetList } from './WorkoutSetList';

interface WorkoutCardProps {
  workout: WorkoutWithDetails;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workout,
  isAdmin = false,
  onDelete,
}) => {
  const className = workout.class?.name || '자유수영';
  const poolName = workout.pool?.name || '수영장 미지정';
  const poolLength = workout.pool?.length ? `${workout.pool.length}m` : '25m';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition hover:shadow-md">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-50/70 to-white">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-ocean-100 text-ocean-800">
              {className}
            </span>
            {workout.class?.days && (
              <span className="text-[11px] font-semibold text-slate-500">
                {workout.class.days}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {poolName} ({poolLength})
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {formatDuration(workout.duration_minutes)}
            </span>
          </div>
        </div>

        {/* Total distance for this specific workout & Admin actions */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">
              DISTANCE
            </span>
            <span className="text-2xl font-black text-ocean-600 tracking-tight">
              {formatDistance(workout.total_distance)}
            </span>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
              <Link
                to={`/admin/workouts/${workout.id}/edit`}
                title="수정"
                className="p-1.5 rounded-lg text-slate-500 hover:text-ocean-600 hover:bg-ocean-50 transition"
              >
                <Edit2 className="w-4 h-4" />
              </Link>
              {onDelete && (
                <button
                  onClick={() => onDelete(workout.id)}
                  title="삭제"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sets breakdown */}
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-ocean-600" />
            <span>운동 세트 ({workout.sets?.length || 0})</span>
          </h4>
        </div>

        <WorkoutSetList sets={workout.sets || []} />

        {/* Memo */}
        {workout.memo && (
          <div className="mt-4 p-3 rounded-xl bg-slate-50 text-xs text-slate-600 leading-relaxed border border-slate-100">
            <span className="font-bold text-slate-700 block mb-0.5">운동 메모:</span>
            {workout.memo}
          </div>
        )}

        {/* Quote */}
        {workout.quote && (
          <div className="mt-5 rounded-2xl border border-ocean-200 bg-ocean-50 p-4 shadow-xs sm:p-5">
            <div className="flex items-center gap-2 text-base font-black tracking-tight text-slate-700 sm:text-lg">
              <Quote className="h-5 w-5 text-ocean-600 sm:h-6 sm:w-6" />
              <span>오늘의 수영 한마디</span>
            </div>
            <p className="mt-3 break-words text-lg font-black italic leading-tight text-slate-800 sm:text-xl">
              “{workout.quote}”
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

