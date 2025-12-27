import type { BookSearchItem } from "../types/content";
import { apiFetchJson } from "./apiClient";
import type { UserBookResponse } from "../types/content";

type AddUserBookResponse = {
  id: number;
  status: string;
};

type AddUserBookPayload = {
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
  status: string;
};

export async function addUserBook(
  book: BookSearchItem,
  status: string,
): Promise<AddUserBookResponse> {
  const authors = book.authors?.length ? book.authors : ["알 수 없음"];
  const payload: AddUserBookPayload = {
    title: book.title,
    authors,
    isbn10: book.isbn10,
    isbn13: book.isbn13,
    coverUrl: book.coverUrl,
    publisher: book.publisher,
    publishedDate: book.publishedDate,
    description: book.description,
    language: book.language,
    pageCount: book.pageCount,
    googleVolumeId: book.googleVolumeId,
    status,
  };

  return apiFetchJson<AddUserBookResponse>("/api/user-books", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateUserBookStatus(
  bookId: number | string,
  status: string,
): Promise<UserBookResponse> {
  return apiFetchJson<UserBookResponse>(`/api/user-books/${bookId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

export async function updateUserBookProgress(
  bookId: number | string,
  progress: number,
): Promise<UserBookResponse> {
  return apiFetchJson<UserBookResponse>(`/api/user-books/${bookId}/progress`, {
    method: "PUT",
    body: JSON.stringify({ progress }),
  });
}

export async function updateUserBookRating(
  bookId: number | string,
  rating: number,
): Promise<UserBookResponse> {
  return apiFetchJson<UserBookResponse>(`/api/user-books/${bookId}/rating`, {
    method: "PUT",
    body: JSON.stringify({ rating }),
  });
}

export async function updateUserBookMemo(
  bookId: number | string,
  memo: string,
): Promise<UserBookResponse> {
  return apiFetchJson<UserBookResponse>(`/api/user-books/${bookId}/memo`, {
    method: "PUT",
    body: JSON.stringify({ memo }),
  });
}
