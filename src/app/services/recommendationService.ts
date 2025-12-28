import { headers } from "next/headers";
import { API_BASE_URL } from "./authService";
import type { BookRecommendationResponse } from "../types/content";

export type RecommendationResult = {
  response: BookRecommendationResponse;
  status: number;
};

export async function getBookRecommendationsServer(
  limit = 12,
  forceRefresh = false,
): Promise<RecommendationResult> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (forceRefresh) {
    params.set("forceRefresh", "true");
  }

  const cookieHeader = (await headers()).get("cookie");
  const response = await fetch(
    `${API_BASE_URL}/api/recommendations/books?${params.toString()}`,
    {
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return { response: { items: [], totalItems: 0 }, status: response.status };
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return { response: { items: [], totalItems: 0 }, status: response.status };
  }

  return {
    response: (await response.json()) as BookRecommendationResponse,
    status: 200,
  };
}
