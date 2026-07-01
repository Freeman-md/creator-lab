"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import type { Id } from "@convex/_generated/dataModel";

import { api } from "@convex/_generated/api";
import { AppShell } from "@/components/ui/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalysisListContent } from "@/modules/analyses/components/analysis-list-content";

type AnalysesPageProps = {
  params: Promise<{
    postId: string;
  }>;
};

export default function AnalysesPage({ params }: AnalysesPageProps) {
  const { postId } = use(params);
  const post = useQuery(api.posts.get, {
    postId: postId as Id<"posts">,
  });
  const analyses = useQuery(api.analyses.getAll, {
    postId: postId as Id<"posts">,
  });

  const postTitle = post?.post.title?.trim() || "Untitled post";

  return (
    <AppShell
      eyebrow="Analyses"
      title={postTitle}
      description="Analysis history and brief outcomes for this post."
    >
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="font-heading text-xl font-semibold tracking-tight">
            Analysis history
          </CardTitle>
          <Button asChild variant="outline">
            <Link href={`/dashboard/posts/${postId}`}>Back to post</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <AnalysisListContent postId={postId} analyses={analyses} />
        </CardContent>
      </Card>
    </AppShell>
  );
}
