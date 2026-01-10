import { headers } from "next/headers";
import { API_BASE_URL } from "./authService";
import type {
  BookmarkPageResponse,
  UserBookListResponse,
  UserBookResponse,
  UserReviewPageResponse,
} from "../types/content";

async function fetchWithAuth<T>(path: string): Promise<T> {
  const cookieHeader = (await headers()).get("cookie");
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function getUserBooksByStatus(
  status?: string,
): Promise<UserBookListResponse> {
  const params = new URLSearchParams();
  if (status) {
    params.set("status", status);
  }
  const suffix = params.toString();
  const path = suffix ? `/api/user-books?${suffix}` : "/api/user-books";
  return fetchWithAuth<UserBookListResponse>(path);
}

export async function getUserBookDetail(
  bookId: number | string,
): Promise<UserBookResponse> {
  return fetchWithAuth<UserBookResponse>(`/api/user-books/${bookId}`);
}

export async function getUserReviewsByUser(
  userId: number | string,
  size = 3,
): Promise<UserReviewPageResponse> {
  const params = new URLSearchParams({ size: String(size) });
  return fetchWithAuth<UserReviewPageResponse>(
    `/api/reviews/users/${userId}?${params.toString()}`,
  );
}

export async function getBookmarkedReviews(
  size = 3,
): Promise<BookmarkPageResponse> {
  const params = new URLSearchParams({ size: String(size) });
  return fetchWithAuth<BookmarkPageResponse>(
    `/api/bookmarks?${params.toString()}`,
  );
}
