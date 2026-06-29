"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import type { Id } from "@convex/_generated/dataModel";
import { toast } from "sonner";

import { api } from "@convex/_generated/api";
import { MetricsFormCard } from "@/modules/metrics/components/metrics-form-card";
import type { MetricsFormValues, MetricsRecord } from "@/modules/metrics/types";

type PostDetailMetricsSectionProps = {
  postId: Id<"posts">;
  defaultValues?: MetricsRecord;
};

export function PostDetailMetricsSection({
  postId,
  defaultValues,
}: PostDetailMetricsSectionProps) {
  const upsertMetrics = useMutation(api.metrics.upsert);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (values: MetricsFormValues) => {
    setIsSaving(true);

    try {
      await upsertMetrics({
        postId,
        ...values,
      });
      toast.success("Metrics saved.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Metrics save failed."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MetricsFormCard
      defaultValues={defaultValues}
      isSaving={isSaving}
      onSubmit={handleSubmit}
    />
  );
}
