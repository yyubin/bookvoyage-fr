import { headers } from "next/headers";
import { API_BASE_URL } from "./authService";
import type { TrendingKeywordResponse } from "../types/content";

export type TrendingKeywordResult = {
  response: TrendingKeywordResponse | null;
  status: number;
};

export async function getTrendingKeywordsServer(
  limit = 6,
  window = "daily",
): Promise<TrendingKeywordResult> {
  try {
    const cookieHeader = (await headers()).get("cookie");
    const params = new URLSearchParams({
      limit: String(limit),
      window,
    });
    const response = await fetch(
      `${API_BASE_URL}/api/search/keywords/trending?${params.toString()}`,
      {
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
        cache: "no-store",
      },
    );

    if (!response.ok) {
      console.warn(
        "[search] /api/search/keywords/trending non-ok response",
        response.status,
        response.url,
      );
      return { response: null, status: response.status };
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      console.warn(
        "[search] /api/search/keywords/trending unexpected content-type",
        response.status,
        response.url,
        contentType,
      );
      return { response: null, status: response.status };
    }

    return {
      response: (await response.json()) as TrendingKeywordResponse,
      status: 200,
    };
  } catch (error) {
    console.error("[search] /api/search/keywords/trending failed", error);
    return { response: null, status: 500 };
  }
}
