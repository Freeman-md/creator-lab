import type { LucideIcon } from "lucide-react";
import {
  Bell,
  CircleUserRound,
  FileText,
  HelpCircle,
  LayoutGrid,
  MessageSquareMore,
  Plus,
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

export const dashboardPrimaryNav: DashboardNavItem[] = [
  {
    href: "/dashboard",
    icon: LayoutGrid,
    label: "Dashboard",
  },
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
    icon: MessageSquareMore,
    label: "Feedback",
  },
];

export const dashboardUtilityActions = [
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
export const dashboardUpgradeIcon = Sparkles;
