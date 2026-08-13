"use client";

import { useState } from "react";

import { RouteGuard } from "@/features/cms/components/auth/RouteGuard";
import { PageHeader } from "@/features/cms/components/layout/PageHeader";
import { SocialMediaLinksPanel } from "@/features/cms/components/settings/SocialMediaLinksPanel";
import { TeamMembersPanel } from "@/features/cms/components/settings/TeamMembersPanel";
import { cn } from "@/shared/lib/cn";

type CompanyProfileTab = "social" | "team";

const TABS: { value: CompanyProfileTab; label: string }[] = [
  { value: "social", label: "Social Media Links" },
  { value: "team", label: "Team Members" },
];

export function CompanyProfileView() {
  const [tab, setTab] = useState<CompanyProfileTab>("social");

  return (
    <RouteGuard requireSuperadmin>
      <PageHeader
        title="Company Profile"
        description="Manage public company details: social links and the EGI Media team roster."
      />

      <div
        role="tablist"
        aria-label="Company profile sections"
        className="mb-6 flex gap-1 overflow-x-auto border-b border-neutral-200 dark:border-neutral-800"
      >
        {TABS.map((item) => {
          const active = tab === item.value;
          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(item.value)}
              className={cn(
                "relative whitespace-nowrap px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "text-accent"
                  : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200",
              )}
            >
              {item.label}
              {active ? (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent" />
              ) : null}
            </button>
          );
        })}
      </div>

      {tab === "social" ? <SocialMediaLinksPanel /> : <TeamMembersPanel />}
    </RouteGuard>
  );
}
