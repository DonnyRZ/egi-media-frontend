import type { CSSProperties } from "react";

import { cn } from "@/shared/lib/cn";
import type { SharePlatform } from "@/shared/types/article.types";

export type ArticleActionIconName = SharePlatform | "bookmark";

const SPRITE_POSITION: Record<ArticleActionIconName, string> = {
  bookmark: "0% 0%",
  copy_link: "50% 0%",
  whatsapp: "100% 0%",
  facebook: "0% 100%",
  twitter: "50% 100%",
  telegram: "100% 100%",
};

interface ArticleActionIconProps {
  name: ArticleActionIconName;
  className?: string;
}

export function ArticleActionIcon({ name, className }: ArticleActionIconProps) {
  const style: CSSProperties = {
    backgroundImage: "url('/images/article-actions/icon-sprite.png')",
    backgroundPosition: SPRITE_POSITION[name],
    backgroundRepeat: "no-repeat",
    backgroundSize: "300% 200%",
  };

  return (
    <span
      aria-hidden="true"
      className={cn("block h-6 w-6 shrink-0", className)}
      style={style}
    />
  );
}
