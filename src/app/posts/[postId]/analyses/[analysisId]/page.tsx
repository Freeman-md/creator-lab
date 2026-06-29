"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import type { Id } from "@convex/_generated/dataModel";

import { api } from "@convex/_generated/api";
import { AppShell } from "@/components/ui/app-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { AnalysisBriefStatusCard } from "@/modules/analyses/components/analysis-brief-status-card";
import { AnalysisInsightsTabs } from "@/modules/analyses/components/analysis-insights-tabs";
import { AnalysisSummaryCard } from "@/modules/analyses/components/analysis-summary-card";
import {
  ANALYSIS_STATUS_LABELS,
  BRIEF_STATUS_LABELS,
} from "@/lib/constants/status";
import { getStatusTone } from "@/lib/utils";

type AnalysisDetailPageProps = {
  params: Promise<{
    postId: string;
    analysisId: string;
  }>;
};

function AnalysisDetailLoading() {
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

export default function AnalysisDetailPage({ params }: AnalysisDetailPageProps) {
  const { postId, analysisId } = use(params);
  const typedAnalysisId = analysisId as Id<"analyses">;
  const detail = useQuery(api.analyses.get, {
    analysisId: typedAnalysisId,
  });

  if (detail === undefined) {
    return <AnalysisDetailLoading />;
  }

  const postTitle = detail.post.title?.trim() || "Untitled post";

  return (
    <AppShell
      eyebrow="Analysis Detail"
      title={postTitle}
      description="Review analysis output, grouped lessons, patterns, and brief-generation status for this post."
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
          <AnalysisSummaryCard
            postId={postId}
            analysisId={analysisId}
            analysis={detail.analysis}
            brief={detail.brief}
          />
          <AnalysisBriefStatusCard
            analysisId={typedAnalysisId}
            analysis={detail.analysis}
            brief={detail.brief}
          />
        </div>
        <AnalysisInsightsTabs
          lessons={detail.lessons}
          patterns={detail.patterns}
        />
      </div>
    </AppShell>
  );
}
