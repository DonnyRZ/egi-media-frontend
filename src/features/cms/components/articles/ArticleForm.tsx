"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardBody } from "@/features/cms/components/ui/Card";
import { ArticleActionBar } from "@/features/cms/components/articles/ArticleActionBar";
import { ArticleLocaleFields } from "@/features/cms/components/articles/ArticleLocaleFields";
import { ArticleSettingsSidebar } from "@/features/cms/components/articles/ArticleSettingsSidebar";
import { ScheduleModal } from "@/features/cms/components/articles/ScheduleModal";
import {
  articleFormSchema,
  type ArticleFormValues,
} from "@/features/cms/schemas/cms.schemas";
import { useArticleMutations } from "@/features/cms/hooks/useArticleMutations";
import {
  useCategoryOptions,
  useSeriesOptions,
  useTagOptions,
  useTopicOptions,
} from "@/features/cms/hooks/useTaxonomyOptions";
import { usePermissions } from "@/features/cms/hooks/usePermissions";
import { useToast } from "@/features/cms/stores/cms-toast.store";
import { ApiError } from "@/shared/lib/errors";
import type {
  ArticleStatus,
  ArticleTranslation,
  ArticleWritePayload,
} from "@/features/cms/types/cms.types";

interface ArticleFormProps {
  mode: "new" | "edit";
  articleId?: string;
  status: ArticleStatus;
  defaultValues: ArticleFormValues;
}

export function ArticleForm({
  mode,
  articleId,
  status,
  defaultValues,
}: ArticleFormProps) {
  const router = useRouter();
  const toast = useToast();
  const { canPublish } = usePermissions();
  const { create, update, changeStatus } = useArticleMutations();
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const categories = useCategoryOptions();
  const topics = useTopicOptions();
  const series = useSeriesOptions();
  const tags = useTagOptions();

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues,
  });

  const saving = create.isPending || update.isPending || changeStatus.isPending;
  const title = watch("title");

  function buildTranslations(
    values: ArticleFormValues,
  ): ArticleWritePayload["translations"] {
    const translations: Partial<Record<"en" | "uz", ArticleTranslation>> = {};
    // Only send a locale when both title and content are present (backend rule).
    if (values.titleEn?.trim() && values.contentEn?.trim()) {
      translations.en = {
        title: values.titleEn.trim(),
        summary: values.summaryEn?.trim() ?? "",
        content: values.contentEn,
      };
    }
    if (values.titleUz?.trim() && values.contentUz?.trim()) {
      translations.uz = {
        title: values.titleUz.trim(),
        summary: values.summaryUz?.trim() ?? "",
        content: values.contentUz,
      };
    }
    return Object.keys(translations).length > 0 ? translations : undefined;
  }

  function buildPayload(values: ArticleFormValues): ArticleWritePayload {
    return {
      title: values.title,
      content: values.content,
      summary: values.summary || null,
      featuredImage: values.featuredImage || null,
      categoryId: values.categoryId || null,
      seriesId: values.seriesId || null,
      topicIds: values.topicIds,
      tagIds: values.tagIds,
      translations: buildTranslations(values),
    };
  }

  async function persist(
    values: ArticleFormValues,
    nextStatus?: ArticleStatus,
    publishedAt?: string,
  ): Promise<string> {
    const payload = buildPayload(values);
    if (mode === "new") {
      return create.mutateAsync({
        ...payload,
        status: nextStatus ?? "draft",
        publishedAt,
      });
    }
    await update.mutateAsync({ id: articleId as string, payload });
    if (nextStatus && nextStatus !== status) {
      await changeStatus.mutateAsync({
        id: articleId as string,
        status: nextStatus,
        publishedAt,
      });
    }
    return articleId as string;
  }

  function run(nextStatus: ArticleStatus | undefined, message: string, toList: boolean, publishedAt?: string) {
    return handleSubmit(async (values) => {
      try {
        const id = await persist(values, nextStatus, publishedAt);
        toast.success(message);
        router.push(toList ? "/cms/articles" : `/cms/articles/${id}`);
      } catch (error) {
        toast.error(error instanceof ApiError ? error.message : "Something went wrong");
      }
    })();
  }

  return (
    <form className="grid gap-6 lg:grid-cols-3" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardBody>
            <ArticleLocaleFields
              control={control}
              register={register}
              errors={errors}
              title={title}
            />
          </CardBody>
        </Card>
      </div>

      <div className="space-y-6">
        <ArticleActionBar
          mode={mode}
          status={status}
          canPublish={canPublish}
          saving={saving}
          onSave={() => run(undefined, "Draft saved", false)}
          onSubmitReview={() => run("review", "Submitted for review", true)}
          onPublish={() =>
            run(
              "published",
              "Article published",
              true,
              mode === "new" ? new Date().toISOString() : undefined,
            )
          }
          onSchedule={() => setScheduleOpen(true)}
          onArchive={() => run("archived", "Article archived", true)}
        />

        <ArticleSettingsSidebar
          control={control}
          categories={(categories.data?.items ?? []).map((c) => ({ value: c.id, label: c.name }))}
          series={(series.data?.items ?? []).map((s) => ({ value: s.id, label: s.name }))}
          topics={(topics.data?.items ?? []).map((t) => ({ value: t.id, label: t.name }))}
          tags={(tags.data ?? []).map((t) => ({ value: t.id, label: t.name }))}
        />
      </div>

      <ScheduleModal
        open={scheduleOpen}
        loading={saving}
        onClose={() => setScheduleOpen(false)}
        onConfirm={(iso) => {
          setScheduleOpen(false);
          run("scheduled", "Article scheduled", true, iso);
        }}
      />
    </form>
  );
}
