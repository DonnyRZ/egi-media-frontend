"use client";

import { formatAbsoluteDateTime } from "@/shared/utils/format";
import { Badge } from "@/features/cms/components/ui/Badge";
import { Card, CardHeader } from "@/features/cms/components/ui/Card";
import {
  EmptyState,
  LoadingState,
} from "@/features/cms/components/ui/StateViews";
import { useRecentActivity } from "@/features/cms/hooks/useDashboard";

type ActionTone = "success" | "info" | "warning" | "danger" | "neutral";

const ACTION_TONE: Record<string, ActionTone> = {
  create: "success",
  insert: "success",
  published: "success",
  scheduled: "info",
  submitted_for_review: "info",
  update: "info",
  restored: "info",
  reverted_to_draft: "warning",
  archived: "warning",
  status_change: "warning",
  delete: "danger",
  trashed: "danger",
};

const ACTION_LABEL: Record<string, string> = {
  create: "CREATED",
  insert: "CREATED",
  update: "UPDATED",
  delete: "TRASHED",
  trashed: "TRASHED",
  archived: "ARCHIVED",
  restored: "RESTORED",
  published: "PUBLISHED",
  scheduled: "SCHEDULED",
  submitted_for_review: "SUBMITTED FOR REVIEW",
  reverted_to_draft: "REVERTED TO DRAFT",
  status_change: "CHANGED STATUS",
};

function normalizeAction(action: string | null | undefined): string {
  return (action ?? "").trim().toLowerCase();
}

export function RecentActivity() {
  const { data, isLoading, isError } = useRecentActivity(true);

  return (
    <Card>
      <CardHeader title="Recent Activity" description="Newsroom audit trail" />
      {isLoading ? (
        <LoadingState />
      ) : isError || !data || data.length === 0 ? (
        <EmptyState title="No recent activity" />
      ) : (
        <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {data.map((log) => {
            const normalized = normalizeAction(log.action);
            const actionLabel =
              ACTION_LABEL[normalized] ??
              (log.action ? log.action.replace(/_/g, " ") : "CHANGED");
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
                <Badge tone={ACTION_TONE[normalized] ?? "neutral"}>
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
