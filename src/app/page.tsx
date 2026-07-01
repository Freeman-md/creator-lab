import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import {
  ArrowRightIcon,
  BarChart3Icon,
  FileTextIcon,
  SparklesIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function HomePage() {
  const session = await auth();
  const primaryHref = session.userId ? "/dashboard/posts" : "/sign-in";
  const primaryLabel = session.userId ? "Open dashboard" : "Sign in";

  return (
    <div className="min-h-screen">
      <header className="border-b border-border/70 bg-background/80 backdrop-blur-sm">
        <div className="page-shell flex items-center justify-between gap-4 py-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-heading text-lg font-semibold tracking-tight">
              Creator Lab
            </Link>
            <span className="rounded-full border border-border bg-card px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              V1
            </span>
          </div>
          <Button asChild size="sm">
            <Link href={primaryHref}>{primaryLabel}</Link>
          </Button>
        </div>
      </header>

      <main className="page-shell flex flex-col gap-10 py-16 md:gap-14 md:py-24">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-center">
          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              <h1 className="max-w-4xl font-heading text-4xl font-semibold tracking-[-0.03em] text-foreground md:text-6xl">
                Every post makes the next one better.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                Creator Lab is a feedback engine for LinkedIn creators. Save a
                published post, add its metrics, run analysis, extract lessons
                and patterns, and turn the result into a sharper next-post
                brief.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={primaryHref}>
                  {primaryLabel}
                  <ArrowRightIcon data-icon="inline-end" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/sign-in">View sign-in</Link>
              </Button>
            </div>
          </div>

          <Card className="border-border bg-card shadow-sm">
            <CardHeader className="gap-3">
              <CardTitle className="font-heading text-2xl font-semibold tracking-tight">
                The loop
              </CardTitle>
              <p className="text-sm leading-6 text-muted-foreground">
                Creator Lab is not a generic post generator. It helps you learn
                from what already shipped and carry the signal forward.
              </p>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm text-muted-foreground">
              {[
                "Save one published LinkedIn post.",
                "Add the latest metrics snapshot.",
                "Trigger AI analysis in the background.",
                "Review reusable lessons and patterns.",
                "Generate a directional next-post brief.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-border bg-muted/25 px-4 py-3"
                >
                  <p className="leading-6 text-foreground">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Capture the source post",
              description:
                "Store the post, publish timestamp, goal, category, and audience in one place.",
              Icon: FileTextIcon,
            },
            {
              title: "Measure what happened",
              description:
                "Attach impressions, reactions, comments, reposts, and profile visits as the latest metrics snapshot.",
              Icon: BarChart3Icon,
            },
            {
              title: "Use the next brief",
              description:
                "Turn completed analysis into repeat, avoid, improve, and next-angle guidance for the next post.",
              Icon: SparklesIcon,
            },
          ].map(({ title, description, Icon }) => (
            <Card key={title} className="border-border bg-card shadow-sm">
              <CardHeader className="gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-muted text-primary">
                  <Icon />
                </div>
                <CardTitle className="font-heading text-xl font-semibold tracking-tight">
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
}
