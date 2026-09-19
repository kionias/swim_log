import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Share2, 
  Download,
  PlusCircle, 
  Calendar as CalendarIcon, 
  Waves,
  Loader2 
} from 'lucide-react';
import { workoutService } from '../services/workoutService';
import { WorkoutWithDetails } from '../types/database';
import { formatKoreanDate } from '../utils/date';
import { formatDistance } from '../utils/distance';
import { WorkoutCard } from '../components/WorkoutCard/WorkoutCard';
import { ReportModal } from '../components/Report/ReportModal';
import { useAuth } from '../context/AuthContext';

export const WorkoutDetail: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const { isAdmin } = useAuth();

  const [workouts, setWorkouts] = useState<WorkoutWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isDirectDownloadOpen, setIsDirectDownloadOpen] = useState(false);

  const loadData = () => {
    if (!date) return;
    setLoading(true);
    workoutService.getWorkoutsByDate(date)
      .then((data) => {
        setWorkouts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [date]);

  const handleDeleteWorkout = async (id: string) => {
    if (!window.confirm('정말 이 운동 기록을 삭제하시겠습니까?')) return;
    try {
      await workoutService.deleteWorkout(id);
      loadData();
    } catch (err) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  if (!date) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500 mb-4">잘못된 접근입니다.</p>
        <Link to="/" className="px-4 py-2 bg-ocean-600 text-white rounded-xl text-sm font-bold">
          캘린더로 돌아가기
        </Link>
      </div>
    );
  }

  const totalDistance = workouts.reduce((sum, w) => sum + (w.total_distance || 0), 0);
  const totalSets = workouts.reduce((sum, w) => sum + (w.sets?.length || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top navigation & action bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-ocean-700 transition px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs hover:bg-slate-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>운동기록으로 돌아가기</span>
        </Link>

        <div className="flex items-center gap-2">
          {workouts.length > 0 && (
            <>
              <button
                onClick={() => setIsDirectDownloadOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-ocean-200 bg-ocean-50 px-3.5 py-2 text-xs font-bold text-ocean-700 transition hover:bg-ocean-100 sm:text-sm"
              >
                <Download className="w-4 h-4" />
                <span>PNG 저장</span>
              </button>
              <button
                onClick={() => setIsReportOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-ocean-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-ocean-600/20 transition hover:bg-ocean-700 sm:text-sm"
              >
                <Share2 className="w-4 h-4" />
                <span>운동 리포트 카드</span>
              </button>
            </>
          )}

          {isAdmin && (
            <Link
              to={`/admin/workouts/new?date=${date}`}
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-ocean-700 bg-ocean-50 border border-ocean-200 hover:bg-ocean-100 px-3 py-2 rounded-xl transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">이 날짜에 추가</span>
            </Link>
          )}
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-ocean-600" />
          <span className="text-xs font-semibold">운동 정보를 불러오는 중...</span>
        </div>
      ) : workouts.length === 0 ? (
        /* Empty State */
        <div className="rounded-2xl border border-slate-200/80 bg-white p-10 text-center shadow-xs sm:p-16">
          <div className="w-16 h-16 rounded-2xl bg-ocean-50 text-ocean-500 mx-auto flex items-center justify-center mb-4">
            <Waves className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-1">
            {formatKoreanDate(date, true)}
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            등록된 수영 운동 기록이 없습니다.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/"
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              운동기록으로 이동
            </Link>
            {isAdmin && (
              <Link
                to={`/admin/workouts/new?date=${date}`}
                className="px-4 py-2.5 rounded-xl bg-ocean-600 hover:bg-ocean-700 text-white text-xs font-bold transition shadow-md shadow-ocean-600/20"
              >
                운동 기록 추가하기
              </Link>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Daily Total Distance Highlight Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ocean-700 via-ocean-600 to-ocean-500 p-6 text-white shadow-xl shadow-ocean-600/15 sm:p-8">
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-ocean-200 text-xs sm:text-sm font-semibold mb-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{formatKoreanDate(date, true)}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  오늘의 총 수영 거리
                </h1>
                <p className="text-xs text-ocean-100/80 mt-1">
                  총 {totalSets}개의 운동 세트 완료
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/15 text-center sm:text-right">
                <span className="text-[11px] uppercase font-bold tracking-widest text-cyan-200 block">
                  TOTAL DISTANCE
                </span>
                <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                  {formatDistance(totalDistance)}
                </span>
              </div>
            </div>

            {/* Background water accents */}
            <div className="absolute -bottom-8 -right-8 w-44 h-44 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-0 right-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          </div>

          {/* List of workout cards on this date */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-800">
                상세 운동 목록 ({workouts.length}건)
              </h3>
            </div>

            {workouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                isAdmin={isAdmin}
                onDelete={handleDeleteWorkout}
              />
            ))}
          </div>
        </>
      )}

      {/* Shareable PNG Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        dateStr={date}
        workouts={workouts}
      />
      <ReportModal
        isOpen={isDirectDownloadOpen}
        onClose={() => setIsDirectDownloadOpen(false)}
        dateStr={date}
        workouts={workouts}
        downloadOnly
      />
    </div>
  );
};
