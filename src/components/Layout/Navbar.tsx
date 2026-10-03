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
    `relative px-3 py-1.5 text-sm font-semibold transition-all ${
      isActive
        ? 'text-ocean-700 font-bold'
        : 'text-slate-600 hover:text-ocean-700'
    }`;

  const mobileNavItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center py-2 flex-1 text-xs font-medium transition-all ${
      isActive ? 'text-ocean-700 font-bold' : 'text-slate-500 hover:text-slate-800'
    }`;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-ocean-600 flex items-center justify-center text-white shadow-xs group-hover:bg-ocean-700 transition-colors">
              <Waves className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight text-slate-900 group-hover:text-ocean-700 transition-colors">
                SWIM LOG
              </span>
              <span className="text-[10px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded-full bg-ocean-50 text-ocean-700 border border-ocean-100">
                {isSupabaseConfigured ? 'Live DB' : 'Local'}
              </span>
            </div>
          </Link>

          <div className="ml-auto flex items-center gap-4">
            <nav className="hidden items-center gap-4 md:flex">
              <NavLink to="/" className={navItemClass} end>
                {({ isActive }) => (
                  <>
                    <span>홈 / 캘린더</span>
                    {isActive && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-ocean-600 rounded-full" />}
                  </>
                )}
              </NavLink>
              <NavLink to={isAdmin ? '/admin' : '/admin/login'} className={navItemClass}>
                {({ isActive }) => (
                  <>
                    <span>{isAdmin ? '관리자' : '로그인'}</span>
                    {isActive && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-ocean-600 rounded-full" />}
                  </>
                )}
              </NavLink>
            </nav>

            {isAdmin && (
              <>
                <Link
                  to="/admin/workouts/new"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-ocean-600 text-white shadow-xs hover:bg-ocean-700 transition"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>운동 추가</span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="관리자 로그아웃"
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
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

