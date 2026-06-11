import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { requestPasswordReset } from "../actions";
import type { AuthFeedback } from "../types";

type RequestResetFormProps = AuthFeedback;

export function RequestResetForm({ error, message }: RequestResetFormProps) {
  return (
    <form action={requestPasswordReset} className="flex flex-col gap-6">
      <p className="text-sm leading-6 text-muted-foreground">
        Enter your email address and we&apos;ll send you a link to reset your
        password.
      </p>

      <FieldGroup className="gap-5">
        <Field>
          <FieldContent>
            <FieldLabel htmlFor="email" className="mb-1 text-sm text-foreground">
              Email address
            </FieldLabel>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="w-full border-0 border-b border-border bg-transparent px-0 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-0"
            />
          </FieldContent>
        </Field>
      </FieldGroup>

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

      <Button type="submit" className="h-10 rounded-lg text-sm">
        Send reset link
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          Remembered it?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-foreground hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
}
