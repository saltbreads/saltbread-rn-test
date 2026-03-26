// components/features/map/NaverMapView.tsx
import { NaverMapView, NaverMapViewRef } from "@mj-studio/react-native-naver-map";
import React,{forwardRef} from "react";
import { StyleSheet, View } from "react-native";
import MapMarker from "./MapMarker";

interface NaverMapViewProps {
  shops: any[];
  onMarkerPress: (shop: any) => void;
  selectedShopId: string | null;
}

// 동대구역 좌표
const DONGDAEGU_STATION = {
  latitude: 35.8774,
  longitude: 128.6274,
};

// forwardRef로 감싸서 부모의 mapRef를 NaverMapView에 연결합니다.
const NaverMapViewComponent = forwardRef<NaverMapViewRef, NaverMapViewProps>(
  ({ shops, onMarkerPress, selectedShopId }, ref) => {
    return (
      <View style={styles.container}>
        <NaverMapView
          ref={ref} // 👈 부모에서 내려준 ref를 여기에 연결!
          style={styles.map}
          initialCamera={{
            latitude: DONGDAEGU_STATION.latitude,
            longitude: DONGDAEGU_STATION.longitude,
            zoom: 14,
          }}
        >
          {shops.map((shop) => (
            <MapMarker
              key={shop.id}
              shop={shop}
              onPress={onMarkerPress}
              // 현재 이 마커가 선택된 마커인지 판단하여 전달
              isSelected={selectedShopId === shop.id} 
            />
          ))}
        </NaverMapView>
      </View>
    );
  }
);

NaverMapViewComponent.displayName = "NaverMapViewComponent";

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
});

export default NaverMapViewComponent;
