"use client";

import { SocialIcon } from "@/features/footer/components/SocialIcons";
import { useSocialMediaLinks } from "@/features/footer/hooks/useSocialMediaLinks";

export function SocialLinks() {
  const { data, isLoading, isError } = useSocialMediaLinks();
  const links = data ?? [];

  if (isLoading || isError || links.length === 0) {
    return null;
  }

  return (
    <ul className="mt-4 flex flex-wrap items-center gap-2">
      {links.map((link) => (
        <li key={link.id}>
          <a
            aria-label={link.platformName}
            className="inline-flex h-10 w-10 items-center justify-center text-neutral-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            href={link.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            <SocialIcon className="h-5 w-5" platform={link.iconName} />
          </a>
        </li>
      ))}
    </ul>
  );
}
