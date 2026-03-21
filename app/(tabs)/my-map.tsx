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

// {/* 바텀 시트 컴포넌트 */}
// <BottomSheet ref={bottomSheetRef} index={-1} snapPoints={snapPoints} enablePanDownToClose backgroundStyle={styles.sheetBackground}>
// <BottomSheetView style={styles.contentContainer}>
//   {isDetailLoading ? (
//     <View style={styles.center}><ActivityIndicator size="small" color="#FF8C00" /></View>
//   ) : selectedShop ? (
//     <View style={styles.infoBox}>
//       {/* 가게 이름 및 태그 */}
//       <View style={styles.header}>
//         <Text style={styles.shopName} numberOfLines={1}>{selectedShop.name}</Text>
//         <View style={styles.badge}><Text style={styles.badgeText}>소금빵 맛집</Text></View>
//         </View>

//       {/* 상세 정보 리스트 */}
//       <View style={styles.detailList}>
//         {/* 주소 (도로명 주소 반영) */}
//         <View style={styles.detailItem}>
//           <Ionicons name="location-outline" size={18} color="#666" />
//           <Text style={styles.detailText} numberOfLines={2}>
//             {selectedShop.address?.road || '주소 정보 없음'}
//           </Text>
//         </View>
        
//         {/* 영업 시간 */}
//         <View style={styles.detailItem}>
//           <Ionicons name="time-outline" size={18} color="#666" />
//           <Text style={styles.detailText}>
//             {selectedShop.hoursRaw || '영업시간 정보 없음'}
//           </Text>
//         </View>

//         {/* 전화번호 (전화걸기 연결) */}
//         {selectedShop.telephone && (
//           <TouchableOpacity style={styles.detailItem} onPress={() => makeCall(selectedShop.telephone)}>
//             <Ionicons name="call-outline" size={18} color="#007AFF" />
//             <Text style={[styles.detailText, styles.linkText]}>{selectedShop.telephone}</Text>
//           </TouchableOpacity>
//         )}

//         {/* 인스타그램 (인스타 연결) */}
//         {selectedShop.links?.instagram && (
//           <TouchableOpacity style={styles.detailItem} onPress={() => openInstagram(selectedShop.links.instagram)}>
//             <Ionicons name="logo-instagram" size={18} color="#E1306C" />
//             <Text style={[styles.detailText, styles.linkText]}>인스타그램 보기</Text>
//           </TouchableOpacity>
//         )}
//       </View>
      
//       {/* 상세보기 버튼 (최종 목적지) */}
//       <TouchableOpacity style={styles.mainButton}>
//         <Text style={styles.mainButtonText}>가게 상세 정보 더보기</Text>
//         <Ionicons name="arrow-forward" size={18} color="#fff" />
//       </TouchableOpacity>
//     </View>
//   ) : (
//     <View style={styles.center}><Text style={styles.placeholder}>가게를 선택해 주세요.</Text></View>
//   )}
// </BottomSheetView>
// </BottomSheet>

