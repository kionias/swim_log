import React from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const isWorkoutLogPage = pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main
        className={`relative flex-1 px-4 py-6 pb-24 sm:px-6 md:pb-12 ${isWorkoutLogPage ? 'bg-cover bg-center bg-fixed bg-no-repeat' : ''}`}
        style={isWorkoutLogPage ? { backgroundImage: "url('/image/background_01.png')" } : undefined}
      >
        {isWorkoutLogPage && <div className="pointer-events-none absolute inset-0 bg-white/60" />}
        <div className="relative z-10 mx-auto w-full max-w-5xl">
        {children}
        </div>
      </main>
      <footer className="border-t border-slate-200/80 bg-white/60 py-6 text-center text-xs text-slate-400 hidden md:block">
        <p>© 2026 SWIM LOG. 수영 운동 기록 & 커스텀 리포트</p>
      </footer>
    </div>
  );
};

