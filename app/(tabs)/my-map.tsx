// app/(tabs)/my-map.tsx
import React, { useRef, useState, useMemo, useCallback } from "react";
import { StyleSheet, ActivityIndicator, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import NaverMapViewComponent from "../../components/features/map/NaverMapView";
import { useShops } from "@/hooks/shop/useShops";

export default function MyMapScreen() {
  //useShops - 가게 x,y 정보 fetch하는 훅 
  const {shops, isLoading} = useShops();

  // 1. 바텀 시트를 조절하기 위한 Ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  
  // 2. 어떤 가게를 눌렀는지 저장하는 상태
  const [selectedShop, setSelectedShop] = useState<any>(null);

  // 3. 시트가 멈추는 높이 (25% 지점, 50% 지점)
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  // 4. 마커 클릭 시 실행될 함수 (NaverMapViewComponent로 전달할 것)
  const handleMarkerPress = useCallback((shop: any) => {
    setSelectedShop(shop);
    bottomSheetRef.current?.snapToIndex(0); // 마커 누르면 25% 높이로 슥 올라옴
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']} >
      {isLoading ? (
        <View style={styles.loading}><ActivityIndicator size="large" color="#FF8C00" /></View>
      ) : (
        <>
          {/* 지도를 그리는 컴포넌트 */}
          <NaverMapViewComponent 
            shops={shops} 
            onMarkerPress={handleMarkerPress} // 함수 전달!
          />
          {/* 바텀 시트 컴포넌트 */}
          <BottomSheet
            ref={bottomSheetRef}
            index={-1} // 처음엔 숨겨둠
            snapPoints={snapPoints}
            enablePanDownToClose // 아래로 내리면 닫힘
          >
            <BottomSheetView style={styles.contentContainer}>
              {selectedShop ? (
                <View>
                  <Text style={styles.shopName}>{selectedShop.name}</Text>
                  <Text style={styles.shopAddress}>📍 {selectedShop.address || '정보 없음'}</Text>
                  <View style={styles.tag}><Text style={styles.tagText}>🥐 소금빵 맛집</Text></View>
                </View>
              ) : (
                <Text>가게를 선택해 주세요.</Text>
              )}
            </BottomSheetView>
          </BottomSheet>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  contentContainer: { padding: 20 },
  shopName: { fontSize: 22, fontWeight: 'bold' },
  shopAddress: { fontSize: 16, color: '#666', marginTop: 8 },
  tag: { backgroundColor: '#FFF4E5', padding: 6, borderRadius: 8, marginTop: 12, alignSelf: 'flex-start' },
  tagText: { color: '#FF8C00', fontWeight: 'bold' }
});