import type { CommentPageResponse, CommentResponse } from "../types/content";
import { apiFetchJson } from "./apiClient";

export async function getCommentsByReview(
  reviewId: number,
  query: { cursor: number | null; limit: number },
): Promise<CommentPageResponse> {
  const params = new URLSearchParams();
  if (query.cursor !== null) {
    params.set("cursor", String(query.cursor));
  }
  params.set("size", String(query.limit));
  return apiFetchJson<CommentPageResponse>(
    `/api/reviews/${reviewId}/comments?${params.toString()}`,
  );
}

export async function createComment(
  reviewId: number,
  content: string,
  parentCommentId?: number | null,
): Promise<CommentResponse> {
  return apiFetchJson<CommentResponse>(`/api/reviews/${reviewId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content, parentCommentId: parentCommentId ?? null }),
  });
}
