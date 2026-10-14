"use client";

import { Breadcrumb } from "@/features/cms/components/layout/Breadcrumb";
import { ThemeToggle } from "@/features/cms/components/layout/ThemeToggle";
import { UserMenu } from "@/features/cms/components/layout/UserMenu";
import { CmsTranslationBell } from "@/features/cms/components/translation-jobs/CmsTranslationBell";
import { Icons } from "@/features/cms/components/ui/Icons";
import { useCmsLayoutStore } from "@/features/cms/stores/cms-layout.store";

export function Topbar() {
  const toggleSidebar = useCmsLayoutStore((state) => state.toggleSidebar);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-neutral-200 bg-white/90 px-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/90 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          aria-label="Toggle menu"
          className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 lg:hidden"
          onClick={toggleSidebar}
          type="button"
        >
          <Icons.menu />
        </button>
        <Breadcrumb />
      </div>

      <div className="flex items-center gap-2">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="hidden h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 sm:flex"
          aria-label="View public site"
          title="View public site"
        >
          <Icons.external className="h-[18px] w-[18px]" />
        </a>
        <CmsTranslationBell />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
