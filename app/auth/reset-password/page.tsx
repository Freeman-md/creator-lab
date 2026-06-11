import Link from "next/link";
import { CreatorLabLogoIcon } from "@/components/icons/creator-lab-logo-icon";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import type { AuthFeedback } from "../types";
import { UpdatePasswordForm } from "./update-password-form";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<AuthFeedback>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <CreatorLabLogoIcon className="size-7" />
        </div>
        <h1 className="mb-1 font-heading text-[32px] leading-[1.2] tracking-[-0.02em] text-foreground">
          Create a new password
        </h1>
        <p className="text-sm text-muted-foreground">
          Secure your Creator Lab account
        </p>
      </div>

      <Card>
        <CardHeader className="sr-only">
          <h2>Reset password</h2>
        </CardHeader>
        <CardContent className="p-10">
          {user ? (
            <UpdatePasswordForm {...params} />
          ) : (
            <div className="flex flex-col gap-6">
              {params.error ? (
                <Alert
                  variant="destructive"
                  className="border-red-200 bg-red-50 text-red-700"
                >
                  <AlertDescription className="text-red-700">
                    {params.error}
                  </AlertDescription>
                </Alert>
              ) : null}

              <p className="text-sm leading-6 text-muted-foreground">
                This reset link is invalid, expired, or no longer active. Request
                a new password reset email to continue.
              </p>

              <Button asChild className="h-10 rounded-lg text-sm">
                <Link href="/auth/forgot-password">Request a new reset link</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
