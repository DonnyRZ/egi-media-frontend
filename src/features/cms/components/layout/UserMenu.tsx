"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import { Icons } from "@/features/cms/components/ui/Icons";
import { CMS_BASE_PATH } from "@/features/cms/constants/cms.constants";
import { useToast } from "@/features/cms/stores/cms-toast.store";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function UserMenu() {
  const router = useRouter();
  const toast = useToast();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    await logout();
    toast.success("Signed out");
    router.replace(`${CMS_BASE_PATH}/login`);
  }

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
          {initials(user.fullName || user.email)}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-xs font-semibold text-neutral-900 dark:text-neutral-100">
            {user.fullName}
          </span>
          <span className="block text-[10px] font-medium uppercase tracking-wide text-neutral-400">
            {user.role}
          </span>
        </span>
        <Icons.chevronDown className="h-4 w-4 text-neutral-400" />
      </button>

      {open ? (
        <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
          <div className="border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
            <p className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {user.fullName}
            </p>
            <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
              {user.email}
            </p>
          </div>
          <Link
            href={`${CMS_BASE_PATH}/settings`}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            onClick={() => setOpen(false)}
          >
            <Icons.settings className="h-4 w-4" /> Settings
          </Link>
          <button
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-error transition-colors hover:bg-red-50 dark:hover:bg-red-950/40"
            onClick={handleLogout}
            type="button"
          >
            <Icons.logout className="h-4 w-4" /> Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}
