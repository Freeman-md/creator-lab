import { FileSearchIcon } from "lucide-react";
import type { FunctionReturnType } from "convex/server";

import { api } from "@convex/_generated/api";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { AnalysisHistoryTable } from "@/modules/analyses/components/analysis-history-table";

type AnalysisListContentProps = {
  postId: string;
  analyses: FunctionReturnType<typeof api.analyses.getAll> | undefined;
};

export function AnalysisListContent({
  postId,
  analyses,
}: AnalysisListContentProps) {
  if (analyses === undefined) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <Empty className="min-h-72 border-border bg-muted/25">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileSearchIcon />
          </EmptyMedia>
          <EmptyTitle>No analysis runs yet</EmptyTitle>
          <EmptyDescription>
            Triggering analysis will create an immutable snapshot and open the
            feedback branch for lessons, patterns, and the brief.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return <AnalysisHistoryTable postId={postId} analyses={analyses} />;
}
