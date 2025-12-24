import { headers } from "next/headers";
import { API_BASE_URL } from "./authService";

export type ServerAuthUser = {
  id?: number | string;
  email?: string;
  username?: string;
};

export async function getServerUser(): Promise<ServerAuthUser | null> {
  const cookieHeader = (await headers()).get("cookie");
  if (!cookieHeader) {
    return null;
  }

  const fetchProfile = async () =>
    fetch(`${API_BASE_URL}/api/users/me`, {
      headers: {
        cookie: cookieHeader,
      },
      cache: "no-store",
    });

  let response = await fetchProfile();
  if (!response.ok) {
    console.error(
      `[auth] /api/users/me failed: ${response.status} ${response.statusText}`,
    );
    response = await fetchProfile();
  }

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as ServerAuthUser;
}
