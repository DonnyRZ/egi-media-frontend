import {
  mapViralIssue,
  type ViralIssueDto,
} from "@/features/cms/mappers/viral-issue.mapper";
import type { ViralIssue } from "@/features/cms/types/viral-issue.types";
import { axiosClient } from "@/shared/lib/axios-client";
import { API_ENDPOINTS } from "@/shared/constants/api.constants";

interface ViralIssuesMetaDto {
  windowHours?: number;
  lookbackHours?: number;
  similarityThreshold?: number;
  articlePoolSize?: number;
  clusterCount?: number;
  engine?: string;
}

interface ViralIssuesApiResponse {
  success: boolean;
  data: {
    items?: ViralIssueDto[];
    meta?: ViralIssuesMetaDto;
    cached?: boolean;
    cache_expires_at?: string;
  };
  error?: { message?: string };
}

export interface ViralIssuesResult {
  items: ViralIssue[];
  cached: boolean;
  windowHours: number;
}

export async function fetchViralIssues(windowHours = 72): Promise<ViralIssuesResult> {
  const response = await axiosClient.get<ViralIssuesApiResponse>(
    API_ENDPOINTS.newsFeedViral,
    { params: { window_hours: windowHours, limit: 50 } },
  );

  if (!response.data.success) {
    throw new Error(
      response.data.error?.message ?? "Failed to load viral issues",
    );
  }

  return {
    items: (response.data.data.items ?? []).map(mapViralIssue),
    cached: false,
    windowHours: response.data.data.meta?.windowHours ?? windowHours,
  };
}
