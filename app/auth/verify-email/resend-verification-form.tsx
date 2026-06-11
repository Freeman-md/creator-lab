import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { resendVerificationEmail } from "../actions";
import type { AuthPageSearchParams } from "../types";

type ResendVerificationFormProps = AuthPageSearchParams;

export function ResendVerificationForm({
  email,
  error,
  message,
}: ResendVerificationFormProps) {
  if (!email) {
    return (
      <div className="flex flex-col gap-6">
        {error ? (
          <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-700">
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        ) : null}

        {message ? (
          <Alert className="border-emerald-200 bg-emerald-50 text-emerald-700">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        ) : null}

        <p className="text-sm leading-6 text-muted-foreground">
          We couldn&apos;t tell which email address needs verification. Start the
          sign-up flow again and we&apos;ll send you a fresh confirmation link.
        </p>

        <Button asChild className="h-10 rounded-lg text-sm">
          <Link href="/auth/sign-up">Back to sign up</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm leading-6 text-muted-foreground">
        We sent a verification link to{" "}
        <span className="font-medium text-foreground">{email}</span>. Open the
        email and confirm your account before signing in.
      </p>

      {message ? (
        <Alert className="border-emerald-200 bg-emerald-50 text-emerald-700">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      ) : null}

      {error ? (
        <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-700">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      ) : null}

      <form action={resendVerificationEmail} className="flex flex-col gap-4">
        <input type="hidden" name="email" value={email} />

        <Button type="submit" className="h-10 rounded-lg text-sm">
          Resend verification email
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          Already verified?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-foreground hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
