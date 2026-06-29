"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import type { Id } from "@convex/_generated/dataModel";
import { toast } from "sonner";

import { api } from "@convex/_generated/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AnalysisDetailData = FunctionReturnType<typeof api.analyses.get>;

type AnalysisBriefStatusCardProps = {
  analysisId: Id<"analyses">;
  analysis: AnalysisDetailData["analysis"];
  brief: AnalysisDetailData["brief"];
};

export function AnalysisBriefStatusCard({
  analysisId,
  analysis,
  brief,
}: AnalysisBriefStatusCardProps) {
  const retryBrief = useMutation(api.briefs.create);
  const [isRetryingBrief, setIsRetryingBrief] = useState(false);

  const handleRetryBrief = async () => {
    setIsRetryingBrief(true);

    try {
      await retryBrief({ analysisId });
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
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="font-heading text-lg font-semibold tracking-tight">
          Brief status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!brief ? (
          <p className="text-sm leading-6 text-muted-foreground">
            Brief generation has not started yet.
          </p>
        ) : brief.status === "failed" ? (
          <Alert variant="destructive">
            <AlertTitle>Brief generation failed</AlertTitle>
            <AlertDescription>
              {brief.errorMessage ?? "The brief job failed."}
            </AlertDescription>
          </Alert>
        ) : brief.status === "in_progress" ? (
          <p className="text-sm leading-6 text-muted-foreground">
            The brief is being generated from the completed analysis, lessons,
            and patterns.
          </p>
        ) : (
          <div className="rounded-xl border border-border bg-muted/25 p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Next post angle
            </p>
            <p className="mt-2 text-sm leading-6 text-foreground">
              {brief.nextPostAngle}
            </p>
          </div>
        )}
        {analysis.status === "completed" && brief?.status === "failed" ? (
          <Button disabled={isRetryingBrief} onClick={handleRetryBrief}>
            Retry brief generation
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
