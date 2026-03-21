// app/(tabs)/my-map.tsx
import React, { useRef, useState, useMemo, useCallback } from "react";
import { StyleSheet, ActivityIndicator, View, Text, TouchableOpacity, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import NaverMapViewComponent from "../../components/features/map/NaverMapView";
import ShopDetailSheet from "@/components/features/map/ShopDetailSheet";
import { useShops } from "@/hooks/shop/useShops";
import { useShopDetail } from "@/hooks/shop/useShopDetail";

export default function MyMapScreen() {
  //useShops - 가게 x,y 정보 fetch하는 훅 
  const {shops, isLoading} = useShops();
  const { selectedShop, isLoading: isDetailLoading, getDetail } = useShopDetail();

  // 1. 바텀 시트를 조절하기 위한 Ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // 2. 시트가 멈추는 높이 (35% 지점, 60% 지점)
  const snapPoints = useMemo(() => ["35%", "60%"], []);

  // 3. 마커 클릭 시 실행될 함수 (NaverMapViewComponent로 전달할 것)
  
  const handleMarkerPress = useCallback((shop: any) => {
    bottomSheetRef.current?.snapToIndex(0);
    getDetail(shop.id); // 훅을 통해 데이터 페칭
  }, [getDetail]);

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
          <BottomSheet 
        ref={bottomSheetRef} 
        index={-1} 
        snapPoints={snapPoints} 
        enablePanDownToClose
      >
        <BottomSheetView>
          <ShopDetailSheet 
            shop={selectedShop} 
            isLoading={isDetailLoading} 
          />
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
  center: { flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 20 },
  sheetBackground: { borderRadius: 24, backgroundColor: '#fff', elevation: 10 },
  contentContainer: { flex: 1, paddingHorizontal: 24, paddingVertical: 20 },
  infoBox: { width: '100%' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  shopName: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A', flex: 1, marginRight: 10 },
  badge: { backgroundColor: '#FFF4E5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeText: { color: '#FF8C00', fontWeight: '600', fontSize: 13 },
  detailList: { marginBottom: 24 },
  detailItem: { flexDirection: 'row', alignItems: 'center', marginVertical: 8, paddingRight: 20 },
  detailText: { fontSize: 16, color: '#4D4D4D', marginLeft: 10, lineHeight: 22 },
  linkText: { color: '#007AFF', textDecorationLine: 'underline' },
  mainButton: { backgroundColor: '#FF8C00', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 12, elevation: 2 },
  mainButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginRight: 8 },
  placeholder: { fontSize: 16, color: '#999' }
});
