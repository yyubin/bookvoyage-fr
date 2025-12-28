import { headers } from "next/headers";
import { API_BASE_URL } from "./authService";
import type {
  BookDetailResponse,
  BookReviewPageResponse,
} from "../types/content";

export type BookDetailResult = {
  book: BookDetailResponse | null;
  status: number;
};

export async function getInternalBookDetail(
  bookId: number | string,
): Promise<BookDetailResult> {
  const cookieHeader = (await headers()).get("cookie");
  const response = await fetch(`${API_BASE_URL}/api/books/${bookId}`, {
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    return { book: null, status: response.status };
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return { book: null, status: response.status };
  }

  return { book: (await response.json()) as BookDetailResponse, status: 200 };
}

export async function getInternalBookReviewsServer(
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

  const cookieHeader = (await headers()).get("cookie");
  const response = await fetch(
    `${API_BASE_URL}/api/books/${bookId}/reviews?${params.toString()}`,
    {
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return { reviews: [], nextCursor: null, totalCount: 0 };
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return { reviews: [], nextCursor: null, totalCount: 0 };
  }

  return (await response.json()) as BookReviewPageResponse;
}
