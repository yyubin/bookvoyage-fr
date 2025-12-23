import type { CursorPage } from "../types/content";

type PaginationInput<T> = {
  items: T[];
  cursor?: string | null;
  limit?: number;
};

export function paginateWithCursor<T>({
  items,
  cursor,
  limit = 6,
}: PaginationInput<T>): CursorPage<T> {
  const start = cursor ? Number.parseInt(cursor, 10) : 0;
  const safeStart = Number.isNaN(start) ? 0 : start;
  const pageItems = items.slice(safeStart, safeStart + limit);
  const next =
    safeStart + limit < items.length ? String(safeStart + limit) : null;

  return {
    items: pageItems,
    nextCursor: next,
  };
}
