"use client";
import { useQuery } from "@tanstack/react-query";
import { useCategoryOptions } from "@/features/cms/hooks/useTaxonomyOptions";
import { fetchMediaCatalog } from "@/shared/services/editorial.service";
export function useVideoMetadataOptions() {
  const categories = useCategoryOptions();
  const programs = useQuery({
    queryKey: ["cms-video-program-options"],
    queryFn: () => fetchMediaCatalog("programs", "id", true),
  });
  return { categories, programs };
}
