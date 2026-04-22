// app/(tabs)/index.tsx
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

// const WEB_URL = "http://10.0.2.2:3000/"; // Android Emulator -> Mac localhost
// const WEB_URL = "http://10.123.195.158:3000/"; // Android 기기로 연결했을때?
const WEB_URL = "https://saltbread-map.vercel.app/"; // Android 기기로 연결했을때?

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <WebView
        source={{ uri: WEB_URL }}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator />
            <Text style={styles.loadingText}>Loading web…</Text>
          </View>
        )}
        // 개발 중 디버깅 편하게
        javaScriptEnabled
        domStorageEnabled
        allowsBackForwardNavigationGestures
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: { marginTop: 8 },
});
