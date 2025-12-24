import { reviews } from "../data/reviews";
import type { CursorPage, CursorQuery, ReviewItem } from "../types/content";
import { paginateWithCursor } from "./pagination";

type ReviewApiResponse = CursorPage<ReviewItem> | null;

async function fetchReviewsFromApi(
  _query: CursorQuery,
): Promise<ReviewApiResponse> {
  return null;
}

export async function getReviews(
  query: CursorQuery,
): Promise<CursorPage<ReviewItem>> {
  const apiResult = await fetchReviewsFromApi(query);

  if (apiResult && apiResult.items.length > 0) {
    return apiResult;
  }

  return paginateWithCursor({
    items: reviews,
    cursor: query.cursor,
    limit: query.limit,
  });
}

export async function getReviewById(
  reviewId: number,
): Promise<ReviewItem | null> {
  const apiResult = await fetchReviewsFromApi({ cursor: null, limit: 100 });
  const fallback = reviews.find((item) => item.id === reviewId) ?? null;

  if (!apiResult) {
    return fallback;
  }

  return apiResult.items.find((item) => item.id === reviewId) ?? fallback;
}
