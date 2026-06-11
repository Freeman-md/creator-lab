import Link from "next/link";
import { CreatorLabLogoIcon } from "@/components/icons/creator-lab-logo-icon";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { AuthPageSearchParams } from "../types";
import { ResendVerificationForm } from "./resend-verification-form";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<AuthPageSearchParams>;
}) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-6 text-foreground">
      <div className="w-full max-w-[400px]">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <CreatorLabLogoIcon className="size-7" />
          </div>
          <h1 className="mb-1 font-heading text-[32px] leading-[1.2] tracking-[-0.02em] text-foreground">
            Verify your email
          </h1>
          <p className="text-sm text-muted-foreground">
            Finish setting up your Creator Lab account
          </p>
        </div>

        <Card>
          <CardHeader className="sr-only">
            <h2>Email verification</h2>
          </CardHeader>
          <CardContent className="p-10">
            <ResendVerificationForm {...params} />
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            Use a different email?{" "}
            <Link
              href="/auth/sign-up"
              className="font-medium text-foreground hover:underline"
            >
              Sign up again
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
