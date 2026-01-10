import { headers } from "next/headers";
import { API_BASE_URL } from "./authService";
import type { UserBookStatisticsResponse } from "../types/content";

export type UserBookStatisticsResult = {
  response: UserBookStatisticsResponse | null;
  status: number;
};

export async function getUserBookStatisticsServer(): Promise<UserBookStatisticsResult> {
  const cookieHeader = (await headers()).get("cookie");
  if (!cookieHeader) {
    return { response: null, status: 401 };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/user-books/statistics`, {
      headers: { cookie: cookieHeader },
      cache: "no-store",
      redirect: "manual",
    });

    if (!response.ok) {
      return { response: null, status: response.status };
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return { response: null, status: response.status };
    }

    return {
      response: (await response.json()) as UserBookStatisticsResponse,
      status: 200,
    };
  } catch (error) {
    console.error("[user-book] /api/user-books/statistics failed", error);
    return { response: null, status: 500 };
  }
}
