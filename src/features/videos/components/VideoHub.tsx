"use client";
import { Link } from "@/i18n/navigation";
import { useVideoHub } from "@/features/videos/hooks/useVideoHub";
import { VideoHeroStage, VideoHeroSkeleton } from "@/features/videos/components/VideoHeroStage";
import {
  VideoHubCollections,
  VideoHubPrograms,
  VideoHubLatest,
  VideoHubNotices,
} from "@/features/videos/components/VideoHubSections";
import { ErrorState } from "@/shared/components/common/ErrorState";
export function VideoHub({ shorts = false }: { shorts?: boolean }) {
  const model = useVideoHub(shorts);
  return (
    <div className="editorial-gutter bg-[#050a16] px-4 py-6 text-white md:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="editorial-page-title text-3xl font-bold">{shorts ? "Shorts" : "Video"}</h1>
        <nav className="flex gap-5">
          <Link href="/videos" aria-current={!shorts ? "page" : undefined} className={!shorts ? "border-b-2 border-accent pb-2 font-semibold" : "pb-2 text-neutral-300 hover:text-white"}>Video</Link>
          <Link href="/shorts" aria-current={shorts ? "page" : undefined} className={shorts ? "border-b-2 border-accent pb-2 font-semibold" : "pb-2 text-neutral-300 hover:text-white"}>Shorts</Link>
        </nav>
      </div>
      {model.videos.isLoading ? (
        shorts ? <div aria-busy="true" className="grid grid-cols-2 gap-5">
          <div className="aspect-[9/16] max-w-[360px] animate-pulse bg-white/10" />
          <div className="aspect-[9/16] max-w-[360px] animate-pulse bg-white/10" />
        </div> : <VideoHeroSkeleton />
      ) : null}
      {model.videos.isError ? (
        <ErrorState tone="dark" onRetry={() => void model.videos.refetch()} />
      ) : null}
      {model.hero ? (
        <VideoHeroStage key={model.hero.id} video={model.hero} />
      ) : null}
      <VideoHubCollections model={model} shorts={shorts} />
      <VideoHubPrograms model={model} shorts={shorts} />
      <VideoHubLatest model={model} shorts={shorts} />
      <VideoHubNotices model={model} shorts={shorts} />
    </div>
  );
}
