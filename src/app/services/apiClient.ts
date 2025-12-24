import { API_BASE_URL, refreshAccessToken } from "./authService";

type ApiFetchOptions = RequestInit & {
  retry?: boolean;
};

export async function apiFetch(
  path: string,
  options: ApiFetchOptions = {},
): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (response.status !== 401 || options.retry === false) {
    return response;
  }

  const refreshed = await refreshAccessToken();
  if (!refreshed) {
    return response;
  }

  return apiFetch(path, { ...options, retry: false });
}

export async function apiFetchJson<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const response = await apiFetch(path, options);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  // Check if response is JSON
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error(
      `Expected JSON response but got ${contentType || "unknown content type"}. This might indicate an authentication redirect.`,
    );
  }

  return (await response.json()) as T;
}
