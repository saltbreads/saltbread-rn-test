// api/users.ts
import { BASE_URL } from "@/constants/config";
import { AuthFetchFn } from "@/context/AuthContext";

const { API_URL, ENDPOINTS } = BASE_URL;

// TODO: UserProfile, FavoriteShop, MyReview 등 공용 타입은 types/ 디렉토리로 분리 예정
export interface UserProfile {
  id: string;
  displayName: string;
  nickname: string | null;
  profileImageUrl: string;
  email: string;
  provider: string;
  favoriteCount: number;
  reviewCount: number;
  avgRating: number | null;
  ratingDistribution: { '1': number; '2': number; '3': number; '4': number; '5': number };
}

export interface FavoriteShop {
  shopId: string;
  name: string;
  heroImageUrl: string;
  region: string;
  createdAt: string;
}

export interface MyReview {
  id: string;
  rating: number;
  content: string;
  tags: string[];
  images: { id: string; url: string; order: number }[];
  shop: {
    id: string;
    name: string;
    roadAddress: string;
    heroImageUrl: string | null;
  };
  createdAt: string;
}

export interface MyReviewsResponse {
  items: MyReview[];
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
}

export const fetchMe = async (accessToken: string): Promise<UserProfile | null> => {
  try {
    const response = await fetch(`${API_URL}${ENDPOINTS.USERS_ME}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) throw new Error("유저 정보를 불러오는데 실패했습니다.");
    const json = await response.json();
    if (json.success && json.data) return json.data;
    return null;
  } catch (error) {
    console.error("fetchMe 에러:", error);
    return null;
  }
};

export const fetchMyFavorites = async (authFetch: AuthFetchFn): Promise<FavoriteShop[]> => {
  try {
    const response = await authFetch(`${API_URL}${ENDPOINTS.USERS_ME_FAVORITES}`);
    if (!response.ok) throw new Error("찜 목록을 불러오는데 실패했습니다.");
    const json = await response.json();
    if (json.success && json.data) return json.data;
    return [];
  } catch (error) {
    console.error("fetchMyFavorites 에러:", error);
    return [];
  }
};

export const fetchMyReviews = async (
  authFetch: AuthFetchFn,
  params?: { page?: number; limit?: number }
): Promise<MyReviewsResponse | null> => {
  try {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    const qs = query.toString() ? `?${query.toString()}` : '';
    const response = await authFetch(`${API_URL}${ENDPOINTS.USERS_ME_REVIEWS}${qs}`);
    if (!response.ok) throw new Error("내 리뷰 목록을 불러오는데 실패했습니다.");
    const json = await response.json();
    if (json.success && json.data) return json.data;
    return null;
  } catch (error) {
    console.error("fetchMyReviews 에러:", error);
    return null;
  }
};
