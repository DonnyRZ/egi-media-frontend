"use client";

import Link from "next/link";

import { Card, CardHeader } from "@/features/cms/components/ui/Card";
import { Icons, type IconName } from "@/features/cms/components/ui/Icons";
import { usePermissions } from "@/features/cms/hooks/usePermissions";

interface QuickAction {
  label: string;
  href: string;
  icon: IconName;
  show: boolean;
}

export function QuickActions() {
  const permissions = usePermissions();

  const actions: QuickAction[] = [
    { label: "New Article", href: "/cms/articles/new", icon: "articles", show: true },
    {
      label: "Manage Taxonomy",
      href: "/cms/taxonomy",
      icon: "category",
      show: permissions.canManageTaxonomy,
    },
    {
      label: "Add Author",
      href: "/cms/users",
      icon: "users",
      show: permissions.canManageUsers,
    },
  ];

  return (
    <Card>
      <CardHeader title="Quick Actions" />
      <div className="grid grid-cols-2 gap-3 p-5">
        {actions
          .filter((action) => action.show)
          .map((action) => {
            const Icon = Icons[action.icon];
            return (
              <Link
                key={action.label}
                href={action.href}
                className="flex flex-col items-center gap-2 rounded-lg border border-neutral-200 p-4 text-center transition-colors hover:border-accent hover:bg-accent/5 dark:border-neutral-800"
              >
                <Icon className="h-6 w-6 text-accent" />
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  {action.label}
                </span>
              </Link>
            );
          })}
      </div>
    </Card>
  );
}
