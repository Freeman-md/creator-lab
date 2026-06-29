"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import type { Id } from "@convex/_generated/dataModel";

import { api } from "@convex/_generated/api";
import { AppShell } from "@/components/ui/app-shell";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { BriefDetailCard } from "@/modules/briefs/components/brief-detail-card";
import { BRIEF_STATUS_LABELS } from "@/lib/constants/status";
import { getStatusTone } from "@/lib/utils";

type BriefDetailPageProps = {
  params: Promise<{
    postId: string;
    analysisId: string;
  }>;
};

function BriefDetailLoading() {
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

export default function BriefDetailPage({ params }: BriefDetailPageProps) {
  const { postId, analysisId } = use(params);
  const typedAnalysisId = analysisId as Id<"analyses">;
  const brief = useQuery(api.briefs.get, {
    analysisId: typedAnalysisId,
  });
  const analysisDetail = useQuery(api.analyses.get, {
    analysisId: typedAnalysisId,
  });

  if (brief === undefined || analysisDetail === undefined) {
    return <BriefDetailLoading />;
  }

  const postTitle = analysisDetail.post.title?.trim() || "Untitled post";

  return (
    <AppShell
      eyebrow="Next Post Brief"
      title={postTitle}
      description="Directional guidance for the next post, derived from the completed feedback loop."
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
        <BriefDetailCard
          analysisId={typedAnalysisId}
          postId={postId}
          brief={brief}
        />
      )}
    </AppShell>
  );
}
