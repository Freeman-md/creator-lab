"use client";

import { CopyIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppShell } from "@/shared/components/app-shell";
import { StatusBadge } from "@/shared/components/status-badge";

type BriefDetailViewProps = {
  analysisId: string;
};

export function BriefDetailView({ analysisId }: BriefDetailViewProps) {
  return (
    <AppShell
      eyebrow="Next Post Brief"
      title="Guidance for the next post, not a generated replacement."
      description="The brief must stay directional: what to repeat, avoid, improve, and the angle worth testing next."
      actions={<StatusBadge label="Brief ready" tone="success" />}
    >
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <CardTitle className="font-heading text-xl font-semibold tracking-tight">
              Brief for analysis {analysisId}
            </CardTitle>
            <p className="text-sm leading-6 text-muted-foreground">
              Copy support and completed guidance will be implemented here against <code>briefs.get</code>.
            </p>
          </div>
          <Button variant="outline">
            <CopyIcon data-icon="inline-start" />
            Copy Brief
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-3">
          {["Repeat", "Avoid", "Improve"].map((section) => (
            <div
              key={section}
              className="rounded-xl border border-border bg-muted/25 p-4"
            >
              <h2 className="font-heading text-base font-semibold tracking-tight">
                {section}
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Guidance items will populate this section from validated structured output.
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}
