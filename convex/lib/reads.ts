import { Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";
import { ANALYSIS_STATUS } from "./constants";

export async function getProfileByUserId(
  ctx: QueryCtx | MutationCtx,
  userId: string
) {
  return await ctx.db
    .query("profiles")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .unique();
}

export async function getLinkedInPostSyncByUserId(
  ctx: QueryCtx | MutationCtx,
  userId: string
) {
  return await ctx.db
    .query("linkedinPostSyncs")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .unique();
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

export async function getPostOrThrow(
  ctx: QueryCtx | MutationCtx,
  postId: Id<"posts">,
  errorMessage: string = "Post not found"
) {
  const post = await ctx.db.get(postId);

  if (!post) {
    throw new Error(errorMessage);
  }

  return post
}

export async function getAnalysisOrThrow(
  ctx: QueryCtx | MutationCtx,
  analysisId: Id<"analyses">,
  errorMessage: string = "Analysis not found"
) {
  const analysis = await ctx.db.get(analysisId);

  if (!analysis) {
    throw new Error(errorMessage);
  }

  return analysis
}

export async function getBriefOrThrow(
  ctx: QueryCtx | MutationCtx,
  briefId: Id<"briefs">,
  errorMessage: string = "Brief not found"
) {
  const brief = await ctx.db.get(briefId);

  if (!brief) {
    throw new Error(errorMessage);
  }

  return brief
}
