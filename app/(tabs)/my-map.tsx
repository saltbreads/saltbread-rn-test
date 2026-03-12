// app/(tabs)/my-map.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NaverMapView, NaverMapMarker } from '@mj-studio/react-native-naver-map';

export default function MyMapScreen() {
  return (
    <View style={styles.container}>
      <NaverMapView
        style={styles.map}
        initialCamera={{
          latitude: 37.5665,
          longitude: 126.978,
          zoom: 15,
        }}
        isShowLocationButton={true} // 내 위치 버튼
      >
        {/* 나중에 데이터 연결 시 여기에 마커(핀) 추가 */}
        {/* <NaverMapMarker
          coordinate={{ latitude: 37.5665, longitude: 126.978 }}
          onClick={() => console.log('핀 클릭!')}
          caption={{ text: "서울시청" }}
        /> 
        */}
      </NaverMapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});