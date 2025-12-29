import type {
  BookRecommendationResponse,
  ReviewRecommendationResponse,
} from "../types/content";
import { apiFetchJson } from "./apiClient";

type BookRecommendationQuery = {
  cursor?: number | null;
  limit?: number;
  forceRefresh?: boolean;
};

export async function getBookRecommendations(
  query: BookRecommendationQuery = {},
): Promise<BookRecommendationResponse> {
  const { cursor, limit = 20, forceRefresh = false } = query;
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor !== undefined && cursor !== null) {
    params.set("cursor", String(cursor));
  }
  if (forceRefresh) {
    params.set("forceRefresh", "true");
  }

  return apiFetchJson<BookRecommendationResponse>(
    `/api/recommendations/books?${params.toString()}`,
  );
}

type ReviewRecommendationQuery = {
  cursor?: number | null;
  limit?: number;
  forceRefresh?: boolean;
};

export async function getReviewRecommendations(
  query: ReviewRecommendationQuery = {},
): Promise<ReviewRecommendationResponse> {
  const { cursor, limit = 4, forceRefresh = false } = query;
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor !== undefined && cursor !== null) {
    params.set("cursor", String(cursor));
  }
  if (forceRefresh) {
    params.set("forceRefresh", "true");
  }

  return apiFetchJson<ReviewRecommendationResponse>(
    `/api/recommendations/reviews?${params.toString()}`,
  );
}
