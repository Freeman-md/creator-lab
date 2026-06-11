"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { CreatorLabLogoIcon } from "@/components/icons/creator-lab-logo-icon";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  dashboardHeaderLinks,
  dashboardPrimaryNav,
  dashboardUtilityActions,
} from "./navigation";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Link href="/posts" className="flex items-center gap-3 md:hidden">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <CreatorLabLogoIcon className="size-4" />
            </div>
            <span className="text-sm font-semibold text-foreground">Creator Lab</span>
          </Link>

          <div className="relative hidden sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="h-9 w-[220px] rounded-md border-border bg-muted/70 pl-9 text-sm shadow-none placeholder:text-muted-foreground focus:border-border focus:ring-0"
            />
          </div>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {dashboardHeaderLinks.map(({ href, label }) => {
            const active = pathname.startsWith(href);

            return (
              <Link
                key={`${href}-${label}`}
                href={href}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "h-9 rounded-md px-3",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="hidden rounded-md px-3 text-muted-foreground md:inline-flex"
          >
            Feedback
          </Button>
          <Button size="sm" className="rounded-md px-3">
            Upgrade
          </Button>
          {dashboardUtilityActions.map(({ icon: Icon, label }) => (
            <Button
              key={label}
              variant="ghost"
              size="icon-sm"
              className="rounded-md text-muted-foreground"
              aria-label={label}
            >
              <Icon className="size-4" />
            </Button>
          ))}
        </div>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto border-t border-border px-4 py-2 md:hidden">
        {dashboardPrimaryNav.map(({ href, icon: Icon, label }) => {
          const active = isActive(pathname, href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "h-8 shrink-0 gap-2 rounded-md px-3",
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
    </header>
  );
}
