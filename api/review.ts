// api/reviews.ts
import { BASE_URL } from "@/constants/config";

const { API_URL, ENDPOINTS } = BASE_URL;

export type ReviewSort = "latest" | "rating";

export type GetShopReviewsParams = {
  page?: number;
  limit?: number;
  sort?: ReviewSort;
};

export type ReviewAuthorDto = {
  id: string;
  nickname: string | null;
  profileImageUrl: string | null;
} | null;

export type ReviewImageDto = {
  id: string;
  url: string;
  order: number;
};

export type ShopReviewDto = {
  id: string;
  rating: number;
  content: string;
  createdAt: string;
  author: ReviewAuthorDto;
  images: ReviewImageDto[];
};

export type ShopReviewsResponse = {
  items: ShopReviewDto[];
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
};

export type ReviewTagDto = {
  id: string;
  label: string;
  count: number;
  externalCount: number | null;
  displayCount: number;
};

export type ShopReviewTagsResponse = {
  items: ReviewTagDto[];
};

export type CreateReviewRequest = {
  shopId: string;
  rating: number;
  content?: string;
  imageUrls?: string[];
  tags?: string[];
  accessToken: string;
};

export type AiTagSuggestionRequest = {
  content: string;
  accessToken: string;
};

export type AiTagSuggestionResponse = {
  items: string[];
};

function buildQueryString(
  params?: Record<string, string | number | undefined>
) {
  if (!params) return "";

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : "";
}

export const fetchShopReviews = async (
  shopId: string,
  params?: GetShopReviewsParams
): Promise<ShopReviewsResponse> => {
  try {
    const queryString = buildQueryString({
      page: params?.page,
      limit: params?.limit,
      sort: params?.sort,
    });

    const response = await fetch(
      `${API_URL}${ENDPOINTS.REVIEWS(shopId)}${queryString}`
    );

    if (!response.ok) {
      throw new Error("리뷰를 불러오는데 실패했습니다.");
    }

    const json = await response.json();

    if (json.success && json.data && Array.isArray(json.data.items)) {
      return json.data;
    }

    return {
      items: [],
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
      total: 0,
      hasNext: false,
    };
  } catch (error) {
    console.error("Failed to fetch shop reviews:", error);

    return {
      items: [],
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
      total: 0,
      hasNext: false,
    };
  }
};

export const fetchShopReviewTags = async (
  shopId: string
): Promise<ShopReviewTagsResponse> => {
  try {
    const response = await fetch(`${API_URL}${ENDPOINTS.REVIEW_TAGS(shopId)}`);

    if (!response.ok) {
      throw new Error("리뷰 태그를 불러오는데 실패했습니다.");
    }

    const json = await response.json();

    if (json.success && json.data && Array.isArray(json.data.items)) {
      return json.data;
    }

    return { items: [] };
  } catch (error) {
    console.error("Failed to fetch shop review tags:", error);
    return { items: [] };
  }
};

export const createShopReview = async ({
  shopId,
  accessToken,
  ...body
}: CreateReviewRequest): Promise<ShopReviewDto | null> => {
  try {
    const response = await fetch(`${API_URL}${ENDPOINTS.REVIEWS(shopId)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json?.message || "리뷰 등록에 실패했습니다.");
    }

    if (json.success && json.data) {
      return json.data;
    }

    return null;
  } catch (error) {
    console.error("Failed to create shop review:", error);
    return null;
  }
};

export const fetchAiTagSuggestions = async ({
  accessToken,
  ...body
}: AiTagSuggestionRequest): Promise<AiTagSuggestionResponse> => {
  try {
    const response = await fetch(`${API_URL}${ENDPOINTS.AI_TAG_SUGGESTIONS}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json?.message || "AI 태그 추천에 실패했습니다.");
    }

    if (json.success && json.data && Array.isArray(json.data.items)) {
      return json.data;
    }

    return { items: [] };
  } catch (error) {
    console.error("Failed to fetch AI tag suggestions:", error);
    return { items: [] };
  }
};
