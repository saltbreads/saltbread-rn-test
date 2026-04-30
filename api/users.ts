// api/users.ts
import { BASE_URL } from "@/constants/config";
import { AuthFetchFn } from "@/context/AuthContext";

const { API_URL, ENDPOINTS } = BASE_URL;

// TODO: UserProfile, FavoriteShop 등 공용 타입은 types/ 디렉토리로 분리 예정
export interface UserProfile {
  id: string;
  displayName: string;
  nickname: string | null;
  profileImageUrl: string;
  email: string;
  provider: string;
  favoriteCount: number;
}

export interface FavoriteShop {
  shopId: string;
  name: string;
  heroImageUrl: string;
  region: string;
  createdAt: string;
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
