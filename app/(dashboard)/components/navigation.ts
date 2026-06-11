import type { LucideIcon } from "lucide-react";
import {
  Archive,
  Bell,
  CircleUserRound,
  FileText,
  HelpCircle,
  LayoutGrid,
  Plus,
  Search,
  Settings2,
  Sparkles,
} from "lucide-react";

export type DashboardNavItem = {
  href: string;
  icon: LucideIcon;
  label: string;
};

export type DashboardActionItem = {
  icon: LucideIcon;
  label: string;
};

export type DashboardHeaderLink = {
  href: string;
  label: string;
};

export const dashboardPrimaryNav: DashboardNavItem[] = [
  {
    href: "/posts",
    icon: FileText,
    label: "Posts",
  },
  {
    href: "/settings",
    icon: Settings2,
    label: "Settings",
  },
];

export const dashboardFooterNav: DashboardActionItem[] = [
  {
    icon: HelpCircle,
    label: "Support",
  },
  {
    icon: Archive,
    label: "Archive",
  },
];

export const dashboardHeaderLinks: DashboardHeaderLink[] = [
  {
    href: "/posts",
    label: "Drafts",
  },
  {
    href: "/posts",
    label: "Published",
  },
  {
    href: "/posts",
    label: "Analytics",
  },
];

export const dashboardUtilityActions = [
  {
    icon: Search,
    label: "Search",
  },
  {
    icon: Bell,
    label: "Notifications",
  },
  {
    icon: CircleUserRound,
    label: "Account",
  },
];

export const dashboardCtaIcon = Plus;
export const dashboardBrandIcon = LayoutGrid;
export const dashboardUpgradeIcon = Sparkles;
