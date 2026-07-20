import { fetchSeries, fetchSeriesById } from "@/shared/services/series.service";
import { HOMEPAGE_LIMITS } from "@/shared/constants/homepage.constants";
import { SERIES_PAGE_LIMIT } from "@/shared/constants/series.constants";
import type { ContentLocale } from "@/shared/types/article.types";
import type { SeriesDetail, SeriesListResult } from "@/shared/types/series.types";

export async function getFeaturedSeries(
  lang: ContentLocale = "id",
): Promise<SeriesListResult> {
  return fetchSeries({
    page: 1,
    limit: HOMEPAGE_LIMITS.featuredSeries,
    lang,
  });
}

export async function getSeriesPage(
  lang: ContentLocale = "id",
  page = 1,
): Promise<SeriesListResult> {
  return fetchSeries({
    page,
    limit: SERIES_PAGE_LIMIT,
    lang,
  });
}

export async function getSeriesBySlug(
  slug: string,
  lang: ContentLocale = "id",
): Promise<SeriesDetail> {
  const list = await fetchSeries({
    page: 1,
    limit: 50,
    search: slug,
    lang,
  });

  const match =
    list.items.find((item) => item.slug === slug) ??
    list.items.find((item) => item.slug.toLowerCase() === slug.toLowerCase());

  if (!match) {
    throw new Error("Series not found");
  }

  return fetchSeriesById(match.id, lang);
}
