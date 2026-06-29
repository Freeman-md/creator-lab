import Link from "next/link";
import type { FunctionReturnType } from "convex/server";

import { api } from "@convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostStatusBadges } from "@/modules/posts/components/post-status-badges";
import { formatPublishedDate } from "@/lib/utils";

type PostLibraryCardProps = {
  entry: FunctionReturnType<typeof api.posts.getAll>[number];
};

export function PostLibraryCard({ entry }: PostLibraryCardProps) {
  return (
    <Card className="border-border bg-card shadow-sm">
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
            <PostStatusBadges
              hasMetrics={Boolean(entry.metrics)}
              latestAnalysis={entry.latestAnalysis}
              latestBrief={entry.latestBrief}
            />
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
            <p className="mt-1 leading-6 text-foreground">{entry.post.category}</p>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em]">
              Audience
            </p>
            <p className="mt-1 leading-6 text-foreground">{entry.post.audience}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href={`/posts/${entry.post.id}`}>Open Post</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/posts/${entry.post.id}/analyses`}>View Analyses</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
