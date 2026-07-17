import { axiosClient } from "@/shared/lib/axios-client";
import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import { mapNewsletterListDto } from "@/shared/mappers/newsletter.mapper";
import type {
  PaginatedApiResponse,
  NewsletterListParams,
} from "@/shared/types/api.types";
import type { NewsletterListResult } from "@/shared/types/newsletter.types";

interface NewsletterDto {
  id: string;
  title: string;
  description: string | null;
  frequency: "daily" | "weekly" | "monthly";
}

export async function fetchNewsletters(
  params: NewsletterListParams,
): Promise<NewsletterListResult> {
  const response = await axiosClient.get<PaginatedApiResponse<NewsletterDto>>(
    API_ENDPOINTS.newsletters,
    { params },
  );

  return mapNewsletterListDto({
    items: response.data.data,
    meta: { total: response.data.meta?.total ?? 0 },
  });
}
