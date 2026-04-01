// hooks/shop/useShopMenus.ts
import { useState, useCallback } from "react";
import { fetchShopMenus } from "@/api/shops";

export const useShopMenus = (shopId: string) => {
  const [menus, setMenus] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getMenus = useCallback(async () => {
    if (!shopId) return;
    
    setIsLoading(true);
    try {
      const data = await fetchShopMenus(shopId);
      setMenus(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [shopId]);

  return { menus, isLoading, getMenus };
};