import { AUTH_ENDPOINTS } from "@/features/auth/constants/auth.constants";
import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import { axiosClient } from "@/shared/lib/axios-client";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import {
  mapCmsProfile,
  type CmsProfileDto,
} from "@/features/cms/mappers/cms.mapper";
import type { CmsProfile } from "@/features/cms/types/cms.types";

export async function fetchProfile(): Promise<CmsProfile> {
  const response = await axiosClient.get<ApiSuccessResponse<CmsProfileDto>>(
    API_ENDPOINTS.userProfile,
  );
  return mapCmsProfile(response.data.data);
}

export interface ProfileWritePayload {
  bio?: string | null;
  jobTitle?: string | null;
  company?: string | null;
  industry?: string | null;
  seniority?: string | null;
  country?: string | null;
  avatarUrl?: string | null;
}

export async function updateProfile(
  payload: ProfileWritePayload,
): Promise<void> {
  await axiosClient.put(API_ENDPOINTS.userProfile, {
    bio: payload.bio ?? undefined,
    job_title: payload.jobTitle ?? undefined,
    company: payload.company ?? undefined,
    industry: payload.industry ?? undefined,
    seniority: payload.seniority ?? undefined,
    country: payload.country ?? undefined,
    avatar_url: payload.avatarUrl ?? undefined,
  });
}

export async function changePassword(
  oldPassword: string,
  newPassword: string,
): Promise<void> {
  await axiosClient.patch(AUTH_ENDPOINTS.changePassword, {
    old_password: oldPassword,
    new_password: newPassword,
  });
}
