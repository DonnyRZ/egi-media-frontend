import axios from "axios";

import {
  mapViralIssue,
  type ViralIssueDto,
} from "@/features/cms/mappers/viral-issue.mapper";
import type { ViralIssue } from "@/features/cms/types/viral-issue.types";
import { env } from "@/shared/config/env";
import { API_TIMEOUT_MS } from "@/shared/constants/api.constants";

interface ViralPocMetaDto {
  lookbackHours?: number;
  similarityThreshold?: number;
  articlePoolSize?: number;
  clusterCount?: number;
  engine?: string;
}

interface ViralPocApiResponse {
  success: boolean;
  data: {
    items?: ViralIssueDto[];
    meta?: ViralPocMetaDto;
    cached?: boolean;
    cache_expires_at?: string;
  };
  error?: { message?: string };
}

export interface ViralIssuesResult {
  items: ViralIssue[];
  cached: boolean;
}

const viralPocClient = axios.create({
  baseURL: env.crawlApiUrl,
  timeout: API_TIMEOUT_MS,
  headers: { Accept: "application/json" },
});

export async function fetchViralIssues(): Promise<ViralIssuesResult> {
  const response =
    await viralPocClient.get<ViralPocApiResponse>("/api/viral-poc");

  if (!response.data.success) {
    throw new Error(
      response.data.error?.message ?? "Failed to load viral issues",
    );
  }

  return {
    items: (response.data.data.items ?? []).map(mapViralIssue),
    cached: response.data.data.cached ?? false,
  };
}
