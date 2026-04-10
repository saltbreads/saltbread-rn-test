// components/features/map/ShopDetailSheet.tsx
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ShopHeader from "./ShopHeader";
import ShopInfoHome from "./ShopInfoHome";
import ShopMenu from "./ShopMenu";
import ShopTabs, { ShopTabType } from "./ShopTabs";
import ShopReview from "./ShopReview";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window"); // 화면 너비 가져오기

interface Props {
  shop: any;
  photos: string[];
  isLoading: boolean;
}

const ShopDetailSheet = ({ shop, photos, isLoading }: Props) => {
  const [activeTab, setActiveTab] = useState<ShopTabType>("홈");
  const [contentHeight, setContentHeight] = useState(400);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="small" color="#FF8C00" />
        <Text style={styles.loadingText}>정보를 가져오는 중...</Text>
      </View>
    );
  }

  if (!shop) return null;

  return (
    <BottomSheetView 
      style={styles.container}
      // 2. 바텀시트 전체가 그려질 때 남은 공간을 계산합니다.
      onLayout={(e) => {
        const { height } = e.nativeEvent.layout;
        if (height > 0) {
          // 전체 높이에서 헤더/탭바/버튼 대략적인 높이(약 350)를 빼서 설정
          // (혹은 시트가 snapPoints에 따라 동적으로 변한다면 유용함)
          setContentHeight(height - 300); 
        }
      }}
    >
      {/* 1. 상단 헤더 (사진 + 이름) */}
      <ShopHeader name={shop.name} photos={photos} />

      {/* 2. 탭 바 */}
      <ShopTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 3. 탭별 컨텐츠 분기 */}
      {/* 아래 스타일 추후 styles적용 */}
      {/* <View style={{  height:contentHeight}}> */}
      <View style={{ height:SCREEN_HEIGHT * 0.45,overflow: 'hidden', }}>
        {/* <View style={{ flex: 1,minHeight:300, overflow: 'hidden' }}> */}
        {activeTab === "홈" && <ShopInfoHome shop={shop} />}
        {activeTab === "메뉴" && <ShopMenu shopId={shop.shopId} />}
        {activeTab === "리뷰" && <ShopReview shopId={shop.shopId} />}
        {activeTab === "사진" && (
          <View>
            <Text>전체 사진 그리드 준비 중...</Text>
          </View>
        )}
      </View>

      {/* 하단 상세정보 버튼 */}
      {/* <View style={{ paddingVertical: 16 }}> */}
        {/* 버튼을 감싸는 여백 */}
        <TouchableOpacity
          style={[styles.mainButton,{ marginTop: 10, marginBottom: 10 }]}
          onPress={() => console.log("상세페이지 이동")} // 나중에 WebView 연결할 곳
        >
          <Text style={styles.mainButtonText}>가게 상세 정보 더보기</Text>
          <Ionicons name="chevron-forward" size={18} color="#fff" />
        </TouchableOpacity>
      {/* </View> */}
    </BottomSheetView>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 24, flex: 1 },
  center: { padding: 50, alignItems: "center", justifyContent: "center" },
  loadingText: { marginTop: 10, color: "#999", fontSize: 14 },
  content: { minHeight: 150, marginBottom: 20 },
  header: { marginBottom: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  badge: {
    backgroundColor: "#FFF4E5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  badgeText: { color: "#FF8C00", fontSize: 13, fontWeight: "700" },
  infoSection: { marginBottom: 30 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    paddingRight: 10,
  },
  text: { marginLeft: 12, color: "#4D4D4D", fontSize: 16, lineHeight: 22 },
  linkText: {
    color: "#007AFF",
    textDecorationLine: "underline",
    fontWeight: "500",
  },
  mainButton: {
    backgroundColor: "#FF8C00",
    flexDirection: "row",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
    }),
  },
  mainButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 6,
  },
  // 사진 섹션 스타일 추가
  photoSection: { marginHorizontal: -24, marginBottom: 12 }, // 부모 패딩 무시하고 화면 꽉 채우기
  photoListContent: { paddingHorizontal: 24 }, // 양 끝 여백
  photo: {
    width: SCREEN_WIDTH - 64, // 사진 한 장 너비 (스크롤 간격 조절)
    height: 180, // 사진 높이
    borderRadius: 14, // 사진 모서리 둥글게
    marginRight: 16, // 사진 사이 간격
  },
  noPhotoBox: {
    width: "100%",
    height: 120,
    backgroundColor: "#f5f5f5",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
});

export default ShopDetailSheet;
