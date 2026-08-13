import { axiosClient } from "@/shared/lib/axios-client";
import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type {
  TranslationEntityType,
  TranslationJob,
  TranslationJobStatus,
  TranslationStatus,
} from "@/features/cms/types/cms.types";

interface TranslationJobDto {
  id: string;
  entity_type?: TranslationEntityType;
  entity_id?: string;
  entity_title?: string;
  article_id: string;
  article_title: string;
  requested_by: string | null;
  target_status: "published" | "scheduled";
  job_status: TranslationJobStatus;
  error_message: string | null;
  translation_status: TranslationStatus;
  article_status: string;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
}

function mapJob(dto: TranslationJobDto): TranslationJob {
  const entityType = dto.entity_type ?? "article";
  const entityId = dto.entity_id || dto.article_id;
  const entityTitle = dto.entity_title || dto.article_title;
  return {
    id: dto.id,
    entityType,
    entityId,
    entityTitle,
    articleId: dto.article_id,
    articleTitle: dto.article_title,
    requestedBy: dto.requested_by,
    targetStatus: dto.target_status,
    jobStatus: dto.job_status,
    errorMessage: dto.error_message,
    translationStatus: dto.translation_status,
    articleStatus: dto.article_status,
    createdAt: dto.created_at,
    startedAt: dto.started_at,
    finishedAt: dto.finished_at,
  };
}

export async function fetchTranslationJobs(
  limit = 30,
): Promise<TranslationJob[]> {
  const response = await axiosClient.get<
    ApiSuccessResponse<{ items: TranslationJobDto[] }>
  >(API_ENDPOINTS.articleTranslationJobs, { params: { limit } });
  return (response.data.data.items ?? []).map(mapJob);
}

export async function retryArticleTranslation(
  articleId: string,
): Promise<void> {
  await axiosClient.post(API_ENDPOINTS.articleTranslateRetry(articleId));
}

export async function retryColumnTranslation(
  columnId: string,
): Promise<void> {
  await axiosClient.post(API_ENDPOINTS.columnTranslateRetry(columnId));
}

export async function retryTranslationJob(
  entityType: TranslationEntityType,
  entityId: string,
): Promise<void> {
  if (entityType === "column") {
    await retryColumnTranslation(entityId);
    return;
  }
  await retryArticleTranslation(entityId);
}
