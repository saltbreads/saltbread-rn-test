// constants/tabs.ts

// 가게 상세 탭
export const SHOP_TAB = {
  HOME: '홈',
  MENU: '메뉴',
  REVIEW: '리뷰',
  PHOTO: '사진',
} as const;

export type ShopTabType = typeof SHOP_TAB[keyof typeof SHOP_TAB];

// 마이페이지 탭
export const MY_PAGE_TAB = {
  FAVORITES: 'favorites',
  REVIEWS: 'reviews',
} as const;

export type MyPageTabType = typeof MY_PAGE_TAB[keyof typeof MY_PAGE_TAB];
