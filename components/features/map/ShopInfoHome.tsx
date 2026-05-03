// components/features/map/ShopInfoHome.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from "@expo/vector-icons";
import ShopTagList from './ShopTagList';
import { ShopTabType } from './ShopTabs';

interface Props {
  shop: any;
  onTabChange?: (tab: ShopTabType) => void;
}

const ShopInfoHome = ({ shop, onTabChange }: Props) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ShopTagList
        shopId={shop.shopId}
        onPressMore={onTabChange ? () => onTabChange('리뷰') : undefined}
      />
      <InfoItem icon="location-outline" text={shop.address?.road || '주소 정보가 없습니다.'} />
      <InfoItem icon="time-outline" text={shop.hoursRaw || '영업시간 정보가 없습니다.'} />

      {shop.telephone && (
        <TouchableOpacity onPress={() => Linking.openURL(`tel:${shop.telephone}`)}>
          <InfoItem icon="call-outline" text={shop.telephone} isLink iconColor="#007AFF" />
        </TouchableOpacity>
      )}

      {shop.links?.instagram && (
        <TouchableOpacity onPress={() => Linking.openURL(shop.links.instagram)}>
          <InfoItem icon="logo-instagram" text="인스타그램 방문하기" isLink iconColor="#E1306C" />
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const InfoItem = ({ icon, text, isLink, iconColor = "#666" }: any) => (
  <View style={styles.item}>
    <Ionicons name={icon} size={20} color={iconColor} />
    <Text style={[styles.text, isLink && styles.linkText]}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { paddingVertical: 10 },
  item: { flexDirection: 'row', alignItems: 'flex-start', marginVertical: 10 },
  text: { marginLeft: 12, color: '#4D4D4D', fontSize: 16, lineHeight: 22, flex: 1 },
  linkText: { color: '#007AFF', textDecorationLine: 'underline', fontWeight: '500' },
});

export default ShopInfoHome;
