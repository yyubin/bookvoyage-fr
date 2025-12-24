export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
export const GOOGLE_OAUTH_URL = `${API_BASE_URL}/oauth2/authorization/google`;

export async function refreshAccessToken(): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  return response.ok;
}
