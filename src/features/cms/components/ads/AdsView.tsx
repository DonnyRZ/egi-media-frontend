"use client";
import { useState } from "react";
import { AdMedia } from "@/features/ads/components/AdMedia";
import { AdFormModal } from "@/features/cms/components/ads/AdFormModal";
import { RouteGuard } from "@/features/cms/components/auth/RouteGuard";
import { PageHeader } from "@/features/cms/components/layout/PageHeader";
import { Badge } from "@/features/cms/components/ui/Badge";
import { Button } from "@/features/cms/components/ui/Button";
import { ErrorState, LoadingState, EmptyState } from "@/features/cms/components/ui/StateViews";
import { useAdMutations, useCmsAds } from "@/features/cms/hooks/useCmsAds";
import type { AdFormValues } from "@/features/cms/schemas/cms.schemas";
import type { CmsAd } from "@/features/cms/services/cms-ads.service";
import { useToast } from "@/features/cms/stores/cms-toast.store";
import { AD_PLACEMENT_GUIDELINES } from "@/shared/types/ads.types";
const params = { page: 1, limit: 10, active: "all" as const };
export function AdsView() {
  const toast = useToast();
  const [editing, setEditing] = useState<CmsAd | null>(null);
  const { data, isLoading, isError, refetch } = useCmsAds(params);
  const { update } = useAdMutations();
  const ads = data?.items ?? [];
  async function submit(values: AdFormValues) {
    if (!editing) return;
    try {
      await update.mutateAsync({ id: editing.id, payload: values });
      toast.success("Advertisement updated"); setEditing(null);
    } catch (error) { toast.error(error instanceof Error ? error.message : "Could not save advertisement"); }
  }
  return <RouteGuard requireSuperadmin>
    <PageHeader title="Advertisements" />
    {isLoading ? <LoadingState label="Loading advertisements…" /> : null}
    {isError ? <><ErrorState title="Could not load advertisements" /><Button variant="secondary" onClick={() => void refetch()}>Retry</Button></> : null}
    {!isLoading && !isError && !ads.length ? <EmptyState title="No advertisement slots found" /> : null}
    <div className="grid items-start gap-5 xl:grid-cols-2 2xl:grid-cols-4">
      {ads.map((ad) => <section key={ad.id} className="min-w-0 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="mb-2 text-base font-semibold">{AD_PLACEMENT_GUIDELINES[ad.placement].label}</h2>
        <p className="mb-3 text-xs text-neutral-500">{AD_PLACEMENT_GUIDELINES[ad.placement].dimensions}px</p>
        <AdMedia placement={ad.placement} imageUrl={ad.imageUrl} title={ad.title} imageWidth={ad.imageWidth} imageHeight={ad.imageHeight} />
        <div className="mt-3 flex items-center justify-between gap-2"><Badge tone={ad.isActive ? "success" : "neutral"}>{ad.isActive ? "Active" : "Inactive"}</Badge>
          <Button variant="secondary" size="sm" onClick={() => setEditing(ad)}>Edit</Button></div>
        <p className="mt-3 break-words text-sm">{ad.title}</p>
        <p className="mt-2 text-xs text-neutral-500">{ad.impressions.toLocaleString()} impressions · {ad.clicks.toLocaleString()} clicks</p>
      </section>)}
    </div>
    <AdFormModal key={editing?.id ?? "closed"} open={Boolean(editing)} saving={update.isPending} ad={editing} availableAds={ads}
      onClose={() => setEditing(null)} onSubmit={(values) => void submit(values)} />
  </RouteGuard>;
}
