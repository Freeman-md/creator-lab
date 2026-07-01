"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useConvexAuth } from "convex/react";
import { LoaderCircleIcon, ShieldAlertIcon } from "lucide-react";

import { AuthStatusControls } from "@/components/auth/auth-status-controls";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DashboardFrameProps = {
  children: React.ReactNode;
};

type DashboardAuthGateProps = {
  children: React.ReactNode;
};

export function DashboardFrame({ children }: DashboardFrameProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/80 bg-background/80 backdrop-blur-sm">
        <div className="page-shell flex items-center justify-between gap-4 py-6">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/posts" className="font-heading text-lg font-semibold tracking-tight">
              Creator Lab
            </Link>
            <span className="rounded-full border border-border bg-card px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              V1
            </span>
          </div>
          <AuthStatusControls />
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}

export function DashboardAuthGate({ children }: DashboardAuthGateProps) {
  const pathname = usePathname();
  const { isLoading, isAuthenticated } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="page-shell flex min-h-[calc(100vh-89px)] items-center py-12">
        <Card className="mx-auto w-full max-w-2xl border-border bg-card shadow-sm">
          <CardHeader className="gap-4 border-b border-border/70 bg-muted/40 pb-6">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-background ring-1 ring-foreground/10">
              <LoaderCircleIcon className="size-5 animate-spin text-primary" />
            </div>
            <div className="space-y-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Dashboard
              </p>
              <CardTitle className="font-heading text-3xl font-semibold tracking-[-0.02em] text-foreground">
                Restoring your workspace session.
              </CardTitle>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                Creator Lab is waiting for Clerk and Convex to agree on the
                active session before protected data loads.
              </p>
            </div>
          </CardHeader>
          <CardContent className="px-6 py-8">
            <div className="rounded-2xl border border-border bg-muted/25 p-5">
              <p className="text-sm leading-6 text-muted-foreground">
                This usually takes a moment on a full browser refresh. Once the
                Convex session is ready, the dashboard will continue normally.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="page-shell flex min-h-[calc(100vh-89px)] items-center py-12">
        <Card className="mx-auto w-full max-w-2xl border-border bg-card shadow-sm">
          <CardHeader className="gap-4 border-b border-border/70 bg-muted/40 pb-6">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-background ring-1 ring-foreground/10">
              <ShieldAlertIcon className="size-5 text-primary" />
            </div>
            <div className="space-y-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Dashboard
              </p>
              <CardTitle className="font-heading text-3xl font-semibold tracking-[-0.02em] text-foreground">
                Your dashboard session is not available.
              </CardTitle>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                Clerk is loaded, but Convex still does not see an authenticated
                session for this workspace route.
              </p>
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3 px-6 py-8">
            <Button asChild>
              <Link href={`/sign-in?redirect_url=${encodeURIComponent(pathname || "/dashboard/posts")}`}>
                Sign in again
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/posts">Open dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return children;
}
