"use client";
import { useState } from "react";
import { AdPreview } from "@/features/cms/components/ads/AdPreview";
import { ImageUpload } from "@/features/cms/components/media/ImageUpload";
import { Button } from "@/features/cms/components/ui/Button";
import { Field } from "@/features/cms/components/ui/Field";
import { Input } from "@/features/cms/components/ui/Input";
import { Modal } from "@/features/cms/components/ui/Modal";
import { useAdForm } from "@/features/cms/hooks/useAdForm";
import type { AdFormValues } from "@/features/cms/schemas/cms.schemas";
import type { CmsAd } from "@/features/cms/services/cms-ads.service";
import { AD_PLACEMENT_GUIDELINES, matchesAdRatio } from "@/shared/types/ads.types";
interface AdFormModalProps { open: boolean; saving: boolean; ad: CmsAd | null; availableAds: CmsAd[]; onClose: () => void; onSubmit: (values: AdFormValues) => void; }
export function AdFormModal({ open, saving, ad, availableAds, onClose, onSubmit }: AdFormModalProps) {
  const [busy, setBusy] = useState(false);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useAdForm(ad, open);
  const values = watch();
  if (!open || !ad) return null;
  const guideline = AD_PLACEMENT_GUIDELINES[ad.placement];
  const reusable = availableAds.filter((item) => item.id !== ad.id && item.imageReceipt && item.imageUrl &&
    item.imageWidth && item.imageHeight && matchesAdRatio(ad.placement, item.imageWidth, item.imageHeight));
  return <Modal open={open} onClose={() => { if (!busy && !saving) onClose(); }} title={guideline.label}
    footer={<><Button variant="secondary" onClick={onClose} disabled={busy || saving}>Cancel</Button>
      <Button disabled={busy} onClick={handleSubmit(onSubmit)} loading={saving}>Save changes</Button></>}>
    <div className="flex flex-col gap-4">
      <Field label="Campaign name" htmlFor="ad-title" error={errors.title?.message} required>
        <Input id="ad-title" {...register("title")} invalid={Boolean(errors.title)} />
      </Field>
      <p className="text-sm text-neutral-500">Recommended: {guideline.dimensions}px. {guideline.tip}</p>
      <Field label="Target URL" htmlFor="ad-target-url" error={errors.targetUrl?.message} required={values.isActive}>
        <Input id="ad-target-url" type="url" placeholder="https://example.com" {...register("targetUrl")} invalid={Boolean(errors.targetUrl)} />
      </Field>
      <Field label="Image" htmlFor="ad-image" error={errors.imageUrl?.message} required={values.isActive}>
        <ImageUpload adPlacement={ad.placement} onBusyChange={setBusy}
          onMetadata={(metadata) => setValue("imageReceipt", metadata.imageReceipt)}
          onUploaded={(url) => setValue("imageUrl", url, { shouldValidate: true })} />
        <input id="ad-image" type="hidden" {...register("imageUrl")} />
        {reusable.map((item) => <button type="button" key={item.id} disabled={busy} className="mt-2 min-h-11 text-sm text-accent underline"
          onClick={() => { setValue("imageReceipt", item.imageReceipt); setValue("imageUrl", item.imageUrl, { shouldValidate: true }); }}>Use image from {AD_PLACEMENT_GUIDELINES[item.placement].label}</button>)}
      </Field>
      <AdPreview placement={ad.placement} imageUrl={values.imageUrl} title={values.title} />
      <label className="flex min-h-11 items-center gap-2 text-sm">
        <input type="checkbox" {...register("isActive")} /> Active
      </label>
    </div>
  </Modal>;
}
