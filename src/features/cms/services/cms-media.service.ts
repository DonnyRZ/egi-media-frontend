import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import { axiosClient } from "@/shared/lib/axios-client";
import { ApiError } from "@/shared/lib/errors";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import { prepareImage } from "@/features/cms/utils/prepare-image";

interface UploadResponseDto {
  url: string;
}

export const IMAGE_UPLOAD_TIMEOUT_MS = 120_000;
const MAX_UPLOAD_ATTEMPTS = 2;

export interface ImageUploadState {
  stage: "preparing" | "uploading" | "retrying" | "saving";
  progress: number;
  originalBytes: number;
  uploadBytes: number;
  attempt: number;
}

interface UploadImageOptions {
  signal?: AbortSignal;
  onStateChange?: (state: ImageUploadState) => void;
}

/** Optimize the image, then upload to the configured backend storage. */
export async function uploadImage(file: File, options: UploadImageOptions = {}): Promise<string> {
  const update = (stage: ImageUploadState["stage"], progress: number, uploadBytes: number, attempt: number) => {
    options.onStateChange?.({ stage, progress, originalBytes: file.size, uploadBytes, attempt });
  };
  update("preparing", 0, file.size, 1);
  const prepared = await prepareImage(file, options.signal);
  const formData = new FormData();
  formData.append("file", prepared);

  for (let attempt = 1; attempt <= MAX_UPLOAD_ATTEMPTS; attempt += 1) {
    if (options.signal?.aborted) throw new DOMException("Upload cancelled", "AbortError");
    update(attempt === 1 ? "uploading" : "retrying", 0, prepared.size, attempt);
    try {
      const response = await axiosClient.post<ApiSuccessResponse<UploadResponseDto>>(
        API_ENDPOINTS.uploads,
        formData,
        {
          // Let the browser generate the multipart boundary.
          headers: { "Content-Type": undefined },
          timeout: IMAGE_UPLOAD_TIMEOUT_MS,
          signal: options.signal,
          onUploadProgress: (event) => {
            const total = event.total ?? prepared.size;
            const progress = Math.min(100, Math.round((event.loaded / total) * 100));
            update(progress === 100 ? "saving" : "uploading", progress, prepared.size, attempt);
          },
        },
      );
      const url = response.data.data?.url;
      if (!url) throw new Error("The upload did not return an image URL. Please retry.");
      return url;
    } catch (error) {
      if (options.signal?.aborted) throw new DOMException("Upload cancelled", "AbortError");
      const retryable = error instanceof ApiError && [0, 408, 502, 503, 504].includes(error.statusCode);
      if (retryable && attempt < MAX_UPLOAD_ATTEMPTS) continue;
      if (retryable) throw new Error("The upload could not finish. Check your connection and retry; your selected image is still available.");
      throw error;
    }
  }
  throw new Error("Upload failed. Please retry.");
}
