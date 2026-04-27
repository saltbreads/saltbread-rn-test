// api/favorites.ts
import { BASE_URL } from "@/constants/config";

const { API_URL, ENDPOINTS } = BASE_URL;

export const addFavorite = async (shopId: string, accessToken: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}${ENDPOINTS.SHOP_FAVORITE(shopId)}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.ok;
  } catch (error) {
    console.error("addFavorite 에러:", error);
    return false;
  }
};

export const removeFavorite = async (shopId: string, accessToken: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}${ENDPOINTS.SHOP_FAVORITE(shopId)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.ok;
  } catch (error) {
    console.error("removeFavorite 에러:", error);
    return false;
  }
};
