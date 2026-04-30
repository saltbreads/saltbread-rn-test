// api/favorites.ts
import { BASE_URL } from "@/constants/config";
import { AuthFetchFn } from "@/context/AuthContext";

const { API_URL, ENDPOINTS } = BASE_URL;

export const addFavorite = async (shopId: string, authFetch: AuthFetchFn): Promise<boolean> => {
  try {
    const response = await authFetch(`${API_URL}${ENDPOINTS.SHOP_FAVORITE(shopId)}`, {
      method: "POST",
    });
    return response.ok;
  } catch (error) {
    console.error("addFavorite 에러:", error);
    return false;
  }
};

export const removeFavorite = async (shopId: string, authFetch: AuthFetchFn): Promise<boolean> => {
  try {
    const response = await authFetch(`${API_URL}${ENDPOINTS.SHOP_FAVORITE(shopId)}`, {
      method: "DELETE",
    });
    return response.ok;
  } catch (error) {
    console.error("removeFavorite 에러:", error);
    return false;
  }
};
