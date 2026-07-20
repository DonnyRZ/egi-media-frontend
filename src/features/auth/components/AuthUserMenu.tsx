"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/shared/components/ui/Button";
import { useOutsideClick } from "@/shared/hooks/useOutsideClick";
import { useUiStore } from "@/shared/stores/ui.store";

export function AuthUserMenu() {
  const t = useTranslations("auth");
  const tHeader = useTranslations("header");
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const logout = useAuthStore((state) => state.logout);
  const [open, setOpen] = useState(false);
  const ref = useOutsideClick<HTMLDivElement>(() => setOpen(false));

  if (!isHydrated) {
    return (
      <span aria-hidden="true" className="inline-block h-4 w-16 bg-neutral-100" />
    );
  }

  if (!user) {
    return (
      <Link className="hover:text-accent" href="/login">
        {tHeader("signIn")}
      </Link>
    );
  }

  async function handleLogout() {
    setOpen(false);
    await logout();
    router.replace("/login");
    router.refresh();
  }

  const initials = user.fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div ref={ref} className="relative">
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 text-left hover:text-accent"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span className="flex h-7 w-7 items-center justify-center bg-ink text-[10px] font-bold text-white">
          {initials || "U"}
        </span>
        <span className="hidden max-w-[9rem] truncate text-xs font-semibold uppercase tracking-wide sm:inline">
          {user.fullName}
        </span>
      </button>

      {open ? (
        <div
          className="absolute right-0 z-50 mt-2 w-56 border border-neutral-200 bg-white py-2 shadow-md"
          role="menu"
        >
          <div className="border-b border-neutral-100 px-4 py-2">
            <p className="truncate text-sm font-semibold text-ink">{user.fullName}</p>
            <p className="truncate text-xs text-neutral-500">{user.email}</p>
          </div>
          <button
            className="block w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
            onClick={() => void handleLogout()}
            role="menuitem"
            type="button"
          >
            {t("signOut")}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function AuthMobileActions() {
  const t = useTranslations("auth");
  const tHeader = useTranslations("header");
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const logout = useAuthStore((state) => state.logout);
  const setMobileMenuOpen = useUiStore((state) => state.setMobileMenuOpen);

  if (!isHydrated) return null;

  if (!user) {
    return (
      <Link
        className="block py-2 text-sm font-semibold uppercase tracking-wide text-neutral-800"
        href="/login"
        onClick={() => setMobileMenuOpen(false)}
      >
        {tHeader("signIn")}
      </Link>
    );
  }

  return (
    <div className="space-y-2 border-t border-neutral-200 pt-3">
      <p className="text-sm font-semibold text-ink">{user.fullName}</p>
      <p className="text-xs text-neutral-500">{user.email}</p>
      <Button
        className="w-full rounded-none"
        onClick={() => {
          void (async () => {
            setMobileMenuOpen(false);
            await logout();
            router.replace("/login");
            router.refresh();
          })();
        }}
        type="button"
        variant="secondary"
      >
        {t("signOut")}
      </Button>
    </div>
  );
}
