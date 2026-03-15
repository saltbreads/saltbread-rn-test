// hooks/shop/useShops.ts
import { useState, useEffect } from 'react';
import { fetchShopLocations } from '@/api/shops';

export const useShops = () => {
  const [shops, setShops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadShops = async () => {
    setIsLoading(true);
    const result = await fetchShopLocations();
    if (result.success) {
      setShops(result.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadShops();
  }, []);

  // 데이터를 다시 불러오고 싶을 때를 위해 refetch 함수도 같이 반환해줍니다.
  return { shops, isLoading, refetch: loadShops };
};