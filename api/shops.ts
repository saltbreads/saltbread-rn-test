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

export const fetchShopDetail = async (shopId: string) => {
  try {
    const response = await fetch(`${BASE_URL.API_URL}/shops/${shopId}/home`);
    if (!response.ok) throw new Error("가게 정보를 불러오는데 실패했습니다.");
    
    const json = await response.json();
    //@TODO 백엔드 shops.controller @Get(':shopId/home') 이부분 오타 수정되면 같이 수정
    const isSuccessful = json.success || json.sucess;
    if (isSuccessful && json.data) {
      return json.data; // data 객체만 반환
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch shop detail:', error);
    return null;
  }
};

export const fetchShopPhotoHighlights = async (shopId: string) => {
  try {
    const response = await fetch(`${BASE_URL.API_URL}/shops/${shopId}/photo-highlights`);
    if (!response.ok) throw new Error("사진 하이라이트를 불러오는데 실패했습니다.");
    
    const json = await response.json();
    
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
    console.error('Failed to fetch photo highlights:', error);
    return [];
  }
};