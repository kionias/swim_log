import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  isAdmin: boolean;
  userEmail: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  userEmail: null,
  login: async () => ({ success: false }),
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('swim_log_is_admin') === 'true';
  });
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return localStorage.getItem('swim_log_admin_email') || null;
  });

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setIsAdmin(true);
          setUserEmail(session.user.email || null);
          localStorage.setItem('swim_log_is_admin', 'true');
          if (session.user.email) localStorage.setItem('swim_log_admin_email', session.user.email);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setIsAdmin(true);
          setUserEmail(session.user.email || null);
          localStorage.setItem('swim_log_is_admin', 'true');
          if (session.user.email) localStorage.setItem('swim_log_admin_email', session.user.email);
        } else {
          setIsAdmin(false);
          setUserEmail(null);
          localStorage.removeItem('swim_log_is_admin');
          localStorage.removeItem('swim_log_admin_email');
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        return { success: false, error: error.message };
      }
      setIsAdmin(true);
      setUserEmail(data.user?.email || email);
      return { success: true };
    }

    // Demo/Local Mode fallback for admin (demo login)
    if (password === 'admin1234' || (email === 'admin@swimlog.com' && password === 'admin1234')) {
      setIsAdmin(true);
      setUserEmail(email);
      localStorage.setItem('swim_log_is_admin', 'true');
      localStorage.setItem('swim_log_admin_email', email);
      return { success: true };
    }

    return { success: false, error: '이메일 또는 비밀번호가 일치하지 않습니다. (로컬 데모: admin@swimlog.com / admin1234)' };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setIsAdmin(false);
    setUserEmail(null);
    localStorage.removeItem('swim_log_is_admin');
    localStorage.removeItem('swim_log_admin_email');
  };

  return (
    <AuthContext.Provider value={{ isAdmin, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

