import { apiFetch, apiFetchJson } from "./apiClient";
import type { ReviewResponse } from "../types/content";
import type { BookSearchItem } from "../types/content";

type CreateReviewPayload = {
  title: string;
  authors: string[];
  isbn10?: string | null;
  isbn13?: string | null;
  coverUrl?: string | null;
  publisher?: string | null;
  publishedDate?: string | null;
  description?: string | null;
  language?: string | null;
  pageCount?: number | null;
  googleVolumeId?: string | null;
  rating: number;
  summary: string;
  content: string;
  visibility?: string;
  genre: string;
  keywords?: string[];
  highlights?: string[];
};

export async function createReview(
  book: BookSearchItem,
  payload: Omit<CreateReviewPayload, keyof BookSearchItem>,
): Promise<ReviewResponse> {
  const request: CreateReviewPayload = {
    title: book.title,
    authors: book.authors,
    isbn10: book.isbn10,
    isbn13: book.isbn13,
    coverUrl: book.coverUrl,
    publisher: book.publisher,
    publishedDate: book.publishedDate,
    description: book.description,
    language: book.language,
    pageCount: book.pageCount,
    googleVolumeId: book.googleVolumeId,
    rating: payload.rating,
    summary: payload.summary,
    content: payload.content,
    visibility: payload.visibility,
    genre: payload.genre,
    keywords: payload.keywords,
    highlights: payload.highlights,
  };

  return apiFetchJson<ReviewResponse>("/api/reviews", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function updateReview(
  reviewId: number | string,
  payload: CreateReviewPayload,
): Promise<ReviewResponse> {
  return apiFetchJson<ReviewResponse>(`/api/reviews/${reviewId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteReview(
  reviewId: number | string,
): Promise<void> {
  const response = await apiFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete review: ${response.status}`);
  }
}
