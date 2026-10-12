"use client";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { VideoShelf } from "@/features/videos/components/VideoShelf";
import { ScrollShelf } from "@/features/videos/components/ScrollShelf";
import { ArticleImage } from "@/shared/components/common/ArticleImage";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { Pagination } from "@/shared/components/common/Pagination";
import { fetchYoutubeVideos } from "@/shared/services/youtube.service";
import type { MediaResource } from "@/shared/types/editorial.types";
import type { ContentLocale } from "@/shared/types/article.types";
import type { useVideoHub } from "@/features/videos/hooks/useVideoHub";
export interface HubModelProps {
  model: ReturnType<typeof useVideoHub>;
  shorts: boolean;
}
function VideoCollection({
  collection,
  lang,
}: {
  collection: MediaResource;
  lang: ContentLocale;
}) {
  const query = useQuery({
    queryKey: ["editorial-video-collection", collection.id, lang],
    queryFn: () =>
      fetchYoutubeVideos({ collection_id: collection.id, lang, limit: 20 }),
  });
  if (query.isError)
    return (
      <ErrorState
        tone="dark"
        title={collection.name}
        onRetry={() => void query.refetch()}
      />
    );
  if (query.isLoading)
    return (
      <div className="my-6 h-40 animate-pulse bg-white/10" aria-busy="true" />
    );
  return (
    <VideoShelf title={collection.name} videos={query.data?.items || []} />
  );
}
export function VideoHubCollections({ model, shorts }: HubModelProps) {
  if (shorts || model.page !== 1) return null;
  return (
    <>
      {model.collections.data?.map((collection) => (
        <VideoCollection
          key={collection.id}
          collection={collection}
          lang={model.lang}
        />
      ))}
      <VideoShelf title="Shorts" videos={model.shortVideos.data?.items || []} />
    </>
  );
}
export function VideoHubPrograms({ model, shorts }: HubModelProps) {
  if (shorts || model.page !== 1 || !model.programs.data?.length) return null;
  return (
    <ScrollShelf title="Original Series">
      {model.programs.data.map((program) => (
        <Link
          key={program.id}
          href={`/videos/programs/${program.slug}`}
          className="w-[70%] shrink-0 snap-start sm:w-[40%] lg:w-[23%]"
        >
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-neutral-900">
            <ArticleImage alt={program.name} src={program.poster_url || null} />
          </div>
          <h3 className="mt-3 text-lg font-bold">{program.name}</h3>
        </Link>
      ))}
    </ScrollShelf>
  );
}
export function VideoHubLatest({ model, shorts }: HubModelProps) {
  const t = useTranslations("editorial");
  const videos = model.videos;
  return (
    <>
      <VideoShelf
        title={shorts ? "Shorts" : t("latestVideos")}
        videos={(videos.data?.items || []).filter(
          (v) => v.id !== model.hero?.id,
        )}
      />
      {videos.data && !videos.data.items.length ? (
        <div className="py-8">
          <p>{t("noVideos")}</p>
          <Link
            className="mt-4 inline-flex min-h-11 items-center underline"
            href="/latest"
          >
            {t("latest")}
          </Link>
        </div>
      ) : null}
      {videos.data ? (
        <Pagination
          basePath={shorts ? "/shorts" : "/videos"}
          currentPage={model.page}
          totalPages={videos.data.totalPages}
          totalItems={videos.data.total}
          pageSize={12}
          itemLabel="videos"
          className="[&_a]:text-white [&_p]:text-neutral-300 [&_a[aria-current=page]]:bg-white [&_a[aria-current=page]]:text-ink"
        />
      ) : null}
    </>
  );
}
function hubFailures(model: HubModelProps["model"]) {
  return [
    {
      query: model.shortVideos,
      label: "Shorts",
      show: model.shortVideos.isError,
    },
    {
      query: model.programs,
      label: "Original Series",
      show: model.programs.isError,
    },
    {
      query: model.collections,
      label: "Collections",
      show: model.collections.isError,
    },
    {
      query: model.settings,
      label: "Video hero",
      show: model.settings.isError,
    },
    {
      query: model.configured,
      label: "Video hero",
      show: model.configuredFailure,
    },
  ];
}
export function VideoHubNotices({ model }: HubModelProps) {
  const failures = hubFailures(model);
  return (
    <>
      {failures
        .filter((f) => f.show)
        .map((failure, index) => (
          <div className="mt-4" key={index}>
            <ErrorState
              tone="dark"
              title={failure.label}
              onRetry={() => void failure.query.refetch()}
            />
          </div>
        ))}
    </>
  );
}
