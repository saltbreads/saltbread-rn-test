// api/users.ts
import { BASE_URL } from "@/constants/config";

const { API_URL, ENDPOINTS } = BASE_URL;

export interface UserProfile {
  id: string;
  displayName: string;
  nickname: string | null;
  profileImageUrl: string;
  email: string;
  provider: string;
}

export const fetchMe = async (accessToken: string): Promise<UserProfile | null> => {
  try {
    const response = await fetch(`${API_URL}${ENDPOINTS.USERS_ME}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
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
