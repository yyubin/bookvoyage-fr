import { apiFetch, apiFetchJson } from "./apiClient";

type ReactionResponse = {
  reactionId: number;
  reviewId: number;
  userId: number;
  content: string;
  createdAt: string;
};

export async function upsertReaction(
  reviewId: number | string,
  content: string,
): Promise<ReactionResponse> {
  return apiFetchJson<ReactionResponse>(`/api/reviews/${reviewId}/reaction`, {
    method: "PUT",
    body: JSON.stringify({ content }),
  });
}

export async function deleteReaction(
  reviewId: number | string,
): Promise<void> {
  const response = await apiFetch(`/api/reviews/${reviewId}/reaction`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete reaction: ${response.status}`);
  }
}
