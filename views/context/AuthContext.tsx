//views/context/AuthContext.tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  created_at?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  refresh: () => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const VERIFY_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  );
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  });
  // Only block rendering when we have a token but NO cached user to show.
  const [loading, setLoading] = useState<boolean>(() => {
    const hasToken = !!localStorage.getItem("token");
    const hasUser = !!localStorage.getItem("user");
    return hasToken && !hasUser;
  });

  const clearAuth = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  const refresh = useCallback(async (): Promise<boolean> => {
    const currentToken = localStorage.getItem("token");
    if (!currentToken) {
      clearAuth();
      return false;
    }

    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${currentToken}` },
      });

      if (!res.ok) {
        clearAuth();
        return false;
      }

      const data = (await res.json()) as { user?: AuthUser };
      if (!data.user) {
        clearAuth();
        return false;
      }

      setToken(currentToken);
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      return true;
    } catch {
      clearAuth();
      return false;
    }
  }, [clearAuth]);

  const login = useCallback((newToken: string, newUser: AuthUser) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  // Initial verification on mount.
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    void refresh().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Periodic re-verify.
  useEffect(() => {
    if (!token) return;
    const id = window.setInterval(() => {
      void refresh();
    }, VERIFY_INTERVAL);
    return () => window.clearInterval(id);
  }, [token, refresh]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      login,
      logout,
      refresh,
      isAuthenticated: !!token && !!user,
    }),
    [user, token, loading, login, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
