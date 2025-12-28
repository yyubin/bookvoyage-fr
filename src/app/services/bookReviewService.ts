import type { BookReviewPageResponse } from "../types/content";
import { apiFetchJson } from "./apiClient";

export async function getBookReviews(
  bookId: number | string,
  query: { cursor: number | null; size: number; sort?: string },
): Promise<BookReviewPageResponse> {
  const params = new URLSearchParams();
  if (query.cursor !== null) {
    params.set("cursor", String(query.cursor));
  }
  params.set("size", String(query.size));
  if (query.sort) {
    params.set("sort", query.sort);
  }
  return apiFetchJson<BookReviewPageResponse>(
    `/api/books/${bookId}/reviews?${params.toString()}`,
  );
}
