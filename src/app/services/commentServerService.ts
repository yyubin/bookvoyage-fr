import { headers } from "next/headers";
import { API_BASE_URL } from "./authService";
import type { CommentPageResponse } from "../types/content";

type CommentQuery = {
  cursor?: number | null;
  size?: number;
};

export async function getReviewCommentsServer(
  reviewId: number,
  query: CommentQuery = {},
): Promise<CommentPageResponse> {
  const params = new URLSearchParams();
  if (query.cursor !== undefined && query.cursor !== null) {
    params.set("cursor", String(query.cursor));
  }
  params.set("size", String(query.size ?? 8));

  const cookieHeader = (await headers()).get("cookie");
  const response = await fetch(
    `${API_BASE_URL}/api/reviews/${reviewId}/comments?${params.toString()}`,
    {
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return { comments: [], nextCursor: null, totalCount: 0 };
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return { comments: [], nextCursor: null, totalCount: 0 };
  }

  return (await response.json()) as CommentPageResponse;
}
