import { Doc, Id } from "../_generated/dataModel";
import { MutationCtx } from "../_generated/server";
import { getLatestCompletedAnalysis } from "./reads";

export function didPostChange(oldPost: Doc<"posts">, newPost: Doc<"posts">) {
  return (
    oldPost.title !== newPost.title ||
    oldPost.body !== newPost.body ||
    oldPost.publishedDateTime !== newPost.publishedDateTime ||
    oldPost.goal !== newPost.goal ||
    oldPost.category !== newPost.category ||
    oldPost.audience !== newPost.audience
  );
}

export function didMetricsChange(
  oldMetrics: Doc<"metrics">,
  newMetrics: Doc<"metrics">
) {
  return (
    oldMetrics.impressions !== newMetrics.impressions ||
    oldMetrics.reactions !== newMetrics.reactions ||
    oldMetrics.likes !== newMetrics.likes ||
    oldMetrics.comments !== newMetrics.comments ||
    oldMetrics.reposts !== newMetrics.reposts ||
    oldMetrics.shares !== newMetrics.shares ||
    oldMetrics.profileVisits !== newMetrics.profileVisits ||
    JSON.stringify(oldMetrics.reactionBreakdown ?? {}) !==
      JSON.stringify(newMetrics.reactionBreakdown ?? {})
  );
}

export async function markLatestCompletedAnalysisStale(
  ctx: MutationCtx,
  postId: Id<"posts">
) {
  const latestCompletedAnalysis = await getLatestCompletedAnalysis(
    ctx,
    postId
  );

  if (!latestCompletedAnalysis || latestCompletedAnalysis.isStale) {
    return;
  }

  await ctx.db.patch(latestCompletedAnalysis._id, {
    isStale: true,
    updatedAt: Date.now(),
  });
}
