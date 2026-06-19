"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { AppShell } from "@/shared/components/app-shell";
import { StatusBadge } from "@/shared/components/status-badge";
import { FileSearchIcon } from "lucide-react";

type AnalysisListViewProps = {
  postId: string;
};

export function AnalysisListView({ postId }: AnalysisListViewProps) {
  return (
    <AppShell
      eyebrow="Analyses"
      title="A complete run history for one post."
      description="Every analysis stays visible, including failed and stale runs, so the user can compare outputs instead of losing context."
      actions={<StatusBadge label={`Post ${postId}`} />}
    >
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading text-xl font-semibold tracking-tight">
            Analysis history
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Empty className="min-h-72 border-border bg-muted/25">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileSearchIcon />
              </EmptyMedia>
              <EmptyTitle>No analysis runs yet</EmptyTitle>
              <EmptyDescription>
                Triggering analysis will create an immutable snapshot and open the feedback branch for lessons, patterns, and the brief.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    </AppShell>
  );
}
