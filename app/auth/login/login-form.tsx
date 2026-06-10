import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { GoogleIcon } from "@/components/icons/google-icon";
import { LinkedInIcon } from "@/components/icons/linkedin-icon";
import { signInWithPassword } from "../actions";

type LoginFormProps = {
  initialError?: string;
  initialMessage?: string;
};

export function LoginForm({ initialError, initialMessage }: LoginFormProps) {
  return (
    <form action={signInWithPassword} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Button
          type="button"
          variant="outline"
          className="h-10 justify-center gap-2 rounded-lg border-border bg-background text-sm text-foreground"
        >
          <GoogleIcon className="size-4" />
          Continue with Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-10 justify-center gap-2 rounded-lg border-border bg-background text-sm text-foreground"
        >
          <LinkedInIcon className="size-4 text-[#0A66C2]" />
          Continue with LinkedIn
        </Button>
      </div>

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
                href="/"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Forgot?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              required
              className="w-full border-0 border-b border-border bg-transparent px-0 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-0"
            />
          </FieldContent>
        </Field>
      </FieldGroup>

      {initialMessage ? (
        <Alert className="border-emerald-200 bg-emerald-50 text-emerald-700">
          <AlertDescription>{initialMessage}</AlertDescription>
        </Alert>
      ) : null}

      {initialError ? (
        <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-700">
          <AlertDescription className="text-red-700">
            {initialError}
          </AlertDescription>
        </Alert>
      ) : null}

      <Button type="submit" className="h-10 rounded-lg text-sm">
        Sign in
      </Button>
    </form>
  );
}
