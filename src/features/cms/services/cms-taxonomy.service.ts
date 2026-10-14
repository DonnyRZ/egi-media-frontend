import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import { axiosClient } from "@/shared/lib/axios-client";
import type {
  ApiSuccessResponse,
  PaginatedApiResponse,
} from "@/shared/types/api.types";
import { mapTag, type TagDto } from "@/features/cms/mappers/cms.mapper";
import type { Tag } from "@/features/cms/types/cms.types";

export interface TaxonomyWritePayload {
  name: string;
  description?: string | null;
  translations?: {
    en?: { name?: string; description?: string };
    uz?: { name?: string; description?: string };
  };
}

export type CategoryTranslationLocale = "en" | "uz";
export type CategoryTranslationStatus = "none" | "pending" | "processing" | "ready" | "failed";

export interface CmsCategoryTranslationState {
  categoryId: string;
  translations: Record<CategoryTranslationLocale, { name: string; description: string }>;
  locales: Record<CategoryTranslationLocale, {
    status: CategoryTranslationStatus;
    lastError: string | null;
    nameOrigin: "manual" | "ai" | null;
    descriptionOrigin: "manual" | "ai" | null;
    updatedAt: string | null;
  }>;
}

interface CategoryTranslationStateDto {
  category_id: string;
  translations: CmsCategoryTranslationState["translations"];
  locales: Record<CategoryTranslationLocale, {
    status: CategoryTranslationStatus;
    last_error?: string | null;
    name_origin?: "manual" | "ai" | null;
    description_origin?: "manual" | "ai" | null;
    updated_at?: string | null;
  }>;
}

export interface TopicWritePayload extends TaxonomyWritePayload {
  categoryId: string;
}

export interface SeriesWritePayload {
  name: string;
  description?: string | null;
  image?: string | null;
  topicId: string;
}

export interface CmsTaxonomyParent {
  id: string;
  name: string;
  slug: string | null;
}

export interface CmsTaxonomyItem {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  image: string | null;
  articleCount: number;
  categoryId: string | null;
  category: CmsTaxonomyParent | null;
  topicId: string | null;
  topic: CmsTaxonomyParent | null;
}

interface TaxonomyParentDto {
  id: string;
  name: string;
  slug?: string | null;
}

interface TaxonomyItemDto {
  id: string;
  name: string;
  slug?: string | null;
  description?: string | null;
  image?: string | null;
  article_count?: number | null;
  category_id?: string | null;
  category?: TaxonomyParentDto | null;
  topic_id?: string | null;
  topic?: TaxonomyParentDto | null;
}

function mapParent(dto: TaxonomyParentDto | null | undefined): CmsTaxonomyParent | null {
  if (!dto?.id) return null;
  return { id: dto.id, name: dto.name, slug: dto.slug ?? null };
}

async function fetchTaxonomyList(
  endpoint: string,
): Promise<CmsTaxonomyItem[]> {
  const response = await axiosClient.get<PaginatedApiResponse<TaxonomyItemDto>>(
    endpoint,
    { params: { limit: 100 } },
  );
  return (response.data.data ?? []).map((dto) => ({
    id: dto.id,
    name: dto.name,
    slug: dto.slug ?? null,
    description: dto.description ?? null,
    image: dto.image ?? null,
    articleCount: dto.article_count ?? 0,
    categoryId: dto.category_id ?? dto.category?.id ?? null,
    category: mapParent(dto.category),
    topicId: dto.topic_id ?? dto.topic?.id ?? null,
    topic: mapParent(dto.topic),
  }));
}

export const fetchCmsCategories = () =>
  fetchTaxonomyList(API_ENDPOINTS.categories);
export const fetchCmsTopics = () => fetchTaxonomyList(API_ENDPOINTS.topics);
export const fetchCmsSeries = () => fetchTaxonomyList(API_ENDPOINTS.series);
export const fetchCmsTags = () => fetchTaxonomyList(API_ENDPOINTS.tags);

export async function createCategory(
  payload: TaxonomyWritePayload,
): Promise<{ id: string; slug: string | null }> {
  const response = await axiosClient.post<ApiSuccessResponse<{ id: string; slug?: string | null }>>(
    API_ENDPOINTS.categories,
    {
    name: payload.name,
    description: payload.description ?? "",
    translations: payload.translations,
    },
  );
  return { id: response.data.data.id, slug: response.data.data.slug ?? null };
}

