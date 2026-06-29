"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import type { Id } from "@convex/_generated/dataModel";

import { api } from "@convex/_generated/api";
import { AppShell } from "@/components/ui/app-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { PostDetailAnalysisTrigger } from "@/modules/posts/components/post-detail-analysis-trigger";
import { PostDetailEditor } from "@/modules/posts/components/post-detail-editor";
import { PostDetailFeedbackSummary } from "@/modules/posts/components/post-detail-feedback-summary";
import { PostDetailMetricsSection } from "@/modules/posts/components/post-detail-metrics-section";
import { PostStatusBadges } from "@/modules/posts/components/post-status-badges";

type PostDetailPageProps = {
  params: Promise<{
    postId: string;
  }>;
};

function PostDetailLoading() {
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

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const { postId } = use(params);
  const typedPostId = postId as Id<"posts">;
  const postData = useQuery(api.posts.get, { postId: typedPostId });

  if (postData === undefined) {
    return <PostDetailLoading />;
  }

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
          <PostDetailEditor postId={typedPostId} defaultValues={postData.post} />
          <PostDetailFeedbackSummary
            postId={postId}
            latestAnalysis={latestAnalysis}
            latestBrief={latestBrief}
          />
        </div>
        <div className="space-y-6">
          <PostDetailMetricsSection
            postId={typedPostId}
            defaultValues={postData.metrics ?? undefined}
          />
          <PostDetailAnalysisTrigger
            postId={typedPostId}
            latestAnalysis={latestAnalysis}
          />
        </div>
      </div>
    </AppShell>
  );
}
