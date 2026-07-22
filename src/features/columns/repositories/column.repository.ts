import {
  COLUMNS_PAGE_LIMIT,
  MY_COLUMNS_PAGE_LIMIT,
  SAVED_COLUMN_PAGE_LIMIT,
} from "@/features/columns/constants/column.constants";
import {
  createColumn,
  deleteColumn,
  fetchColumnBySlug,
  fetchColumns,
  fetchMyColumnById,
  fetchMyColumns,
  fetchSavedColumns,
  recordColumnShare,
  recordColumnView,
  saveColumn,
  submitColumn,
  unsaveColumn,
  updateColumn,
} from "@/features/columns/services/column.service";
import type {
  ColumnDetail,
  ColumnListResult,
  ColumnWritePayload,
  MyColumnsParams,
} from "@/features/columns/types/column.types";
import type {
  ContentLocale,
  SharePlatform,
} from "@/shared/types/article.types";

export interface ColumnMutationResult {
  id: string;
  slug: string;
}

export async function getColumnsPage(
  lang: ContentLocale = "id",
  page = 1,
): Promise<ColumnListResult> {
  return fetchColumns({
    page,
    limit: COLUMNS_PAGE_LIMIT,
    sort: "latest",
    lang,
  });
}

export async function getColumnDetail(
  slug: string,
  lang: ContentLocale = "id",
): Promise<ColumnDetail> {
  return fetchColumnBySlug(slug, lang);
}

export async function getMyColumnDetail(
  id: string,
  lang: ContentLocale = "id",
): Promise<ColumnDetail> {
  return fetchMyColumnById(id, lang);
}

export async function getMyColumnsPage(
  params: Omit<MyColumnsParams, "limit"> & { lang?: ContentLocale },
): Promise<ColumnListResult> {
  return fetchMyColumns({
    page: params.page ?? 1,
    limit: MY_COLUMNS_PAGE_LIMIT,
    status: params.status,
    lang: params.lang ?? "id",
  });
}

export async function getSavedColumnsPage(
  lang: ContentLocale = "id",
  page = 1,
): Promise<ColumnListResult> {
  return fetchSavedColumns({
    page,
    limit: SAVED_COLUMN_PAGE_LIMIT,
    lang,
  });
}

export async function createColumnEntry(
  payload: ColumnWritePayload,
): Promise<ColumnMutationResult> {
  return createColumn(payload);
}

export async function updateColumnEntry(
  id: string,
  payload: Omit<ColumnWritePayload, "status">,
): Promise<ColumnMutationResult> {
  return updateColumn(id, payload);
}

export async function deleteColumnEntry(id: string): Promise<void> {
  return deleteColumn(id);
}

export async function submitColumnEntry(
  id: string,
): Promise<ColumnMutationResult> {
  return submitColumn(id);
}

export async function trackColumnView(
  columnId: string,
): Promise<number | null> {
  return recordColumnView(columnId);
}

export async function trackColumnShare(
  columnId: string,
  platform: SharePlatform,
): Promise<number | null> {
  return recordColumnShare(columnId, platform);
}

export async function saveColumnEntry(columnId: string): Promise<void> {
  return saveColumn(columnId);
}

export async function unsaveColumnEntry(columnId: string): Promise<void> {
  return unsaveColumn(columnId);
}