export async function updateCategory(
  id: string,
  payload: TaxonomyWritePayload,
): Promise<{ id: string }> {
  const response = await axiosClient.put<ApiSuccessResponse<{ id: string }>>(
    API_ENDPOINTS.categoryById(id),
    {
    name: payload.name,
    description: payload.description ?? "",
    translations: payload.translations,
    },
  );
  return { id: response.data.data.id };
}

export async function fetchCategoryTranslationState(
  id: string,
): Promise<CmsCategoryTranslationState> {
  const response = await axiosClient.get<ApiSuccessResponse<CategoryTranslationStateDto>>(
    API_ENDPOINTS.categoryTranslations(id),
  );
  const dto = response.data.data;
  const mapLocale = (locale: CategoryTranslationLocale) => ({
    status: dto.locales[locale].status,
    lastError: dto.locales[locale].last_error ?? null,
    nameOrigin: dto.locales[locale].name_origin ?? null,
    descriptionOrigin: dto.locales[locale].description_origin ?? null,
    updatedAt: dto.locales[locale].updated_at ?? null,
  });
  return {
    categoryId: dto.category_id,
    translations: dto.translations,
    locales: { en: mapLocale("en"), uz: mapLocale("uz") },
  };
}

export async function retryCategoryTranslation(
  id: string,
  locale: CategoryTranslationLocale,
): Promise<{ status: CategoryTranslationStatus; error: string | null }> {
  const response = await axiosClient.post<ApiSuccessResponse<{
    status: CategoryTranslationStatus;
    error?: string | null;
  }>>(API_ENDPOINTS.categoryTranslationRetry(id), { locale });
  return {
    status: response.data.data.status,
    error: response.data.data.error ?? null,
  };
}

export async function deleteCategory(id: string): Promise<void> {
  await axiosClient.delete(API_ENDPOINTS.categoryById(id));
}

export async function createTopic(payload: TopicWritePayload): Promise<void> {
  await axiosClient.post(API_ENDPOINTS.topics, {
    name: payload.name,
    description: payload.description ?? "",
    category_id: payload.categoryId,
  });
}

export async function updateTopic(
  id: string,
  payload: TopicWritePayload,
): Promise<void> {
  await axiosClient.put(API_ENDPOINTS.topicById(id), {
    name: payload.name,
    description: payload.description ?? "",
    category_id: payload.categoryId,
  });
}

export async function deleteTopic(id: string): Promise<void> {
  await axiosClient.delete(API_ENDPOINTS.topicById(id));
}

export async function fetchTags(): Promise<Tag[]> {
  const response = await axiosClient.get<PaginatedApiResponse<TagDto>>(
    API_ENDPOINTS.tags,
    { params: { limit: 100 } },
  );
  return (response.data.data ?? []).map(mapTag);
}

export async function createTag(name: string): Promise<Tag> {
  const response = await axiosClient.post<ApiSuccessResponse<TagDto>>(
    API_ENDPOINTS.tags,
    { name },
  );
  return mapTag(response.data.data);
}

export async function updateTag(id: string, name: string): Promise<Tag> {
  const response = await axiosClient.put<ApiSuccessResponse<TagDto>>(
    API_ENDPOINTS.tagById(id),
    { name },
  );
  return mapTag(response.data.data);
}

export async function deleteTag(id: string): Promise<void> {
  await axiosClient.delete(API_ENDPOINTS.tagById(id));
}

export async function createSeries(payload: SeriesWritePayload): Promise<void> {
  await axiosClient.post(API_ENDPOINTS.series, {
    name: payload.name,
    description: payload.description ?? "",
    image: payload.image || undefined,
    topic_id: payload.topicId,
  });
}

export async function updateSeries(
  id: string,
  payload: SeriesWritePayload,
): Promise<void> {
  await axiosClient.put(API_ENDPOINTS.seriesById(id), {
    name: payload.name,
    description: payload.description ?? "",
    image: payload.image || undefined,
    topic_id: payload.topicId,
  });
}

export async function deleteSeries(id: string): Promise<void> {
  await axiosClient.delete(API_ENDPOINTS.seriesById(id));
}
