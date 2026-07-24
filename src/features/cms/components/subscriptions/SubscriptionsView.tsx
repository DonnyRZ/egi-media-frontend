"use client";

import { useMemo, useState } from "react";

import { RouteGuard } from "@/features/cms/components/auth/RouteGuard";
import { PageHeader } from "@/features/cms/components/layout/PageHeader";
import { TopicSubscribersModal } from "@/features/cms/components/subscriptions/TopicSubscribersModal";
import { Badge } from "@/features/cms/components/ui/Badge";
import { Button } from "@/features/cms/components/ui/Button";
import { Card } from "@/features/cms/components/ui/Card";
import { Input } from "@/features/cms/components/ui/Input";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/features/cms/components/ui/StateViews";
import { useCmsTopicSubscriptionStats } from "@/features/cms/hooks/useCmsTopicSubscriptionStats";
import { useDebouncedValue } from "@/features/cms/hooks/useDebouncedValue";

export function SubscriptionsView() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<{
    topicId: string;
    topicName: string;
  } | null>(null);
  const debouncedSearch = useDebouncedValue(search);
  const { data, isLoading, isError, refetch } = useCmsTopicSubscriptionStats();

  const items = useMemo(() => {
    const rows = data?.items ?? [];
    const query = debouncedSearch.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter(
      (row) =>
        row.topicName.toLowerCase().includes(query) ||
        (row.categoryName ?? "").toLowerCase().includes(query),
    );
  }, [data?.items, debouncedSearch]);

  const maxCount = Math.max(...items.map((item) => item.subscriberCount), 1);

  return (
    <RouteGuard requireSuperadmin>
      <PageHeader
        title="Topic Subscriptions"
        description="Topic popularity for members — useful for editorial focus and publish email alerts."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Topics tracked
          </p>
          <p className="mt-2 text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            {data?.totalTopics ?? 0}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Total subscriptions
          </p>
          <p className="mt-2 text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            {data?.totalSubscribers ?? 0}
          </p>
        </Card>
      </div>

      <Card className="p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Topic popularity
          </h2>
          <Input
            className="max-w-xs"
            placeholder="Filter by topic or category…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {isLoading ? <LoadingState /> : null}
        {isError ? (
          <ErrorState
            action={
              <Button size="sm" variant="secondary" onClick={() => void refetch()}>
                Try again
              </Button>
            }
          />
        ) : null}
        {!isLoading && !isError && items.length === 0 ? (
          <EmptyState title="No topic subscription data yet" />
        ) : null}

        {!isLoading && !isError && items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500 dark:border-neutral-800">
                <tr>
                  <th className="px-2 py-3 font-semibold">Topic</th>
                  <th className="px-2 py-3 font-semibold">Parent category</th>
                  <th className="px-2 py-3 font-semibold">Subscribers</th>
                  <th className="px-2 py-3 font-semibold">Popularity</th>
                  <th className="px-2 py-3 font-semibold" />
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {items.map((item) => (
                  <tr key={item.topicId}>
                    <td className="px-2 py-3 font-medium text-neutral-900 dark:text-neutral-100">
                      {item.topicName}
                    </td>
                    <td className="px-2 py-3 text-neutral-600 dark:text-neutral-300">
                      {item.categoryName ?? (
                        <span className="text-neutral-400">Unassigned</span>
                      )}
                    </td>
                    <td className="px-2 py-3">
                      <Badge tone={item.subscriberCount > 0 ? "info" : "muted"}>
                        {item.subscriberCount}
                      </Badge>
                    </td>
                    <td className="min-w-[10rem] px-2 py-3">
                      <div className="h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                        <div
                          className="h-full rounded-full bg-accent"
                          style={{
                            width: `${Math.round(
                              (item.subscriberCount / maxCount) * 100,
                            )}%`,
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-2 py-3 text-right">
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={item.subscriberCount === 0}
                        onClick={() =>
                          setSelected({
                            topicId: item.topicId,
                            topicName: item.topicName,
                          })
                        }
                      >
                        View emails
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </Card>

      <TopicSubscribersModal
        topicId={selected?.topicId ?? null}
        topicName={selected?.topicName ?? ""}
        onClose={() => setSelected(null)}
      />
    </RouteGuard>
  );
}
