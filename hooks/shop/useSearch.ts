// hooks/shop/useSearch.ts

import { BASE_URL } from "@/constants/config";
import { Shop } from "@/types/shop";
import { useEffect, useState } from "react";

export function useSearch(keyword: string, lat: number, lng: number) {
  const [searchResults, setSearchResults] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 1. 키워드가 너무 짧으면 검색하지 않음 (최소 2자 이상 추천)
    if (!keyword || keyword.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    // 2. 타이머 설정 (500ms 동안 입력이 없으면 실행)
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        // radiusKm을 추가해서 좀 더 좁은 범위의 '내 주변' 검색으로 최적화
        const RADIUS = 10; // 10km 반경
        const LIMIT = 20; // 결과 20개 요청

        const url = `${BASE_URL.API_URL}${BASE_URL.ENDPOINTS.SHOP_SEARCH}?lat=${lat}&lng=${lng}&search=${keyword}&radiusKm=${RADIUS}&limit=${LIMIT}`;
        const response = await fetch(url);
        const resJson = await response.json();
        if (resJson.success) {
          setSearchResults(resJson.data);
          // console.log(resJson.data)
        }
      } catch (error) {
        console.error("실시간 검색 에러:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    // 3. 사용자가 다시 타이핑을 시작하면 이전 타이머를 취소 (디바운스의 핵심)
    return () => clearTimeout(timer);
  }, [keyword, lat, lng]);

  return { searchResults, isLoading };
}
