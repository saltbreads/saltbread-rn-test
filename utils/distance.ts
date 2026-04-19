// utils/distance.ts

/**
 * 하버사인 공식(Haversine Formula)을 이용한 거리 계산
 */
export function getDistanceKm(
  pos1: { lat: number; lng: number },
  pos2: { lat: number; lng: number }
): number {
  const R = 6371; // 지구 반지름 (km)
  const dLat = (pos2.lat - pos1.lat) * (Math.PI / 180);
  const dLon = (pos2.lng - pos1.lng) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(pos1.lat * (Math.PI / 180)) *
      Math.cos(pos2.lat * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * 거리를 읽기 쉬운 포맷으로 변환 (1km 미만은 m, 이상은 km)
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(1)}km`;
}
