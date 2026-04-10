// hooks/shop/useShopReviews.ts
import { useState, useCallback } from 'react';
import axios from 'axios';
import { BASE_URL } from '@/constants/config';
import { ShopReviewData } from '@/types/review';

export const useShopReviews = (shopId: string) => {
  const [reviews, setReviews] = useState<ShopReviewData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const getReviews = useCallback(async () => {
    if (!shopId) return;
    
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL.API_URL}${BASE_URL.ENDPOINTS.REVIEWS(shopId)}`);
      
      // Postman 응답 구조: { success: true, data: { items: [...] } }
      if (response.data.success) {
        setReviews(response.data.data.items);
        setTotal(response.data.data.total);
      }
    } catch (error) {
      console.error("리뷰를 불러오는 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  }, [shopId]);

  return { reviews, isLoading, total, getReviews };
};