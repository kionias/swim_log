import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  PlusCircle,
  Edit2,
  Trash2,
  BookOpen,
  MapPin,
  Calendar as CalendarIcon,
  LogOut,
  Loader2,
  X,
} from 'lucide-react';
import { workoutService } from '../services/workoutService';
import { WorkoutWithDetails, ClassInfo, Pool } from '../types/database';
import { useAuth } from '../context/AuthContext';
import { formatDistance, formatDuration } from '../utils/distance';
import { formatKoreanDate } from '../utils/date';

export const AdminDashboard: React.FC = () => {
  const { isAdmin, userEmail, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'workouts' | 'classes' | 'pools'>('workouts');
  const [workouts, setWorkouts] = useState<WorkoutWithDetails[]>([]);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);

  const [classModalOpen, setClassModalOpen] = useState(false);
  const [poolModalOpen, setPoolModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassInfo | null>(null);
  const [editingPool, setEditingPool] = useState<Pool | null>(null);
  const [classForm, setClassForm] = useState({
    pool_id: '',
    name: '',
    days: '',
    start_time: '20:00',
    end_time: '21:00',
    description: '',
    is_active: true,
  });
  const [poolForm, setPoolForm] = useState({
    name: '',
    location: '',
    length: 25,
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }

    loadAll();
  }, [isAdmin]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [w, c, p] = await Promise.all([
        workoutService.getAllWorkouts(),
        workoutService.getClasses(),
        workoutService.getPools(),
      ]);
      setWorkouts(w);
      setClasses(c);
      setPools(p);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkout = async (id: string) => {
    if (!window.confirm('정말 이 운동 기록을 삭제하시겠습니까?')) return;
    try {
      await workoutService.deleteWorkout(id);
      loadAll();
    } catch (err) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const openAddClassModal = () => {
    setEditingClass(null);
    setClassForm({
      pool_id: pools[0]?.id || '',
      name: '',
      days: '',
      start_time: '20:00',
      end_time: '21:00',
      description: '',
      is_active: true,
    });
    setClassModalOpen(true);
  };

  const openEditClassModal = (cls: ClassInfo) => {
    setEditingClass(cls);
    setClassForm({
      pool_id: cls.pool_id,
      name: cls.name,
      days: cls.days,
      start_time: cls.start_time,
      end_time: cls.end_time,
      description: cls.description || '',
      is_active: cls.is_active,
    });
    setClassModalOpen(true);
  };

  const submitClassForm = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!classForm.name.trim()) {
      alert('수업명을 입력해주세요.');
      return;
    }

    try {
      await workoutService.saveClass({
        id: editingClass?.id,
        ...classForm,
        name: classForm.name.trim(),
        description: classForm.description.trim(),
      });
      setClassModalOpen(false);
      await loadAll();
    } catch (error) {
      console.error(error);
      alert('수업 저장 중 오류가 발생했습니다.');
    }
  };

  const deleteClass = async (id: string) => {
    if (!window.confirm('해당 수업을 삭제하시겠습니까?')) return;
    try {
      await workoutService.deleteClass(id);
      await loadAll();
    } catch (error) {
      console.error(error);
      alert('수업 삭제 중 오류가 발생했습니다.');
    }
  };

  const openAddPoolModal = () => {
    setEditingPool(null);
    setPoolForm({ name: '', location: '', length: 25 });
    setPoolModalOpen(true);
  };

  const openEditPoolModal = (pool: Pool) => {
    setEditingPool(pool);
    setPoolForm({
      name: pool.name,
      location: pool.location,
      length: pool.length,
    });
    setPoolModalOpen(true);
  };

  const submitPoolForm = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!poolForm.name.trim()) {
      alert('수영장 이름을 입력해주세요.');
      return;
    }

    try {
      await workoutService.savePool({
        id: editingPool?.id,
        name: poolForm.name.trim(),
        location: poolForm.location.trim(),
        length: Number(poolForm.length) || 25,
      });
      setPoolModalOpen(false);
      await loadAll();
    } catch (error) {
      console.error(error);
      alert('수영장 저장 중 오류가 발생했습니다.');
    }
  };

  const deletePool = async (id: string) => {
    if (!window.confirm('해당 수영장을 삭제하시겠습니까?')) return;
    try {
      await workoutService.deletePool(id);
      await loadAll();
    } catch (error) {
      console.error(error);
      alert('수영장 삭제 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-16 flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-ocean-600" />
        <span className="text-xs font-semibold">관리자 데이터를 불러오는 중...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-ocean-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-ocean-600/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-slate-900">관리자 대시보드</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Authenticated
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">접속 계정: {userEmail || 'admin'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/workouts/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-ocean-600 hover:bg-ocean-700 text-white text-xs font-bold shadow-md shadow-ocean-600/20 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>새 운동 기록 등록</span>
          </Link>
          <button
            onClick={handleLogout}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
            title="로그아웃"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('workouts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'workouts' ? 'bg-ocean-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          운동 기록 관리 ({workouts.length})
        </button>
        <button
          onClick={() => setActiveTab('classes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'classes' ? 'bg-ocean-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          수업 목록 ({classes.length})
        </button>
        <button
          onClick={() => setActiveTab('pools')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'pools' ? 'bg-ocean-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          수영장 목록 ({pools.length})
        </button>
      </div>

      {activeTab === 'workouts' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-ocean-600" />
              <span>전체 운동 기록</span>
            </h2>
            <Link
              to="/admin/workouts/new"
              className="text-xs font-bold text-ocean-600 hover:text-ocean-700 inline-flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>운동 추가</span>
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {workouts.map((w) => (
              <div
                key={w.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-800">{formatKoreanDate(w.workout_date, true)}</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-ocean-100 text-ocean-800">
                      {w.class?.name || '자유수영'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {w.pool?.name} · {formatDuration(w.duration_minutes)} · 세트 {w.sets?.length || 0}개
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="text-base font-black text-ocean-700">{formatDistance(w.total_distance)}</span>
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/admin/workouts/${w.id}/edit`}
                      className="p-2 rounded-lg text-slate-500 hover:text-ocean-600 hover:bg-ocean-50 transition"
                      title="수정"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteWorkout(w.id)}
                      className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'classes' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-ocean-600" />
              <span>등록된 수영 수업 목록</span>
            </h2>
            <button
              type="button"
              onClick={openAddClassModal}
              className="inline-flex items-center gap-1 rounded-xl bg-ocean-600 px-3 py-2 text-xs font-bold text-white"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              새 수업 추가
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {classes.map((cls) => (
              <div key={cls.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                <div className="flex items-center justify-between mb-2 gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{cls.name}</h3>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => openEditClassModal(cls)}
                      className="p-2 rounded-lg text-slate-500 hover:text-ocean-600 hover:bg-ocean-50 transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteClass(cls.id)}
                      className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold px-2 py-0.5 rounded bg-ocean-100 text-ocean-700 w-fit">
                  {cls.days}
                </div>
                <p className="text-xs text-slate-500 mt-2">시간: {cls.start_time} ~ {cls.end_time}</p>
                {cls.description && <p className="text-xs text-slate-400 mt-1">{cls.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'pools' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-ocean-600" />
              <span>등록된 수영장 목록</span>
            </h2>
            <button
              type="button"
              onClick={openAddPoolModal}
              className="inline-flex items-center gap-1 rounded-xl bg-ocean-600 px-3 py-2 text-xs font-bold text-white"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              새 수영장 등록
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pools.map((pool) => (
              <div key={pool.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                <div className="flex items-center justify-between mb-2 gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{pool.name}</h3>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => openEditPoolModal(pool)}
                      className="p-2 rounded-lg text-slate-500 hover:text-ocean-600 hover:bg-ocean-50 transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deletePool(pool.id)}
                      className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-500">위치: {pool.location || '미입력'}</p>
                <p className="text-xs text-slate-500 mt-1">길이: {pool.length}m</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {classModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">{editingClass ? '수업 수정' : '새 수업 추가'}</h3>
              <button type="button" onClick={() => setClassModalOpen(false)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitClassForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-bold text-slate-700">수업명</label>
                  <input
                    value={classForm.name}
                    onChange={(event) => setClassForm((prev) => ({ ...prev, name: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
                    placeholder="예: 저녁 수영 8시 연수반"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">수영장</label>
                  <select
                    value={classForm.pool_id}
                    onChange={(event) => setClassForm((prev) => ({ ...prev, pool_id: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
                  >
                    {pools.map((pool) => (
                      <option key={pool.id} value={pool.id}>{pool.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">운영 요일</label>
                  <input
                    value={classForm.days}
                    onChange={(event) => setClassForm((prev) => ({ ...prev, days: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
                    placeholder="예: 월수금"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">시작 시간</label>
                  <input
                    type="time"
                    value={classForm.start_time}
                    onChange={(event) => setClassForm((prev) => ({ ...prev, start_time: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">종료 시간</label>
                  <input
                    type="time"
                    value={classForm.end_time}
                    onChange={(event) => setClassForm((prev) => ({ ...prev, end_time: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-bold text-slate-700">설명</label>
                  <textarea
                    value={classForm.description}
                    onChange={(event) => setClassForm((prev) => ({ ...prev, description: event.target.value }))}
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
                    placeholder="수업 소개를 입력하세요."
                  />
                </div>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={classForm.is_active}
                    onChange={(event) => setClassForm((prev) => ({ ...prev, is_active: event.target.checked }))}
                  />
                  운영 중
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setClassModalOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600">
                  취소
                </button>
                <button type="submit" className="rounded-xl bg-ocean-600 px-4 py-2 text-sm font-bold text-white">
                  {editingClass ? '수정 저장' : '추가하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {poolModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">{editingPool ? '수영장 수정' : '새 수영장 등록'}</h3>
              <button type="button" onClick={() => setPoolModalOpen(false)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitPoolForm} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">수영장 이름</label>
                <input
                  value={poolForm.name}
                  onChange={(event) => setPoolForm((prev) => ({ ...prev, name: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
                  placeholder="예: 용인시평생학습관스포츠센터"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">위치</label>
                <input
                  value={poolForm.location}
                  onChange={(event) => setPoolForm((prev) => ({ ...prev, location: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
                  placeholder="예: 경기도 용인시"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">레인 길이 (m)</label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={poolForm.length}
                  onChange={(event) => setPoolForm((prev) => ({ ...prev, length: Number(event.target.value) || 25 }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setPoolModalOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600">
                  취소
                </button>
                <button type="submit" className="rounded-xl bg-ocean-600 px-4 py-2 text-sm font-bold text-white">
                  {editingPool ? '수정 저장' : '등록하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

