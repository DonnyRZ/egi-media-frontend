"use client";
import { Link } from "@/i18n/navigation";
import { useVideoHub } from "@/features/videos/hooks/useVideoHub";
import { VideoHeroStage } from "@/features/videos/components/VideoHeroStage";
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
    <div className="bg-[#050a16] px-4 py-6 text-white md:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">{shorts ? "Shorts" : "Video"}</h1>
        <nav className="flex gap-5">
          <Link href="/videos">Video</Link>
          <Link href="/shorts">Shorts</Link>
        </nav>
      </div>
      {model.videos.isLoading ? (
        <div
          className="aspect-video max-w-[560px] animate-pulse bg-white/10"
          aria-busy="true"
        />
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
