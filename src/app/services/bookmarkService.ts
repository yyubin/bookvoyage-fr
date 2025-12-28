import { apiFetch, apiFetchJson } from "./apiClient";

type BookmarkStatusResponse = {
  reviewId: number;
  bookmarked: boolean;
};

export async function addBookmark(
  reviewId: number | string,
): Promise<void> {
  const response = await apiFetch(`/api/reviews/${reviewId}/bookmark`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(`Failed to add bookmark: ${response.status}`);
  }
}

export async function removeBookmark(
  reviewId: number | string,
): Promise<void> {
  const response = await apiFetch(`/api/reviews/${reviewId}/bookmark`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to remove bookmark: ${response.status}`);
  }
}

export async function getBookmarkStatus(
  reviewId: number | string,
): Promise<BookmarkStatusResponse> {
  return apiFetchJson<BookmarkStatusResponse>(
    `/api/reviews/${reviewId}/bookmark`,
  );
}
