import type { BookRecommendationResponse } from "../types/content";
import { apiFetchJson } from "./apiClient";

export async function getBookRecommendations(
  limit = 20,
  forceRefresh = false,
): Promise<BookRecommendationResponse> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (forceRefresh) {
    params.set("forceRefresh", "true");
  }

  return apiFetchJson<BookRecommendationResponse>(
    `/api/recommendations/books?${params.toString()}`,
  );
}
