"use client";

import Image from "next/image";
import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useFormatter, useTranslations } from "next-intl";

import { Link, useRouter } from "@/i18n/navigation";
import { Container } from "@/shared/components/layout/Container";
import { AuthUserMenu, AuthMobileActions } from "@/features/auth/components/AuthUserMenu";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";
import { LanguageSwitcher } from "@/features/language/components/LanguageSwitcher";
import { useEditorialNavigation } from "@/features/header/hooks/useEditorialNavigation";
import { useScrollHeaderVisibility } from "@/features/header/hooks/useScrollHeaderVisibility";
import { useClock } from "@/features/world-clock/hooks/useClock";
import { WORLD_CLOCK_CITIES } from "@/features/world-clock/constants/world-clock.constants";
import { formatClockTime } from "@/features/world-clock/utils/formatClockTime";
import { HEADER_CATEGORY_SLUGS } from "@/shared/constants/header-categories.constants";
import { SITE_NAME } from "@/shared/constants/site.constants";
import { useUiStore } from "@/shared/stores/ui.store";
import { cn } from "@/shared/lib/cn";

function LanguageSwitcherSlot() {
  return (
    <Suspense fallback={<span className="inline-block h-8 w-12" aria-hidden="true" />}>
      <LanguageSwitcher />
    </Suspense>
  );
}

const NAV_ITEMS = [
  { key: "home", href: "/" },
  { key: "business", href: `/categories/${HEADER_CATEGORY_SLUGS.business}` },
  { key: "technology", href: `/categories/${HEADER_CATEGORY_SLUGS.technology}` },
  { key: "politics", href: `/categories/${HEADER_CATEGORY_SLUGS.politics}` },
  { key: "sports", href: `/categories/${HEADER_CATEGORY_SLUGS.sports}` },
  { key: "entertainment", href: `/categories/${HEADER_CATEGORY_SLUGS.entertainment}` },
  { key: "egiNews", href: `/categories/${HEADER_CATEGORY_SLUGS.egiNews}` },
  { key: "series", href: "/series" },
  { key: "videos", href: "/videos" },
  { key: "column", href: "/kolom" },
] as const;

type NavItem = (typeof NAV_ITEMS)[number];

