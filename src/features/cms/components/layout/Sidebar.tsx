"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/shared/lib/cn";
import { Icons } from "@/features/cms/components/ui/Icons";
import {
  NAV_SECTIONS,
  SETTINGS_NAV_ITEMS,
  type NavItem,
} from "@/features/cms/components/layout/nav.config";
import { usePermissions } from "@/features/cms/hooks/usePermissions";
import { useCmsLayoutStore } from "@/features/cms/stores/cms-layout.store";

function isActive(pathname: string, item: NavItem) {
  if (item.matchPrefix) return pathname.startsWith(item.href);
  return pathname === item.href;
}

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const Icon = Icons[item.icon];
  const active = isActive(pathname, item);
  const closeSidebar = useCmsLayoutStore((state) => state.setSidebarOpen);

  return (
    <Link
      href={item.href}
      onClick={() => closeSidebar(false)}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-accent/10 text-accent"
          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100",
      )}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />
      {item.label}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const permissions = usePermissions();
  const isOpen = useCmsLayoutStore((state) => state.isSidebarOpen);
  const setOpen = useCmsLayoutStore((state) => state.setSidebarOpen);

  const canShow = (item: NavItem) =>
    item.permission === "always" || permissions[item.permission];

  return (
    <>
      {isOpen ? (
        <button
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-neutral-900/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-neutral-200 bg-white transition-transform dark:border-neutral-800 dark:bg-neutral-900 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-neutral-200 px-5 dark:border-neutral-800">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent font-serif text-sm font-bold text-white">
            E
          </span>
          <div className="leading-tight">
            <p className="font-serif text-sm font-bold text-neutral-900 dark:text-neutral-100">
              EGI Media
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
              Editorial CMS
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {NAV_SECTIONS.map((section, index) => {
            const items = section.items.filter(canShow);
            if (items.length === 0) return null;
            return (
              <div key={section.title ?? index} className="space-y-1">
                {section.title ? (
                  <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    {section.title}
                  </p>
                ) : null}
                {items.map((item) => (
                  <NavLink key={item.href} item={item} pathname={pathname} />
                ))}
              </div>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-neutral-200 px-3 py-3 dark:border-neutral-800">
          {SETTINGS_NAV_ITEMS.filter(canShow).map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </div>
      </aside>
    </>
  );
}
