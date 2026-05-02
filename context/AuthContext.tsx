// context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, useRef, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { fetchMe, UserProfile } from '@/api/users';
import { BASE_URL } from '@/constants/config';

export type AuthFetchFn = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

interface AuthContextType {
  accessToken: string | null;
  user: UserProfile | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (token: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  authFetch: AuthFetchFn;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const accessTokenRef = useRef<string | null>(null);
  const refreshTokenRef = useRef<string | null>(null);
  const refreshPromiseRef = useRef<Promise<string | null> | null>(null);

  useEffect(() => { accessTokenRef.current = accessToken; }, [accessToken]);
  useEffect(() => { refreshTokenRef.current = refreshToken; }, [refreshToken]);

  const logout = useCallback(async () => {
    await Promise.all([
      SecureStore.deleteItemAsync('accessToken'),
      SecureStore.deleteItemAsync('refreshToken'),
    ]);
    setAccessToken(null);
    setRefreshToken(null);
    accessTokenRef.current = null;
    refreshTokenRef.current = null;
    setUser(null);
  }, []);

  const doRefresh = useCallback(async (): Promise<string | null> => {
    const currentRefresh = refreshTokenRef.current;
    if (!currentRefresh) {
      await logout();
      return null;
    }
    try {
      const response = await fetch(`${BASE_URL.API_URL}${BASE_URL.ENDPOINTS.AUTH_REFRESH}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Type': 'mobile',
        },
        body: JSON.stringify({ refreshToken: currentRefresh }),
      });
      const json = await response.json();
      if (!response.ok) {
        // 토큰 갱신 실패 → 로그아웃
        await logout();
        return null;
      }
      const { accessToken: newAccess, refreshToken: newRefresh } = json.data;
      await Promise.all([
        SecureStore.setItemAsync('accessToken', newAccess),
        SecureStore.setItemAsync('refreshToken', newRefresh),
      ]);
      setAccessToken(newAccess);
      setRefreshToken(newRefresh);
      accessTokenRef.current = newAccess;
      refreshTokenRef.current = newRefresh;
      // 토큰 갱신 성공 → 원래 요청 재시도
      return newAccess;
    } catch {
      await logout();
      return null;
    }
  }, [logout]);

  const authFetch = useCallback<AuthFetchFn>(async (input, init) => {
    const makeRequest = (token: string | null) =>
      fetch(input, {
        ...init,
        headers: {
          ...init?.headers,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

    const response = await makeRequest(accessTokenRef.current);
    if (response.status !== 401) return response;

    // 401 감지 → 토큰 갱신 시도 (중복 방지하며 refresh)
    if (!refreshPromiseRef.current) {
      refreshPromiseRef.current = doRefresh().finally(() => {
        refreshPromiseRef.current = null;
      });
    }
    const newToken = await refreshPromiseRef.current;
    if (!newToken) return response;

    return makeRequest(newToken);
  }, [doRefresh]);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const [token, refresh] = await Promise.all([
          SecureStore.getItemAsync('accessToken'),
          SecureStore.getItemAsync('refreshToken'),
        ]);
        if (token) {
          setAccessToken(token);
          accessTokenRef.current = token;
          if (refresh) {
            setRefreshToken(refresh);
            refreshTokenRef.current = refresh;
          }
          // authFetch 사용 → 토큰 만료 시 자동 갱신 후 유저 정보 로드
          const response = await authFetch(`${BASE_URL.API_URL}${BASE_URL.ENDPOINTS.USERS_ME}`);
          if (response.ok) {
            const json = await response.json();
            if (json.success && json.data) setUser(json.data);
          }
        }
      } catch (e) {
        console.error('토큰 로딩 에러:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadToken();
  }, [authFetch]);

  const login = async (token: string, refresh: string) => {
    await Promise.all([
      SecureStore.setItemAsync('accessToken', token),
      SecureStore.setItemAsync('refreshToken', refresh),
    ]);
    setAccessToken(token);
    setRefreshToken(refresh);
    accessTokenRef.current = token;
    refreshTokenRef.current = refresh;
    const profile = await fetchMe(token);
    setUser(profile);
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, isLoggedIn: !!accessToken, isLoading, login, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
