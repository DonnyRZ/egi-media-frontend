"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ImageUpload } from "@/features/cms/components/media/ImageUpload";
import { Button } from "@/features/cms/components/ui/Button";
import { Field } from "@/features/cms/components/ui/Field";
import { Input } from "@/features/cms/components/ui/Input";
import { Modal } from "@/features/cms/components/ui/Modal";
import {
  adFormSchema,
  type AdFormValues,
} from "@/features/cms/schemas/cms.schemas";
import type { CmsAd } from "@/features/cms/services/cms-ads.service";
import {
  AD_PLACEMENT_GUIDELINES,
  isAdPlacement,
  type AdPlacement,
} from "@/shared/types/ads.types";

interface AdFormModalProps {
  open: boolean;
  saving: boolean;
  ad: CmsAd | null;
  onClose: () => void;
  onSubmit: (values: AdFormValues) => void;
}

const EMPTY: AdFormValues = {
  title: "",
  imageUrl: "",
  targetUrl: "",
  placement: "IN_FEED",
  isActive: true,
};

function resolvePlacement(value: string): AdPlacement {
  return isAdPlacement(value) ? value : "IN_FEED";
}

export function AdFormModal({
  open,
  saving,
  ad,
  onClose,
  onSubmit,
}: AdFormModalProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AdFormValues>({
    resolver: zodResolver(adFormSchema),
    defaultValues: EMPTY,
  });

  const isActive = watch("isActive");
  const imageUrl = watch("imageUrl");
  const placement = resolvePlacement(ad?.placement ?? watch("placement"));
  const guideline = AD_PLACEMENT_GUIDELINES[placement];

  useEffect(() => {
    if (!open || !ad) return;
    reset({
      title: ad.title,
      imageUrl: ad.imageUrl,
      targetUrl: ad.targetUrl ?? "",
      placement: resolvePlacement(ad.placement),
      isActive: ad.isActive,
    });
  }, [open, ad, reset]);

  if (!open || !ad) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit advertisement"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} loading={saving}>
            Save changes
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Field label="Title" htmlFor="ad-title" error={errors.title?.message} required>
          <Input
            id="ad-title"
            invalid={Boolean(errors.title)}
            placeholder="Campaign title"
            {...register("title")}
          />
        </Field>

        <Field label="Placement" htmlFor="ad-placement">
          <input type="hidden" {...register("placement")} />
          <p
            id="ad-placement"
            className="flex h-10 items-center rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
          >
            {guideline.label}
          </p>
          <p className="mt-1.5 text-xs text-neutral-500">
            Recommend {guideline.dimensions}.{" "}
            {placement === "LEADERBOARD"
              ? "Centered at up to 720×310 so the artwork stays readable."
              : "Slot is fixed by layout."}
          </p>
        </Field>

        {/* Target URL — always rendered, never conditional */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="ad-target-url"
            className="block text-xs font-semibold uppercase tracking-wide text-neutral-600 dark:text-neutral-400"
          >
            Target URL <span className="text-accent">*</span>
          </label>
          <Controller
            name="targetUrl"
            control={control}
            render={({ field }) => (
              <input
                id="ad-target-url"
                name={field.name}
                ref={field.ref}
                type="text"
                inputMode="url"
                autoComplete="off"
                placeholder="https://example.com"
                value={field.value ?? ""}
                onBlur={field.onBlur}
                onChange={(event) => field.onChange(event.target.value)}
                className="mt-1 mb-1 box-border block h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
              />
            )}
          />
          {errors.targetUrl?.message ? (
            <p className="text-xs text-error">{errors.targetUrl.message}</p>
          ) : null}
        </div>

        <Field
          label="Image"
          htmlFor="ad-image"
          error={errors.imageUrl?.message}
          required
        >
          <div className="space-y-3">
            <p className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs leading-relaxed text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
              <span className="font-medium text-ink">Recommended: </span>
              {guideline.dimensions}. {guideline.tip}
            </p>
            <ImageUpload
              onUploaded={(url) =>
                setValue("imageUrl", url, { shouldValidate: true })
              }
            />
            <Input
              id="ad-image"
              placeholder="https://… or /images/…"
              invalid={Boolean(errors.imageUrl)}
              {...register("imageUrl")}
            />
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt="Preview"
                className="h-24 w-full rounded-md object-cover"
              />
            ) : null}
          </div>
        </Field>

        <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-neutral-300 text-accent focus:ring-accent"
            checked={isActive}
            onChange={(event) => setValue("isActive", event.target.checked)}
          />
          Active (shown on the public website)
        </label>
      </div>
    </Modal>
  );
}
