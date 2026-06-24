"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { AppShell } from "@/components/ui/app-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  ANALYSIS_STATUS_LABELS,
  BRIEF_STATUS_LABELS,
} from "@/lib/constants/status";

type AnalysisDetailViewProps = {
  postId: string;
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

function groupLessons(
  lessons: Array<{
    id: string;
    type: "repeat" | "avoid" | "improve";
    content: string;
  }>
) {
  return {
    repeat: lessons.filter((lesson) => lesson.type === "repeat"),
    avoid: lessons.filter((lesson) => lesson.type === "avoid"),
    improve: lessons.filter((lesson) => lesson.type === "improve"),
  };
}

function groupPatterns(
  patterns: Array<{
    id: string;
    sentiment: "positive" | "negative";
    score: number;
    name: string;
    description: string;
  }>
) {
  return {
    positive: patterns.filter((pattern) => pattern.sentiment === "positive"),
    negative: patterns.filter((pattern) => pattern.sentiment === "negative"),
  };
}

function LoadingView() {
  return (
    <AppShell
      eyebrow="Analysis Detail"
      title="Review the output before the next brief is trusted."
      description="The analysis detail screen owns summary content, reasoning, confidence, grouped lessons, grouped patterns, and brief-generation status."
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
        <Skeleton className="h-[520px] w-full rounded-xl" />
        <Skeleton className="h-[520px] w-full rounded-xl" />
      </div>
    </AppShell>
  );
}

function ConnectedAnalysisDetailView({
  postId,
  analysisId,
}: AnalysisDetailViewProps) {
  const detail = useQuery(api.analyses.get, {
    analysisId: analysisId as Id<"analyses">,
  });
  const retryBrief = useMutation(api.briefs.create);
  const [isRetryingBrief, setIsRetryingBrief] = useState(false);

  if (detail === undefined) {
    return <LoadingView />;
  }

  const groupedLessons = groupLessons(detail.lessons);
  const groupedPatterns = groupPatterns(detail.patterns);

  const handleRetryBrief = async () => {
    setIsRetryingBrief(true);
    try {
      await retryBrief({ analysisId: analysisId as Id<"analyses"> });
      toast.success("Brief generation restarted.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Brief generation retry failed."
      );
    } finally {
      setIsRetryingBrief(false);
    }
  };

  return (
    <AppShell
      eyebrow="Analysis Detail"
      title="Review the output before the next brief is trusted."
      description="The analysis detail screen owns summary content, reasoning, confidence, grouped lessons, grouped patterns, and brief-generation status."
      actions={
        <>
          <StatusBadge
            label={ANALYSIS_STATUS_LABELS[detail.analysis.status]}
            tone={getStatusTone(detail.analysis.status)}
          />
          {detail.brief ? (
            <StatusBadge
              label={BRIEF_STATUS_LABELS[detail.brief.status]}
              tone={getStatusTone(detail.brief.status)}
            />
          ) : (
            <StatusBadge label="Brief pending" tone="neutral" />
          )}
          {detail.analysis.stale ? (
            <StatusBadge label="Stale feedback" tone="warning" />
          ) : null}
        </>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
        <div className="space-y-6">
          <Card className="border-border bg-card shadow-sm">
            <CardHeader className="gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="font-heading text-xl font-semibold tracking-tight">
                  Analysis summary
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="outline">
                    <Link href={`/posts/${postId}/analyses`}>All analyses</Link>
                  </Button>
                  {detail.brief ? (
                    <Button asChild>
                      <Link href={`/posts/${postId}/analyses/${analysisId}/brief`}>
                        Open Brief
                      </Link>
                    </Button>
                  ) : null}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {detail.analysis.status === "failed" ? (
                <Alert variant="destructive">
                  <AlertTitle>Analysis failed</AlertTitle>
                  <AlertDescription>
                    {detail.analysis.errorMessage ?? "The analysis did not complete."}
                  </AlertDescription>
                </Alert>
              ) : detail.analysis.status === "in_progress" ? (
                <Empty className="min-h-56 border-border bg-muted/25">
                  <EmptyHeader>
                    <EmptyTitle>Analysis is running</EmptyTitle>
                    <EmptyDescription>
                      The immutable snapshot has been captured. This screen will
                      populate automatically when the background job finishes.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl border border-border bg-muted/25 p-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      Summary
                    </p>
                    <p className="mt-2 text-sm leading-6 text-foreground">
                      {detail.analysis.content}
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
                    <div className="rounded-xl border border-border bg-card p-4">
                      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        Reasoning
                      </p>
                      <p className="mt-2 text-sm leading-6 text-foreground">
                        {detail.analysis.reasoning}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4">
                      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        Confidence
                      </p>
                      <p className="mt-2 text-sm font-medium capitalize text-foreground">
                        {detail.analysis.confidence}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading text-lg font-semibold tracking-tight">
                Brief status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!detail.brief ? (
                <p className="text-sm leading-6 text-muted-foreground">
                  Brief generation has not started yet.
                </p>
              ) : detail.brief.status === "failed" ? (
                <Alert variant="destructive">
                  <AlertTitle>Brief generation failed</AlertTitle>
                  <AlertDescription>
                    {detail.brief.errorMessage ?? "The brief job failed."}
                  </AlertDescription>
                </Alert>
              ) : detail.brief.status === "in_progress" ? (
                <p className="text-sm leading-6 text-muted-foreground">
                  The brief is being generated from the completed analysis,
                  lessons, and patterns.
                </p>
              ) : (
                <div className="rounded-xl border border-border bg-muted/25 p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    Next post angle
                  </p>
                  <p className="mt-2 text-sm leading-6 text-foreground">
                    {detail.brief.nextPostAngle}
                  </p>
                </div>
              )}
              {detail.analysis.status === "completed" &&
                detail.brief?.status === "failed" ? (
                <Button disabled={isRetryingBrief} onClick={handleRetryBrief}>
                  Retry brief generation
                </Button>
              ) : null}
            </CardContent>
          </Card>
        </div>
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading text-lg font-semibold tracking-tight">
              Lessons and patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="lessons">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="lessons">Lessons</TabsTrigger>
                <TabsTrigger value="patterns">Patterns</TabsTrigger>
              </TabsList>
              <TabsContent value="lessons" className="pt-4">
                <div className="flex flex-col gap-4">
                  {(
                    [
                      ["Repeat", groupedLessons.repeat],
                      ["Avoid", groupedLessons.avoid],
                      ["Improve", groupedLessons.improve],
                    ] as const
                  ).map(([title, lessons]) => (
                    <div
                      key={title}
                      className="rounded-xl border border-border bg-muted/25 p-4"
                    >
                      <h3 className="font-heading text-base font-semibold tracking-tight">
                        {title}
                      </h3>
                      {lessons.length === 0 ? (
                        <p className="mt-3 text-sm text-muted-foreground">
                          No {title.toLowerCase()} lessons were produced.
                        </p>
                      ) : (
                        <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-sm leading-6 text-foreground">
                          {lessons.map((lesson) => (
                            <li key={lesson.id}>{lesson.content}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="patterns" className="pt-4">
                <div className="flex flex-col gap-4">
                  {(
                    [
                      ["Positive", groupedPatterns.positive],
                      ["Negative", groupedPatterns.negative],
                    ] as const
                  ).map(([title, patterns]) => (
                    <div
                      key={title}
                      className="rounded-xl border border-border bg-muted/25 p-4"
                    >
                      <h3 className="font-heading text-base font-semibold tracking-tight">
                        {title}
                      </h3>
                      {patterns.length === 0 ? (
                        <p className="mt-3 text-sm text-muted-foreground">
                          No {title.toLowerCase()} patterns were produced.
                        </p>
                      ) : (
                        <div className="mt-3 flex flex-col gap-3">
                          {patterns.map((pattern) => (
                            <div
                              key={pattern.id}
                              className="rounded-lg border border-border bg-card p-3"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <h4 className="font-medium text-foreground">
                                  {pattern.name}
                                </h4>
                                <span className="font-mono text-xs text-muted-foreground">
                                  Score {pattern.score.toFixed(2)}
                                </span>
                              </div>
                              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                {pattern.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

export function AnalysisDetailView({
  postId,
  analysisId,
}: AnalysisDetailViewProps) {
  return <ConnectedAnalysisDetailView postId={postId} analysisId={analysisId} />;
}
