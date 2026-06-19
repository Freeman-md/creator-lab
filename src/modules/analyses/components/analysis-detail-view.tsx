"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppShell } from "@/shared/components/app-shell";
import { StatusBadge } from "@/shared/components/status-badge";

type AnalysisDetailViewProps = {
  postId: string;
  analysisId: string;
};

export function AnalysisDetailView({
  postId,
  analysisId,
}: AnalysisDetailViewProps) {
  return (
    <AppShell
      eyebrow="Analysis Detail"
      title="Review the output before the next brief is trusted."
      description="The analysis detail screen owns summary content, reasoning, confidence, grouped lessons, grouped patterns, and brief-generation status."
      actions={
        <>
          <StatusBadge label="Analysed" tone="success" />
          <StatusBadge label="Brief in progress" tone="warning" />
        </>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading text-xl font-semibold tracking-tight">
              Analysis summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
            <p>
              Analysis <span className="font-mono">{analysisId}</span> for post{" "}
              <span className="font-mono">{postId}</span> will render summary,
              reasoning, and confidence here.
            </p>
            <Button asChild variant="outline">
              <Link href={`/posts/${postId}/analyses/${analysisId}/brief`}>
                Open Brief
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading text-lg font-semibold tracking-tight">
              Lessons and patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="lessons">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="lessons">Lessons</TabsTrigger>
                <TabsTrigger value="patterns">Patterns</TabsTrigger>
              </TabsList>
              <TabsContent value="lessons" className="pt-4 text-sm text-muted-foreground">
                Repeat, avoid, and improve groups will be rendered here.
              </TabsContent>
              <TabsContent value="patterns" className="pt-4 text-sm text-muted-foreground">
                Positive and negative patterns with scores will be rendered here.
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
