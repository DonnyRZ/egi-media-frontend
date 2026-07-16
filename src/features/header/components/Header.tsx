"use client";

import Link from "next/link";

import { Button } from "@/shared/components/ui/Button";
import { Container } from "@/shared/components/layout/Container";
import { SITE_NAME } from "@/shared/constants/site.constants";
import { useUiStore } from "@/shared/stores/ui.store";
import { cn } from "@/shared/lib/cn";

const NAV_ITEMS = [
  { label: "Latest", href: "/" },
  { label: "Series", href: "/series" },
  { label: "Videos", href: "/videos" },
  { label: "Topics", href: "/topics" },
];

export function Header() {
  const {
    isMobileMenuOpen,
    isSearchOpen,
    searchQuery,
    toggleMobileMenu,
    setMobileMenuOpen,
    setSearchOpen,
    setSearchQuery,
  } = useUiStore();

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-300 bg-white/95 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4 lg:h-20">
          <Link
            aria-label={`${SITE_NAME} home`}
            className="text-xl font-bold text-primary-900 lg:text-2xl"
            href="/"
          >
            {SITE_NAME}
          </Link>

          <nav aria-label="Main navigation" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    className="text-sm font-semibold text-neutral-700 transition-colors hover:text-primary-700"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              aria-expanded={isSearchOpen}
              aria-label="Toggle search"
              className="rounded-lg p-2 text-neutral-700 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              onClick={() => setSearchOpen(!isSearchOpen)}
              type="button"
            >
              <SearchIcon />
            </button>
            <Button className="hidden sm:inline-flex" variant="secondary">
              Subscribe
            </Button>
            <Button className="hidden md:inline-flex">Login</Button>
            <button
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle menu"
              className="rounded-lg p-2 text-neutral-700 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 lg:hidden"
              onClick={toggleMobileMenu}
              type="button"
            >
              <MenuIcon />
            </button>
          </div>
        </div>

        {isSearchOpen ? (
          <div className="border-t border-neutral-200 py-4">
            <label className="sr-only" htmlFor="site-search">
              Search articles
            </label>
            <input
              className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
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
          <ul className="space-y-3">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  className="block text-sm font-semibold text-neutral-700"
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="flex gap-2 pt-2">
              <Button className="flex-1" variant="secondary">
                Subscribe
              </Button>
              <Button className="flex-1">Login</Button>
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
