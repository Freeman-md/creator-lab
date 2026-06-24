"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  SignOutButton,
  useUser,
} from "@clerk/nextjs";
import { AlertTriangleIcon, RefreshCcwIcon, ShieldAlertIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const { isLoaded, isSignedIn } = useUser();
  const isUnauthorized = error.message.includes("Unauthorized");

  return (
    <div className="min-h-screen bg-background">
      <div className="page-shell flex min-h-screen items-center py-12">
        <Card className="mx-auto w-full max-w-3xl overflow-hidden border-border bg-card shadow-sm">
          <CardHeader className="gap-4 border-b border-border/70 bg-muted/40 pb-6">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-background ring-1 ring-foreground/10">
              {isUnauthorized ? (
                <ShieldAlertIcon className="size-5 text-primary" />
              ) : (
                <AlertTriangleIcon className="size-5 text-primary" />
              )}
            </div>
            <div className="space-y-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Posts Workspace
              </p>
              <CardTitle className="font-heading text-3xl font-semibold tracking-[-0.02em] text-foreground">
                {isUnauthorized
                  ? "Your session is not ready for Creator Lab yet."
                  : "This workspace hit an unexpected state."}
              </CardTitle>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                {isUnauthorized
                  ? "The route loaded, but the data layer did not accept the current session. Stay on the product path: sign in again, refresh the session, or retry once the auth wiring is settled."
                  : "Creator Lab could not finish loading this route. Retry the view, or step back to the post library and continue from there."}
              </p>
            </div>
          </CardHeader>

          <CardContent className="grid gap-8 px-6 py-8 md:grid-cols-[1.4fr_0.9fr]">
            <div className="space-y-5">
              <div className="rounded-2xl border border-border bg-background p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  What you can do next
                </p>
                <div className="mt-4 grid gap-3">
                  <Button onClick={() => unstable_retry()} className="justify-center md:justify-start">
                    <RefreshCcwIcon data-icon="inline-start" />
                    Retry this route
                  </Button>
                  <Button asChild variant="outline" className="justify-center md:justify-start">
                    <Link href="/posts">Back to library</Link>
                  </Button>
                </div>
              </div>

              {isUnauthorized ? (
                <div className="rounded-2xl border border-border bg-muted/30 p-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    Session actions
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {isLoaded && !isSignedIn ? (
                      <Button asChild>
                        <Link href="/sign-in">Sign in</Link>
                      </Button>
                    ) : null}
                    {isLoaded && isSignedIn ? (
                      <SignOutButton>
                        <Button variant="outline">Sign out</Button>
                      </SignOutButton>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="rounded-2xl border border-border bg-muted/30 p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Error details
              </p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    Message
                  </p>
                  <p className="mt-1 text-sm leading-6 text-foreground">
                    {isUnauthorized
                      ? "Unauthorized request from the Convex data layer."
                      : error.message}
                  </p>
                </div>
                {error.digest ? (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      Digest
                    </p>
                    <p className="mt-1 font-mono text-xs text-foreground">
                      {error.digest}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
