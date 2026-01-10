import { headers } from "next/headers";
import { API_BASE_URL } from "./authService";
import { apiFetchJson } from "./apiClient";
import type {
  CommunityTrendResponse,
  UserAnalysisResponse,
} from "../types/content";

export type CommunityTrendResult = {
  response: CommunityTrendResponse | null;
  status: number;
};

export async function getCommunityTrendServer(): Promise<CommunityTrendResult> {
  try {
    const baseUrl = API_BASE_URL || "http://localhost:8080";
    const cookieHeader = (await headers()).get("cookie");
    return {
      response: await apiFetchJson<CommunityTrendResponse>(
        `${baseUrl}/api/ai/community-trend`,
        {
          cache: "no-store",
          headers: cookieHeader ? { cookie: cookieHeader } : undefined,
        },
      ),
      status: 200,
    };
  } catch (error) {
    console.error("[ai] /api/ai/community-trend failed", error);
    return { response: null, status: 500 };
  }
}

export type UserAnalysisResult = {
  response: UserAnalysisResponse | null;
  status: number;
};

export async function getUserAnalysisServer(): Promise<UserAnalysisResult> {
  try {
    const baseUrl = API_BASE_URL || "http://localhost:8080";
    const cookieHeader = (await headers()).get("cookie");
    const response = await apiFetchJson<UserAnalysisResponse>(
      `${baseUrl}/api/ai/user-analysis`,
      {
        cache: "no-store",
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      },
    );
    console.info("[ai] user-analysis data", {
      userId: response.userId,
      personaType: response.personaType,
      keywords: response.keywords?.length ?? 0,
      recommendations: response.recommendations?.length ?? 0,
      analyzedAt: response.analyzedAt,
    });
    return { response, status: 200 };
  } catch (error) {
    console.error("[ai] /api/ai/user-analysis failed", error);
    return { response: null, status: 500 };
  }
}
