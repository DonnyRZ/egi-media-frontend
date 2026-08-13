"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/features/cms/components/ui/Button";
import { Field } from "@/features/cms/components/ui/Field";
import { Input } from "@/features/cms/components/ui/Input";
import { Modal } from "@/features/cms/components/ui/Modal";
import {
  socialMediaLinkFormSchema,
  type SocialMediaLinkFormValues,
} from "@/features/cms/schemas/cms.schemas";
import type { CmsSocialMediaLink } from "@/features/cms/services/cms-social-media.service";
import { SOCIAL_ICON_OPTIONS } from "@/features/footer/constants/social.constants";
import { SocialIcon } from "@/features/footer/components/SocialIcons";

interface SocialMediaFormModalProps {
  open: boolean;
  saving: boolean;
  link: CmsSocialMediaLink | null;
  onClose: () => void;
  onSubmit: (values: SocialMediaLinkFormValues) => void;
}

const EMPTY: SocialMediaLinkFormValues = {
  platformName: "",
  url: "",
  iconName: "youtube",
  isActive: true,
  sortOrder: 0,
};

export function SocialMediaFormModal({
  open,
  saving,
  link,
  onClose,
  onSubmit,
}: SocialMediaFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SocialMediaLinkFormValues>({
    resolver: zodResolver(socialMediaLinkFormSchema),
    defaultValues: EMPTY,
  });

  const isActive = watch("isActive");
  const iconName = watch("iconName");

  useEffect(() => {
    if (!open) return;
    reset(
      link
        ? {
            platformName: link.platformName,
            url: link.url,
            iconName: link.iconName,
            isActive: link.isActive,
            sortOrder: link.sortOrder,
          }
        : EMPTY,
    );
  }, [open, link, reset]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={link ? "Edit social link" : "Add social link"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} loading={saving}>
            {link ? "Save changes" : "Add link"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field
          label="Platform name"
          htmlFor="social-platform"
          error={errors.platformName?.message}
          required
        >
          <Input
            id="social-platform"
            invalid={Boolean(errors.platformName)}
            placeholder="Instagram"
            {...register("platformName")}
          />
        </Field>

        <Field label="URL" htmlFor="social-url" error={errors.url?.message} required>
          <Input
            id="social-url"
            type="url"
            placeholder="https://"
            invalid={Boolean(errors.url)}
            {...register("url")}
          />
        </Field>

        <Field label="Icon" htmlFor="social-icon" error={errors.iconName?.message} required>
          <div className="flex items-center gap-3">
            <select
              id="social-icon"
              className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm dark:border-neutral-700 dark:bg-neutral-900"
              {...register("iconName")}
            >
              {SOCIAL_ICON_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-neutral-200 text-neutral-700 dark:border-neutral-700 dark:text-neutral-200">
              <SocialIcon className="h-5 w-5" platform={iconName} />
            </span>
          </div>
        </Field>

        <Field
          label="Sort order"
          htmlFor="social-sort"
          error={errors.sortOrder?.message}
          required
        >
          <Input
            id="social-sort"
            type="number"
            min={0}
            invalid={Boolean(errors.sortOrder)}
            {...register("sortOrder")}
          />
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
