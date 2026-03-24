// hooks/shop/useShopDetail.ts
import { fetchShopDetail, fetchShopPhotoHighlights } from "@/api/shops";
import { useCallback, useState } from "react";

export const useShopDetail = () => {
  const [selectedShop, setSelectedShop] = useState<any>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const getDetail = useCallback(async (shopId: string) => {
    setIsLoading(true);
    try {
      // 두 API를 병렬로 호출하여 성능을 높입니다.
      const [detailData, photoData] = await Promise.all([
        fetchShopDetail(shopId),
        fetchShopPhotoHighlights(shopId),
      ]);
      setSelectedShop(detailData);
      setPhotos(photoData); // 사진 배열 저장
    } catch (error) {
      console.error(error);
      setSelectedShop(null);
      setPhotos([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetDetail = useCallback(() => {
    setSelectedShop(null);
    setPhotos([]);
  }, []);

  return { selectedShop, photos, isLoading, getDetail, resetDetail };
};
