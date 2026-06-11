"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreatorLabLogoIcon } from "@/components/icons/creator-lab-logo-icon";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  dashboardCtaIcon,
  dashboardFooterNav,
  dashboardPrimaryNav,
} from "./navigation";

const DashboardCtaIcon = dashboardCtaIcon;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

type DashboardSidebarProps = {
  className?: string;
};

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "hidden w-64 shrink-0 border-r border-border bg-sidebar text-sidebar-foreground md:flex md:flex-col",
        className,
      )}
    >
      <Link
        href="/dashboard"
        className="flex h-16 items-center gap-3 border-b border-border px-5"
      >
        <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <CreatorLabLogoIcon className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">Creator Lab</p>
          <p className="text-xs text-muted-foreground">Studio Precision</p>
        </div>
      </Link>

      <div className="flex flex-1 flex-col px-3 py-4">
        <Button className="mb-5 h-10 w-full justify-center gap-2 rounded-md">
          <DashboardCtaIcon className="size-4" />
          New Post
        </Button>

        <nav className="space-y-1">
          {dashboardPrimaryNav.map(({ href, icon: Icon, label }) => {
            const active = isActive(pathname, href);

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "h-9 w-full justify-start gap-3 rounded-md px-3 font-medium",
                  active
                    ? "bg-secondary text-foreground hover:bg-secondary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-border pt-4">
          <nav className="space-y-1">
            {dashboardFooterNav.map(({ icon: Icon, label }) => (
              <button
                key={label}
                type="button"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "h-9 w-full justify-start gap-3 rounded-md px-3 text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
