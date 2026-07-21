import {
  ALREADY_SUBSCRIBED_STATUS,
  NEWSLETTER_ENDPOINTS,
  NOT_FOUND_STATUS,
} from "@/features/newsletters/constants/newsletter.constants";
import {
  mapNewsletterList,
  type NewsletterDto,
} from "@/features/newsletters/mappers/newsletter.mapper";
import type {
  NewsletterListParams,
  NewsletterListResult,
} from "@/features/newsletters/types/newsletter.types";
import { axiosClient } from "@/shared/lib/axios-client";
import { ApiError } from "@/shared/lib/errors";
import type { PaginatedApiResponse } from "@/shared/types/api.types";
import type { ContentLocale } from "@/shared/types/article.types";

export async function fetchNewsletters(
  params: NewsletterListParams = {},
  lang: ContentLocale = "id",
): Promise<NewsletterListResult> {
  // The API does not accept a language param; it returns every translation
  // variant in one payload, so we resolve the active locale client-side.
  const response = await axiosClient.get<PaginatedApiResponse<NewsletterDto>>(
    NEWSLETTER_ENDPOINTS.list,
    { params },
  );
  return mapNewsletterList(response.data.data, response.data.meta, lang);
}

export async function subscribeNewsletter(id: string): Promise<void> {
  try {
    await axiosClient.post(NEWSLETTER_ENDPOINTS.subscribe(id));
  } catch (error) {
    // Treat "already subscribed" as success so the UI stays consistent.
    if (error instanceof ApiError && error.statusCode === ALREADY_SUBSCRIBED_STATUS) {
      return;
    }
    throw error;
  }
}

export async function unsubscribeNewsletter(id: string): Promise<void> {
  try {
    await axiosClient.delete(NEWSLETTER_ENDPOINTS.subscribe(id));
  } catch (error) {
    // Treat "not subscribed" as success so the toggle is idempotent.
    if (error instanceof ApiError && error.statusCode === NOT_FOUND_STATUS) {
      return;
    }
    throw error;
  }
}
