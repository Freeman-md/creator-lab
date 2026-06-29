"use client";

import { useState } from "react";
import Link from "next/link";
import { BarChart3Icon, FileClockIcon, SparklesIcon } from "lucide-react";
import { useMutation } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import type { Id } from "@convex/_generated/dataModel";
import { toast } from "sonner";

import { api } from "@convex/_generated/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PostDetailData = FunctionReturnType<typeof api.posts.get>;

type PostDetailAnalysisTriggerProps = {
  postId: Id<"posts">;
  latestAnalysis: PostDetailData["latestAnalysis"];
};

export function PostDetailAnalysisTrigger({
  postId,
  latestAnalysis,
}: PostDetailAnalysisTriggerProps) {
  const triggerAnalysis = useMutation(api.analyses.trigger);
  const [isTriggering, setIsTriggering] = useState(false);

  const handleTrigger = async () => {
    setIsTriggering(true);

    try {
      await triggerAnalysis({ postId });
      toast.success("Analysis started.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Analysis trigger failed."
      );
    } finally {
      setIsTriggering(false);
    }
  };

  return (
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
          disabled={isTriggering || latestAnalysis?.status === "in_progress"}
          onClick={handleTrigger}
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
  );
}
