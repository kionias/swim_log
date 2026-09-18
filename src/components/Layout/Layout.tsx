import React from 'react';
import { Navbar } from './Navbar';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
        {children}
      </main>
      <footer className="border-t border-slate-200/80 bg-white/60 py-6 text-center text-xs text-slate-400 hidden md:block">
        <p>© 2026 SWIM LOG. 수영 운동 기록 & 커스텀 리포트</p>
      </footer>
    </div>
  );
};

