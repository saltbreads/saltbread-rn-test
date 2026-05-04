// components/features/map/ShopTabs.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SHOP_TAB, ShopTabType } from '@/constants/tabs';
import { AppColors } from '@/constants/theme';

interface Props {
  activeTab: ShopTabType;
  onTabChange: (tab: ShopTabType) => void;
}

const ShopTabs = ({ activeTab, onTabChange }: Props) => {
  const tabs: ShopTabType[] = [SHOP_TAB.HOME, SHOP_TAB.MENU, SHOP_TAB.REVIEW, SHOP_TAB.PHOTO];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
          onPress={() => onTabChange(tab)}
        >
          <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
            {tab}
          </Text>
          {/* 활성화된 탭 아래에 오렌지색 바 표시 */}
          {activeTab === tab && <View style={styles.indicator} />}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {},
  tabText: {
    fontSize: 15,
    color: '#999',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#1A1A1A',
    fontWeight: 'bold',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    width: '40%',
    height: 3,
    backgroundColor: AppColors.primary,
    borderRadius: 2,
  },
});

export default ShopTabs;