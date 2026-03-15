// api/shops.ts
import { BASE_URL } from "@/constants/config";

export const fetchShopLocations = async () => {
  try {
    const response = await fetch(
      `${BASE_URL.API_URL}${BASE_URL.ENDPOINTS.SHOPS_LOCATIONS}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const json = await response.json();
    return json; // { success: true, data: [...] }
  } catch (error) {
    console.error("Failed to fetch shop locations:", error);
    return { success: false, data: [] };
  }
};
