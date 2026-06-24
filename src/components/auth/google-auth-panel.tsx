"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { AlertCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { GoogleIcon } from "../icons/google-icon";

type GoogleAuthPanelProps = {
  redirectUrlComplete: string;
};


export function GoogleAuthPanel({ redirectUrlComplete }: GoogleAuthPanelProps) {
  const { signIn } = useSignIn();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleGoogleSignIn() {
    if (!signIn || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const redirectCallbackUrl = `/sso-callback?redirect_url=${encodeURIComponent(redirectUrlComplete)}`;
      const { error } = await signIn.sso({
        strategy: "oauth_google",
        redirectUrl: redirectUrlComplete,
        redirectCallbackUrl,
      });

      if (error) {
        setErrorMessage(JSON.stringify(error));
        setIsSubmitting(false);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Google sign-in could not be started.";
      setErrorMessage(message);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <Button
        type="button"
        size="lg"
        variant="outline"
        onClick={handleGoogleSignIn}
        disabled={!signIn || isSubmitting}
        className="h-12 w-full rounded-2xl border-border bg-card text-base font-medium text-foreground shadow-none hover:bg-muted"
      >
        {isSubmitting ? <Spinner className="size-4" /> : <GoogleIcon />}
        {isSubmitting ? "Opening Google..." : "Continue with Google"}
      </Button>

      {errorMessage ? (
        <Alert variant="destructive" className="rounded-2xl border-destructive/20 bg-destructive/8">
          <AlertCircleIcon className="size-4" />
          <AlertTitle>Google sign-in failed</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
