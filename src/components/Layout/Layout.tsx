import React from 'react';
import { Navbar } from './Navbar';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main
        className="relative flex-1 px-4 py-6 pb-24 sm:px-6 md:pb-12 bg-cover bg-center bg-fixed bg-no-repeat"
        style={{ backgroundImage: "url('/image/background_01.png')" }}
      >
        <div className="relative z-10 mx-auto w-full max-w-5xl">
          {children}
        </div>
      </main>
      <footer className="border-t border-slate-200/80 bg-white/80 backdrop-blur-sm py-6 text-center text-xs text-slate-500 font-semibold hidden md:block">
        <p>© {new Date().getFullYear()} SWIM LOG. 수영 운동 기록 & 커스텀 리포트</p>
      </footer>
    </div>
  );
};

