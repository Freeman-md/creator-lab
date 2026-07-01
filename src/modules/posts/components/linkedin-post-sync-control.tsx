"use client";

import { useState } from "react";
import { format } from "date-fns";
import { RefreshCwIcon } from "lucide-react";
import { useMutation } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { toast } from "sonner";

import { api } from "@convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type SyncStatus = FunctionReturnType<typeof api.linkedinPosts.getSyncStatus>;

type LinkedInPostSyncControlProps = {
  syncStatus: SyncStatus | undefined;
};

const statusLabels: Record<SyncStatus["status"], string> = {
  idle: "Idle",
  in_progress: "Syncing",
  completed: "Completed",
  failed: "Failed",
};

export function LinkedInPostSyncControl({
  syncStatus,
}: LinkedInPostSyncControlProps) {
  const triggerSync = useMutation(api.linkedinPosts.triggerSync);
  const [isTriggering, setIsTriggering] = useState(false);
  const isInProgress = syncStatus?.status === "in_progress";
  const isDisabled = isTriggering || isInProgress || syncStatus === undefined;

  async function handleSync() {
    setIsTriggering(true);

    try {
      await triggerSync({});
      toast.success("LinkedIn post sync started.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "LinkedIn post sync failed."
      );
    } finally {
      setIsTriggering(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-card px-3 py-3 sm:min-w-80">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge
            variant={syncStatus?.status === "failed" ? "destructive" : "outline"}
          >
            {syncStatus ? statusLabels[syncStatus.status] : "Loading"}
          </Badge>
          {syncStatus?.lastSuccessfulSyncAt ? (
            <span className="text-xs text-muted-foreground">
              Last {format(syncStatus.lastSuccessfulSyncAt, "dd MMM HH:mm")}
            </span>
          ) : null}
        </div>
        <Button size="sm" onClick={handleSync} disabled={isDisabled}>
          {isTriggering || isInProgress ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <RefreshCwIcon data-icon="inline-start" />
          )}
          Sync LinkedIn Posts
        </Button>
      </div>
      {syncStatus?.status === "failed" && syncStatus.errorMessage ? (
        <p className="text-xs leading-5 text-destructive">
          {syncStatus.errorMessage}
        </p>
      ) : null}
      {syncStatus && syncStatus.status !== "idle" ? (
        <p className="text-xs leading-5 text-muted-foreground">
          Fetched {syncStatus.fetched}. Imported {syncStatus.imported}. Updated{" "}
          {syncStatus.metricsUpdated}. Skipped{" "}
          {syncStatus.skippedDuplicate +
            syncStatus.skippedInvalid +
            syncStatus.skippedRepost +
            syncStatus.skippedNonOwned}
          .
        </p>
      ) : null}
    </div>
  );
}
