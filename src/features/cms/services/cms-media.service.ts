import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import { axiosClient } from "@/shared/lib/axios-client";
import type { ApiSuccessResponse } from "@/shared/types/api.types";

interface UploadResponseDto {
  url: string;
}

/**
 * Uploads an image to the backend (Cloudflare R2) and returns its public URL.
 * The backend endpoint is `POST /api/v1/uploads` (multipart, field `file`).
 */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosClient.post<ApiSuccessResponse<UploadResponseDto>>(
    API_ENDPOINTS.uploads,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );

  return response.data.data.url;
}
