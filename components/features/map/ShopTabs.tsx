import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export type ShopTabType = '홈' | '메뉴' | '리뷰' | '사진';

interface Props {
  activeTab: ShopTabType;
  onTabChange: (tab: ShopTabType) => void;
}

const ShopTabs = ({ activeTab, onTabChange }: Props) => {
  const tabs: ShopTabType[] = ['홈', '메뉴', '리뷰', '사진'];

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
    backgroundColor: '#FF8C00',
    borderRadius: 2,
  },
});

export default ShopTabs;