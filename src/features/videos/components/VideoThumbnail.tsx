"use client";

import Image from "next/image";
import { useState } from "react";
import { FALLBACK_VIDEO_THUMBNAIL } from "@/shared/constants/site.constants";
import { getYoutubeThumbnailCandidates, isYoutubeThumbnail } from "@/shared/utils/format";
import { safeImageSource, imageNeedsDirectLoad } from "@/shared/utils/safe-image";

export interface VideoThumbnailSource {
  url: string;
  format?: "horizontal" | "short";
  posterLandscape?: string | null;
  posterPortrait?: string | null;
  thumbnailUrl?: string | null;
}

interface VideoThumbnailProps {
  video: VideoThumbnailSource;
  alt?: string;
  sizes?: string;
  priority?: boolean;
}

/** Shared by the CMS preview/list and every public video thumbnail. */
export function VideoThumbnail({ video, ...props }: VideoThumbnailProps) {
  const requestedPoster = (video.format === "short" ? video.posterPortrait : video.posterLandscape)
    || (video.thumbnailUrl && !isYoutubeThumbnail(video.thumbnailUrl, video.url)
      ? video.thumbnailUrl : null);
  const poster = requestedPoster && safeImageSource(requestedPoster) === requestedPoster ? requestedPoster : null;
  // Remount when the URL/poster/format changes: a late result from the old link cannot replace the new preview.
  return <ThumbnailImage key={`${video.url}|${video.format}|${poster}`} video={video} poster={poster} {...props} />;
}

function ThumbnailImage({
  video, poster, alt = "", sizes = "(max-width: 767px) 100vw, 480px", priority = false,
}: VideoThumbnailProps & { poster: string | null }) {
  const candidates = getYoutubeThumbnailCandidates(video.url);
  const sources = [...(poster ? [poster] : []), ...candidates];
  const [index, setIndex] = useState(0);
  const [accepted, setAccepted] = useState<string | null>(null);
  const src = sources[index];
  const isCustom = Boolean(poster) && index === 0;
  const advance = () => setIndex((current) => current === index ? current + 1 : current);
  const acceptImage = (image: HTMLImageElement) => {
    if (!image.complete) return;
    // Unavailable variants can respond with a 120×90 placeholder instead of an HTTP error.
    if (image.naturalWidth <= 120 || image.naturalHeight <= 90) advance();
    else if (accepted !== src) setAccepted(src);
  };

  if (!src || isCustom) {
    return <Image src={src || FALLBACK_VIDEO_THUMBNAIL} alt={alt} fill sizes={sizes}
      priority={priority} className="object-contain"
      unoptimized={Boolean(src && imageNeedsDirectLoad(src))}
      onError={src ? advance : undefined} />;
  }

  return <span className="absolute inset-0 overflow-hidden" data-video-thumbnail="youtube">
    <span className={video.format === "short"
      ? "absolute left-1/2 top-0 h-full aspect-video -translate-x-1/2"
      : "absolute inset-0"}>
      {/* Native dimensions are needed: an optimized 120px placeholder can look like a valid HD image. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img key={src} src={src} alt={alt} loading={priority ? "eager" : "lazy"}
        ref={(image) => { if (image) acceptImage(image); }}
        decoding="async" fetchPriority={priority ? "high" : "auto"}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ opacity: accepted === src ? 1 : 0 }}
        onError={advance}
        onLoad={(event) => acceptImage(event.currentTarget)} />
    </span>
  </span>;
}
