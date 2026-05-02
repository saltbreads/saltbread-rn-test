// components/features/map/ShopHeader.tsx
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useState, useEffect } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// 👈 중요: gorhom이 아닌 gesture-handler에서 직접 가져옵니다.
import { FlatList } from "react-native-gesture-handler";
import { useAuth } from "@/context/AuthContext";
import { addFavorite, removeFavorite } from "@/api/favorites";
import { fetchMyFavorites } from "@/api/users";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const PHOTO_WIDTH = SCREEN_WIDTH - 48;
const PHOTO_GAP = 16;

interface Props {
  shopId: string;
  name: string;
  photos: string[];
}
const GHFlatList = FlatList as any;

const ShopHeader = ({ shopId, name, photos }: Props) => {
  const { isLoggedIn, authFetch } = useAuth();
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;
    fetchMyFavorites(authFetch).then((list) => {
      setFavorited(list.some((s) => s.shopId === shopId));
    });
  }, [shopId, isLoggedIn, authFetch]);

  const handleFavorite = async () => {
    if (!isLoggedIn) return;
    const next = !favorited;
    setFavorited(next);
    const ok = next
      ? await addFavorite(shopId, authFetch)
      : await removeFavorite(shopId, authFetch);
    if (!ok) setFavorited(!next); // 실패 시 롤백
  };

  const renderPhotoItem = ({ item }: { item: string }) => (
    <Image
      source={{ uri: item }}
      style={styles.photo}
      contentFit="cover"
      transition={300}
    />
  );

  return (
    <View style={styles.container}>
      {photos && photos.length > 0 ? (
        <View style={styles.photoSection}>
          <GHFlatList // 👈 원본 핸들러용 FlatList 사용
            data={photos}
            renderItem={renderPhotoItem}
            keyExtractor={(item: string, index: number) => `${item}-${index}`}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.photoListContent,
              // 사진이 한 장일 때는 스크롤 영역이 남지 않도록 조정
              photos.length === 1 && { width: SCREEN_WIDTH },
              // @TODO 사진여러장일때 맨마지막 사진 끝까지 스크롤이후 중앙정렬은 안됨
            ]}
            // 👈 사진이 2장 이상일 때만 스크롤 활성화
            scrollEnabled={photos.length > 1}
            //자석 효과 속성
            snapToInterval={PHOTO_WIDTH + PHOTO_GAP}
            snapToAlignment="start"
            decelerationRate="fast"
            // 제스쳐보정
            activeOffsetX={[-10, 10]} // 가로 민감도 극대화
            failFast={true} // 가로 스크롤 감지 시 즉시 다른 핸들러 취소
            // 대각선 스크롤 시 바텀시트가 개입하지 못하도록 범위를 좁힘
            // y축 이동이 5픽셀만 넘어가도 이 핸들러가 가로 전용임을 명시
            activeOffsetY={[-5, 5]}
          />
        </View>
      ) : (
        <View style={styles.noPhotoBox}>
          <Ionicons name="image-outline" size={40} color="#ccc" />
        </View>
      )}

      {/* ... 나머지 타이틀 섹션 ... */}
      <View style={styles.titleSection}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {name}
          </Text>
          <TouchableOpacity onPress={handleFavorite} style={styles.heartButton}>
            <Ionicons
              name={favorited ? "heart" : "heart-outline"}
              size={26}
              color={favorited ? "#FF4D4D" : "#ccc"}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>🥐 소금빵 맛집</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // 부모인 ShopDetailSheet에서 이미 paddingHorizontal 24를 주고 있으므로
    // width: SCREEN_WIDTH,
    // marginBottom: 10,
  },
  photoSection: {
    width: SCREEN_WIDTH,
    marginHorizontal: -24,
    marginBottom: 16,
  },
  photoListContent: { paddingHorizontal: 24 },
  photo: {
    width: PHOTO_WIDTH,
    height: 180,
    borderRadius: 14,
    marginRight: PHOTO_GAP,
  },
  noPhotoBox: {
    width: SCREEN_WIDTH - 48, // 부모 패딩을 고려한 너비
    height: 180,
    backgroundColor: "#f5f5f5",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: PHOTO_GAP,
    alignSelf: "center", // 중앙 정렬
  },
  titleSection: { marginBottom: 16 },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  heartButton: { padding: 4 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A1A",
    flex: 1,
  },
  badge: {
    backgroundColor: "#FFF4E5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  badgeText: { color: "#FF8C00", fontSize: 13, fontWeight: "700" },
});

export default ShopHeader;
