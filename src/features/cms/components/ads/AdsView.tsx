"use client";

import { useMemo, useState } from "react";

import { RouteGuard } from "@/features/cms/components/auth/RouteGuard";
import { AdFormModal } from "@/features/cms/components/ads/AdFormModal";
import { PageHeader } from "@/features/cms/components/layout/PageHeader";
import { Badge } from "@/features/cms/components/ui/Badge";
import { Button } from "@/features/cms/components/ui/Button";
import { Card } from "@/features/cms/components/ui/Card";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/features/cms/components/ui/StateViews";
import { useAdMutations, useCmsAds } from "@/features/cms/hooks/useCmsAds";
import type { AdFormValues } from "@/features/cms/schemas/cms.schemas";
import type { CmsAd } from "@/features/cms/services/cms-ads.service";
import { AD_PLACEMENT_GUIDELINES } from "@/shared/types/ads.types";
import { useToast } from "@/features/cms/stores/cms-toast.store";

export function AdsView() {
  const toast = useToast();
  const [editing, setEditing] = useState<CmsAd | null>(null);
  const params = useMemo(
    () => ({
      page: 1,
      limit: 10,
      active: "all" as const,
    }),
    [],
  );
  const { data, isLoading, isError } = useCmsAds(params);
  const { update } = useAdMutations();
  const ads = data?.items ?? [];

  async function submit(values: AdFormValues) {
    if (!editing) return;
    try {
      await update.mutateAsync({
        id: editing.id,
        payload: {
          title: values.title,
          imageUrl: values.imageUrl,
          targetUrl: values.targetUrl,
          isActive: values.isActive,
        },
      });
      toast.success("Advertisement updated");
      setEditing(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save advertisement",
      );
    }
  }

  return (
    <RouteGuard requireSuperadmin>
      <PageHeader
        title="Advertisements"
        description="Attach creative and a destination URL to the three fixed homepage slots. Turn a slot off with Inactive."
      />

      <Card className="overflow-hidden">
        {isLoading ? <LoadingState label="Loading advertisements…" /> : null}
        {isError ? <ErrorState title="Could not load advertisements" /> : null}
        {!isLoading && !isError && ads.length === 0 ? (
          <EmptyState title="No advertisement slots found" />
        ) : null}

        {!isLoading && !isError && ads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-neutral-100 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">
                <tr>
                  <th className="px-5 py-3 font-medium">Ad</th>
                  <th className="px-5 py-3 font-medium">Placement</th>
                  <th className="px-5 py-3 font-medium">Impressions</th>
                  <th className="px-5 py-3 font-medium">Clicks</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {ads.map((ad) => (
                  <tr key={ad.id}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={ad.imageUrl}
                          alt=""
                          className="h-10 w-16 rounded object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-neutral-900 dark:text-neutral-100">
                            {ad.title}
                          </p>
                          <p className="truncate text-xs text-neutral-400">
                            {ad.targetUrl}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-neutral-600 dark:text-neutral-300">
                      {AD_PLACEMENT_GUIDELINES[ad.placement]?.label ??
                        ad.placement}
                    </td>
                    <td className="px-5 py-4 tabular-nums text-neutral-700 dark:text-neutral-200">
                      {ad.impressions.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 tabular-nums text-neutral-700 dark:text-neutral-200">
                      {ad.clicks.toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <Badge tone={ad.isActive ? "success" : "neutral"}>
                        {ad.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setEditing(ad)}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </Card>

      <AdFormModal
        open={Boolean(editing)}
        saving={update.isPending}
        ad={editing}
        onClose={() => setEditing(null)}
        onSubmit={(values) => void submit(values)}
      />
    </RouteGuard>
  );
}
