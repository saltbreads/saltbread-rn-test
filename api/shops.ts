// api/shops.ts
import { BASE_URL } from "@/constants/config";

const { API_URL, ENDPOINTS } = BASE_URL;

export const fetchShopLocations = async () => {
  try {
    const url = `${API_URL}${ENDPOINTS.SHOP_LOCATIONS}`;
    console.log("[fetchShopLocations] request url:", url);

    const response = await fetch(url);

    console.log("[fetchShopLocations] status:", response.status);
    console.log("[fetchShopLocations] ok:", response.ok);

    if (!response.ok) {
      console.log("[fetchShopLocations] statusText:", response.statusText);
      throw new Error("Network response was not ok");
    }

    const json = await response.json();

    // console.log("[fetchShopLocations] response json:", json);

    return json; // { success: true, data: [...] }
  } catch (error) {
    console.error("Failed to fetch shop locations:", error);
    return { success: false, data: [] };
  }
};

export const fetchShopDetail = async (shopId: string) => {
  try {
    const url = `${API_URL}${ENDPOINTS.SHOP_HOME(shopId)}`;
    console.log("[fetchShopDetail] request url:", url);

    const response = await fetch(url);

    console.log("[fetchShopDetail] status:", response.status);
    console.log("[fetchShopDetail] ok:", response.ok);

    if (!response.ok) {
      console.log("[fetchShopDetail] statusText:", response.statusText);
      throw new Error("가게 정보를 불러오는데 실패했습니다.");
    }

    const json = await response.json();

    console.log("[fetchShopDetail] response json:", json);

    const isSuccessful = json.success;

    if (isSuccessful && json.data) {
      return json.data; // data 객체만 반환
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch shop detail:", error);
    return null;
  }
};

export const fetchShopPhotoHighlights = async (shopId: string) => {
  try {
    const url = `${API_URL}${ENDPOINTS.SHOP_PHOTO_HIGHLIGHTS(shopId)}`;
    console.log("[fetchShopPhotoHighlights] request url:", url);

    const response = await fetch(url);

    console.log("[fetchShopPhotoHighlights] status:", response.status);
    console.log("[fetchShopPhotoHighlights] ok:", response.ok);

    if (!response.ok) {
      console.log(
        "[fetchShopPhotoHighlights] statusText:",
        response.statusText
      );
      throw new Error("사진 하이라이트를 불러오는데 실패했습니다.");
    }

    const json = await response.json();

    console.log("[fetchShopPhotoHighlights] response json:", json);

    if (json.success && json.data) {
      const { hero, items } = json.data;
      // hero와 items 배열을 합쳐 하나의 URL 배열로 만듭니다.
      const imageUrls: string[] = [];
      if (hero?.url) imageUrls.push(hero.url);
      if (items && items.length > 0) {
        items.forEach((item: any) => {
          if (item.url) imageUrls.push(item.url);
        });
      }
      return imageUrls; // ["heroUrl", "reviewUrl1", ...]
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch photo highlights:", error);
    return [];
  }
};

export const fetchShopMenus = async (shopId: string) => {
  try {
    const url = `${API_URL}${ENDPOINTS.SHOP_MENUS(shopId)}`;
    const response = await fetch(url);
    const json = await response.json();
    if (json.success) {
      return json.data;
    }
    return [];
  } catch (error) {
    console.error("❌ fetchShopMenus 에러 발생:", error);
    return [];
  }
};
