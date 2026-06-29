"use client";

import { useState } from "react";
import Link from "next/link";
import { BarChart3Icon, FileClockIcon, SparklesIcon } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { MetricsFormCard } from "@/modules/metrics/components/metrics-form-card";
import { PostEditorForm } from "@/modules/posts/components/post-editor-form";
import { MetricsFormValues } from "@/modules/metrics/types";
import { PostFormSubmitValues } from "@/modules/posts/types";
import { AppShell } from "@/components/ui/app-shell";
import { PostStatusBadges } from "@/modules/posts/components/post-status-badges";

type PostDetailViewProps = {
  postId: string;
};

function LoadingView() {
  return (
    <AppShell
      eyebrow="Post Detail"
      title="One post, one visible feedback loop."
      description="This screen owns post editing, the latest metrics snapshot, analysis status, and the next action that moves feedback forward."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        <div className="flex flex-col gap-6">
          <Skeleton className="h-[620px] w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-[360px] w-full rounded-xl" />
          <Skeleton className="h-[260px] w-full rounded-xl" />
        </div>
      </div>
    </AppShell>
  );
}

function ConnectedPostDetailView({ postId }: PostDetailViewProps) {
  const typedPostId = postId as Id<"posts">;
  const postData = useQuery(api.posts.get, { postId: typedPostId });
  const updatePost = useMutation(api.posts.update);
  const upsertMetrics = useMutation(api.metrics.upsert);
  const triggerAnalysis = useMutation(api.analyses.trigger);

  const [isSavingPost, setIsSavingPost] = useState(false);
  const [isSavingMetrics, setIsSavingMetrics] = useState(false);
  const [isTriggeringAnalysis, setIsTriggeringAnalysis] = useState(false);

  if (postData === undefined) {
    return <LoadingView />;
  }

  const handlePostSave = async (values: PostFormSubmitValues) => {
    setIsSavingPost(true);
    try {
      await updatePost({
        postId: typedPostId,
        ...values,
      });
      toast.success("Post updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Post update failed.");
    } finally {
      setIsSavingPost(false);
    }
  };

  const handleMetricsSave = async (values: MetricsFormValues) => {
    setIsSavingMetrics(true);
    try {
      await upsertMetrics({
        postId: typedPostId,
        ...values,
      });
      toast.success("Metrics saved.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Metrics save failed."
      );
    } finally {
      setIsSavingMetrics(false);
    }
  };

  const handleAnalysisTrigger = async () => {
    setIsTriggeringAnalysis(true);
    try {
      await triggerAnalysis({ postId: typedPostId });
      toast.success("Analysis started.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Analysis trigger failed."
      );
    } finally {
      setIsTriggeringAnalysis(false);
    }
  };

  const latestAnalysis = postData.latestAnalysis;
  const latestBrief = postData.latestBrief;

  return (
    <AppShell
      eyebrow="Post Detail"
      title="One post, one visible feedback loop."
      description="This screen owns post editing, the latest metrics snapshot, analysis status, and the next action that moves feedback forward."
      actions={
        <PostStatusBadges
          hasMetrics={Boolean(postData.metrics)}
          latestAnalysis={latestAnalysis}
          latestBrief={latestBrief}
        />
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        <div className="flex flex-col gap-6">
          <PostEditorForm
            title="Post content"
            submitLabel="Save post"
            isSaving={isSavingPost}
            defaultValues={postData.post}
            onSubmit={handlePostSave}
          />
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading text-xl font-semibold tracking-tight">
                Current feedback view
              </CardTitle>
            </CardHeader>
            <CardContent>
              {latestAnalysis?.status === "completed" ? (
                <div className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      Latest analysis
                    </p>
                    <p className="text-sm leading-6 text-foreground">
                      {latestAnalysis.content}
                    </p>
                  </div>
                  {latestBrief?.status === "completed" ? (
                    <div className="rounded-xl border border-border bg-muted/30 p-4">
                      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        Next post angle
                      </p>
                      <p className="mt-2 text-sm leading-6 text-foreground">
                        {latestBrief.nextPostAngle}
                      </p>
                    </div>
                  ) : null}
                  <div className="flex flex-wrap gap-3">
                    <Button asChild variant="outline">
                      <Link
                        href={`/posts/${postId}/analyses/${latestAnalysis.id}`}
                      >
                        Open latest analysis
                      </Link>
                    </Button>
                    {latestBrief ? (
                      <Button asChild>
                        <Link
                          href={`/posts/${postId}/analyses/${latestAnalysis.id}/brief`}
                        >
                          Open brief
                        </Link>
                      </Button>
                    ) : null}
                  </div>
                </div>
              ) : (
                <Empty className="min-h-48 border-border bg-muted/25">
                  <EmptyHeader>
                    <EmptyTitle>No completed feedback yet</EmptyTitle>
                    <EmptyDescription>
                      Trigger analysis after saving the post and metrics. The
                      strongest reusable lessons will surface here once the run
                      completes.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <MetricsFormCard
            defaultValues={postData.metrics ?? undefined}
            isSaving={isSavingMetrics}
            onSubmit={handleMetricsSave}
          />
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading text-lg font-semibold tracking-tight">
                Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {latestAnalysis?.status === "failed" ? (
                <Alert variant="destructive">
                  <AlertTitle>Latest analysis failed</AlertTitle>
                  <AlertDescription>
                    {latestAnalysis.errorMessage ?? "The analysis job failed."}
                  </AlertDescription>
                </Alert>
              ) : null}
              {latestAnalysis?.status === "in_progress" ? (
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <FileClockIcon className="size-4" />
                  Analysis is running in the background now.
                </div>
              ) : latestAnalysis?.stale ? (
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <BarChart3Icon className="size-4" />
                  Post or metrics changed after the last completed run. A fresh
                  analysis is recommended.
                </div>
              ) : (
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <BarChart3Icon className="size-4" />
                  {latestAnalysis
                    ? "You can create a fresh run at any time."
                    : "No analysis has been created for this post yet."}
                </div>
              )}
              <Button
                className="w-full"
                disabled={isTriggeringAnalysis || latestAnalysis?.status === "in_progress"}
                onClick={handleAnalysisTrigger}
              >
                <SparklesIcon data-icon="inline-start" />
                {latestAnalysis ? "Run new analysis" : "Trigger analysis"}
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/posts/${postId}/analyses`}>View all analyses</Link>
              </Button>
              {latestAnalysis ? (
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/posts/${postId}/analyses/${latestAnalysis.id}`}>
                    Open latest analysis
                  </Link>
                </Button>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

export function PostDetailView({ postId }: PostDetailViewProps) {
  return <ConnectedPostDetailView postId={postId} />;
}
