// components/features/map/ShopPhotoGrid.tsx
import React, { useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useShopPhotos } from "@/hooks/shop/useShopPhotos";
import { AppColors } from '@/constants/theme';
import { SCREEN_WIDTH } from '@/constants/layout';
// 1. 부모의 패딩(좌우 24씩 총 48)을 제외한 실제 가용 너비를 구합니다.
const REAL_WIDTH = SCREEN_WIDTH - 48; 
// 2. 가용 너비를 3으로 나눕니다.
const COLUMN_SIZE = REAL_WIDTH / 3;

const ShopPhotoGrid = ({ shopId }: { shopId: string }) => {
  const insets = useSafeAreaInsets();
  const { photos, heroPhoto, isLoading, getPhotos } = useShopPhotos(shopId);

  useEffect(() => {
    getPhotos();
  }, [getPhotos]);

  const allPhotos = heroPhoto
    ? [{ id: 'hero', url: heroPhoto }, ...photos]
    : photos;

  const renderPhotoItem = ({ item }: { item: any }) => (
    <View style={styles.photoContainer}>
      <Image source={{ uri: item.url }} style={styles.photo} contentFit="cover" transition={200} />
    </View>
  );

  return (
    <FlatList
      data={allPhotos}
      renderItem={renderPhotoItem}
      keyExtractor={(item: { id: any }) => item.id}
      numColumns={3}
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      ListHeaderComponent={isLoading ? <ActivityIndicator style={{ padding: 40 }} color={AppColors.primary} /> : null}
    />
  );
};

const styles = StyleSheet.create({
  photoContainer: {
    width: COLUMN_SIZE,
    height: COLUMN_SIZE,
    padding: 1, // 얇은 구분선 느낌
  },
  photo: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
});

export default ShopPhotoGrid;