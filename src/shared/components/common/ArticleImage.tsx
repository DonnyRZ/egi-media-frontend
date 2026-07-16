"use client";

import Image from "next/image";
import { useState } from "react";

import { FALLBACK_ARTICLE_IMAGE } from "@/shared/constants/site.constants";
import { cn } from "@/shared/lib/cn";

interface ArticleImageProps {
  src: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export function ArticleImage({
  src,
  alt,
  className,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: ArticleImageProps) {
  const [imageSrc, setImageSrc] = useState(src || FALLBACK_ARTICLE_IMAGE);

  return (
    <Image
      alt={alt}
      className={cn("object-cover", className)}
      fill
      onError={() => setImageSrc(FALLBACK_ARTICLE_IMAGE)}
      priority={priority}
      sizes={sizes}
      src={imageSrc}
    />
  );
}
