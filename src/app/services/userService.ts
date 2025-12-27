import { apiFetch } from "./apiClient";
import { apiFetchJson } from "./apiClient";

type ProfileImageUploadResponse = {
  presignedUrl: string;
  fileUrl: string;
  objectKey: string;
};

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

export async function requestProfileImageUploadUrl(
  filename: string,
): Promise<ProfileImageUploadResponse> {
  return apiFetchJson<ProfileImageUploadResponse>(
    "/api/users/me/profile-image/upload-url",
    {
      method: "POST",
      body: JSON.stringify({ filename }),
    },
  );
}

export async function uploadProfileImageToS3(
  presignedUrl: string,
  file: File,
  onProgress?: (percent: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("PUT", presignedUrl);
    request.setRequestHeader(
      "Content-Type",
      file.type || "application/octet-stream",
    );
    request.upload.onprogress = (event) => {
      if (!onProgress || !event.lengthComputable) {
        return;
      }
      const percent = Math.round((event.loaded / event.total) * 100);
      onProgress(percent);
    };
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        onProgress?.(100);
        resolve();
        return;
      }
      reject(new Error(`Failed to upload image: ${request.status}`));
    };
    request.onerror = () => reject(new Error("Failed to upload image"));
    request.send(file);
  });
}
