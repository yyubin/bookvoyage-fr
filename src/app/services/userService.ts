import { apiFetch } from "./apiClient";

export async function updateMyBio(bio: string): Promise<void> {
  const response = await apiFetch("/api/users/me/bio", {
    method: "PATCH",
    body: JSON.stringify({ bio }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update bio: ${response.status}`);
  }
}

export async function updateMyTasteTag(tasteTag: string): Promise<void> {
  const response = await apiFetch("/api/users/me/taste-tag", {
    method: "PATCH",
    body: JSON.stringify({ tasteTag }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update taste tag: ${response.status}`);
  }
}

export async function updateMyNickname(nickname: string): Promise<void> {
  const response = await apiFetch("/api/users/me/nickname", {
    method: "PATCH",
    body: JSON.stringify({ nickname }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update nickname: ${response.status}`);
  }
}

export async function updateMyProfileImage(imageUrl: string): Promise<void> {
  const response = await apiFetch("/api/users/me/profile-image", {
    method: "PATCH",
    body: JSON.stringify({ imageUrl }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update profile image: ${response.status}`);
  }
}
