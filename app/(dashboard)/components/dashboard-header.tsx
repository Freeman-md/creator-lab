"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Send } from "lucide-react";
import { CreatorLabLogoIcon } from "@/components/icons/creator-lab-logo-icon";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { dashboardPrimaryNav, dashboardUtilityActions } from "./navigation";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardHeader() {
  const pathname = usePathname();
  const isPostEditor = pathname === "/posts/new";

  if (isPostEditor) {
    return (
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2 text-sm">
            <Link
              href="/posts"
              className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
            >
              Posts
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="truncate font-medium text-foreground">New Post</span>
            <Badge variant="outline" className="hidden shrink-0 sm:inline-flex">
              Draft
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" className="rounded-md">
              Finalize
              <Send data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-3 md:hidden">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <CreatorLabLogoIcon className="size-4" />
            </div>
            <span className="text-sm font-semibold text-foreground">Creator Lab</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
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
