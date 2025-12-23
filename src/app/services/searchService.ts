import type { SearchResults } from "../types/content";

async function fetchSearchFromApi(_query: string): Promise<SearchResults | null> {
  return null;
}

export async function searchContent(query: string): Promise<SearchResults> {
  const apiResult = await fetchSearchFromApi(query);

  if (apiResult) {
    return apiResult;
  }

  return {
    reviews: [],
    books: [],
  };
}
