import Link from "next/link";
import type { FunctionReturnType } from "convex/server";

import { api } from "@convex/_generated/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";

type AnalysisDetailData = FunctionReturnType<typeof api.analyses.get>;

type AnalysisSummaryCardProps = {
  postId: string;
  analysisId: string;
  analysis: AnalysisDetailData["analysis"];
  brief: AnalysisDetailData["brief"];
};

export function AnalysisSummaryCard({
  postId,
  analysisId,
  analysis,
  brief,
}: AnalysisSummaryCardProps) {
  return (
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
            {brief ? (
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
        {analysis.status === "failed" ? (
          <Alert variant="destructive">
            <AlertTitle>Analysis failed</AlertTitle>
            <AlertDescription>
              {analysis.errorMessage ?? "The analysis did not complete."}
            </AlertDescription>
          </Alert>
        ) : analysis.status === "in_progress" ? (
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
                {analysis.content}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  Reasoning
                </p>
                <p className="mt-2 text-sm leading-6 text-foreground">
                  {analysis.reasoning}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  Confidence
                </p>
                <p className="mt-2 text-sm font-medium capitalize text-foreground">
                  {analysis.confidence}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
