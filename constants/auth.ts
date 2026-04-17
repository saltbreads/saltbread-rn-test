// constants/auth.ts
import { Platform } from 'react-native';
import { BASE_URL } from './config';

export const AUTH_CONFIG = {
  // 구글이 낚시질할 콜백 경로 (도메인 제외 경로만 따로 관리하면 관리하기 편함)
  CALLBACK_PATH: '/auth/google/callback',
  
  // 전체 콜백 URL (ngrok 주소 + 경로)
  get CALLBACK_URL() {
    return `${BASE_URL.API_URL}${this.CALLBACK_PATH}`;
  },

  // 구글 로그인 차단을 피하기 위한 User Agent
  USER_AGENTS: {
    android: 'Chrome/110.0.0.0 Mobile Safari/537.36',
    ios: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.3 Mobile/15E148 Safari/604.1',
    get current() {
      return Platform.OS === 'android' ? this.android : this.ios;
    }
  }
};