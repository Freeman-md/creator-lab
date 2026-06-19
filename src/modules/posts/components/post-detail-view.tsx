"use client";

import Link from "next/link";
import { BarChart3Icon, FileClockIcon, SparklesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AppShell } from "@/shared/components/app-shell";
import { StatusBadge } from "@/shared/components/status-badge";

type PostDetailViewProps = {
  postId: string;
};

export function PostDetailView({ postId }: PostDetailViewProps) {
  return (
    <AppShell
      eyebrow="Post Detail"
      title="One post, one visible feedback loop."
      description="This screen owns post editing, the latest metrics snapshot, analysis status, and the next action that moves feedback forward."
      actions={
        <>
          <StatusBadge label="No metrics" />
          <StatusBadge label="Analysis not started" />
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading text-xl font-semibold tracking-tight">
              Post content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 text-sm leading-6 text-muted-foreground">
            <p>
              Worker-owned implementation will bind this surface to <code>posts.get</code>, editing controls, and stale-analysis indicators for post or metric updates.
            </p>
            <Separator />
            <div className="rounded-lg border border-dashed border-border bg-muted/40 p-4">
              Post <span className="font-mono">{postId}</span> is waiting for its first saved record.
            </div>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading text-lg font-semibold tracking-tight">
                Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <BarChart3Icon className="size-4" />
                Latest metrics snapshot will live here.
              </div>
              <Button className="w-full">Save Metrics</Button>
            </CardContent>
          </Card>
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading text-lg font-semibold tracking-tight">
                Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <FileClockIcon className="size-4" />
                Background status, retries, and stale guidance belong here.
              </div>
              <Button className="w-full">
                <SparklesIcon data-icon="inline-start" />
                Trigger Analysis
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/posts/${postId}/analyses`}>View All Analyses</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
