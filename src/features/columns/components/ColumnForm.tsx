"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { useColumnMutations } from "@/features/columns/hooks/useColumnMutations";
import {
  createColumnFormSchema,
  type ColumnFormValues,
} from "@/features/columns/schemas/column.schema";
import type {
  ColumnDetail,
  ColumnTranslation,
  ColumnWritePayload,
} from "@/features/columns/types/column.types";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/shared/components/ui/Button";
import { TextArea } from "@/shared/components/ui/TextArea";
import { TextField } from "@/shared/components/ui/TextField";
import { ApiError } from "@/shared/lib/errors";

interface ColumnFormProps {
  mode: "create" | "edit";
  columnId?: string;
  defaultValues?: ColumnFormValues;
  initialDetail?: ColumnDetail;
}

function buildTranslations(
  values: ColumnFormValues,
): ColumnWritePayload["translations"] {
  const translations: Partial<Record<"en" | "uz", ColumnTranslation>> = {};

  if (values.titleEn?.trim() && values.contentEn?.trim()) {
    translations.en = {
      title: values.titleEn.trim(),
      summary: values.summaryEn?.trim() || null,
      content: values.contentEn.trim(),
    };
  }
  if (values.titleUz?.trim() && values.contentUz?.trim()) {
    translations.uz = {
      title: values.titleUz.trim(),
      summary: values.summaryUz?.trim() || null,
      content: values.contentUz.trim(),
    };
  }

  return Object.keys(translations).length > 0 ? translations : undefined;
}

function buildPayload(
  values: ColumnFormValues,
  status?: "draft" | "pending_approval",
): ColumnWritePayload {
  const featured = values.featuredImage?.trim();
  return {
    title: values.title.trim(),
    content: values.content.trim(),
    summary: values.summary?.trim() || null,
    featured_image: featured || null,
    translations: buildTranslations(values),
    ...(status ? { status } : {}),
  };
}

export function ColumnForm({
  mode,
  columnId,
  defaultValues,
}: ColumnFormProps) {
  const t = useTranslations("columnsPage");
  const router = useRouter();
  const { create, update, submit } = useColumnMutations();

  const schema = useMemo(
    () =>
      createColumnFormSchema({
        titleRequired: t("validation.titleRequired"),
        contentRequired: t("validation.contentRequired"),
        featuredImageInvalid: t("validation.featuredImageInvalid"),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ColumnFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? {
      title: "",
      summary: "",
      content: "",
      featuredImage: "",
      titleEn: "",
      summaryEn: "",
      contentEn: "",
      titleUz: "",
      summaryUz: "",
      contentUz: "",
    },
  });

  const isPending =
    create.isPending || update.isPending || submit.isPending;

  async function saveDraft(values: ColumnFormValues) {
    try {
      if (mode === "create") {
        await create.mutateAsync(buildPayload(values, "draft"));
      } else if (columnId) {
        await update.mutateAsync({
          id: columnId,
          payload: buildPayload(values),
        });
      }
      router.push("/kolom/saya");
    } catch (error) {
      throw error;
    }
  }

  async function saveAndSubmit(values: ColumnFormValues) {
    try {
      if (mode === "create") {
        await create.mutateAsync(buildPayload(values, "pending_approval"));
      } else if (columnId) {
        await update.mutateAsync({
          id: columnId,
          payload: buildPayload(values),
        });
        await submit.mutateAsync(columnId);
      }
      router.push("/kolom/saya");
    } catch (error) {
      throw error;
    }
  }

  return (
    <form className="space-y-8" noValidate>
      <section className="space-y-4 border border-neutral-200 bg-white p-6 sm:p-8">
        <div>
          <h2 className="font-serif text-xl font-bold text-ink">
            {t("form.mainHeading")}
          </h2>
          <p className="mt-1 text-sm text-neutral-600">{t("form.mainLede")}</p>
        </div>
        <TextField
          error={errors.title?.message}
          label={t("form.title")}
          {...register("title")}
        />
        <TextArea
          error={errors.summary?.message}
          label={t("form.summary")}
          rows={3}
          {...register("summary")}
        />
        <TextArea
          error={errors.content?.message}
          label={t("form.content")}
          rows={12}
          {...register("content")}
        />
        <TextField
          error={errors.featuredImage?.message}
          label={t("form.featuredImage")}
          placeholder="https://"
          type="url"
          {...register("featuredImage")}
        />
      </section>

      <section className="space-y-4 border border-neutral-200 bg-white p-6 sm:p-8">
        <div>
          <h2 className="font-serif text-lg font-bold text-ink">
            {t("form.translationsHeading")}
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            {t("form.translationsLede")}
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              English
            </p>
            <TextField label={t("form.titleEn")} {...register("titleEn")} />
            <TextArea
              label={t("form.summaryEn")}
              rows={2}
              {...register("summaryEn")}
            />
            <TextArea
              label={t("form.contentEn")}
              rows={6}
              {...register("contentEn")}
            />
          </div>
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Oʻzbekcha
            </p>
            <TextField label={t("form.titleUz")} {...register("titleUz")} />
            <TextArea
              label={t("form.summaryUz")}
              rows={2}
              {...register("summaryUz")}
            />
            <TextArea
              label={t("form.contentUz")}
              rows={6}
              {...register("contentUz")}
            />
          </div>
        </div>
      </section>

      {(create.error || update.error || submit.error) && (
        <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {(create.error ?? update.error ?? submit.error) instanceof ApiError
            ? (create.error ?? update.error ?? submit.error)?.message
            : t("errors.saveFailed")}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <Button
          className="rounded-none"
          disabled={isPending}
          onClick={handleSubmit(saveDraft)}
          type="button"
          variant="secondary"
        >
          {isPending ? t("form.saving") : t("form.saveDraft")}
        </Button>
        <Button
          className="rounded-none"
          disabled={isPending}
          onClick={handleSubmit(saveAndSubmit)}
          type="button"
        >
          {isPending ? t("form.saving") : t("form.submitForReview")}
        </Button>
      </div>
    </form>
  );
}
