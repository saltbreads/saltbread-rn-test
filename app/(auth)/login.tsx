// app/(auth)/login.tsx
import { AUTH_CONFIG } from "@/constants/auth";
import { BASE_URL } from "@/constants/config";
import { useAuth } from "@/context/AuthContext"; // @ 경로 사용 권장
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { WebView } from "react-native-webview";
import { View, ActivityIndicator, StyleSheet,Text } from 'react-native';

// @TODO 로그인 하기 버튼 이후 뜨는 흰네모박스 디자인 통일
// @TODO 첫로그인 시 로딩 형태가 이상함.. 쿠키저장된 이후 자동로그인 될때부터는 괜찮


export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const isProcessing = useRef(false);
  const [loading, setLoading] = useState(false);

  // 로딩 뷰를 공통 컴포넌트로 분리해서 재사용
  const LoadingView = ({ text }: { text: string }) => (
    <View style={styles.loadingOverlay}>
      <ActivityIndicator size="large" color="#FF6B00" />
      <Text style={styles.loadingText}>{text}</Text>
    </View>
  );

  // 로직 분리: 로딩을 시작하고 통신하는 부분을 함수로 뺍니다.
  const processLogin = async (url: string) => {
    if (isProcessing.current) return;
    
    isProcessing.current = true;
    setLoading(true); // 즉시 로딩 시작

    const rawCode = url.split("code=")[1].split("&")[0];
    const code = decodeURIComponent(rawCode);

    try {
      const response = await fetch(
        `${BASE_URL.API_URL}${BASE_URL.ENDPOINTS.AUTH_EXCHANGE}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Client-Type": "mobile",
          },
          body: JSON.stringify({ code }),
        }
      );

      const result = await response.json();
      if (result.success) {
        await login(result.data.accessToken, result.data.refreshToken);
        router.replace("/(tabs)/profile");
      } else {
        setLoading(false);
        isProcessing.current = false;
      }
    } catch (e) {
      setLoading(false);
      isProcessing.current = false;
      console.error("Login Exchange Error:", e);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 1. 웹뷰가 로딩 중이거나 백엔드와 통신 중일 때 보여줄 로딩 창 */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FF6B00" />
          <LoadingView text="로그인 정보를 확인 중입니다... 🥐" />
        </View>
      )}

      <WebView
        source={{ uri: `${BASE_URL.API_URL}${BASE_URL.ENDPOINTS.AUTH_GOOGLE}` }}
        // incognito={true} // 시크릿모드 (쿠키/캐시저장안함)

        // [필수 추가] 이게 있어야 renderLoading이 작동합니다!
        startInLoadingState={true}
        renderLoading={() => (
          <View style={{ flex: 1 }}>
            <ActivityIndicator size="large" color="#FF6B00" />
            <Text style={styles.loadingText}>소금빵 굽는 중... (로그인 창 불러오기)</Text>
          </View>
        )}

        onLoadStart={(navState) => {
          // @TODO 하드코딩된 부분 리팩토링 예정 (나중에 카카오 네이버 추가 후)
          // 사용자가 계정을 클릭해서 /auth/google/callback 같은 리다이렉트 경로로 이동하기 시작하면
          // 즉시 로딩 화면을 띄워버립니다. (code= 가 나올 때까지 기다리지 않음)
          if (navState.nativeEvent.url.includes("/auth/google/callback") || 
              navState.nativeEvent.url.includes("/oauth/callback")) {
            setLoading(true);
          }
        }}

        onNavigationStateChange={(navState) => {
          if (navState.url.includes("code=") && !isProcessing.current) {
            processLogin(navState.url);
          }
        }}

        style={{ flex: 1 }}

        //크롬인척 하기
        userAgent={AUTH_CONFIG.USER_AGENTS.current}
        // 실기기 테스트 시 쿠키 세션 유지를 위해 추가하면 좋습니다.
        sharedCookiesEnabled={true}
        domStorageEnabled={true}
        onShouldStartLoadWithRequest={(request) => {
          if (request.url.includes("/oauth/callback")) {
            // 주소에 코드가 있다면 여기서 바로 낚시 시작! (찰나의 흰 화면 방지)
            if (request.url.includes("code=")) {
              processLogin(request.url);
            }
            return false; 
          }
          return true;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  }
});