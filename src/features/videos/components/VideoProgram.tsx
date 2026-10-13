"use client";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useVideoProgram } from "@/features/videos/hooks/useVideoProgram";
import { ArticleImage } from "@/shared/components/common/ArticleImage";
import { Pagination } from "@/shared/components/common/Pagination";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { VideoShelf } from "@/features/videos/components/VideoShelf";
interface ProgramModelProps {
  model: ReturnType<typeof useVideoProgram>;
}
function ProgramHeader({ model }: ProgramModelProps) {
  const program = model.program.data;
  if (!program) return null;
  return (
    <header className="my-6 grid gap-6 md:grid-cols-[240px_1fr]">
      <div className="relative aspect-[2/3] w-full max-w-[240px] bg-neutral-900">
        <ArticleImage src={program.poster_url || null} alt={program.name} />
      </div>
      <div className="self-center">
        <p className="text-sm font-semibold text-neutral-300">
          Original Series
        </p>
        <h1 className="editorial-page-title mt-3 text-3xl font-bold lg:text-5xl">{program.name}</h1>
        {program.description ? (
          <p className="mt-4 max-w-2xl leading-7 text-neutral-300">
            {program.description}
          </p>
        ) : null}
      </div>
    </header>
  );
}
function ProgramEpisodes({ model }: ProgramModelProps) {
  const t = useTranslations("editorial");
  return (
    <>
      {model.videos.isError ? (
        <ErrorState tone="dark" onRetry={() => void model.videos.refetch()} />
      ) : null}
      {model.videos.isLoading ? (
        <div className="h-40 animate-pulse bg-white/10" />
      ) : null}
      <VideoShelf
        title={t("episodes")}
        videos={model.videos.data?.items || []}
      />
      {model.videos.data && !model.videos.data.items.length ? (
        <p className="py-6">{t("noVideos")}</p>
      ) : null}
    </>
  );
}
export function VideoProgram({ slug }: { slug: string }) {
  const model = useVideoProgram(slug);
  return (
    <div className="editorial-gutter bg-[#050a16] px-4 py-5 text-white md:px-6 lg:px-8">
      <Link
        className="inline-flex min-h-11 items-center underline"
        href="/videos"
      >
        ← Video
      </Link>
      {model.program.isLoading ? (
        <div className="h-80 animate-pulse bg-white/10" />
      ) : null}
      {model.program.isError ? (
        <ErrorState
          tone="dark"
          message={model.program.error.message}
          onRetry={() => void model.program.refetch()}
        />
      ) : null}
      <ProgramHeader model={model} />
      <ProgramEpisodes model={model} />
      {model.videos.data ? (
        <Pagination
          basePath={`/videos/programs/${slug}`}
          currentPage={model.page}
          totalPages={model.videos.data.totalPages}
          itemLabel="videos"
          className="[&_a]:text-white [&_p]:text-neutral-300 [&_a[aria-current=page]]:bg-white [&_a[aria-current=page]]:text-ink"
        />
      ) : null}
    </div>
  );
}
