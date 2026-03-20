// components/features/map/MapMarker.tsx
import React from 'react';
import { NaverMapMarkerOverlay } from '@mj-studio/react-native-naver-map';

interface MapMarkerProps {
  shop: any; // 가게 전체 데이터를 받음
  onPress: (shop: any) => void; // 클릭 시 가게 전체 정보를 부모에게 전달
}

const MapMarker = ({ shop, onPress }: MapMarkerProps) => {
  return (
    <NaverMapMarkerOverlay
      latitude={shop.latitude}
      longitude={shop.longitude}
      onTap={() => onPress?.(shop)}
      anchor={{ x: 0.5, y: 1 }} // 핀의 발끝이 좌표에 오도록 설정
      caption={{
        text: shop.name,
        textSize: 12,
        color: '#333',
        haloColor: '#fff',
      }}
      // 로컬 이미지를 넣을 때는 'image' prop을 사용합니다.
      // @TODO 하드코딩 바꾸기
      image={require('../../../assets/images/saltBreadPin.png')}
      width={35}
      height={35}
    />
  );
};

export default MapMarker;