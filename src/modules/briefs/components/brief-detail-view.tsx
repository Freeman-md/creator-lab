"use client";

import { useState } from "react";
import Link from "next/link";
import { CopyIcon } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { AppShell } from "@/shared/components/app-shell";
import { StatusBadge } from "@/shared/components/status-badge";
import { BRIEF_STATUS_LABELS } from "@/shared/constants/status";

type BriefDetailViewProps = {
  analysisId: string;
};
function getStatusTone(status?: "in_progress" | "completed" | "failed") {
  if (status === "completed") {
    return "success" as const;
  }
  if (status === "failed") {
    return "danger" as const;
  }
  if (status === "in_progress") {
    return "warning" as const;
  }
  return "neutral" as const;
}

function buildBriefCopyText(brief: {
  repeat?: string[];
  avoid?: string[];
  improve?: string[];
  nextPostAngle?: string;
  nextPostReason?: string;
  nextPostReminder?: string;
}) {
  return [
    "Repeat",
    ...(brief.repeat ?? []).map((item) => `- ${item}`),
    "",
    "Avoid",
    ...(brief.avoid ?? []).map((item) => `- ${item}`),
    "",
    "Improve",
    ...(brief.improve ?? []).map((item) => `- ${item}`),
    "",
    "Next Post",
    `Angle: ${brief.nextPostAngle ?? ""}`,
    `Why: ${brief.nextPostReason ?? ""}`,
    `Reminder: ${brief.nextPostReminder ?? ""}`,
  ].join("\n");
}

function LoadingView() {
  return (
    <AppShell
      eyebrow="Next Post Brief"
      title="Guidance for the next post, not a generated replacement."
      description="The brief must stay directional: what to repeat, avoid, improve, and the angle worth testing next."
    >
      <Skeleton className="h-[520px] w-full rounded-xl" />
    </AppShell>
  );
}

function ConnectedBriefDetailView({ analysisId }: BriefDetailViewProps) {
  const brief = useQuery(api.briefs.get, {
    analysisId: analysisId as Id<"analyses">,
  });
  const retryBrief = useMutation(api.briefs.create);
  const [isRetrying, setIsRetrying] = useState(false);

  if (brief === undefined) {
    return <LoadingView />;
  }

  const handleCopy = async () => {
    if (!brief || brief.status !== "completed") {
      return;
    }

    await navigator.clipboard.writeText(buildBriefCopyText(brief));
    toast.success("Brief copied.");
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await retryBrief({ analysisId: analysisId as Id<"analyses"> });
      toast.success("Brief generation restarted.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Brief retry failed."
      );
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <AppShell
      eyebrow="Next Post Brief"
      title="Guidance for the next post, not a generated replacement."
      description="The brief must stay directional: what to repeat, avoid, improve, and the angle worth testing next."
      actions={
        brief ? (
          <StatusBadge
            label={BRIEF_STATUS_LABELS[brief.status]}
            tone={getStatusTone(brief.status)}
          />
        ) : (
          <StatusBadge label="Brief pending" tone="neutral" />
        )
      }
    >
      {!brief ? (
        <Empty className="min-h-[420px] border-border bg-card">
          <EmptyHeader>
            <EmptyTitle>No brief record yet</EmptyTitle>
            <EmptyDescription>
              A brief appears here after the analysis finishes and the background
              brief job starts.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <CardTitle className="font-heading text-xl font-semibold tracking-tight">
                Brief for analysis {analysisId}
              </CardTitle>
              <p className="text-sm leading-6 text-muted-foreground">
                Directional guidance for the next post, built from the completed
                feedback loop.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={handleCopy}
                disabled={brief.status !== "completed"}
              >
                <CopyIcon data-icon="inline-start" />
                Copy Brief
              </Button>
              <Button asChild variant="outline">
                <Link href={`/posts/${brief.postId}/analyses/${analysisId}`}>
                  Back to analysis
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {brief.status === "failed" ? (
              <Alert variant="destructive">
                <AlertTitle>Brief generation failed</AlertTitle>
                <AlertDescription>
                  {brief.errorMessage ?? "The brief job failed."}
                </AlertDescription>
              </Alert>
            ) : null}
            {brief.status === "failed" ? (
              <div>
                <Button disabled={isRetrying} onClick={handleRetry}>
                  Retry brief generation
                </Button>
              </div>
            ) : null}
            {brief.status === "in_progress" ? (
              <Empty className="min-h-64 border-border bg-muted/25">
                <EmptyHeader>
                  <EmptyTitle>Brief is in progress</EmptyTitle>
                  <EmptyDescription>
                    Creator Lab is turning the completed analysis, lessons, and
                    patterns into next-post guidance.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : null}
            {brief.status === "completed" ? (
              <>
                <div className="grid gap-4 lg:grid-cols-3">
                  {(
                    [
                      ["Repeat", brief.repeat ?? []],
                      ["Avoid", brief.avoid ?? []],
                      ["Improve", brief.improve ?? []],
                    ] as const
                  ).map(([section, items]) => (
                    <div
                      key={section}
                      className="rounded-xl border border-border bg-muted/25 p-4"
                    >
                      <h2 className="font-heading text-base font-semibold tracking-tight">
                        {section}
                      </h2>
                      {items.length === 0 ? (
                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                          No {section.toLowerCase()} guidance was returned.
                        </p>
                      ) : (
                        <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-sm leading-6 text-foreground">
                          {items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-border bg-card p-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    Next post angle
                  </p>
                  <p className="mt-2 text-base font-medium text-foreground">
                    {brief.nextPostAngle}
                  </p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        Why this angle
                      </p>
                      <p className="mt-2 text-sm leading-6 text-foreground">
                        {brief.nextPostReason}
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        Reminder
                      </p>
                      <p className="mt-2 text-sm leading-6 text-foreground">
                        {brief.nextPostReminder}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      )}
    </AppShell>
  );
}

export function BriefDetailView({ analysisId }: BriefDetailViewProps) {
  return <ConnectedBriefDetailView analysisId={analysisId} />;
}
