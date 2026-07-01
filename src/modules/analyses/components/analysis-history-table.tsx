import Link from "next/link";
import type { FunctionReturnType } from "convex/server";

import { api } from "@convex/_generated/api";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ANALYSIS_STATUS_LABELS,
  BRIEF_STATUS_LABELS,
} from "@/lib/constants/status";
import { getStatusTone } from "@/lib/utils";

type AnalysisHistoryTableProps = {
  postId: string;
  analyses: FunctionReturnType<typeof api.analyses.getAll>;
};

export function AnalysisHistoryTable({
  postId,
  analyses,
}: AnalysisHistoryTableProps) {
  return (
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
                  {new Date(analysis.creationTime).toLocaleString()}
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
                  <Link href={`/dashboard/posts/${postId}/analyses/${analysis.id}`}>
                    Open
                  </Link>
                </Button>
                {analysis.brief ? (
                  <Button asChild size="sm">
                    <Link href={`/dashboard/posts/${postId}/analyses/${analysis.id}/brief`}>
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
  );
}
