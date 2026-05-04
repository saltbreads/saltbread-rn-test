// store/useReviewStore.ts
import { create } from 'zustand';
import { MyReview } from '@/api/users';

interface ReviewStore {
  reviews: MyReview[];
  selectedIndex: number;
  setReviewDetail: (reviews: MyReview[], index: number) => void;
  clear: () => void;
}

export const useReviewStore = create<ReviewStore>((set) => ({
  reviews: [],
  selectedIndex: 0,
  setReviewDetail: (reviews, index) => set({ reviews, selectedIndex: index }),
  clear: () => set({ reviews: [], selectedIndex: 0 }),
}));
