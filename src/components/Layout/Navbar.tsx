import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Waves,
  Calendar as CalendarIcon,
  ShieldCheck,
  LogOut,
  PlusCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';

export const Navbar: React.FC = () => {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
      isActive
        ? 'bg-ocean-600 text-white shadow-md shadow-ocean-600/20'
        : 'text-slate-600 hover:text-ocean-700 hover:bg-ocean-50'
    }`;

  const mobileNavItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center py-2 flex-1 text-xs font-medium transition-all ${
      isActive ? 'text-ocean-600 font-bold' : 'text-slate-500 hover:text-slate-800'
    }`;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200/80 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-ocean-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-ocean-500/25 group-hover:scale-105 transition-transform">
              <Waves className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-ocean-700 transition-colors">
                  SWIM LOG
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-ocean-100 text-ocean-700">
                  {isSupabaseConfigured ? 'Live DB' : 'Local'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-none hidden sm:block">
                수영 운동 기록
              </p>
            </div>
          </Link>

          <div className="ml-auto flex items-center gap-3">
            <nav className="hidden items-center gap-1 md:flex">
              <NavLink to="/" className={navItemClass} end>
                <CalendarIcon className="w-4 h-4" />
                <span>운동기록</span>
              </NavLink>
              <NavLink to={isAdmin ? '/admin' : '/admin/login'} className={navItemClass}>
                <ShieldCheck className="w-4 h-4" />
                <span>{isAdmin ? '관리자' : '로그인'}</span>
              </NavLink>
            </nav>

            {isAdmin && (
              <>
                <Link
                  to="/admin/workouts/new"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-ocean-600 to-cyan-600 text-white shadow-sm hover:from-ocean-700 hover:to-cyan-700 transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>운동 추가</span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="관리자 로그아웃"
                  className="p-2 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 px-2 py-1 flex items-center justify-around shadow-lg">
        <NavLink to="/" className={mobileNavItemClass} end>
          <CalendarIcon className="w-5 h-5 mb-0.5" />
          <span>운동기록</span>
        </NavLink>
        <NavLink to={isAdmin ? '/admin' : '/admin/login'} className={mobileNavItemClass}>
          <ShieldCheck className="w-5 h-5 mb-0.5" />
          <span>{isAdmin ? '관리자' : '로그인'}</span>
        </NavLink>
      </div>
    </>
  );
};

