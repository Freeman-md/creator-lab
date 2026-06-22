"use client";

import { UserButton, useUser } from "@clerk/nextjs";

export function AuthControls() {
  const { isLoaded, isSignedIn } = useUser();

  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return null;
  }

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <UserButton
      appearance={{
        elements: {
          userButtonAvatarBox: "h-9 w-9",
        },
      }}
    />
  );
}
