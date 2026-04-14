// constants/config.ts

import { Platform } from "react-native";

// 실기기(S25) 테스트를 위해 맥북 IP로 고정
// @YJ - DEV_IP만 바꾸시면 됩니다
const DEV_IP = "10.123.195.158"; 
const API_BASE_URL = `http://${DEV_IP}:4000`;

// 안드로이드 에뮬레이터는 10.0.2.2, iOS나 실기기는 localhost 또는 특정 IP
// const API_BASE_URL =
//   Platform.OS === "android" ? "http://10.0.2.2:4000" : "http://localhost:4000";

export const BASE_URL = {
  API_URL: API_BASE_URL,
  ENDPOINTS: {
    // 가게 관련
    SHOP_LOCATIONS: "/shops/locations",
    SHOP_HOME: (shopId: string) => `/shops/${shopId}/home`,
    SHOP_MENUS: (shopId: string) => `/shops/${shopId}/menus`,
    SHOP_PHOTOS: (shopId: string) => `/shops/${shopId}/photos`,
    SHOP_PHOTO_HIGHLIGHTS: (shopId: string) => `/shops/${shopId}/photo-highlights`,
    
    // 리뷰 관련
    REVIEWS: (shopId: string) => `/shops/${shopId}/reviews`,
    REVIEW_TAGS: (shopId: string) => `/shops/${shopId}/reviews/tags`,
  },
};
