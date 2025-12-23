import {
  followersByUserId,
  followingByUserId,
  profilesById,
} from "../data/profile";
import type {
  CursorPage,
  CursorQuery,
  FollowUser,
  ProfileSummary,
  ProfileStats,
  ShelfStats,
} from "../types/content";
import { paginateWithCursor } from "./pagination";

type ProfileResponse = ProfileSummary | null;
type FollowResponse = CursorPage<FollowUser> | null;

async function fetchProfileFromApi(_userId: string): Promise<ProfileResponse> {
  return null;
}

async function fetchFollowersFromApi(
  _userId: string,
  _query: CursorQuery,
): Promise<FollowResponse> {
  return null;
}

async function fetchFollowingFromApi(
  _userId: string,
  _query: CursorQuery,
): Promise<FollowResponse> {
  return null;
}

export async function getProfileSummary(
  userId: string,
): Promise<ProfileSummary> {
  const apiResult = await fetchProfileFromApi(userId);
  return apiResult ?? profilesById[userId] ?? profilesById["user-001"];
}

export async function getProfileStats(
  userId: string,
): Promise<ProfileStats> {
  const summary = await getProfileSummary(userId);
  return summary.stats;
}

export async function getShelfStats(userId: string): Promise<ShelfStats> {
  const summary = await getProfileSummary(userId);
  return summary.shelves;
}

export async function getFollowers(
  userId: string,
  query: CursorQuery,
): Promise<CursorPage<FollowUser>> {
  const apiResult = await fetchFollowersFromApi(userId, query);

  if (apiResult && apiResult.items.length > 0) {
    return apiResult;
  }

  const fallback = followersByUserId[userId] ?? followersByUserId["user-001"];

  return paginateWithCursor({
    items: fallback,
    cursor: query.cursor,
    limit: query.limit,
  });
}

export async function getFollowing(
  userId: string,
  query: CursorQuery,
): Promise<CursorPage<FollowUser>> {
  const apiResult = await fetchFollowingFromApi(userId, query);

  if (apiResult && apiResult.items.length > 0) {
    return apiResult;
  }

  const fallback = followingByUserId[userId] ?? followingByUserId["user-001"];

  return paginateWithCursor({
    items: fallback,
    cursor: query.cursor,
    limit: query.limit,
  });
}
