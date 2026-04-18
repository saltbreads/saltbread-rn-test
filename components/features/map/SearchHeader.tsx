// components/features/map/SearchHeader.tsx

import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export function SearchHeader() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput placeholder="맛있는 소금빵 검색" style={styles.input} />
        {/* 네이버 지도 스타일의 프로필 아이콘 */}
        <TouchableOpacity onPress={() => router.push('/my-page')}> 
          <Ionicons name="person-circle" size={32} color="#FF6B00" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40, // 상태바 위치 고려
    left: 16,
    right: 16,
    zIndex: 100,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    // 그림자 설정 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  input: { flex: 1, marginLeft: 8 },
});