import { fetchSeries } from "@/shared/services/series.service";
import type { SeriesListParams } from "@/shared/types/api.types";
import type { SeriesListResult } from "@/shared/types/series.types";
import { HOMEPAGE_LIMITS } from "@/shared/constants/homepage.constants";

export async function getFeaturedSeries(): Promise<SeriesListResult> {
  const params: SeriesListParams = {
    page: 1,
    limit: HOMEPAGE_LIMITS.featuredSeries,
  };

  return fetchSeries(params);
}
