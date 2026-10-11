"use client";

import { useHomepageNews } from "@/features/homepage/hooks/useHomepageNews";
import { ErrorState } from "@/shared/components/common/ErrorState";

export function HomepageSectionNotice({ section }: { section: string }) {
  const query = useHomepageNews();
  if (!query.data?.failedSections.includes(section)) return null;
  return <div className="bg-white p-4"><ErrorState onRetry={() => void query.refetch()} /></div>;
}
