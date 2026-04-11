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