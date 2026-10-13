"use client";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { SearchResultSection } from "@/features/search/components/SearchResultSection";
import { PageFrame } from "@/shared/components/layout/PageFrame";
import { FrameModule } from "@/shared/components/layout/FrameModule";
export function SearchResultsView() {
  const query=(useSearchParams().get("q")||"").trim();
  const t=useTranslations("editorial");
  return <PageFrame><FrameModule><div className="editorial-gutter px-4 py-5 md:p-5"><h1 className="editorial-page-title text-3xl font-bold">{t("search")}</h1><form key={query} action="" className="mt-4 flex gap-2"><input className="min-h-11 min-w-0 flex-1 border border-neutral-300 px-3" aria-label={t("search")} name="q" defaultValue={query}/><button type="submit" className="min-h-11 bg-ink px-5 font-semibold text-white">{t("searchSubmit")}</button></form></div>{query?<><SearchResultSection key={query+"articles"} query={query} kind="articles"/><SearchResultSection key={query+"columns"} query={query} kind="columns"/></>:null}</FrameModule></PageFrame>;
}
