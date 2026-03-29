// components/features/map/ShopHeader.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Platform } from 'react-native';
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Image } from 'expo-image';
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// 사진 한 장의 너비를 결정합니다. (화면 전체 너비 - 양옆 여백)
const PHOTO_WIDTH = SCREEN_WIDTH - 48; // 부모 패딩(24*2)을 고려한 너비
const PHOTO_GAP = 16; // 사진 사이의 간격

interface Props {
  name: string;
  photos: string[];
}

const ShopHeader = ({ name, photos }: Props) => {
  const renderPhotoItem = ({ item }: { item: string }) => (
    <Image source={{ uri: item }} style={styles.photo} contentFit="cover" transition={300} />
  );

  return (
    <View style={styles.container}>
      {photos && photos.length > 0 ? (
        <View style={styles.photoSection}>
        {/* 일반 FlatList 대신 BottomSheetFlatList를 사용하면 
           바텀시트 내부에서의 스크롤 충돌을 라이브러리가 알아서 처리해줍니다.
        */}
        <BottomSheetFlatList
          data={photos}
          renderItem={renderPhotoItem}
          keyExtractor={(item: any) => item}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24 }}
          
          // 👈 자석 효과를 위한 속성들
          snapToInterval={PHOTO_WIDTH + PHOTO_GAP}
          snapToAlignment="start"
          decelerationRate="fast"
          
          // 👈 [중요] 시트가 스크롤을 뺏어가지 못하게 방어하는 속성
          disallowInterruption={true} 
          extraData={photos}
        />
      </View>
      ) : (
        <View style={styles.noPhotoBox}>
          <Ionicons name="image-outline" size={40} color="#ccc" />
        </View>
      )}

      <View style={styles.titleSection}>
        <Text style={styles.title} numberOfLines={1}>{name}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>🥐 소금빵 맛집</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    marginBottom: 10 },
  photoSection: { width: SCREEN_WIDTH,marginHorizontal: -24, marginBottom: 16 },
  photoListContent: { paddingHorizontal: 24 },
  photo: { width: PHOTO_WIDTH, height: 180, borderRadius: 14, marginRight: PHOTO_GAP },
  noPhotoBox: { 
    width: SCREEN_WIDTH - 48, // 부모 패딩을 고려한 너비
    height: 120, 
    backgroundColor: '#f5f5f5', 
    borderRadius: 14, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 16,
    alignSelf: 'center' // 중앙 정렬
  },
  titleSection: { marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "bold", color: "#1A1A1A", marginBottom: 8 },
  badge: { backgroundColor: "#FFF4E5", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: "flex-start" },
  badgeText: { color: "#FF8C00", fontSize: 13, fontWeight: "700" },
});

export default ShopHeader;