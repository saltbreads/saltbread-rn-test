// hooks/shop/useShopDetail.ts
import { useState, useCallback } from "react";
import { fetchShopDetail } from "@/api/shops";

export const useShopDetail = () => {
  const [selectedShop, setSelectedShop] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getDetail = useCallback(async (shopId: string) => {
    setIsLoading(true);
    try {
      const data = await fetchShopDetail(shopId);
      setSelectedShop(data);
    } catch (error) {
      console.error(error);
      setSelectedShop(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetDetail = useCallback(() => {
    setSelectedShop(null);
  }, []);

  return { selectedShop, isLoading, getDetail, resetDetail };
};