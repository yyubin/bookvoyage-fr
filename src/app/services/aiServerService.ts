import { API_BASE_URL } from "./authService";
import type { CommunityTrendResponse } from "../types/content";

export type CommunityTrendResult = {
  response: CommunityTrendResponse | null;
  status: number;
};

export async function getCommunityTrendServer(): Promise<CommunityTrendResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ai/community-trend`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return { response: null, status: response.status };
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return { response: null, status: response.status };
    }

    return {
      response: (await response.json()) as CommunityTrendResponse,
      status: 200,
    };
  } catch (error) {
    console.error("[ai] /api/ai/community-trend failed", error);
    return { response: null, status: 500 };
  }
}
