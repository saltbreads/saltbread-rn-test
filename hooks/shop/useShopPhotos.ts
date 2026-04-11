// hooks/shop/useShopPhotos.ts
import { useState, useCallback } from 'react';
import axios from 'axios';
import { BASE_URL } from '@/constants/config';
import { ShopPhotoItem, ShopPhotosResponse } from '@/types/shop';

export const useShopPhotos = (shopId: string) => {
  const [photos, setPhotos] = useState<ShopPhotoItem[]>([]);
  const [heroPhoto, setHeroPhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getPhotos = useCallback(async () => {
    if (!shopId) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL.API_URL}${BASE_URL.ENDPOINTS.SHOP_PHOTOS(shopId)}`);
      if (response.data.success) {
        const data: ShopPhotosResponse = response.data.data;
        setHeroPhoto(data.hero?.url || null);
        setPhotos(data.items);
      }
    } catch (error) {
      console.error("사진을 불러오는 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  }, [shopId]);

  return { photos, heroPhoto, isLoading, getPhotos };
};