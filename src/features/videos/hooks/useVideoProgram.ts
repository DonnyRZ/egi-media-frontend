"use client";
import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { fetchMediaResource } from "@/shared/services/editorial.service";
import { fetchYoutubeVideos } from "@/shared/services/youtube.service";
import type { ContentLocale } from "@/shared/types/article.types";
export function useVideoProgram(slug: string) {
  const lang = useLocale() as ContentLocale;
  const page = Math.max(1, Number(useSearchParams().get("page")) || 1);
  const program = useQuery({
    queryKey: ["video-program", slug, lang],
    queryFn: () => fetchMediaResource("programs", slug, lang),
  });
  const videos = useQuery({
    queryKey: ["program-episodes", program.data?.id, page, lang],
    queryFn: () =>
      fetchYoutubeVideos({
        lang,
        program_id: program.data!.id,
        page,
        limit: 12,
      }),
    enabled: Boolean(program.data),
  });
  return { program, videos, page };
}
