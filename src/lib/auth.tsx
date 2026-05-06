import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';

const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin';
const STORAGE_KEY = 'pyrus-admin-session';

type AuthContextValue = {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => { ok: true } | { ok: false; error: string };
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [username, setUsername] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (username) localStorage.setItem(STORAGE_KEY, username);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage errors
    }
  }, [username]);

  const login = useCallback((u: string, p: string) => {
    if (u === ADMIN_USERNAME && p === ADMIN_PASSWORD) {
      setUsername(u);
      return { ok: true } as const;
    }
    return { ok: false, error: 'Invalid username or password' } as const;
  }, []);

  const logout = useCallback(() => setUsername(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({ isAuthenticated: Boolean(username), username, login, logout }),
    [username, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
