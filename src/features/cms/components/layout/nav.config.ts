import type { IconName } from "@/features/cms/components/ui/Icons";

export type NavPermission =
  | "always"
  | "canViewUsers"
  | "canViewActivity"
  | "canModerateColumns";

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
      {
        label: "News Feed",
        href: "/cms/news-feed",
        icon: "articles",
        permission: "always",
        matchPrefix: true,
      },
      {
        label: "Contributor Columns",
        href: "/cms/columns",
        icon: "columns",
        permission: "canModerateColumns",
        matchPrefix: true,
      },
    ],
  },
  {
    title: "Newsroom",
    items: [
      {label:"Category Layout",href:"/cms/editorial",icon:"category",permission:"canViewActivity"},
      {label:"Video Programs & Collections",href:"/cms/video-catalog",icon:"video",permission:"canViewActivity"},
      {
        label: "Taxonomy",
        href: "/cms/taxonomy",
        icon: "category",
        permission: "always",
        matchPrefix: true,
      },
      {
        label: "Videos",
        href: "/cms/videos",
        icon: "video",
        permission: "always",
        matchPrefix: true,
      },
      {
        label: "Advertisements",
        href: "/cms/ads",
        icon: "media",
        permission: "canViewActivity",
        matchPrefix: true,
      },
      {
        label: "Users",
        href: "/cms/users",
        icon: "users",
        permission: "canViewUsers",
      },
      {
        label: "Subscriptions",
        href: "/cms/subscriptions",
        icon: "topic",
        permission: "canViewActivity",
        matchPrefix: true,
      },
      {
        label: "Audit Logs",
        href: "/cms/audit-logs",
        icon: "history",
        permission: "canViewActivity",
        matchPrefix: true,
      },
    ],
  },
];

export const SETTINGS_NAV: NavItem = {
  label: "Settings",
  href: "/cms/settings",
  icon: "settings",
  permission: "always",
};

export const COMPANY_PROFILE_NAV: NavItem = {
  label: "Company Profile",
  href: "/cms/settings/company",
  icon: "media",
  permission: "canViewActivity",
  matchPrefix: true,
};

/** @deprecated Use COMPANY_PROFILE_NAV */
export const SOCIAL_MEDIA_NAV = COMPANY_PROFILE_NAV;

export const SETTINGS_NAV_ITEMS: NavItem[] = [SETTINGS_NAV, COMPANY_PROFILE_NAV];
