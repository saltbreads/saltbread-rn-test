// components/features/map/ShopReview.tsx
import { useShopReviews } from "@/hooks/shop/useShopReviews";
import { ShopReviewData } from "@/types/review";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ShopReview = ({ shopId }: { shopId: string }) => {
  const insets = useSafeAreaInsets();

  const { reviews, isLoading, getReviews } = useShopReviews(shopId);

  useEffect(() => {
    getReviews();
  }, [getReviews]);

  if (isLoading) {
    return <ActivityIndicator style={{ padding: 40 }} color="#FF8C00" />;
  }


  const renderReviewItem = ({ item }: { item: ShopReviewData }) => (
    <View style={styles.reviewCard}>
      {/* 유저 정보 영역 */}
      <View style={styles.authorSection}>
        <Image
          source={{ uri: item.author.profileImageUrl || "기본이미지URL" }}
          style={styles.profilePic}
        />
        <View style={styles.authorInfo}>
          <Text style={styles.nickname}>
            {item.author.nickname || "익명 사용자"}
          </Text>
          <Text style={styles.date}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>⭐ {item.rating}</Text>
        </View>
      </View>

      {/* 리뷰 본문 */}
      <Text style={styles.content}>{item.content}</Text>

      {/* 리뷰 이미지들 (가로 스크롤) */}
      {item.images.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imageScroll}
        >
          {item.images.map((img) => (
            <Image
              key={img.id}
              source={{ uri: img.url }}
              style={styles.reviewImage}
              contentFit="cover"
            />
          ))}
        </ScrollView>
      )}
    </View>
  );

  return (
    <BottomSheetFlatList
      data={reviews}
      renderItem={renderReviewItem}
      keyExtractor={(item: { id: any }) => item.id}
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyText}>아직 작성된 리뷰가 없어요. ✍️</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  reviewCard: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  authorSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEE",
  },
  authorInfo: { marginLeft: 10, flex: 1 },
  nickname: { fontSize: 15, fontWeight: "600", color: "#1A1A1A" },
  date: { fontSize: 12, color: "#999", marginTop: 2 },
  ratingBadge: {
    backgroundColor: "#FFF4E5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingText: { color: "#FF8C00", fontSize: 13, fontWeight: "700" },
  content: { fontSize: 15, color: "#4D4D4D", lineHeight: 22, marginBottom: 12 },
  imageScroll: { flexDirection: "row" },
  reviewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: "#F9F9F9",
  },
  empty: { alignItems: "center", paddingVertical: 60 },
  emptyText: { color: "#BBB", fontSize: 14 },
});

export default ShopReview;
