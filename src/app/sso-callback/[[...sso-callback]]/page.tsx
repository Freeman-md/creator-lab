"use client";

import { useClerk, useSignIn, useSignUp } from "@clerk/nextjs";
import { normalizeRedirectTarget } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Page() {
  const clerk = useClerk();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasRun = useRef(false);
  const redirectTarget = normalizeRedirectTarget(searchParams.get("redirect_url"));

  useEffect(() => {
    const navigateToSignIn = () => {
      router.push("/sign-in");
    };

    const navigateToTarget = async ({
      session,
      decorateUrl,
    }: {
      session?: { currentTask?: unknown } | null;
      decorateUrl: (url: string) => string;
    }) => {
      if (session?.currentTask) {
        navigateToSignIn();
        return;
      }

      const url = decorateUrl(redirectTarget);
      if (url.startsWith("http")) {
        window.location.href = url;
        return;
      }

      router.push(url);
    };

    async function finalizeSignIn() {
      await signIn.finalize({
        navigate: navigateToTarget,
      });
    }

    async function finalizeSignUp() {
      await signUp.finalize({
        navigate: navigateToTarget,
      });
    }

    async function run() {
      if (!clerk.loaded || hasRun.current) {
        return;
      }

      hasRun.current = true;

      if (signIn.status === "complete") {
        await finalizeSignIn();
        return;
      }

      if (signUp.isTransferable) {
        await signIn.create({ transfer: true });
        const signInStatus = signIn.status as typeof signIn.status | "complete";

        if (signInStatus === "complete") {
          await finalizeSignIn();
          return;
        }

        navigateToSignIn();
        return;
      }

      if (signIn.isTransferable) {
        await signUp.create({ transfer: true });

        if (signUp.status === "complete") {
          await finalizeSignUp();
          return;
        }

        navigateToSignIn();
        return;
      }

      if (signUp.status === "complete") {
        await finalizeSignUp();
        return;
      }

      if (signIn.status === "needs_second_factor" || signIn.status === "needs_new_password") {
        navigateToSignIn();
        return;
      }

      if (signIn.existingSession || signUp.existingSession) {
        const sessionId = signIn.existingSession?.sessionId || signUp.existingSession?.sessionId;

        if (!sessionId) {
          navigateToSignIn();
          return;
        }

        await clerk.setActive({
          session: sessionId,
          navigate: navigateToTarget,
        });
        return;
      }

      navigateToSignIn();
    }

    void run();
  }, [clerk, redirectTarget, router, signIn, signUp]);

  return <div id="clerk-captcha" />;
}
