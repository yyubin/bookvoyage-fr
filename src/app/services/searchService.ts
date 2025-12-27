import type { BookSearchPage, ReviewSearchPage, SearchResults } from "../types/content";
import { apiFetchJson } from "./apiClient";

type SearchQueryOptions = {
  bookStartIndex?: number;
  bookSize?: number;
  reviewCursor?: number;
  reviewSize?: number;
};

type BookSearchOptions = {
  startIndex?: number;
  size?: number;
  language?: string;
  orderBy?: string;
  printType?: string;
};

type ReviewSearchOptions = {
  cursor?: number;
  size?: number;
  genre?: string;
  minRating?: number;
  maxRating?: number;
  startDate?: string;
  endDate?: string;
  highlight?: string;
  bookId?: number;
  userId?: number;
  sortBy?: string;
};

export async function searchBooks(
  query: string,
  options: BookSearchOptions = {},
): Promise<BookSearchPage> {
  const params = new URLSearchParams({ q: query });
  if (options.startIndex !== undefined) {
    params.set("startIndex", String(options.startIndex));
  }
  if (options.size !== undefined) {
    params.set("size", String(options.size));
  }
  if (options.language) {
    params.set("language", options.language);
  }
  if (options.orderBy) {
    params.set("orderBy", options.orderBy);
  }
  if (options.printType) {
    params.set("printType", options.printType);
  }
  try {
    return await apiFetchJson<BookSearchPage>(
      `/api/books/search?${params.toString()}`,
    );
  } catch {
    return { items: [], nextStartIndex: null, totalItems: 0 };
  }
}

export async function searchReviews(
  query: string,
  options: ReviewSearchOptions = {},
): Promise<ReviewSearchPage> {
  const params = new URLSearchParams({ q: query });
  if (options.cursor !== undefined) {
    params.set("cursor", String(options.cursor));
  }
  if (options.size !== undefined) {
    params.set("size", String(options.size));
  }
  if (options.genre) {
    params.set("genre", options.genre);
  }
  if (options.minRating !== undefined) {
    params.set("minRating", String(options.minRating));
  }
  if (options.maxRating !== undefined) {
    params.set("maxRating", String(options.maxRating));
  }
  if (options.startDate) {
    params.set("startDate", options.startDate);
  }
  if (options.endDate) {
    params.set("endDate", options.endDate);
  }
  if (options.highlight) {
    params.set("highlight", options.highlight);
  }
  if (options.bookId !== undefined) {
    params.set("bookId", String(options.bookId));
  }
  if (options.userId !== undefined) {
    params.set("userId", String(options.userId));
  }
  if (options.sortBy) {
    params.set("sortBy", options.sortBy);
  }
  try {
    return await apiFetchJson<ReviewSearchPage>(
      `/api/reviews/search?${params.toString()}`,
    );
  } catch {
    return { items: [], nextCursor: null };
  }
}

export async function searchContent(
  query: string,
  options: SearchQueryOptions = {},
): Promise<SearchResults> {
  if (!query) {
    return {
      query,
      reviews: { items: [], nextCursor: null },
      books: { items: [], nextStartIndex: null, totalItems: 0 },
    };
  }

  try {
    const [books, reviews] = await Promise.all([
      searchBooks(query, {
        startIndex: options.bookStartIndex,
        size: options.bookSize,
      }),
      options.reviewSize === 0
        ? Promise.resolve({ items: [], nextCursor: null })
        : searchReviews(query, {
            cursor: options.reviewCursor,
            size: options.reviewSize,
          }),
    ]);

    return {
      query,
      books,
      reviews,
    };
  } catch {
    return {
      query,
      reviews: { items: [], nextCursor: null },
      books: { items: [], nextStartIndex: null, totalItems: 0 },
    };
  }
}
