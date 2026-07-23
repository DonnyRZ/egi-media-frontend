"use client";

import Link from "next/link";

import { formatAbsoluteDateTime } from "@/shared/utils/format";
import { Badge } from "@/features/cms/components/ui/Badge";
import { Card, CardHeader } from "@/features/cms/components/ui/Card";
import {
  EmptyState,
  LoadingState,
} from "@/features/cms/components/ui/StateViews";
import { CMS_BASE_PATH } from "@/features/cms/constants/cms.constants";
import { useRecentActivity } from "@/features/cms/hooks/useDashboard";
import {
  getAuditActionLabel,
  getAuditActionTone,
} from "@/features/cms/utils/audit-action";

export function RecentActivity() {
  const { data, isLoading, isError } = useRecentActivity(true);

  return (
    <Card>
      <CardHeader
        title="Recent Activity"
        description="Latest newsroom actions"
        action={
          <Link
            href={`${CMS_BASE_PATH}/audit-logs`}
            className="text-xs font-semibold text-accent hover:underline"
          >
            View all
          </Link>
        }
      />
      {isLoading ? (
        <LoadingState />
      ) : isError || !data || data.length === 0 ? (
        <EmptyState title="No recent activity" />
      ) : (
        <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {data.map((log) => {
            const actionLabel = getAuditActionLabel(log.action);
            const title = log.recordLabel?.trim();

            return (
              <li
                key={log.id}
                className="flex items-center justify-between gap-3 px-5 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-neutral-800 dark:text-neutral-200">
                    <span className="font-semibold">
                      {log.actorName ?? "Someone"}
                    </span>{" "}
                    <span className="font-medium tracking-wide">
                      {actionLabel}
                    </span>
                    {title ? (
                      <>
                        {" "}
                        <span className="text-neutral-600 dark:text-neutral-300">
                          &lsquo;{title}&rsquo;
                        </span>
                      </>
                    ) : null}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-400">
                    {formatAbsoluteDateTime(log.createdAt)}
                  </p>
                </div>
                <Badge tone={getAuditActionTone(log.action)}>
                  {actionLabel}
                </Badge>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
