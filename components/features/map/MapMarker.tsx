// components/features/map/MapMarker.tsx
import React from 'react';
import { NaverMapMarkerOverlay } from '@mj-studio/react-native-naver-map';

interface MapMarkerProps {
  shop: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
  };
  onPress?: (id: string) => void;
}

const MapMarker = ({ shop, onPress }: MapMarkerProps) => {
  return (
    <NaverMapMarkerOverlay
      latitude={shop.latitude}
      longitude={shop.longitude}
      onTap={() => onPress?.(shop.id)}
      anchor={{ x: 0.5, y: 1 }} // 핀의 발끝이 좌표에 오도록 설정
      caption={{
        text: shop.name,
        textSize: 12,
        color: '#333',
        haloColor: '#fff',
      }}
      // 로컬 이미지를 넣을 때는 'image' prop을 사용합니다.
      image={require('../../../assets/images/saltBreadPin.png')}
      width={35}
      height={35}
    />
  );
};

export default MapMarker;