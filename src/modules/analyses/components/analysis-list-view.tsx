"use client";

import Link from "next/link";
import { FileSearchIcon } from "lucide-react";
import { useQuery } from "convex/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { AppShell } from "@/shared/components/app-shell";
import { BackendRequiredState } from "@/shared/components/backend-required-state";
import { StatusBadge } from "@/shared/components/status-badge";
import {
  ANALYSIS_STATUS_LABELS,
  BRIEF_STATUS_LABELS,
} from "@/shared/constants/status";

type AnalysisListViewProps = {
  postId: string;
};

const hasConvex = Boolean(process.env.NEXT_PUBLIC_CONVEX_URL);

function getStatusTone(status?: "in_progress" | "completed" | "failed") {
  if (status === "completed") {
    return "success" as const;
  }
  if (status === "failed") {
    return "danger" as const;
  }
  if (status === "in_progress") {
    return "warning" as const;
  }
  return "neutral" as const;
}

function ConnectedAnalysisListView({ postId }: AnalysisListViewProps) {
  const analyses = useQuery(api.analyses.getAll, {
    postId: postId as Id<"posts">,
  });

  return (
    <AppShell
      eyebrow="Analyses"
      title="A complete run history for one post."
      description="Every analysis stays visible, including failed and stale runs, so the user can compare outputs instead of losing context."
      actions={<StatusBadge label={`Post ${postId.slice(0, 6)}`} />}
    >
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="font-heading text-xl font-semibold tracking-tight">
            Analysis history
          </CardTitle>
          <Button asChild variant="outline">
            <Link href={`/posts/${postId}`}>Back to post</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {analyses === undefined ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : analyses.length === 0 ? (
            <Empty className="min-h-72 border-border bg-muted/25">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FileSearchIcon />
                </EmptyMedia>
                <EmptyTitle>No analysis runs yet</EmptyTitle>
                <EmptyDescription>
                  Triggering analysis will create an immutable snapshot and open
                  the feedback branch for lessons, patterns, and the brief.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Run</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Brief</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analyses.map((analysis, index) => (
                  <TableRow key={analysis.id}>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-foreground">
                          Run {analyses.length - index}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(analysis.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        label={ANALYSIS_STATUS_LABELS[analysis.status]}
                        tone={getStatusTone(analysis.status)}
                      />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {analysis.confidence ?? "—"}
                    </TableCell>
                    <TableCell>
                      {analysis.brief ? (
                        <StatusBadge
                          label={BRIEF_STATUS_LABELS[analysis.brief.status]}
                          tone={getStatusTone(analysis.brief.status)}
                        />
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {analysis.stale ? (
                        <StatusBadge label="Stale" tone="warning" />
                      ) : (
                        <span className="text-sm text-muted-foreground">Current</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/posts/${postId}/analyses/${analysis.id}`}>
                            Open
                          </Link>
                        </Button>
                        {analysis.brief ? (
                          <Button asChild size="sm">
                            <Link
                              href={`/posts/${postId}/analyses/${analysis.id}/brief`}
                            >
                              Brief
                            </Link>
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}

export function AnalysisListView({ postId }: AnalysisListViewProps) {
  if (!hasConvex) {
    return (
      <BackendRequiredState
        eyebrow="Analyses"
        title="A complete run history for one post."
        description="Every analysis stays visible, including failed and stale runs, so the user can compare outputs instead of losing context."
      />
    );
  }

  return <ConnectedAnalysisListView postId={postId} />;
}
