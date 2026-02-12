import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type AuthUser = {
  id: number;
  email: string;
  is_active: boolean;
};

type AuthResult = {
  error?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACCESS_TOKEN_KEY = "growit_access_token";
const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "").trim().replace(/\/+$/, "");

const buildApiUrl = (path: string): string => {
  const fallbackBase = typeof window !== "undefined" ? window.location.origin : "";
  const baseUrl = API_BASE_URL || fallbackBase;
  return `${baseUrl}${path}`;
};

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const payload = await response.json();
    if (typeof payload?.detail === "string") return payload.detail;
  } catch {
    // ignore and fallback to generic message
  }
  return "요청 처리에 실패했습니다.";
}

type AuthPayload = {
  access_token: string;
  token_type: string;
  user: AuthUser;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = useCallback(async (accessToken: string): Promise<AuthUser | null> => {
    const response = await fetch(buildApiUrl("/api/users/me"), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) return null;
    const me = (await response.json()) as AuthUser;
    return me;
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!savedToken) {
      setIsLoading(false);
      return;
    }

    setToken(savedToken);
    void fetchCurrentUser(savedToken)
      .then((me) => {
        if (!me) {
          localStorage.removeItem(ACCESS_TOKEN_KEY);
          setToken(null);
          setUser(null);
          return;
        }
        setUser(me);
      })
      .catch(() => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [fetchCurrentUser]);

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const formBody = new URLSearchParams({
        username: email,
        password,
      });

      const response = await fetch(buildApiUrl("/api/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody.toString(),
      });

      if (!response.ok) {
        return { error: await readErrorMessage(response) };
      }

      const payload = (await response.json()) as AuthPayload;
      localStorage.setItem(ACCESS_TOKEN_KEY, payload.access_token);
      setToken(payload.access_token);
      setUser(payload.user);
      return {};
    } catch {
      return { error: "네트워크 오류가 발생했습니다." };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const response = await fetch(buildApiUrl("/api/auth/signup"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        return { error: await readErrorMessage(response) };
      }

      const payload = (await response.json()) as AuthPayload;
      localStorage.setItem(ACCESS_TOKEN_KEY, payload.access_token);
      setToken(payload.access_token);
      setUser(payload.user);
      return {};
    } catch {
      return { error: "네트워크 오류가 발생했습니다." };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      login,
      signup,
      logout,
    }),
    [user, token, isLoading, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
