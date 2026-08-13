"use client";

import { useQuery } from "@tanstack/react-query";

import { CMS_QUERY_KEYS } from "@/features/cms/constants/cms.constants";
import {
  fetchManageArticles,
  fetchMyArticles,
} from "@/features/cms/services/cms-article.service";
import { fetchAuditLogs } from "@/features/cms/services/cms-audit-log.service";
import {
  fetchDashboardStats,
  fetchTopArticlesByViews,
} from "@/features/cms/services/cms-dashboard.service";
import { usePermissions } from "@/features/cms/hooks/usePermissions";

export function useDashboardStats() {
  return useQuery({
    queryKey: [...CMS_QUERY_KEYS.dashboard.all, "stats"],
    queryFn: fetchDashboardStats,
    staleTime: 30_000,
  });
}

function useRecentByStatus(status: "draft" | "published") {
  const { isSuperadmin } = usePermissions();
  return useQuery({
    queryKey: [...CMS_QUERY_KEYS.dashboard.all, status, { scope: isSuperadmin ? "all" : "mine" }],
    queryFn: () =>
      isSuperadmin
        ? fetchManageArticles({ page: 1, limit: 5, status })
        : fetchMyArticles({ page: 1, limit: 5, status }),
    staleTime: 30_000,
  });
}

export function useRecentDrafts() {
  return useRecentByStatus("draft");
}

export function useRecentPublished() {
  return useRecentByStatus("published");
}

export function useTopArticles(limit = 5) {
  return useQuery({
    queryKey: [...CMS_QUERY_KEYS.dashboard.all, "top-articles", { limit }],
    queryFn: () => fetchTopArticlesByViews(limit),
    staleTime: 30_000,
  });
}

/** Superadmin-only recent activity feed. Pass `enabled` to gate by role. */
export function useRecentActivity(enabled: boolean) {
  return useQuery({
    queryKey: [...CMS_QUERY_KEYS.auditLogs.all, "recent", { limit: 5 }],
    queryFn: async () => {
      const result = await fetchAuditLogs({ page: 1, limit: 5 });
      return result.items;
    },
    enabled,
    staleTime: 30_000,
  });
}
