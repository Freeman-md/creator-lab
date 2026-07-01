"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { AlertCircleIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { GoogleIcon } from "@/components/icons/google-icon";
import { LinkedInIcon } from "@/components/icons/linkedin-icon";

type SocialAuthPanelProps = {
  redirectUrlComplete: string;
};

const providers = [
  {
    label: "Continue with Google",
    loadingLabel: "Opening Google...",
    strategy: "oauth_google",
    Icon: GoogleIcon,
  },
  {
    label: "Continue with LinkedIn",
    loadingLabel: "Opening LinkedIn...",
    strategy: "oauth_linkedin_oidc",
    Icon: LinkedInIcon,
  },
] as const;

export function SocialAuthPanel({
  redirectUrlComplete,
}: SocialAuthPanelProps) {
  const { signIn } = useSignIn();
  const [pendingStrategy, setPendingStrategy] = useState<
    (typeof providers)[number]["strategy"] | null
  >(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSocialSignIn(
    strategy: (typeof providers)[number]["strategy"],
  ) {
    if (!signIn || pendingStrategy) {
      return;
    }

    try {
      setPendingStrategy(strategy);
      setErrorMessage(null);

      const redirectCallbackUrl = `/sso-callback?redirect_url=${encodeURIComponent(redirectUrlComplete)}`;
      const { error } = await signIn.sso({
        strategy,
        redirectUrl: redirectUrlComplete,
        redirectCallbackUrl,
      });

      if (error) {
        setErrorMessage(JSON.stringify(error));
        setPendingStrategy(null);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Social sign-in could not be started.";
      setErrorMessage(message);
      setPendingStrategy(null);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {providers.map(({ label, loadingLabel, strategy, Icon }) => {
        const isPending = pendingStrategy === strategy;

        return (
          <Button
            key={strategy}
            type="button"
            size="lg"
            variant="outline"
            onClick={() => handleSocialSignIn(strategy)}
            disabled={!signIn || pendingStrategy !== null}
            className="h-12 w-full rounded-2xl border-border bg-card text-base font-medium text-foreground shadow-none hover:bg-muted"
          >
            {isPending ? <Spinner className="size-4" /> : <Icon />}
            {isPending ? loadingLabel : label}
          </Button>
        );
      })}

      {errorMessage ? (
        <Alert
          variant="destructive"
          className="rounded-2xl border-destructive/20 bg-destructive/8"
        >
          <AlertCircleIcon className="size-4" />
          <AlertTitle>Social sign-in failed</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
