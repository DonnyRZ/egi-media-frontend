"use client";

import { formatRelativeTime } from "@/shared/utils/format";
import { Badge } from "@/features/cms/components/ui/Badge";
import { Card, CardHeader } from "@/features/cms/components/ui/Card";
import { EmptyState, LoadingState } from "@/features/cms/components/ui/StateViews";
import { useRecentActivity } from "@/features/cms/hooks/useDashboard";

const ACTION_TONE: Record<string, "success" | "info" | "warning" | "danger" | "neutral"> = {
  create: "success",
  insert: "success",
  update: "info",
  delete: "danger",
};

const TABLE_LABEL: Record<string, string> = {
  articles: "article",
  categories: "category",
  topics: "topic",
  tags: "tag",
  series: "series",
  users: "user",
};

const ACTION_VERB: Record<string, string> = {
  create: "created",
  insert: "created",
  update: "updated",
  delete: "deleted",
};

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
            const verb = ACTION_VERB[log.action ?? ""] ?? log.action ?? "changed";
            const entity = TABLE_LABEL[log.tableName ?? ""] ?? log.tableName ?? "record";
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
                    {verb} {entity}
                    {log.recordLabel ? (
                      <span className="text-neutral-500"> “{log.recordLabel}”</span>
                    ) : null}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-400">
                    {formatRelativeTime(log.createdAt)}
                  </p>
                </div>
                <Badge tone={ACTION_TONE[log.action ?? ""] ?? "neutral"}>
                  {log.action ?? "—"}
                </Badge>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
