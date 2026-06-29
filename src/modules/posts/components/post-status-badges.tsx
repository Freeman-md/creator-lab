import { StatusBadge } from "@/components/ui/status-badge";
import {
  ANALYSIS_STATUS_LABELS,
  BRIEF_STATUS_LABELS,
} from "@/lib/constants/status";
import { getStatusTone } from "@/lib/utils";

type AnalysisStatus = "in_progress" | "completed" | "failed";

type PostStatusBadgesProps = {
  hasMetrics: boolean;
  latestAnalysis?: {
    status: AnalysisStatus;
    stale?: boolean;
  } | null;
  latestBrief?: {
    status: AnalysisStatus;
  } | null;
};

export function PostStatusBadges({
  hasMetrics,
  latestAnalysis,
  latestBrief,
}: PostStatusBadgesProps) {
  return (
    <>
      <StatusBadge
        label={hasMetrics ? "Metrics saved" : "No metrics"}
        tone={hasMetrics ? "success" : "neutral"}
      />
      <StatusBadge
        label={
          latestAnalysis
            ? ANALYSIS_STATUS_LABELS[latestAnalysis.status]
            : "Analysis not started"
        }
        tone={getStatusTone(latestAnalysis?.status)}
      />
      {latestBrief ? (
        <StatusBadge
          label={BRIEF_STATUS_LABELS[latestBrief.status]}
          tone={getStatusTone(latestBrief.status)}
        />
      ) : null}
      {latestAnalysis?.stale ? (
        <StatusBadge label="Stale feedback" tone="warning" />
      ) : null}
    </>
  );
}
