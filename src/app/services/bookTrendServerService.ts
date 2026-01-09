import { API_BASE_URL } from "./authService";
import type { ShelfAdditionTrendResponse } from "../types/content";

export type ShelfAdditionTrendResult = {
  response: ShelfAdditionTrendResponse | null;
  status: number;
};

export async function getShelfAdditionTrendServer(
  limit = 1,
): Promise<ShelfAdditionTrendResult> {
  try {
    const params = new URLSearchParams({ limit: String(limit) });
    const response = await fetch(
      `${API_BASE_URL}/api/books/trending/shelf-additions?${params.toString()}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return { response: null, status: response.status };
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return { response: null, status: response.status };
    }

    return {
      response: (await response.json()) as ShelfAdditionTrendResponse,
      status: 200,
    };
  } catch (error) {
    console.error("[trend] /api/books/trending/shelf-additions failed", error);
    return { response: null, status: 500 };
  }
}
