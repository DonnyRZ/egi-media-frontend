import type { IconName } from "@/features/cms/components/ui/Icons";

export type NavPermission = "always" | "canViewUsers";

export interface NavItem {
  label: string;
  href: string;
  icon: IconName;
  permission: NavPermission;
  /** Match nested routes (e.g. /cms/articles/new) as active. */
  matchPrefix?: boolean;
}

export interface NavSection {
  title: string | null;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    title: null,
    items: [
      { label: "Dashboard", href: "/cms", icon: "dashboard", permission: "always" },
      {
        label: "Articles",
        href: "/cms/articles",
        icon: "articles",
        permission: "always",
        matchPrefix: true,
      },
    ],
  },
  {
    title: "Newsroom",
    items: [
      {
        label: "Taxonomy",
        href: "/cms/taxonomy",
        icon: "category",
        permission: "always",
        matchPrefix: true,
      },
      {
        label: "Users",
        href: "/cms/users",
        icon: "users",
        permission: "canViewUsers",
      },
    ],
  },
];

export const SETTINGS_NAV: NavItem = {
  label: "Settings",
  href: "/cms/settings",
  icon: "settings",
  permission: "always",
  matchPrefix: true,
};
