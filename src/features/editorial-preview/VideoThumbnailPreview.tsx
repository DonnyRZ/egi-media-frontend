"use client";

import { useState } from "react";
import { MediaPreview } from "@/features/cms/components/media/MediaPreview";
import { VideoShelf } from "@/features/videos/components/VideoShelf";
import { VideoHeroStage } from "@/features/videos/components/VideoHeroStage";
import { previewVideo } from "@/features/editorial-preview/fixtures";

/** Local-only interactive preview; does not save video records. */
export function VideoThumbnailPreview() {
  const [url, setUrl] = useState(previewVideo.url);
  const [short, setShort] = useState(false);
  const [custom, setCustom] = useState(false);
  const video = { ...previewVideo, url, thumbnailUrl: null,
    format: short ? "short" as const : "horizontal" as const,
    posterLandscape: custom ? previewVideo.thumbnailUrl : null,
    posterPortrait: custom ? "/images/editorial-preview-short.svg" : null };
  return <div className="editorial-gutter px-4 py-6 md:px-6 lg:px-8">
    <h1 className="editorial-page-title mb-4 text-3xl font-bold">Thumbnail YouTube · preview lokal</h1>
    <label className="block">YouTube URL<input aria-label="YouTube URL" value={url}
      onChange={(event) => setUrl(event.target.value)} className="my-2 block w-full rounded border bg-white p-3 text-ink" /></label>
    <div className="mb-6 flex gap-6">
      <label><input type="checkbox" checked={short} onChange={(event) => setShort(event.target.checked)} /> Shorts</label>
      <label><input type="checkbox" checked={custom} onChange={(event) => setCustom(event.target.checked)} /> Poster editor</label>
    </div>
    {!short ? <VideoHeroStage video={video} /> : null}
    <VideoShelf title="Kartu publik" videos={[video]} />
    <div className="mt-6 max-w-[640px] text-ink">
      <MediaPreview src={null} video={video} title="Pratinjau CMS" ratio={short ? "9:16" : "16:9"} />
    </div>
  </div>;
}