function HeaderClockStrip() {
  const now = useClock();
  const format = useFormatter();
  const t = useTranslations("worldClock");
  const stripRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [visibleCityCount, setVisibleCityCount] = useState(WORLD_CLOCK_CITIES.length);

  const dateLabel = now
    ? format.dateTime(now, { weekday: "short", day: "numeric", month: "short" })
    : "--";
  const localTime = now ? formatClockTime(now) : "--:--";

  const recalc = useCallback(() => {
    const strip = stripRef.current;
    const measure = measureRef.current;
    if (!strip || !measure) return;

    const available = strip.clientWidth;
    const gap = 10; // gap-2.5
    const items = Array.from(measure.children) as HTMLElement[];
    let used = 0;
    let cities = 0;

    for (let index = 0; index < items.length; index += 1) {
      const width = items[index].getBoundingClientRect().width;
      const next = used + (index > 0 ? gap : 0) + width;
      if (next > available + 0.5) break;
      used = next;
      if (index >= 3) cities += 1;
    }

    setVisibleCityCount(cities);
  }, []);

  useLayoutEffect(() => {
    recalc();
    const strip = stripRef.current;
    if (!strip || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => recalc());
    observer.observe(strip);
    return () => observer.disconnect();
  }, [recalc, dateLabel, localTime]);

  return (
    <div
      aria-label={t("ariaLabel")}
      className="relative hidden min-w-0 flex-1 lg:block"
      ref={stripRef}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none invisible absolute flex max-w-full items-center gap-2.5 overflow-hidden whitespace-nowrap"
        ref={measureRef}
      >
        <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide">
          {dateLabel}
        </span>
        <span className="h-3 w-px shrink-0" />
        <div className="flex shrink-0 items-baseline gap-1">
          <span className="inline-block h-1.5 w-1.5 rounded-full" />
          <span className="text-[10px] font-bold uppercase tracking-[0.1em]">{t("local")}</span>
          <span className="font-serif text-xs font-semibold tabular-nums">{localTime}</span>
        </div>
        {WORLD_CLOCK_CITIES.map((city) => (
          <div className="flex shrink-0 items-baseline gap-1" key={city.timeZone}>
            <span className="text-[10px] font-bold uppercase tracking-[0.1em]">{city.label}</span>
            <span className="font-serif text-xs font-semibold tabular-nums">
              {now ? formatClockTime(now, city.timeZone) : "--:--"}
            </span>
          </div>
        ))}
      </div>

      <div className="flex h-full min-w-0 items-center gap-2.5 overflow-hidden">
        <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-neutral-400">
          {dateLabel}
        </span>
        <span aria-hidden="true" className="h-3 w-px shrink-0 bg-neutral-700" />
        <div className="flex shrink-0 items-baseline gap-1">
          <span
            aria-hidden="true"
            className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent"
          />
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-accent">
            {t("local")}
          </span>
          <span className="font-serif text-xs font-semibold tabular-nums text-white">
            {localTime}
          </span>
        </div>
        {WORLD_CLOCK_CITIES.slice(0, visibleCityCount).map((city) => (
          <div className="flex shrink-0 items-baseline gap-1" key={city.timeZone}>
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-neutral-400">
              {city.label}
            </span>
            <span className="font-serif text-xs font-semibold tabular-nums text-white">
              {now ? formatClockTime(now, city.timeZone) : "--:--"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Masthead() {
  const t = useTranslations("header");
  const { isSearchOpen, isMobileMenuOpen, toggleMobileMenu, setSearchOpen } = useUiStore();

  return (
    <div className="flex h-16 items-center justify-between gap-2 lg:h-20 lg:gap-4">
      <div className="flex shrink-0 items-center gap-2">
        <button
          aria-label={t("toggleMenu")}
          aria-expanded={isMobileMenuOpen}
          aria-controls="egi-mobile-navigation"
          className="min-h-11 min-w-11 rounded p-1.5 text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 lg:hidden"
          onClick={toggleMobileMenu}
          type="button"
        >
          <MenuIcon />
        </button>

        <Link aria-label={t("homeAria", { siteName: SITE_NAME })} className="inline-flex" href="/">
          <Image
            alt={SITE_NAME}
            className="h-9 w-auto sm:h-10 lg:h-12"
            height={857}
            priority
            src="/images/Logo_EGI-Media-2.png"
            width={1536}
          />
        </Link>
      </div>

      <HeaderClockStrip />

      <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
        <button
          aria-expanded={isSearchOpen}
          aria-label={t("toggleSearch")}
          className="min-h-11 min-w-11 rounded p-1.5 text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          onClick={() => setSearchOpen(!isSearchOpen)}
          type="button"
        >
          <SearchIcon />
        </button>
        <NotificationBell />
        <LanguageSwitcherSlot />
        <span aria-hidden="true" className="hidden h-4 w-px shrink-0 bg-neutral-700 lg:block" />
        <div className="hidden lg:block">
          <AuthUserMenu />
        </div>
        <Link
          className="hidden rounded-none border border-white/40 bg-transparent px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-ink sm:inline-flex sm:items-center sm:justify-center"
          href="/settings/topics"
        >
          {t("subscribe")}
        </Link>
      </div>
    </div>
  );
}

function DesktopNav() {
  const isActive=useEditorialNavigation();
  const t = useTranslations("header");
  const navRef = useRef<HTMLElement>(null);
  const measureRef = useRef<HTMLUListElement>(null);
  const moreMeasureRef = useRef<HTMLLIElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState<number>(NAV_ITEMS.length);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const recalculate = useCallback(() => {
    const nav = navRef.current;
    const measureList = measureRef.current;
    if (!nav || !measureList) return;

    const availableWidth = nav.clientWidth;
    // Last child is the hidden "More" width probe — exclude it from item count.
    const itemNodes = Array.from(measureList.children).slice(0, -1) as HTMLElement[];
    const moreWidth = moreMeasureRef.current?.offsetWidth ?? 88;
    const gap = 24;

    let usedWidth = 0;
    let count = itemNodes.length;

    for (let index = 0; index < itemNodes.length; index += 1) {
      const itemWidth = itemNodes[index].offsetWidth;
      const nextUsed = usedWidth + itemWidth + (index > 0 ? gap : 0);
      const remaining = itemNodes.length - (index + 1);
      const needsMore = remaining > 0;
      const totalNeeded = nextUsed + (needsMore ? gap + moreWidth : 0);

      if (totalNeeded > availableWidth) {
        count = Math.max(1, index);
        break;
      }

      usedWidth = nextUsed;
      count = index + 1;
    }

    setVisibleCount((prev) => (prev === count ? prev : count));
  }, []);

  useLayoutEffect(() => {
    recalculate();
  }, [recalculate]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => recalculate());
    observer.observe(nav);
    window.addEventListener("resize", recalculate);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", recalculate);
    };
  }, [recalculate]);

  useEffect(() => {
    if (!isMoreOpen) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (
        moreButtonRef.current?.contains(target) ||
        moreMenuRef.current?.contains(target)
      ) {
        return;
      }
      setIsMoreOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsMoreOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMoreOpen]);

  const visibleItems = NAV_ITEMS.slice(0, visibleCount) as NavItem[];
  const overflowItems = NAV_ITEMS.slice(visibleCount) as NavItem[];

  return (
    <nav aria-label={t("navMain")} className="relative min-w-0 flex-1" ref={navRef}>
      <ul
        aria-hidden="true"
        className="pointer-events-none invisible absolute flex max-w-full items-center gap-6 overflow-hidden whitespace-nowrap"
        ref={measureRef}
      >
        {NAV_ITEMS.map((item) => (
          <li key={item.href} className="shrink-0">
            <span className="inline-block border-b-2 border-transparent py-3 text-xs font-semibold uppercase tracking-wide">
              {t(`nav.${item.key}`)}
            </span>
          </li>
        ))}
        <li className="shrink-0" ref={moreMeasureRef}>
          <span className="inline-flex items-center gap-1 border-b-2 border-transparent py-3 text-xs font-semibold uppercase tracking-wide">
            {t("navMore")}
            <ChevronIcon />
          </span>
        </li>
      </ul>

      <ul className="-mb-px flex items-center justify-start gap-6">
        {visibleItems.map((item) => (
          <li key={item.href} className="shrink-0">
            <Link
              className="inline-block border-b-2 border-transparent py-3 text-xs font-semibold uppercase tracking-wide text-neutral-300 transition-colors hover:border-accent hover:text-white aria-[current=page]:border-accent aria-[current=page]:text-white"
              aria-current={isActive(item.href)?"page":undefined}
              href={item.href}
            >
              {t(`nav.${item.key}`)}
            </Link>
          </li>
        ))}

        {overflowItems.length > 0 ? (
          <li className="relative shrink-0">
            <button
              aria-expanded={isMoreOpen}
              aria-haspopup="menu"
              className={cn(
                "inline-flex items-center gap-1 border-b-2 py-3 text-xs font-semibold uppercase tracking-wide transition-colors",
                isMoreOpen
                  ? "border-accent text-accent"
                  : "border-transparent text-neutral-300 hover:border-accent hover:text-white",
              )}
              onClick={() => setIsMoreOpen((open) => !open)}
              ref={moreButtonRef}
              type="button"
            >
              {t("navMore")}
              <ChevronIcon className={cn("transition-transform", isMoreOpen && "rotate-180")} />
            </button>

            {isMoreOpen ? (
              <div
                className="absolute right-0 top-full z-50 mt-0 min-w-[12rem] border border-neutral-700 bg-ink py-2 shadow-sm"
                ref={moreMenuRef}
                role="menu"
              >
                {overflowItems.map((item) => (
                  <Link
                    className="block px-4 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
                    aria-current={isActive(item.href)?"page":undefined}
              href={item.href}
                    key={item.href}
                    onClick={() => setIsMoreOpen(false)}
                    role="menuitem"
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                ))}
              </div>
            ) : null}
          </li>
        ) : null}
      </ul>
    </nav>
  );
}

function NavRow() {
  const t = useTranslations("header");

  return (
    <div className="hidden border-t border-neutral-800 lg:flex lg:items-center lg:justify-between">
      <DesktopNav />
      <Link
        className="ml-6 shrink-0 border-b-2 border-transparent py-3 text-[11px] font-semibold uppercase tracking-wide text-neutral-400 transition-colors hover:border-accent hover:text-white"
        href="/settings/topics"
      >
        {t("topicPreferences")}
      </Link>
    </div>
  );
}

function MobileNav() {
  const isActive=useEditorialNavigation();
  const t = useTranslations("header");
  const { isMobileMenuOpen, setMobileMenuOpen } = useUiStore();
  useEffect(()=>{if(!isMobileMenuOpen)return;const close=(e:KeyboardEvent)=>{if(e.key==='Escape'){setMobileMenuOpen(false);document.querySelector<HTMLButtonElement>('[aria-controls="egi-mobile-navigation"]')?.focus();}};document.addEventListener('keydown',close);return()=>document.removeEventListener('keydown',close);},[isMobileMenuOpen,setMobileMenuOpen]);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const showTopicPreferences = !isHydrated || !isAuthenticated;

  return (
    <nav
      id="egi-mobile-navigation"
      aria-label={t("navMobile")}
      className={cn(
        "border-t border-neutral-800 py-4 lg:hidden",
        isMobileMenuOpen ? "block" : "hidden",
      )}
    >
      <ul className="space-y-1">
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <Link
              className="block py-2 text-sm font-semibold uppercase tracking-wide text-neutral-200"
              aria-current={isActive(item.href)?"page":undefined}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t(`nav.${item.key}`)}
            </Link>
          </li>
        ))}
        {showTopicPreferences ? (
          <li>
            <Link
              className="block py-2 text-sm font-semibold uppercase tracking-wide text-neutral-200"
              href="/settings/topics"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("topicPreferences")}
            </Link>
          </li>
        ) : null}
        <li className="space-y-3 pt-3">
          <AuthMobileActions />
          <Link
            className="flex items-center justify-center rounded-none border border-white/40 bg-transparent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            href="/settings/topics"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t("subscribe")}
          </Link>
        </li>
      </ul>
    </nav>
  );
}

