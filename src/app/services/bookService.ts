import { books } from "../data/books";
import type { BookItem, CursorPage, CursorQuery } from "../types/content";
import { paginateWithCursor } from "./pagination";

type BookApiResponse = CursorPage<BookItem> | null;

async function fetchBooksFromApi(
  _query: CursorQuery,
): Promise<BookApiResponse> {
  return null;
}

export async function getBooks(
  query: CursorQuery,
): Promise<CursorPage<BookItem>> {
  const apiResult = await fetchBooksFromApi(query);

  if (apiResult && apiResult.items.length > 0) {
    return apiResult;
  }

  return paginateWithCursor({
    items: books,
    cursor: query.cursor,
    limit: query.limit,
  });
}
