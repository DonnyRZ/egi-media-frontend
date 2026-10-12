"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardBody } from "@/features/cms/components/ui/Card";
import { ArticleActionBar } from "@/features/cms/components/articles/ArticleActionBar";
import { ArticleLocaleFields } from "@/features/cms/components/articles/ArticleLocaleFields";
import { ArticleSettingsSidebar } from "@/features/cms/components/articles/ArticleSettingsSidebar";
import { ScheduleModal } from "@/features/cms/components/articles/ScheduleModal";
import {
  articleFormSchema,
  getMissingTranslationErrors,
  type ArticleFormValues,
} from "@/features/cms/schemas/cms.schemas";
import { useArticleMutations } from "@/features/cms/hooks/useArticleMutations";
import {
  toCategoryOptions,
  toSeriesOptions,
  toTagOptions,
  toTopicOptions,
} from "@/features/cms/hooks/useCascadingTaxonomyOptions";
import {
  useCmsCategories,
  useCmsSeries,
  useCmsTags,
  useCmsTopics,
} from "@/features/cms/hooks/useCmsTaxonomy";
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

const FIELD_LABELS: Record<keyof ArticleFormValues, string> = {
  title: "Indonesian title", summary: "Indonesian summary", content: "Indonesian content",
  titleEn: "English title", summaryEn: "English summary", contentEn: "English content",
  titleUz: "Uzbek title", summaryUz: "Uzbek summary", contentUz: "Uzbek content",
  featuredImageAlt:"Alternative text",featuredImageCaption:"Caption",featuredImageCredit:"Credit",
  featuredImage: "Featured image", categoryId: "Category", seriesId: "Series",
  topicId: "Topic", tagIds: "Tags", placements: "Placement", headlinePosition: "Headline position",
};

export function ArticleForm({
  mode,
  articleId,
  status,
  defaultValues,
}: ArticleFormProps) {
  const router = useRouter();
  const toast = useToast();
  const { canPublish } = usePermissions();
  const { create, update, changeStatus, updatePlacements } = useArticleMutations();
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const submitLock = useRef(false);
  const [saveFeedback, setSaveFeedback] = useState<{
    tone: "success" | "error"; message: string;
  } | null>(null);

  const categories = useCmsCategories();
  const topics = useCmsTopics();
  const series = useCmsSeries();
  const tags = useCmsTags();

  const {
    control,
    register,
    handleSubmit,
    watch,
    setError,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues,
  });

  const saving = isSubmitting || create.isPending || update.isPending ||
    changeStatus.isPending || updatePlacements.isPending;
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
      featuredImageAlt:values.featuredImageAlt,featuredImageCaption:values.featuredImageCaption,featuredImageCredit:values.featuredImageCredit,
      categoryId: values.categoryId || null,
      seriesId: values.seriesId || null,
      topicId: values.topicId || null,
      tagIds: values.tagIds,
      placements: values.placements,
      translations: buildTranslations(values),
    };
  }

  async function persist(
    values: ArticleFormValues,
    nextStatus?: ArticleStatus,
    publishedAt?: string,
  ): Promise<string> {
    const payload = buildPayload(values);
    let id: string;
    if (mode === "new") {
      id = await create.mutateAsync({
        ...payload,
        status: nextStatus ?? "draft",
        publishedAt,
      });
    } else {
      id = articleId as string;
      await update.mutateAsync({ id, payload });
      if (nextStatus && nextStatus !== status) {
        await changeStatus.mutateAsync({
          id,
          status: nextStatus,
          publishedAt,
        });
      }
    }

    await updatePlacements.mutateAsync({
      id,
      placements: values.placements,
      headlinePosition: values.placements.includes("headline")
        ? values.headlinePosition
        : null,
    });

    return id;
  }

  /** Review / publish / schedule only require Indonesian; EN/UZ stay optional in the editor. */
  function requireIndonesianContent(nextStatus?: ArticleStatus): boolean {
    const needsIndonesian =
      nextStatus === "review" ||
      nextStatus === "published" ||
      nextStatus === "scheduled";
    if (!needsIndonesian) return true;

    const missing = getMissingTranslationErrors(getValues());
    const keys = Object.keys(missing) as (keyof ArticleFormValues)[];
    if (keys.length === 0) return true;

    for (const key of keys) {
      const message = missing[key];
      if (message) setError(key, { type: "manual", message });
    }
    const message = "Fill Indonesian title and content before continuing.";
    setSaveFeedback({ tone: "error", message });
    toast.error(message);
    return false;
  }

  function reportValidationErrors(validationErrors: FieldErrors<ArticleFormValues>) {
    const details = (Object.keys(validationErrors) as (keyof ArticleFormValues)[])
      .map((key) => `${FIELD_LABELS[key] ?? key}: ${validationErrors[key]?.message ?? "Check this field"}`);
    const message = `Not saved. ${details.join("; ")}`;
    setSaveFeedback({ tone: "error", message });
    toast.error(message);
  }

  function run(nextStatus: ArticleStatus | undefined, message: string, toList: boolean, publishedAt?: string) {
    if (saving || submitLock.current) return;
    setSaveFeedback(null);
    if (!requireIndonesianContent(nextStatus)) return;
    submitLock.current = true;
    return handleSubmit(async (values) => {
      try {
        const id = await persist(values, nextStatus, publishedAt);
        setSaveFeedback({ tone: "success", message });
        toast.success(message);
        router.push(toList ? "/cms/articles" : `/cms/articles/${id}`);
      } catch (error) {
        const message = error instanceof ApiError ? error.message : "Could not complete save. Please try again.";
        setSaveFeedback({ tone: "error", message });
        toast.error(message);
      }
    }, reportValidationErrors)().finally(() => {
      submitLock.current = false;
    });
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
          feedback={saveFeedback}
          onSave={() => run(undefined, mode === "edit" ? "Article updated" : "Draft saved", false)}
          onSubmitReview={() => run("review", "Submitted for review", true)}
          onPublish={() =>
            run(
              "published",
              "Publish started — track EN/UZ translation in the bell.",
              true,
              mode === "new" ? new Date().toISOString() : undefined,
            )
          }
          onSchedule={() => setScheduleOpen(true)}
          onArchive={() => run("archived", "Article archived", true)}
        />

        <ArticleSettingsSidebar
          control={control}
          errors={errors}
          setValue={setValue}
          categories={toCategoryOptions(categories.data ?? [])}
          series={toSeriesOptions(series.data ?? [])}
          topics={toTopicOptions(topics.data ?? [])}
          tags={toTagOptions(tags.data ?? [])}
        />
      </div>

      <ScheduleModal
        open={scheduleOpen}
        loading={saving}
        onClose={() => setScheduleOpen(false)}
        onConfirm={(iso) => {
          setScheduleOpen(false);
          run(
            "scheduled",
            "Schedule set — translation started; track progress in the bell.",
            true,
            iso,
          );
        }}
      />
    </form>
  );
}
