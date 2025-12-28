import { apiFetchJson } from "./apiClient";

type ReviewLikeResponse = {
  isLiked: boolean;
  likeCount: number;
};

export async function toggleReviewLike(
  reviewId: number | string,
): Promise<ReviewLikeResponse> {
  return apiFetchJson<ReviewLikeResponse>(`/api/reviews/${reviewId}/like`, {
    method: "POST",
  });
}
