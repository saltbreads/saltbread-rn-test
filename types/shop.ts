// types/shop.ts
export interface ShopMenuData {
  id: string;
  name: string;
  price: number;
  priceText: string;
  displayPrice: number;
  imageUrl: string | null;
}

export interface ShopPhotoItem {
  id: string;
  url: string;
  reviewId: string;
  createdAt: string;
}

export interface ShopPhotosResponse {
  hero: { url: string } | null;
  items: ShopPhotoItem[];
  nextCursor: string | null;
  hasNext: boolean;
}

export interface Shop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  region: string;
  heroImageUrl: string | null;
  avgPrice: number | null;
  avgRating: number;
  reviewCount: number;
  bestLabels: string[];
}

// API 응답 형태도 정의해두면 더 안전합니다.
export interface SearchShopsResponse {
  success: boolean;
  data: Shop[];
}