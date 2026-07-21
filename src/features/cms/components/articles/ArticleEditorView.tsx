"use client";

import { PageHeader } from "@/features/cms/components/layout/PageHeader";
import { ArticleForm } from "@/features/cms/components/articles/ArticleForm";
import { ErrorState, LoadingState } from "@/features/cms/components/ui/StateViews";
import { useCmsArticle } from "@/features/cms/hooks/useCmsArticles";
import type { ArticleFormValues } from "@/features/cms/schemas/cms.schemas";

const EMPTY_VALUES: ArticleFormValues = {
  title: "",
  summary: "",
  content: "",
  titleEn: "",
  summaryEn: "",
  contentEn: "",
  titleUz: "",
  summaryUz: "",
  contentUz: "",
  featuredImage: "",
  categoryId: "",
  seriesId: "",
  topicIds: [],
  tagIds: [],
};

export function ArticleEditorView({ articleId }: { articleId?: string }) {
  const isEdit = Boolean(articleId);
  const { data, isLoading, isError } = useCmsArticle(articleId ?? null);

  if (isEdit && isLoading) return <LoadingState label="Loading article…" />;
  if (isEdit && (isError || !data)) {
    return <ErrorState title="Article not found" />;
  }

  const defaultValues: ArticleFormValues =
    isEdit && data
      ? {
          title: data.title,
          summary: data.summary ?? "",
          content: data.content,
          titleEn: data.translationEn?.title ?? "",
          summaryEn: data.translationEn?.summary ?? "",
          contentEn: data.translationEn?.content ?? "",
          titleUz: data.translationUz?.title ?? "",
          summaryUz: data.translationUz?.summary ?? "",
          contentUz: data.translationUz?.content ?? "",
          featuredImage: data.featuredImage ?? "",
          categoryId: data.categoryId ?? "",
          seriesId: data.seriesId ?? "",
          topicIds: data.topicIds,
          tagIds: data.tagIds,
        }
      : EMPTY_VALUES;

  return (
    <>
      <PageHeader
        title={isEdit ? "Edit article" : "New article"}
        description={
          isEdit
            ? "Update your story and manage its lifecycle."
            : "Draft a new story for the EGI Media newsroom."
        }
      />
      <ArticleForm
        mode={isEdit ? "edit" : "new"}
        articleId={articleId}
        status={data?.status ?? "draft"}
        defaultValues={defaultValues}
      />
    </>
  );
}
