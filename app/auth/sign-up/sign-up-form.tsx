import Link from "next/link";
import { SocialAuthButtons } from "../components/social-auth-buttons";
import type { AuthFeedback } from "../types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { signUpWithPassword } from "../actions";

type SignUpFormProps = AuthFeedback;

export function SignUpForm({ error, message }: SignUpFormProps) {
  return (
    <form action={signUpWithPassword} className="flex flex-col gap-6">
      <SocialAuthButtons />

      <FieldSeparator className="my-0">
        <span className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
          Or
        </span>
      </FieldSeparator>

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

        <Field>
          <FieldContent>
            <div className="mb-1 flex items-center justify-between gap-4">
              <FieldLabel htmlFor="password" className="text-sm text-foreground">
                Password
              </FieldLabel>
              <Link
                href="/auth/login"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Already have an account?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="At least 8 characters"
              autoComplete="new-password"
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
        Create account
      </Button>
    </form>
  );
}
