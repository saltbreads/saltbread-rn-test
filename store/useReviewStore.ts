// store/useReviewStore.ts
import { create } from 'zustand';

interface ReviewStore {
  selectedReviewId: string | null;
  setSelectedReview: (reviewId: string) => void;
  clear: () => void;
}

export const useReviewStore = create<ReviewStore>((set) => ({
  selectedReviewId: null,
  setSelectedReview: (reviewId) => set({ selectedReviewId: reviewId }),
  clear: () => set({ selectedReviewId: null }),
}));
