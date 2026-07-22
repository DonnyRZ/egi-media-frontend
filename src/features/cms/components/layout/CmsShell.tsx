"use client";

import type { ReactNode } from "react";

import { RouteGuard } from "@/features/cms/components/auth/RouteGuard";
import { Sidebar } from "@/features/cms/components/layout/Sidebar";
import { Topbar } from "@/features/cms/components/layout/Topbar";

export function CmsShell({ children }: { children: ReactNode }) {
  return (
    <RouteGuard>
      <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <Sidebar />
        <div className="lg:pl-64">
          <Topbar />
          <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8">{children}</main>
        </div>
      </div>
    </RouteGuard>
  );
}
