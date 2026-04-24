// context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { fetchMe, UserProfile } from '@/api/users';

interface AuthContextType {
  accessToken: string | null;
  user: UserProfile | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('accessToken');
        if (token) {
          setAccessToken(token);
          const profile = await fetchMe(token);
          setUser(profile);
        }
      } catch (e) {
        console.error('토큰 로딩 에러:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  const login = async (token: string) => {
    await SecureStore.setItemAsync('accessToken', token);
    setAccessToken(token);
    const profile = await fetchMe(token);
    setUser(profile);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('accessToken');
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, isLoggedIn: !!accessToken, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
