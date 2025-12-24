import type { SearchResults } from "../types/content";
import { apiFetchJson } from "./apiClient";

type SearchQueryOptions = {
  bookStartIndex?: number;
  bookSize?: number;
  reviewCursor?: number;
  reviewSize?: number;
};

async function fetchSearchFromApi(
  query: string,
  options: SearchQueryOptions,
): Promise<SearchResults> {
  const params = new URLSearchParams({ q: query });
  if (options.bookStartIndex !== undefined) {
    params.set("bookStartIndex", String(options.bookStartIndex));
  }
  if (options.bookSize !== undefined) {
    params.set("bookSize", String(options.bookSize));
  }
  if (options.reviewCursor !== undefined) {
    params.set("reviewCursor", String(options.reviewCursor));
  }
  if (options.reviewSize !== undefined) {
    params.set("reviewSize", String(options.reviewSize));
  }
  return apiFetchJson<SearchResults>(`/api/search?${params.toString()}`);
}

export async function searchContent(
  query: string,
  options: SearchQueryOptions = {},
): Promise<SearchResults> {
  try {
    return await fetchSearchFromApi(query, options);
  } catch {
    return {
      query,
      reviews: { items: [], nextCursor: null },
      books: { items: [], nextStartIndex: null, totalItems: 0 },
    };
  }
}
