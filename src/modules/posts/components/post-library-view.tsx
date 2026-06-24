"use client";

import Link from "next/link";
import { FileTextIcon, PlusIcon } from "lucide-react";
import { useQuery } from "convex/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@convex/_generated/api";
import { AppShell } from "@/components/ui/app-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  ANALYSIS_STATUS_LABELS,
  BRIEF_STATUS_LABELS,
} from "@/lib/constants/status";
import { formatPublishedDate } from "@/lib/utils";

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

function ConnectedPostLibraryView() {
  const library = useQuery(api.posts.getAll, {});

  return (
    <AppShell
      eyebrow="Post Library"
      title="A focused archive for posts worth learning from."
      description="Each saved post should move cleanly from metadata to metrics, analysis, and a practical next-post brief."
      actions={
        <Button asChild>
          <Link href="/posts/new">
            <PlusIcon data-icon="inline-start" />
            New Post
          </Link>
        </Button>
      }
    >
      {library === undefined ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="border-border bg-card shadow-sm">
              <CardHeader className="gap-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-8 w-3/4" />
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : library.length === 0 ? (
        <Empty className="min-h-[480px] border-border bg-card">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileTextIcon />
            </EmptyMedia>
            <EmptyTitle>No posts saved yet</EmptyTitle>
            <EmptyDescription>
              Start by adding one published LinkedIn post. Creator Lab will
              carry it through metrics, analysis, and the brief loop from there.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/posts/new">
                <PlusIcon data-icon="inline-start" />
                Create your first post
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {library.map((entry) => (
            <Card key={entry.post.id} className="border-border bg-card shadow-sm">
              <CardHeader className="gap-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2">
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      Published {formatPublishedDate(entry.post.publishedDateTime)}
                    </p>
                    <CardTitle className="font-heading text-xl font-semibold tracking-tight">
                      {entry.post.title?.trim() || "Untitled post"}
                    </CardTitle>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge
                      label={entry.metrics ? "Metrics saved" : "No metrics"}
                      tone={entry.metrics ? "success" : "neutral"}
                    />
                    <StatusBadge
                      label={
                        entry.latestAnalysis
                          ? ANALYSIS_STATUS_LABELS[entry.latestAnalysis.status]
                          : "Analysis not started"
                      }
                      tone={getStatusTone(entry.latestAnalysis?.status)}
                    />
                    {entry.latestBrief ? (
                      <StatusBadge
                        label={BRIEF_STATUS_LABELS[entry.latestBrief.status]}
                        tone={getStatusTone(entry.latestBrief.status)}
                      />
                    ) : null}
                    {entry.latestAnalysis?.stale ? (
                      <StatusBadge label="Stale feedback" tone="warning" />
                    ) : null}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em]">
                      Goal
                    </p>
                    <p className="mt-1 leading-6 text-foreground">{entry.post.goal}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em]">
                      Category
                    </p>
                    <p className="mt-1 leading-6 text-foreground">
                      {entry.post.category}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em]">
                      Audience
                    </p>
                    <p className="mt-1 leading-6 text-foreground">
                      {entry.post.audience}
                    </p>
                  </div>
                </div>
                <p className="line-clamp-4 text-sm leading-6 text-muted-foreground">
                  {entry.post.body}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild>
                    <Link href={`/posts/${entry.post.id}`}>Open Post</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href={`/posts/${entry.post.id}/analyses`}>
                      View Analyses
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}

export function PostLibraryView() {
  return <ConnectedPostLibraryView />;
}
