// store/useMapStore.ts
import { create } from 'zustand';

interface MapStore {
  pendingShopId: string | null;
  setPendingShopId: (shopId: string) => void;
  clearPendingShopId: () => void;
}

export const useMapStore = create<MapStore>((set) => ({
  pendingShopId: null,
  setPendingShopId: (shopId) => set({ pendingShopId: shopId }),
  clearPendingShopId: () => set({ pendingShopId: null }),
}));
