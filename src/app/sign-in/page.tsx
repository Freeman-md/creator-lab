import { SignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const hasClerkKeys = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
);

export default async function SignInPage() {
  if (!hasClerkKeys) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
        <Card className="w-full max-w-lg border-border bg-card shadow-sm">
          <CardHeader className="space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Authentication Setup
            </p>
            <CardTitle className="font-heading text-3xl font-semibold tracking-tight">
              Clerk still needs to be connected.
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
            <p>
              Add the Clerk Vercel integration, enable Google in Clerk, and set
              `CLERK_JWT_ISSUER_DOMAIN` on Convex.
            </p>
            <p>
              Once those values exist, this page will switch to the Google login
              flow automatically.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  const session = await auth();
  if (session.userId) {
    redirect("/posts");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-5xl rounded-[2rem] border border-border bg-card shadow-sm">
        <div className="grid gap-10 p-6 md:grid-cols-[minmax(0,1.1fr)_420px] md:p-10">
          <section className="flex flex-col justify-between gap-8 rounded-[1.5rem] bg-[linear-gradient(135deg,rgba(211,239,229,0.8),rgba(244,238,223,0.9))] p-8 text-slate-900">
            <div className="space-y-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-600">
                Creator Lab
              </p>
              <h1 className="font-heading text-4xl font-semibold tracking-[-0.03em]">
                Every post makes the next one better.
              </h1>
              <p className="max-w-xl text-sm leading-7 text-slate-700 md:text-base">
                Sign in with Google to save posts, capture metrics, run
                structured analysis, and turn each completed post into a sharper
                next-post brief.
              </p>
            </div>
            <div className="grid gap-3 text-sm text-slate-700">
              <div className="rounded-2xl border border-white/60 bg-white/60 p-4">
                Save the published post and its context.
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/60 p-4">
                Add metrics and trigger structured feedback.
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/60 p-4">
                Reuse lessons, patterns, and the next-post angle.
              </div>
            </div>
          </section>
          <section className="flex items-center justify-center">
            <SignIn path="/sign-in" fallbackRedirectUrl="/posts" />
          </section>
        </div>
      </div>
    </main>
  );
}
