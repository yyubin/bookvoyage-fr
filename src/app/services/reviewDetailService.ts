import { headers } from "next/headers";
import { API_BASE_URL } from "./authService";
import type { ReviewResponse } from "../types/content";

export type ReviewDetailResult = {
  review: ReviewResponse | null;
  status: number;
};

export async function getReviewDetail(
  reviewId: number | string,
): Promise<ReviewDetailResult> {
  const cookieHeader = (await headers()).get("cookie");
  const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`, {
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    return { review: null, status: response.status };
  }

  return { review: (await response.json()) as ReviewResponse, status: 200 };
}
