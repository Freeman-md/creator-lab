import { Doc, Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";
import { ANALYSIS_STATUS } from "./constants";

type AuthenticatedCtx = (QueryCtx | MutationCtx) & { userId: string };

export async function getOwnedPost(
  ctx: AuthenticatedCtx,
  postId: Id<"posts">
) {
  const post = await ctx.db.get(postId);

  if (!post || post.userId !== ctx.userId) {
    throw new Error("Post not found.");
  }

  return post;
}

export async function getOwnedAnalysis(
  ctx: AuthenticatedCtx,
  analysisId: Id<"analyses">
) {
  const analysis = await ctx.db.get(analysisId);
  if (!analysis) {
    throw new Error("Analysis not found.");
  }

  const post = await getOwnedPost(ctx, analysis.postId);
  return { analysis, post };
}

export async function getOwnedBrief(
  ctx: AuthenticatedCtx,
  briefId: Id<"briefs">
) {
  const brief = await ctx.db.get(briefId);
  if (!brief) {
    throw new Error("Brief not found.");
  }

  const post = await getOwnedPost(ctx, brief.postId);
  return { brief, post };
}

export async function getMetrics(
  ctx: QueryCtx | MutationCtx,
  postId: Id<"posts">
) {
  return await ctx.db
    .query("metrics")
    .withIndex("by_postId", (q) => q.eq("postId", postId))
    .unique();
}

export async function ensureNoActiveAnalysis(
  ctx: QueryCtx | MutationCtx,
  postId: Id<"posts">
) {
  const analysis = await ctx.db
    .query("analyses")
    .withIndex("by_postId_and_status", (q) =>
      q.eq("postId", postId).eq("status", ANALYSIS_STATUS.IN_PROGRESS)
    )
    .unique()

  if (analysis) {
    throw new Error("An analysis is already in progress for this post.");
  }
}

export async function getLatestAnalysis(
  ctx: QueryCtx | MutationCtx,
  postId: Id<"posts">
) {
  return await ctx.db
    .query("analyses")
    .withIndex("by_postId", (q) => q.eq("postId", postId))
    .order("desc")
    .first();
}

export async function getLatestCompletedAnalysis(
  ctx: QueryCtx | MutationCtx,
  postId: Id<"posts">
) {
  return await ctx.db
    .query("analyses")
    .withIndex("by_postId_and_status", (q) =>
      q.eq("postId", postId).eq("status", ANALYSIS_STATUS.COMPLETED)
    )
    .order("desc")
    .first();
}

export async function getLessons(
  ctx: QueryCtx | MutationCtx,
  analysisId: Id<"analyses">
) {
  return await ctx.db
    .query("lessons")
    .withIndex("by_analysisId", (q) => q.eq("analysisId", analysisId))
    .collect();
}

export async function getPatterns(
  ctx: QueryCtx | MutationCtx,
  analysisId: Id<"analyses">
) {
  return await ctx.db
    .query("patterns")
    .withIndex("by_analysisId", (q) => q.eq("analysisId", analysisId))
    .collect();
}

export async function getBrief(
  ctx: QueryCtx | MutationCtx,
  analysisId: Id<"analyses">
) {
  return await ctx.db
    .query("briefs")
    .withIndex("by_analysisId", (q) => q.eq("analysisId", analysisId))
    .unique();
}

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
    oldMetrics.comments !== newMetrics.comments ||
    oldMetrics.reposts !== newMetrics.reposts ||
    oldMetrics.profileVisits !== newMetrics.profileVisits
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
