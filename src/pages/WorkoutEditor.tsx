import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Save, 
  Gauge, 
  Clock, 
  BookOpen, 
  Sparkles,
  Loader2 
} from 'lucide-react';
import { workoutService } from '../services/workoutService';
import { Pool, ClassInfo } from '../types/database';
import { useAuth } from '../context/AuthContext';
import { calculateTotalDistance, formatDistance } from '../utils/distance';
import { getRandomQuote } from '../utils/quotes';

interface SetFormState {
  sequence: number;
  content: string;
  distance: number;
}

export const WorkoutEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const isEdit = Boolean(id);
  const defaultDate = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const [workoutDate, setWorkoutDate] = useState(defaultDate);
  const [poolId, setPoolId] = useState('');
  const [classId, setClassId] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [memo, setMemo] = useState('');
  const [quote, setQuote] = useState('');
  
  const [sets, setSets] = useState<SetFormState[]>([
    { sequence: 1, content: '웜업 자유형', distance: 200 }
  ]);

  const [pools, setPools] = useState<Pool[]>([]);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }

    Promise.all([
      workoutService.getPools(),
      workoutService.getClasses(),
      isEdit && id ? workoutService.getAllWorkouts() : Promise.resolve([])
    ]).then(([pList, cList, allWorkouts]) => {
      setPools(pList);
      setClasses(cList);

      if (pList.length > 0 && !poolId) {
        setPoolId(pList[0].id);
      }

      if (isEdit && id) {
        const target = allWorkouts.find(w => w.id === id);
        if (target) {
          setWorkoutDate(target.workout_date);
          setPoolId(target.pool_id);
          setClassId(target.class_id || '');
          setDurationMinutes(target.duration_minutes);
          setMemo(target.memo || '');
          setQuote(target.quote || '');
          if (target.sets && target.sets.length > 0) {
            setSets(target.sets.map((s, idx) => ({
              sequence: s.sequence || idx + 1,
              content: s.description || '',
              distance: s.distance,
            })));
          }
        }
      } else {
        setQuote(getRandomQuote());
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [id, isAdmin]);

  // Dynamic Sets management
  const handleAddSet = () => {
    setSets(prev => [
      ...prev,
      {
        sequence: prev.length + 1,
        content: '',
        distance: 200,
      }
    ]);
  };

  const handleRemoveSet = (index: number) => {
    if (sets.length <= 1) {
      alert('최소 1개의 세트가 필요합니다.');
      return;
    }
    setSets(prev => prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, sequence: i + 1 })));
  };

  const handleSetChange = (index: number, field: keyof SetFormState, value: any) => {
    setSets(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  // Automatic distance calculation
  const totalDistance = calculateTotalDistance(sets);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!poolId) {
      alert('수영장을 선택해주세요.');
      return;
    }

    try {
      setSaving(true);
      await workoutService.saveWorkout(
        {
          id: isEdit ? id : undefined,
          pool_id: poolId,
          class_id: classId || null,
          workout_date: workoutDate,
          duration_minutes: durationMinutes,
          memo,
          quote: quote || getRandomQuote(),
        },
        sets.map((set) => ({
          sequence: set.sequence,
          distance: set.distance,
          description: set.content,
        }))
      );
      navigate(`/workouts/${workoutDate}`);
    } catch (err) {
      console.error(err);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-16 flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-ocean-600" />
        <span className="text-xs font-semibold">데이터를 불러오는 중...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-8">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition px-3 py-2 rounded-xl bg-white border border-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>대시보드로 돌아가기</span>
        </Link>
        <h1 className="text-lg font-black text-slate-900">
          {isEdit ? '운동 기록 수정' : '새 수영 운동 기록'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Info Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-ocean-600" />
            <span>기본 운동 정보</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                운동 날짜 *
              </label>
              <input
                type="date"
                required
                value={workoutDate}
                onChange={(e) => setWorkoutDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                운동 시간 (분) *
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="number"
                  required
                  min="1"
                  max="300"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                수영장 *
              </label>
              <select
                value={poolId}
                onChange={(e) => setPoolId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
              >
                {pools.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.length}m)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                수업 선택 (선택사항)
              </label>
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
              >
                <option value="">자유수영 (수업 없음)</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.days})</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              운동 메모 / 피드백
            </label>
            <textarea
              rows={2}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="예: 킥 판 잡고 발차기 중심 훈련, 인터벌 페이스 유지..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-ocean-600" />
                <span>오늘의 수영 한마디 (리포트용)</span>
              </span>
              <button
                type="button"
                onClick={() => setQuote(getRandomQuote())}
                className="text-[11px] text-ocean-600 hover:underline font-semibold"
              >
                랜덤 새로고침
              </button>
            </label>
            <input
              type="text"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
            />
          </div>
        </div>

        {/* Dynamic Sets Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-ocean-600" />
              <span>운동 세트 설정</span>
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">자동 합산:</span>
              <span className="text-sm font-black text-ocean-600 bg-ocean-50 px-2.5 py-1 rounded-lg">
                {formatDistance(totalDistance)}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {sets.map((set, index) => (
              <div
                key={index}
                className="p-3 sm:p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-black text-slate-400">
                    SET {String(set.sequence).padStart(2, '0')}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSet(index)}
                    className="text-slate-400 hover:text-rose-600 transition p-1"
                    title="세트 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">
                      운동 내용
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="예: 자유형 캐치 드릴 4바퀴"
                      value={set.content}
                      onChange={(e) => handleSetChange(index, 'content', e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">
                      거리 (m) *
                    </label>
                    <input
                      type="number"
                      required
                      step="25"
                      min="25"
                      value={set.distance}
                      onChange={(e) => handleSetChange(index, 'distance', Number(e.target.value))}
                      className="w-full px-2.5 py-2 rounded-lg border border-slate-200 text-xs font-black text-ocean-800 bg-white"
                    />
                  </div>

                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddSet}
            className="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-200 hover:border-ocean-400 hover:bg-ocean-50 text-xs font-bold text-slate-600 hover:text-ocean-700 transition flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>운동 세트 추가</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-center text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex-2 py-3 px-4 rounded-xl bg-ocean-600 hover:bg-ocean-700 text-white text-xs font-bold shadow-md shadow-ocean-600/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>저장 중...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEdit ? '수정 내용 저장' : '운동 기록 등록하기'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
