// types/review.ts
export interface ReviewAuthor {
  id: string;
  nickname: string | null;
  displayName: string | null;
  profileImageUrl: string | null;
}

export interface ReviewImage {
  id: string;
  url: string;
  order: number;
}

export interface ShopReviewData {
  id: string;
  rating: number;
  content: string;
  createdAt: string;
  author: ReviewAuthor;
  images: ReviewImage[];
}