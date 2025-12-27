const SERVER_API_BASE_URL =
  process.env.API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8080";

// 브라우저에서는 프록시 사용 (API 요청용)
export const API_BASE_URL =
  typeof window === "undefined" ? SERVER_API_BASE_URL : "";

// OAuth2는 반드시 백엔드로 직접 리다이렉트 (쿠키 도메인 일치 필요)
const OAUTH_BASE_URL = SERVER_API_BASE_URL;
export const GOOGLE_OAUTH_URL = `${OAUTH_BASE_URL}/oauth2/authorization/google`;

export async function refreshAccessToken(): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  return response.ok;
}
