// components/features/map/SearchHeader.tsx

import { useSearch } from "@/hooks/shop/useSearch";
import { Shop } from "@/types/shop";
import { getDistanceKm, formatDistance} from "@/utils/distance";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SearchHeaderProps {
  onSelectShop: (shop: Shop) => void;
}

export function SearchHeader({ onSelectShop }: SearchHeaderProps) {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);

  // 지도의 현재 중심 좌표 (실제로는 Zustand나 Context에서 가져와야 함)
  // @TODO 내위치 가져오고 zustand나 상태관리 이용해서 clat, clng 적용
  const currentLat = 35.8774;
  const currentLng = 128.6274;

  // 디바운스 훅 사용
  const { searchResults, isLoading } = useSearch(text, currentLat, currentLng);

  // 거리계산
  const shopsWithDistance = useMemo(() => {
    if (!searchResults) return [];

    return searchResults
      .map((shop) => {
        const km = getDistanceKm(
          { lat: currentLat, lng: currentLng },
          { lat: shop.latitude, lng: shop.longitude }
        );
        return { ...shop, distanceKm: km };
      })
      // .sort((a, b) => a.distanceKm - b.distanceKm); // 거리순 정렬!
      // 근데 이미 거리순으로 백엔드에서 주니까 주석처리함
  }, [searchResults, currentLat, currentLng]);

  // 🚀 검색 결과 항목을 그리는 함수
  const renderSearchItem = ({ item }: { item: Shop & { distanceKm: number } }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => {
        // 키보드 내리기
        Keyboard.dismiss();
        // TextInput 커서 포커스 해제 (깜빡이는 커서 없애기)
        inputRef.current?.blur();
        // 드롭다운 목록 숨기기
        setIsFocused(false);
        // 입력창 텍스트를 클릭한 가게 이름으로 바꾸기
        setText(item.name);

        // 지도로 좌표 전달 (이 부분은 지도를 컨트롤하는 부모 컴포넌트에 알리거나
        //    Zustand 스토어의 center 좌표를 업데이트해야 합니다)
        // 예: mapStore.setCenter(item.latitude, item.longitude);
        // 부모(my-map.tsx)의 handleMarkerPress 실행
        onSelectShop(item);
      }}
    >
      <Ionicons name="location-outline" size={18} color="#888" />
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        {/* 주소 데이터가 있다면 여기에 추가 (현재 JSON엔 없음) */}
      </View>
      <Text style={styles.itemDistance}>{formatDistance(item.distanceKm)}</Text>
      
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          placeholder="맛있는 소금빵 검색"
          style={styles.input}
          value={text}
          ref={inputRef}
          onChangeText={setText} // 글자 바뀔 때마다 상태 업데이트
          onFocus={() => setIsFocused(true)} // 포커스 시 목록 표시
        />

        {isLoading && (
          <ActivityIndicator
            size="small"
            color="#FF6B00"
            style={{ marginRight: 8 }}
          />
        )}

        {/* 네이버 지도 스타일의 프로필 아이콘 */}
        <TouchableOpacity onPress={() => router.push("/my-page")}>
          <Ionicons name="person-circle" size={32} color="#FF6B00" />
        </TouchableOpacity>
      </View>

      {/* 🚀 검색 결과 목록 (드롭다운) */}
      {isFocused && text.length >= 2 && (
        <View style={styles.dropdown}>
          {searchResults.length > 0 ? (
            <FlatList
              data={shopsWithDistance}
              renderItem={renderSearchItem}
              keyExtractor={(item) => item.id}
              style={styles.list}
              keyboardShouldPersistTaps="handled" // 목록 클릭 잘 되게
            />
          ) : (
            // 결과가 없을 때
            !isLoading && (
              <View style={styles.noResult}>
                <Text style={styles.noResultText}>
                  검색 결과가 없습니다. 🥐
                </Text>
              </View>
            )
          )}
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 40, // 상태바 위치 고려
    left: 16,
    right: 16,
    zIndex: 100,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
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

  // 🚀 드롭다운 스타일
  dropdown: {
    backgroundColor: "white",
    marginTop: 10,
    borderRadius: 20,
    maxHeight: 300, // 너무 길어지지 않게
    overflow: "hidden",
    // 그림자
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  list: {
    paddingVertical: 5,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#efefef",
  },
  itemTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  itemName: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  // 거리 스타일
  itemDistance: {
    fontSize: 13,
    color: '#FF6B00',
    marginTop: 2,
    fontWeight: '600',
  },
  itemRegion: {
    fontSize: 12,
    color: "#999",
    marginLeft: 10,
  },
  noResult: {
    padding: 30,
    alignItems: "center",
  },
  noResultText: {
    color: "#999",
    fontSize: 14,
  },
});
