"use client";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useVideoDetail } from "@/features/videos/hooks/useVideoDetail";
import { VideoEmbed } from "@/features/videos/components/VideoEmbed";
import { VideoShelf } from "@/features/videos/components/VideoShelf";
import { VideoSequenceNav } from "@/features/videos/components/VideoSequenceNav";
import { ErrorState } from "@/shared/components/common/ErrorState";
interface WatchProps {
  id: string;
  model: ReturnType<typeof useVideoDetail>;
}
function WatchPlayer({ id, model }: WatchProps) {
  const video = model.video.data;
  if (!video) return null;
  return (
    <>
      <div
        className={
          video.format === "short"
            ? "relative mx-auto aspect-[9/16] w-full max-w-[360px]"
            : "relative aspect-video"
        }
      >
        <VideoEmbed key={id} video={video} />
      </div>
      {video.format === "short" ? (
        <VideoSequenceNav
          currentId={id}
          videos={model.related.data?.items || []}
        />
      ) : null}
    </>
  );
}
function WatchMetadata({ model }: WatchProps) {
  const video = model.video.data;
  if (!video) return null;
  return (
    <>
      {video.description ? (
        <p className="mt-5 max-w-3xl leading-7 text-neutral-300">
          {video.description}
        </p>
      ) : null}
      {model.program.data ? (
        <Link
          className="mt-4 inline-flex min-h-11 items-center underline"
          href={`/videos/programs/${model.program.data.slug}`}
        >
          {model.program.data.name} →
        </Link>
      ) : null}
    </>
  );
}
function WatchArticle({ id, model }: WatchProps) {
  const video = model.video.data;
  if (!video) return null;
  return (
    <article className="mx-auto max-w-[1040px]">
      <h1 className="my-5 text-[30px] font-bold leading-tight lg:text-[40px]">
        {video.title}
      </h1>
      <WatchPlayer id={id} model={model} />
      <WatchMetadata id={id} model={model} />
    </article>
  );
}
export function VideoDetail({ id }: { id: string }) {
  const model = useVideoDetail(id);
  const t = useTranslations("editorial");
  return (
    <div className="bg-[#050a16] px-4 py-5 md:p-5 text-white lg:p-8">
      <Link
        className="inline-flex min-h-11 items-center text-sm underline"
        href={model.video.data?.format === "short" ? "/shorts" : "/videos"}
      >
        ← {model.video.data?.format === "short" ? "Shorts" : "Video"}
      </Link>
      {model.video.isLoading ? (
        <div className="h-80 animate-pulse bg-white/10" />
      ) : null}
      {model.video.isError ? (
        <ErrorState
          tone="dark"
          message={model.video.error.message}
          onRetry={() => void model.video.refetch()}
        />
      ) : null}
      <WatchArticle id={id} model={model} />
      <VideoShelf
        title={t("nextVideos")}
        videos={(model.related.data?.items || []).filter((v) => v.id !== id)}
      />
      {model.related.isError ? (
        <ErrorState tone="dark" onRetry={() => void model.related.refetch()} />
      ) : null}
    </div>
  );
}
