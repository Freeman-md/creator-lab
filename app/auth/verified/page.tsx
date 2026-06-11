import Link from "next/link";
import { CreatorLabLogoIcon } from "@/components/icons/creator-lab-logo-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function VerifiedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const href = user ? "/" : "/auth/login";
  const ctaLabel = user ? "Continue to Creator Lab" : "Go to sign in";

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-6 text-foreground">
      <div className="w-full max-w-[400px]">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <CreatorLabLogoIcon className="size-7" />
          </div>
          <h1 className="mb-1 font-heading text-[32px] leading-[1.2] tracking-[-0.02em] text-foreground">
            Email verified
          </h1>
          <p className="text-sm text-muted-foreground">
            Your account is ready to use
          </p>
        </div>

        <Card>
          <CardHeader className="sr-only">
            <h2>Verification complete</h2>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 p-10">
            <p className="text-sm leading-6 text-muted-foreground">
              Your email address has been confirmed. You can now continue into
              Creator Lab.
            </p>

            <Button asChild className="h-10 rounded-lg text-sm">
              <Link href={href}>{ctaLabel}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
