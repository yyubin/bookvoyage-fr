import { headers } from "next/headers";
import { API_BASE_URL } from "./authService";
import type { ReviewCircleResponse } from "../types/content";

export type ReviewCircleResult = {
  response: ReviewCircleResponse | null;
  status: number;
};

type ReviewCircleQuery = {
  window?: string;
  limit?: number;
};

export async function getReviewCircleTopicsServer(
  query: ReviewCircleQuery = {},
): Promise<ReviewCircleResult> {
  const cookieHeader = (await headers()).get("cookie");
  if (!cookieHeader) {
    return { response: null, status: 401 };
  }

  const params = new URLSearchParams();
  if (query.window) {
    params.set("window", query.window);
  }
  if (query.limit) {
    params.set("limit", String(query.limit));
  }

  const queryString = params.toString();
  const url = `${API_BASE_URL}/api/review-circle/topics${
    queryString ? `?${queryString}` : ""
  }`;

  try {
    const response = await fetch(url, {
      headers: { cookie: cookieHeader },
      cache: "no-store",
      redirect: "manual",
    });

    if (!response.ok) {
      return { response: null, status: response.status };
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return { response: null, status: response.status };
    }

    return {
      response: (await response.json()) as ReviewCircleResponse,
      status: 200,
    };
  } catch (error) {
    console.error("[review-circle] /api/review-circle/topics failed", error);
    return { response: null, status: 500 };
  }
}
