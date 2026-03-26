// hooks/map/useMapControl.ts
import { useRef, useState, useCallback } from 'react';
import { NaverMapViewRef } from '@mj-studio/react-native-naver-map';

export const useMapControl = () => {
  const mapRef = useRef<NaverMapViewRef>(null);
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);

  // 지도를 특정 좌표로 부드럽게 이동시키는 함수
  const moveCamera = useCallback((latitude: number, longitude: number) => {
    mapRef.current?.animateCameraTo({
      latitude,
      longitude,
      duration: 400, // 0.4초 동안 부드럽게 이동
    });
  }, []);

  // 마커 선택 처리
  const selectMarker = useCallback((shopId: string, latitude: number, longitude: number) => {
    setSelectedShopId(shopId);
    moveCamera(latitude, longitude);
  }, [moveCamera]);

  // 선택 해제
  const clearSelection = useCallback(() => {
    setSelectedShopId(null);
  }, []);

  return {
    mapRef,
    selectedShopId,
    selectMarker,
    clearSelection,
  };
};