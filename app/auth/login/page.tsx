import Link from "next/link";
import { CreatorLabLogoIcon } from "@/components/icons/creator-lab-logo-icon";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { AuthFeedback } from "../types";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<AuthFeedback>;
}) {
  const params = await searchParams;

  return (
    <>
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <CreatorLabLogoIcon className="size-7" />
        </div>
        <h1 className="mb-1 font-heading text-[32px] leading-[1.2] tracking-[-0.02em] text-foreground">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">Sign in to Creator Lab</p>
      </div>

      <Card>
        <CardHeader className="sr-only">
          <h2>Authentication</h2>
        </CardHeader>
        <CardContent className="p-10">
          <LoginForm {...params} />
        </CardContent>
      </Card>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/sign-up"
            className="font-medium text-foreground hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </>
  );
}
