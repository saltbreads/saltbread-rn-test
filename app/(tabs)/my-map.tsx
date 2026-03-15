// app/(tabs)/my-map.tsx
import React from "react";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NaverMapViewComponent from "../../components/features/map/NaverMapView";
import { useShops } from "@/hooks/shop/useShops";

export default function MyMapScreen() {
  //useShops - 가게 x,y 정보 fetch하는 훅 
  const {shops, isLoading} = useShops();

  return (
    <SafeAreaView style={styles.safe} edges={['top']} >
      {isLoading ? (
        <View style={styles.loading}><ActivityIndicator /></View>
      ) : (
        <NaverMapViewComponent shops={shops} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" }
});