function SearchBar() {
  const t = useTranslations("header");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { isSearchOpen, searchQuery, setSearchOpen, setSearchQuery } =
    useUiStore();

  useEffect(() => {
    if (!isSearchOpen) return;
    const frame = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSearchOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, setSearchOpen]);

  if (!isSearchOpen) return null;

  function submitSearch(event?: FormEvent) {
    event?.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      inputRef.current?.focus();
      return;
    }
    setSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <div className="border-t border-neutral-800 py-4">
      <form className="flex items-end gap-3" onSubmit={submitSearch}>
        <div className="min-w-0 flex-1">
          <label className="sr-only" htmlFor="site-search">
            {t("searchLabel")}
          </label>
          <input
            className="w-full border-b-2 border-white/40 bg-transparent px-1 py-2 font-serif text-lg text-white placeholder:text-neutral-500 focus-visible:border-white focus-visible:outline-none"
            id="site-search"
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
            ref={inputRef}
            type="search"
            value={searchQuery}
          />
        </div>
        <button
          className="shrink-0 border border-white bg-white px-4 py-2 text-sm font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-neutral-200"
          type="submit"
        >
          {t("searchSubmit")}
        </button>
        <button
          aria-label={t("searchClose")}
          className="min-h-11 min-w-11 shrink-0 rounded p-2 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
          onClick={() => setSearchOpen(false)}
          type="button"
        >
          <CloseIcon />
        </button>
      </form>
    </div>
  );
}

export function Header() {
  const isScrollVisible = useScrollHeaderVisibility();
  const isMobileMenuOpen = useUiStore((state) => state.isMobileMenuOpen);
  const isSearchOpen = useUiStore((state) => state.isSearchOpen);
  const isVisible = isScrollVisible || isMobileMenuOpen || isSearchOpen;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-neutral-800 bg-ink text-white transition-transform duration-300 ease-out will-change-transform",
        isVisible ? "translate-y-0" : "pointer-events-none -translate-y-full",
      )}
    >
      <Container>
        <Masthead />
        <NavRow />
        <SearchBar />
        <MobileNav />
      </Container>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M16 16l5 5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn("h-3.5 w-3.5", className)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
