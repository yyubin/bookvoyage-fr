import { headers } from "next/headers";
import { API_BASE_URL } from "./authService";
import type {
  BookRecommendationResponse,
  ReviewRecommendationResponse,
} from "../types/content";

export type RecommendationResult = {
  response: BookRecommendationResponse;
  status: number;
};

export type ReviewRecommendationResult = {
  response: ReviewRecommendationResponse;
  status: number;
};

type BookRecommendationQuery = {
  cursor?: number | null;
  limit?: number;
  forceRefresh?: boolean;
  enableSampling?: boolean;
};

type ReviewRecommendationQuery = {
  cursor?: number | null;
  limit?: number;
  forceRefresh?: boolean;
};

export async function getBookRecommendationsServer(
  query: BookRecommendationQuery = {},
): Promise<RecommendationResult> {
  const {
    cursor,
    limit = 12,
    forceRefresh = false,
    enableSampling = true,
  } = query;
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor !== undefined && cursor !== null) {
    params.set("cursor", String(cursor));
  }
  if (forceRefresh) {
    params.set("forceRefresh", "true");
  }
  params.set("enableSampling", String(enableSampling));

  const cookieHeader = (await headers()).get("cookie");
  const response = await fetch(
    `${API_BASE_URL}/api/recommendations/books?${params.toString()}`,
    {
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return {
      response: {
        items: [],
        totalItems: 0,
        nextCursor: null,
        hasMore: false,
      },
      status: response.status,
    };
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return {
      response: {
        items: [],
        totalItems: 0,
        nextCursor: null,
        hasMore: false,
      },
      status: response.status,
    };
  }

  return {
    response: (await response.json()) as BookRecommendationResponse,
    status: 200,
  };
}

export async function getReviewRecommendationsServer(
  query: ReviewRecommendationQuery = {},
): Promise<ReviewRecommendationResult> {
  const { cursor, limit = 4, forceRefresh = false } = query;
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor !== undefined && cursor !== null) {
    params.set("cursor", String(cursor));
  }
  if (forceRefresh) {
    params.set("forceRefresh", "true");
  }

  const cookieHeader = (await headers()).get("cookie");
  const response = await fetch(
    `${API_BASE_URL}/api/recommendations/reviews?${params.toString()}`,
    {
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return {
      response: {
        items: [],
        totalItems: 0,
        nextCursor: null,
        hasMore: false,
      },
      status: response.status,
    };
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return {
      response: {
        items: [],
        totalItems: 0,
        nextCursor: null,
        hasMore: false,
      },
      status: response.status,
    };
  }

  return {
    response: (await response.json()) as ReviewRecommendationResponse,
    status: 200,
  };
}
