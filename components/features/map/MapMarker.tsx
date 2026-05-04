// components/features/map/MapMarker.tsx
import React from 'react';
import { NaverMapMarkerOverlay } from '@mj-studio/react-native-naver-map';
import { AppColors } from '@/constants/theme';

interface MapMarkerProps {
  shop: any; // 가게 전체 데이터를 받음
  onPress: (shop: any) => void; // 클릭 시 가게 전체 정보를 부모에게 전달
  isSelected: boolean;
}

const MapMarker = ({ shop, onPress,isSelected }: MapMarkerProps) => {
  return (
    <NaverMapMarkerOverlay
      latitude={shop.latitude}
      longitude={shop.longitude}
      onTap={() => onPress?.(shop)}
      anchor={{ x: 0.5, y: 1 }} // 핀의 발끝이 좌표에 오도록 설정
      caption={{
        text: shop.name,
        textSize: 12,
        // 선택되었을 때 텍스트 색상을 오렌지로 변경
        color: isSelected ? AppColors.primary : '#333',
        haloColor: '#fff',
      }}
      // 로컬 이미지를 넣을 때는 'image' prop을 사용합니다.
      // @TODO 하드코딩 바꾸기
      image={
        isSelected 
          ? require('../../../assets/images/saltBreadPin.png') // 👈 @TODO 준비필요
          : require('../../../assets/images/saltBreadPin.png')
      }
      // 선택되었을 때 핀의 크기를 살짝 키워서 강조 (35 -> 45)
      width={isSelected ? 45 : 35}
      height={isSelected ? 45 : 35}
      // 선택된 마커가 다른 마커보다 항상 위에 보이도록 설정
      zIndex={isSelected ? 100 : 1}
    />
  );
};

export default MapMarker;