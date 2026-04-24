// store/useAuthStore.ts

import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  
  // Actions
  initAuth: () => Promise<void>; // 앱 시작 시 토큰 로드
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null, // 💡 나중에 GetMe로 채울 공간
  isLoading: true,
  isLoggedIn: false,

  initAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (token) {
        // 실제로는 여기서 GetMe API를 호출해서 user 정보를 가져오면 베스트!
        set({ accessToken: token, isLoggedIn: true });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (token, user) => {
    await SecureStore.setItemAsync('accessToken', token);
    set({ accessToken: token, user, isLoggedIn: true });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('accessToken');
    set({ accessToken: null, user: null, isLoggedIn: false });
  },
}));