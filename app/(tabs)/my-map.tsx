// app/(tabs)/my-map.tsx
import { SearchHeader } from "@/components/features/map/SearchHeader";
import ShopDetailSheet from "@/components/features/map/ShopDetailSheet";
import { useMapControl } from "@/hooks/map/useMapControl";
import { useShopDetail } from "@/hooks/shop/useShopDetail";
import { useShops } from "@/hooks/shop/useShops";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useRef } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import NaverMapViewComponent from "../../components/features/map/NaverMapView";
import { useMapStore } from "@/store/useMapStore";

export default function MyMapScreen() {
  //useShops - 가게 x,y 정보 fetch하는 훅
  const { shops, isLoading: isListLoading } = useShops();
  const {
    selectedShop,
    photos,
    isLoading: isDetailLoading,
    getDetail,
  } = useShopDetail();

  // 지도 컨트롤 로직
  const { mapRef, selectedShopId, selectMarker, clearSelection } =
    useMapControl();

  const { pendingShopId, clearPendingShopId } = useMapStore();

  // 1. 바텀 시트를 조절하기 위한 Ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // 2. 시트가 멈추는 높이 (35% 지점, 60% 지점)
  const snapPoints = useMemo(() => ["40%", "100%"], []);

  // 3. 마커 클릭 시 실행될 함수 (NaverMapViewComponent로 전달할 것)
  const handleMarkerPress = useCallback(
    (shop: any) => {
      // 1. 지도 중앙 이동 및 마커 활성화 (훅 사용)
      selectMarker(shop.id, shop.latitude, shop.longitude);
      // 2. 바텀시트 올리기
      bottomSheetRef.current?.snapToIndex(0);
      // 3. 상세 데이터 페칭
      getDetail(shop.id);
    },
    [selectMarker, getDetail]
  );

  // my-page 찜 목록에서 넘어온 경우: 탭 포커스 시 해당 가게 바텀시트 자동 오픈
  useFocusEffect(
    useCallback(() => {
      if (!pendingShopId || !shops.length) return;
      const shop = shops.find((s: any) => s.id === pendingShopId);
      if (!shop) return;
      clearPendingShopId();
      setTimeout(() => handleMarkerPress(shop), 100);
    }, [pendingShopId, shops, handleMarkerPress, clearPendingShopId])
  );

  return (
    // <SafeAreaView style={styles.safe} edges={["top"]}>
    <View style={styles.container}>
      {isListLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#FF8C00" />
        </View>
      ) : (
        <>
          {/* 3. 상단 검색바 (지도를 덮도록 배치) */}
          <SearchHeader
            onSelectShop={(shop) => {
              handleMarkerPress(shop);
            }}
          />

          {/* 지도를 그리는 컴포넌트 */}
          <NaverMapViewComponent
            shops={shops}
            onMarkerPress={handleMarkerPress}
            ref={mapRef}
            selectedShopId={selectedShopId}
          />
          <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose
            onChange={(index) => {
              if (index === -1) clearSelection(); // 👈 시트 닫히면 선택 해제
            }}
          >
            <BottomSheetView>
              <ShopDetailSheet
                shop={selectedShop}
                photos={photos}
                isLoading={isDetailLoading}
              />
            </BottomSheetView>
          </BottomSheet>
        </>
      )}
    </View>
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  sheetBackground: { borderRadius: 24, backgroundColor: "#fff", elevation: 10 },
  contentContainer: { flex: 1, paddingHorizontal: 24, paddingVertical: 20 },
  infoBox: { width: "100%" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  shopName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A1A",
    flex: 1,
    marginRight: 10,
  },
  badge: {
    backgroundColor: "#FFF4E5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: { color: "#FF8C00", fontWeight: "600", fontSize: 13 },
  detailList: { marginBottom: 24 },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    paddingRight: 20,
  },
  detailText: {
    fontSize: 16,
    color: "#4D4D4D",
    marginLeft: 10,
    lineHeight: 22,
  },
  linkText: { color: "#007AFF", textDecorationLine: "underline" },
  mainButton: {
    backgroundColor: "#FF8C00",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 2,
  },
  mainButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
  placeholder: { fontSize: 16, color: "#999" },
});
