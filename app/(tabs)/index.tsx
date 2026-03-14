// app/(tabs)/index.tsx
import React from "react";
import { SafeAreaView, StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";

const WEB_URL = "http://10.0.2.2:3000/"; // Android Emulator -> Mac localhost

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
