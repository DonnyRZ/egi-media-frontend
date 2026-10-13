"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import {
  safeImageSource,
  imageNeedsDirectLoad,
} from "@/shared/utils/safe-image";
import { FALLBACK_ARTICLE_IMAGE } from "@/shared/constants/site.constants";
import type { ColumnAuthor as Author } from "@/features/columns/types/column.types";
interface ColumnAuthorProps {
  author: Author;
  showBio?: boolean;
}
function AuthorAvatar({ url }: { url: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [url]);
  const src = safeImageSource(url);
  if (failed || src === FALLBACK_ARTICLE_IMAGE) return null;
  return (
    <Image
      src={src}
      alt=""
      width={48}
      height={48}
      unoptimized={imageNeedsDirectLoad(src)}
      onError={() => setFailed(true)}
      className="h-12 w-12 rounded-full object-contain"
    />
  );
}
export function ColumnAuthor({ author, showBio = false }: ColumnAuthorProps) {
  return (
    <div className="mt-4 flex items-start gap-3">
      {author.avatarUrl ? <AuthorAvatar url={author.avatarUrl} /> : null}
      <div>
        <Link
          className="text-sm font-semibold text-primary-700 hover:underline"
          href={`/kolom?author_id=${author.id}`}
        >
          {author.fullName}
        </Link>
        {showBio && author.bio ? (
          <p className="editorial-summary mt-1 max-w-xl text-sm leading-6 text-neutral-600">
            {author.bio}
          </p>
        ) : null}
      </div>
    </div>
  );
}
