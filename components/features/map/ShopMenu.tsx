// components/features/map/ShopMenu.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import { useShopMenus } from '@/hooks/shop/useShopMenus';
import { ShopMenuData } from '@/types/shop'; 
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppColors } from '@/constants/theme';

interface Props {
  shopId: string;
}

const ShopMenu = ({ shopId }: Props) => {
  const { menus, isLoading, getMenus } = useShopMenus(shopId);
  const insets = useSafeAreaInsets();
  // console.log("현재 shopId:", shopId); 
  // console.log("메뉴 데이터 길이:", menus?.length); 

  useEffect(() => {
    getMenus();
  }, [getMenus]);

  if (isLoading) return <ActivityIndicator style={{ padding: 40 }} color={AppColors.primary} />;

  const renderMenuItem = ({ item }: { item: ShopMenuData }) => (
    <View style={styles.menuItem}>
      <View style={styles.menuTextContent}>
        <Text style={styles.menuName}>{item.name}</Text>
        {/* 서버에서 준 priceText를 그대로 사용합니다 */}
        <Text style={styles.menuPrice}>{item.priceText}</Text>
      </View>
      
      {item.imageUrl ? (
        <Image 
          source={{ uri: item.imageUrl }} 
          style={styles.menuImage} 
          contentFit="cover" 
          transition={200} 
        />
      ) : (
        // 이미지가 없을 때 보여줄 회색 박스나 기본 아이콘
        <View style={styles.noImage}>
          <Text style={{ color: '#ccc', fontSize: 10 }}>No Image</Text>
        </View>
      )}
    </View>
  );

  return (
    
    <BottomSheetFlatList
      data={menus}
      renderItem={renderMenuItem}
      keyExtractor={(item: { id: any; }) => item.id}
      // 👈 1. 스타일 추가: 리스트 자체가 남은 공간을 꽉 채우도록 합니다.
      style={{ flex: 1 }} 
      // 👈 2. 컨텐츠 패딩: 하단 버튼에 메뉴 마지막 아이템이 가려지지 않게 여백을 넉넉히 줍니다.
      contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom }]} 
      focusHook={useEffect} // 바텀시트 내부 포커스 최적화
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>등록된 메뉴 정보가 없어요. 🥐</Text>
        </View>
      }
    />
    
  );
};

const styles = StyleSheet.create({
  listContent: { paddingHorizontal: 2 },
  container: { paddingBottom: 20 },
  menuItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingVertical: 14, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F5F5F5' 
  },
  menuTextContent: { flex: 1, paddingRight: 12 },
  menuName: { fontSize: 16, fontWeight: '600', color: '#1A1A1A', marginBottom: 4 },
  menuPrice: { fontSize: 15, fontWeight: '700', color: AppColors.primary },
  menuImage: { width: 64, height: 64, borderRadius: 10, backgroundColor: '#f9f9f9' },
  noImage: { 
    width: 64, 
    height: 64, 
    borderRadius: 10, 
    backgroundColor: '#F0F0F0', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  emptyContainer: { alignItems: 'center', paddingVertical: 50 },
  emptyText: { color: '#BBB', fontSize: 14 },
});

export default ShopMenu;