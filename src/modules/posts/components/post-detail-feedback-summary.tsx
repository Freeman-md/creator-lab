import Link from "next/link";
import type { FunctionReturnType } from "convex/server";

import { api } from "@convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

type PostDetailData = FunctionReturnType<typeof api.posts.get>;

type PostDetailFeedbackSummaryProps = {
  postId: string;
  latestAnalysis: PostDetailData["latestAnalysis"];
  latestBrief: PostDetailData["latestBrief"];
};

export function PostDetailFeedbackSummary({
  postId,
  latestAnalysis,
  latestBrief,
}: PostDetailFeedbackSummaryProps) {
  return (
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
                <Link href={`/posts/${postId}/analyses/${latestAnalysis.id}`}>
                  Open latest analysis
                </Link>
              </Button>
              {latestBrief ? (
                <Button asChild>
                  <Link href={`/posts/${postId}/analyses/${latestAnalysis.id}/brief`}>
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
  );
}
