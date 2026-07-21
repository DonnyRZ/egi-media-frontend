"use client";

import { useQuery } from "@tanstack/react-query";

import { CMS_QUERY_KEYS } from "@/features/cms/constants/cms.constants";
import { fetchMyArticles } from "@/features/cms/services/cms-article.service";
import { fetchAuditLogs } from "@/features/cms/services/cms-audit-log.service";
import { fetchDashboardStats } from "@/features/cms/services/cms-dashboard.service";

export function useDashboardStats() {
  return useQuery({
    queryKey: [...CMS_QUERY_KEYS.dashboard.all, "stats"],
    queryFn: fetchDashboardStats,
    staleTime: 30_000,
  });
}

export function useRecentDrafts() {
  return useQuery({
    queryKey: [...CMS_QUERY_KEYS.dashboard.all, "drafts"],
    queryFn: () => fetchMyArticles({ page: 1, limit: 5, status: "draft" }),
    staleTime: 30_000,
  });
}

export function useRecentPublished() {
  return useQuery({
    queryKey: [...CMS_QUERY_KEYS.dashboard.all, "published"],
    queryFn: () => fetchMyArticles({ page: 1, limit: 5, status: "published" }),
    staleTime: 30_000,
  });
}

/** Superadmin-only recent activity feed. Pass `enabled` to gate by role. */
export function useRecentActivity(enabled: boolean) {
  return useQuery({
    queryKey: CMS_QUERY_KEYS.auditLogs.list({ limit: 8 }),
    queryFn: () => fetchAuditLogs({ page: 1, limit: 8 }),
    enabled,
    staleTime: 30_000,
  });
}
