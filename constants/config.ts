// constants/config.ts

// 실기기(S25) 테스트를 위해 맥북 IP로 고정
// @YJ - DEV_IP만 바꾸시면 됩니다
// const DEV_IP = "10.123.195.158";
// const API_BASE_URL = `http://${DEV_IP}:4000`;

// const API_BASE_URL = "https://handball-shelf-crimp.ngrok-free.dev";
const API_BASE_URL = "https://uptight-passable-snowshoe.ngrok-free.dev";

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
    SHOP_PHOTO_HIGHLIGHTS: (shopId: string) =>
      `/shops/${shopId}/photo-highlights`,

    // 검색
    SHOP_SEARCH: "/shops/search",

    // 리뷰 관련
    REVIEWS: (shopId: string) => `/shops/${shopId}/reviews`,
    REVIEW_TAGS: (shopId: string) => `/shops/${shopId}/reviews/tags`,
    AI_TAG_SUGGESTIONS: "/reviews/ai-tag-suggestions",

    // 인증 관련
    AUTH_GOOGLE: "/auth/google",
    AUTH_EXCHANGE: "/auth/exchange",

    // 유저 관련
    USERS_ME: "/users/me",
    USERS_ME_FAVORITES: "/users/me/favorites",

    // 찜하기
    SHOP_FAVORITE: (shopId: string) => `/shops/${shopId}/favorite`,
  },
};

// 클라우디너리 관련
export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: "dhfxqpzro",
  UPLOAD_PRESET: "saltbread_review_upload",
  FOLDER: "saltbread-map/reviews",
};
