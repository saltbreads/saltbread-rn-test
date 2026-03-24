// components/features/map/ShopDetailSheet.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  Linking,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from 'expo-image';

const { width: SCREEN_WIDTH } = Dimensions.get("window"); // 화면 너비 가져오기

interface Props {
  shop: any;
  photos: string[];
  isLoading: boolean;
}

const ShopDetailSheet = ({ shop, photos, isLoading }: Props) => {
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="small" color="#FF8C00" />
        <Text style={styles.loadingText}>정보를 가져오는 중...</Text>
      </View>
    );
  }

  if (!shop) return null;

  // 전화걸기 함수
  const handlePhoneCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  // 인스타그램 열기 함수
  const handleInstagram = (url: string) => {
    if (url) Linking.openURL(url);
  };

  // 횡스크롤 이미지 배너 렌더링 함수
  const renderPhotoItem = ({ item }: { item: string }) => (
    <Image 
      source={{ uri: item }} 
      style={styles.photo} 
      contentFit="cover" // 이미지 비율 유지하며 채우기
      transition={300} // 로딩 시 페이드인 효과
    />
  );

  return (
    <View style={styles.container}>
      {/* 상단 사진 횡스크롤 영역 추가 */}
      {photos && photos.length > 0 ? (
        <View style={styles.photoSection}>
          <FlatList
            data={photos}
            renderItem={renderPhotoItem}
            keyExtractor={(item) => item}
            horizontal // 가로 스크롤 활성화
            showsHorizontalScrollIndicator={false} // 스크롤바 숨기기
            snapToInterval={SCREEN_WIDTH - 48} // 한 장씩 멈추는 효과 (패딩 고려)
            decelerationRate="fast"
            contentContainerStyle={styles.photoListContent}
          />
        </View>
      ) : (
        // 사진이 없을 때 대체할 기본 소금빵 아이콘 또는 회색 박스
        <View style={styles.noPhotoBox}>
          <Ionicons name="image-outline" size={40} color="#ccc" />
        </View>
      )}


      {/* 상단 제목 섹션 */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>
            {shop.name}
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>🥐 소금빵 맛집</Text>
          </View>
        </View>
      </View>

      {/* 상세 정보 리스트 섹션 */}
      <View style={styles.infoSection}>
        {/* 주소 */}
        <InfoItem
          icon="location-outline"
          text={shop.address?.road || "주소 정보가 없습니다."}
        />

        {/* 영업 시간 */}
        <InfoItem
          icon="time-outline"
          text={shop.hoursRaw || "영업시간 정보가 없습니다."}
        />

        {/* 전화번호 (클릭 시 전화연결) */}
        {shop.telephone && (
          <TouchableOpacity onPress={() => handlePhoneCall(shop.telephone)}>
            <InfoItem
              icon="call-outline"
              text={shop.telephone}
              isLink
              iconColor="#007AFF"
            />
          </TouchableOpacity>
        )}

        {/* 인스타그램 (클릭 시 앱 연결) */}
        {shop.links?.instagram && (
          <TouchableOpacity
            onPress={() => handleInstagram(shop.links.instagram)}
          >
            <InfoItem
              icon="logo-instagram"
              text="인스타그램 방문하기"
              isLink
              iconColor="#E1306C"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* 하단 메인 버튼 */}
      <TouchableOpacity
        style={styles.mainButton}
        onPress={() => console.log("상세페이지 이동")} // 나중에 WebView 연결할 곳
      >
        <Text style={styles.mainButtonText}>가게 상세 정보 더보기</Text>
        <Ionicons name="chevron-forward" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

// 재사용 가능한 정보 아이템 컴포넌트
const InfoItem = ({ icon, text, isLink, iconColor = "#666" }: any) => (
  <View style={styles.item}>
    <Ionicons name={icon} size={20} color={iconColor} />
    <Text style={[styles.text, isLink && styles.linkText]}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { paddingHorizontal: 24, paddingVertical: 10 },
  center: { padding: 50, alignItems: "center", justifyContent: "center" },
  loadingText: { marginTop: 10, color: "#999", fontSize: 14 },
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
    marginRight: 16 // 사진 사이 간격
  },
  noPhotoBox: { 
    width: '100%', 
    height: 120, 
    backgroundColor: '#f5f5f5', 
    borderRadius: 14, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 16
  },
});

export default ShopDetailSheet;
