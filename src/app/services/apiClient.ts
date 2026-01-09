import { API_BASE_URL, refreshAccessToken } from "./authService";

type ApiFetchOptions = RequestInit & {
  retry?: boolean;
};

export async function apiFetch(
  path: string,
  options: ApiFetchOptions = {},
): Promise<Response> {
  const isAbsoluteUrl = /^https?:\/\//.test(path);
  const url = isAbsoluteUrl ? path : `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
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
    console.warn(
      "[apiFetchJson] unexpected content-type",
      response.url,
      response.status,
      contentType,
    );
    throw new Error(
      `Expected JSON response but got ${contentType || "unknown content type"}. This might indicate an authentication redirect.`,
    );
  }

  return (await response.json()) as T;
}
