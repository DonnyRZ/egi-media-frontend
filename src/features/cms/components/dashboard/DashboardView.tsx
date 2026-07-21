"use client";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import { PageHeader } from "@/features/cms/components/layout/PageHeader";
import { QuickActions } from "@/features/cms/components/dashboard/QuickActions";
import { RecentActivity } from "@/features/cms/components/dashboard/RecentActivity";
import { RecentArticles } from "@/features/cms/components/dashboard/RecentArticles";
import { StatCards } from "@/features/cms/components/dashboard/StatCards";
import {
  useRecentDrafts,
  useRecentPublished,
} from "@/features/cms/hooks/useDashboard";
import { usePermissions } from "@/features/cms/hooks/usePermissions";

export function DashboardView() {
  const user = useAuthStore((state) => state.user);
  const { canViewActivity } = usePermissions();
  const drafts = useRecentDrafts();
  const published = useRecentPublished();

  return (
    <>
      <PageHeader
        title={`Welcome back, ${user?.fullName?.split(" ")[0] ?? "Editor"}`}
        description="Here's what's happening across your newsroom."
      />

      <div className="space-y-6">
        <StatCards />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <RecentArticles
              title="Recent Drafts"
              items={drafts.data?.items}
              isLoading={drafts.isLoading}
              emptyLabel="No drafts yet"
            />
            <RecentArticles
              title="Recently Published"
              items={published.data?.items}
              isLoading={published.isLoading}
              emptyLabel="Nothing published yet"
            />
          </div>

          <div className="space-y-6">
            <QuickActions />
            {canViewActivity ? <RecentActivity /> : null}
          </div>
        </div>
      </div>
    </>
  );
}
