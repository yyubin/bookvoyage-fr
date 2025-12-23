import { reviews } from "../data/reviews";
import type {
  CursorPage,
  CursorQuery,
  ReviewComment,
} from "../types/content";
import { paginateWithCursor } from "./pagination";

type CommentApiResponse = CursorPage<ReviewComment> | null;

async function fetchCommentsFromApi(
  _reviewId: string,
  _query: CursorQuery,
): Promise<CommentApiResponse> {
  return null;
}

export async function getCommentsByReview(
  reviewId: string,
  query: CursorQuery,
): Promise<CursorPage<ReviewComment>> {
  const apiResult = await fetchCommentsFromApi(reviewId, query);
  const fallbackComments =
    reviews.find((item) => item.id === reviewId)?.commentList ?? [];

  if (apiResult && apiResult.items.length > 0) {
    return apiResult;
  }

  return paginateWithCursor({
    items: fallbackComments,
    cursor: query.cursor,
    limit: query.limit,
  });
}
