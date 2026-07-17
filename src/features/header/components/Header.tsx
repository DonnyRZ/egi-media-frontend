"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/shared/components/ui/Button";
import { Container } from "@/shared/components/layout/Container";
import { SITE_NAME } from "@/shared/constants/site.constants";
import { useUiStore } from "@/shared/stores/ui.store";
import { cn } from "@/shared/lib/cn";

const NAV_ITEMS = [
  { label: "Latest", href: "/" },
  { label: "Business", href: "/topics/business" },
  { label: "Technology", href: "/topics/technology" },
  { label: "Politics", href: "/topics/politics" },
  { label: "Series", href: "/series" },
  { label: "Videos", href: "/videos" },
];

function formatToday(): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
}

function UtilityBar() {
  return (
    <div className="hidden border-b border-neutral-200 bg-white lg:block">
      <Container>
        <div className="flex h-9 items-center justify-between text-xs text-neutral-500">
          <span className="font-medium uppercase tracking-wide">
            {formatToday()}
          </span>
          <div className="flex items-center gap-4">
            <Link className="hover:text-accent" href="/newsletters">
              Newsletters
            </Link>
            <span aria-hidden="true" className="text-neutral-300">
              |
            </span>
            <Link className="hover:text-accent" href="/login">
              Sign in
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

function Masthead() {
  const { isSearchOpen, toggleMobileMenu, setSearchOpen } = useUiStore();

  return (
    <div className="flex h-16 items-center justify-between gap-4 lg:h-24">
      <button
        aria-label="Toggle menu"
        className="rounded p-2 text-neutral-900 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 lg:hidden"
        onClick={toggleMobileMenu}
        type="button"
      >
        <MenuIcon />
      </button>

      <Link aria-label={`${SITE_NAME} home`} className="inline-flex" href="/">
        <Image
          alt={SITE_NAME}
          className="h-10 w-auto sm:h-12 lg:h-16"
          height={857}
          priority
          src="/images/Logo_EGI-Media.webp"
          width={1536}
        />
      </Link>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          aria-expanded={isSearchOpen}
          aria-label="Toggle search"
          className="rounded p-2 text-neutral-900 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          onClick={() => setSearchOpen(!isSearchOpen)}
          type="button"
        >
          <SearchIcon />
        </button>
        <Button className="hidden rounded-none sm:inline-flex">Subscribe</Button>
      </div>
    </div>
  );
}

export function Header() {
  const {
    isMobileMenuOpen,
    isSearchOpen,
    searchQuery,
    setMobileMenuOpen,
    setSearchQuery,
  } = useUiStore();

  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-white">
      <UtilityBar />
      <Container>
        <Masthead />

        <nav
          aria-label="Main navigation"
          className="hidden border-t border-neutral-200 lg:block"
        >
          <ul className="-mb-px flex items-center justify-center gap-8">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  className="inline-block border-b-2 border-transparent py-3 text-sm font-semibold uppercase tracking-wide text-neutral-700 transition-colors hover:border-accent hover:text-accent"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {isSearchOpen ? (
          <div className="border-t border-neutral-200 py-4">
            <label className="sr-only" htmlFor="site-search">
              Search articles
            </label>
            <input
              className="w-full border-b-2 border-ink px-1 py-2 font-serif text-lg focus-visible:outline-none"
              id="site-search"
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search stories..."
              type="search"
              value={searchQuery}
            />
          </div>
        ) : null}

        <nav
          aria-label="Mobile navigation"
          className={cn(
            "border-t border-neutral-200 py-4 lg:hidden",
            isMobileMenuOpen ? "block" : "hidden",
          )}
        >
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  className="block py-2 text-sm font-semibold uppercase tracking-wide text-neutral-800"
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="flex gap-2 pt-3">
              <Button className="flex-1 rounded-none">Subscribe</Button>
              <Button className="flex-1 rounded-none" variant="secondary">
                Sign in
              </Button>
            </li>
          </ul>
        </nav>
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
