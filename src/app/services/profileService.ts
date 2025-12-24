import type {
  CursorPage,
  CursorQuery,
  FollowUser,
  BookmarkedReviewItem,
  ProfileSummary,
  ProfileStats,
  ProfileReviewItem,
  ReadingBookItem,
  ShelfStats,
} from "../types/content";
import { apiFetchJson } from "./apiClient";

type ProfileResponse = ProfileSummary;
type FollowResponse = CursorPage<FollowUser>;
type ReviewResponse = CursorPage<ProfileReviewItem>;
type ReadingBooksResponse = ReadingBookItem[];
type BookmarkedReviewsResponse = BookmarkedReviewItem[];

const buildCursorParams = (query: CursorQuery) => {
  const params = new URLSearchParams();
  if (query.cursor !== undefined && query.cursor !== null) {
    params.set("cursor", String(query.cursor));
  }
  if (query.limit !== undefined) {
    params.set("size", String(query.limit));
  }
  return params;
};

async function fetchProfileFromApi(userId: string): Promise<ProfileResponse> {
  return apiFetchJson<ProfileSummary>(`/api/profile/${userId}`);
}

async function fetchFollowersFromApi(
  userId: string,
  query: CursorQuery,
): Promise<FollowResponse> {
  const params = buildCursorParams(query);
  return apiFetchJson<FollowResponse>(
    `/api/profile/${userId}/followers?${params.toString()}`,
  );
}

async function fetchFollowingFromApi(
  userId: string,
  query: CursorQuery,
): Promise<FollowResponse> {
  const params = buildCursorParams(query);
  return apiFetchJson<FollowResponse>(
    `/api/profile/${userId}/following?${params.toString()}`,
  );
}

export async function fetchUserReviews(
  userId: string,
  query: CursorQuery,
): Promise<ReviewResponse> {
  const params = buildCursorParams(query);
  return apiFetchJson<ReviewResponse>(
    `/api/profile/${userId}/reviews?${params.toString()}`,
  );
}

export async function fetchLatestReadingBooks(
  userId: string,
  size = 3,
): Promise<ReadingBooksResponse> {
  return apiFetchJson<ReadingBooksResponse>(
    `/api/profile/${userId}/reading-books?size=${size}`,
  );
}

export async function fetchMyBookmarkedReviews(
  size = 3,
): Promise<BookmarkedReviewsResponse> {
  return apiFetchJson<BookmarkedReviewsResponse>(
    `/api/profile/me/bookmarks?size=${size}`,
  );
}

export async function getProfileSummary(
  userId: string,
): Promise<ProfileSummary | null> {
  try {
    return await fetchProfileFromApi(userId);
  } catch {
    return null;
  }
}

export async function getProfileStats(
  userId: string,
): Promise<ProfileStats | null> {
  const summary = await getProfileSummary(userId);
  return summary?.stats ?? null;
}

export async function getShelfStats(
  userId: string,
): Promise<ShelfStats | null> {
  const summary = await getProfileSummary(userId);
  return summary?.shelves ?? null;
}

export async function getFollowers(
  userId: string,
  query: CursorQuery,
): Promise<CursorPage<FollowUser>> {
  try {
    return await fetchFollowersFromApi(userId, query);
  } catch {
    return { items: [], nextCursor: null };
  }
}

export async function getFollowing(
  userId: string,
  query: CursorQuery,
): Promise<CursorPage<FollowUser>> {
  try {
    return await fetchFollowingFromApi(userId, query);
  } catch {
    return { items: [], nextCursor: null };
  }
}
