import Link from "next/link";

import { AuthStatusControls } from "@/components/auth/auth-status-controls";
import { Button } from "@/components/ui/button";

type AppShellProps = {
  title: string;
  eyebrow?: string;
  description: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export function AppShell({
  title,
  eyebrow,
  description,
  actions,
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen pb-16">
      <header className="border-b border-border/80 bg-background/80 backdrop-blur-sm">
        <div className="page-shell flex flex-col gap-6 py-6">
          <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-4">
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
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <div className="space-y-2">
                {eyebrow ? (
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    {eyebrow}
                  </p>
                ) : null}
                <h1 className="font-heading text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-4xl">
                  {title}
                </h1>
                <p className="max-w-3xl text-sm leading-6 text-muted-foreground md:text-base md:leading-7">
                  {description}
                </p>
              </div>
            </div>
            <nav className="flex items-center gap-2 self-start">
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/posts">Library</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/dashboard/posts/new">New Post</Link>
              </Button>
            </nav>
          </div>
          {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
        </div>
      </header>
      <main className="page-shell pt-8">{children}</main>
    </div>
  );
}
