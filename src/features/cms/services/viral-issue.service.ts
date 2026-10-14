import {
  mapViralIssue,
  type ViralIssueDto,
} from "@/features/cms/mappers/viral-issue.mapper";
import type { ViralIssue, RadarMeta, RadarStatus } from "@/features/cms/types/viral-issue.types";
import { axiosClient } from "@/shared/lib/axios-client";
import { API_ENDPOINTS } from "@/shared/constants/api.constants";

interface ViralIssuesMetaDto extends RadarMeta {
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
    page?: number;
    total?: number;
    total_pages?: number;
    cache_expires_at?: string;
  };
  error?: { message?: string };
  message?: string;
}

export interface ViralIssuesResult {
  items: ViralIssue[];
  cached: boolean;
  windowHours: number;
  page: number;
  total: number;
  totalPages: number;
  meta: RadarMeta;
}

export interface RadarParams { page?: number; search?: string; category?: string; trend?: string; candidate?: boolean; legacy?: boolean }
export async function fetchViralIssues(windowHours = 24, params: RadarParams = {}): Promise<ViralIssuesResult> {
  const response = await axiosClient.get<ViralIssuesApiResponse>(
    API_ENDPOINTS.newsFeedRecommendations,
    { params: { window_hours: windowHours, limit: 20, page: params.page ?? 1, search: params.search,
      category: params.category, trend: params.trend, engine: params.candidate ? "candidate" : params.legacy ? "legacy" : undefined } },
  );

  if (!response.data.success) {
    throw new Error(
      response.data.error?.message ?? response.data.message ?? "Failed to load viral issues",
    );
  }

  return {
    items: (response.data.data.items ?? []).map(mapViralIssue),
    cached: false,
    windowHours: response.data.data.meta?.windowHours ?? windowHours,
    page: response.data.data.page ?? params.page ?? 1,
    total: response.data.data.total ?? response.data.data.items?.length ?? 0,
    totalPages: response.data.data.total_pages ?? 1,
    meta: response.data.data.meta ?? {},
  };
}

export async function fetchRadarStatus(): Promise<RadarStatus> {
  const response = await axiosClient.get<{success: boolean; data: RadarStatus; message?: string}>(API_ENDPOINTS.newsFeedStatus);
  if (!response.data.success) throw new Error(response.data.message ?? "Source status unavailable");
  return response.data.data;
}
export async function fetchRadarDetail(id: string, windowHours: number, page: number, runId?: string | null) {
  const response = await axiosClient.get<{success: boolean; data: {item: ViralIssueDto; page: number; total: number; total_pages: number}; message?: string}>(
    `${API_ENDPOINTS.newsFeedRecommendations}/${encodeURIComponent(id)}`,
    {params: {window_hours: windowHours, page, limit: 20, run_id: runId}},
  );
  if (!response.data.success) throw new Error(response.data.message ?? "Event detail unavailable");
  return {...response.data.data, item: mapViralIssue(response.data.data.item, 0)};
}
