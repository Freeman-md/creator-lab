import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { updatePassword } from "../actions";
import type { AuthFeedback } from "../types";

type UpdatePasswordFormProps = AuthFeedback;

export function UpdatePasswordForm({ error, message }: UpdatePasswordFormProps) {
  return (
    <form action={updatePassword} className="flex flex-col gap-6">
      <p className="text-sm leading-6 text-muted-foreground">
        Choose a new password for your Creator Lab account.
      </p>

      <FieldGroup className="gap-5">
        <Field>
          <FieldContent>
            <FieldLabel htmlFor="password" className="mb-1 text-sm text-foreground">
              New password
            </FieldLabel>
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

        <Field>
          <FieldContent>
            <FieldLabel
              htmlFor="confirmPassword"
              className="mb-1 text-sm text-foreground"
            >
              Confirm new password
            </FieldLabel>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Repeat your new password"
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
        Update password
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          Back to{" "}
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
