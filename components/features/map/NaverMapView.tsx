// components/features/map/NaverMapView.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NaverMapView } from '@mj-studio/react-native-naver-map';
import MapMarker from './MapMarker';

interface NaverMapViewProps {
  shops: any[];
  onMarkerPress: (shop: any) => void;
}

const NaverMapViewComponent = ({ shops, onMarkerPress }: NaverMapViewProps) => {
  // 동대구역 좌표
  // @TODO constants로 바꾸기
  const DONGDAEGU_STATION = {
    latitude: 35.8774,
    longitude: 128.6274,
  };

  return (
    <View style={styles.container}>
      <NaverMapView
        style={styles.map}
        initialCamera={{
          latitude: DONGDAEGU_STATION.latitude,
          longitude: DONGDAEGU_STATION.longitude,
          zoom: 14, // 숫자가 클수록 더 확대됩니다.
        }}
      >
        {shops.map((shop) => (
          <MapMarker
          key={shop.id}
          shop={shop}
          onPress={onMarkerPress} // 부모로부터 받은 함수를 그대로 전달 
          />
        ))}
      </NaverMapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
});

export default NaverMapViewComponent;