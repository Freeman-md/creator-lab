"use client";

import Link from "next/link";
import {
  SignOutButton,
  useUser,
} from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export function AuthStatusControls() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button variant="ghost" size="sm" disabled>
          Loading
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {!isSignedIn ? (
        <Button asChild variant="ghost" size="sm">
          <Link href="/sign-in">Sign in</Link>
        </Button>
      ) : null}

      {isSignedIn ? (
        <>
          <div className="hidden rounded-full border border-border bg-card px-3 py-1.5 text-right md:block">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Signed in
            </p>
            <p className="text-sm font-medium text-foreground">
              {user?.firstName || user?.username || user?.primaryEmailAddress?.emailAddress || "Creator"}
            </p>
          </div>
          <SignOutButton>
            <Button variant="outline" size="sm">
              Sign out
            </Button>
          </SignOutButton>
        </>
      ) : null}
    </div>
  );
}
